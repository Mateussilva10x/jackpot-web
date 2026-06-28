import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { ClipboardCopy } from "lucide-react";
import { JackpotButton } from "../ui/JackpotButton";
import { useToast } from "../../hooks/useToast";
import { rankingService } from "../../services/rankingService";
import { userService } from "../../services/userService";
import type {
  MatchBetResponse,
  UserProfileDto,
  UserRankingDto,
} from "../../types/api";

// A match is considered "happening now" when it is not finished and its kickoff
// sits inside the window: from up to 5 minutes before kickoff (games about to
// start) until LIVE_WINDOW_MS after kickoff. The upper cap prevents matches the
// admin forgot to finalize from lingering in the list forever.
const LIVE_WINDOW_MS = 4 * 60 * 60 * 1000; // 4h after kickoff
const UPCOMING_WINDOW_MS = 5 * 60 * 1000; // 5min before kickoff

interface LiveMatch {
  match: MatchBetResponse;
  group: string;
}

interface UserBetLine {
  name: string;
  bet?: { homeScore: number; awayScore: number };
  // Mata-mata: time que o usuário escolheu pra avançar quando palpitou empate.
  advancingTeam?: string;
}

function isLive(match: MatchBetResponse): boolean {
  if (match.status === "FINISHED") return false;
  const kickoff = new Date(match.dateTime).getTime();
  const now = Date.now();
  return kickoff - now <= UPCOMING_WINDOW_MS && now - kickoff <= LIVE_WINDOW_MS;
}

// The API returns either a URL whose filename is the 2-letter ISO code
// (e.g. https://flag-url.com/br.png) or the bare 2-letter code. Convert it to a
// regional-indicator emoji so the title shows the country flag inline.
function flagEmoji(flag: string): string {
  const code = flag?.match(/(?:^|\/)([a-z]{2})(?:\.[a-z]+)?$/i)?.[1];
  if (!code) return "";
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function groupLabel(group: string, t: TFunction): string {
  if (/^[A-L]$/.test(group)) {
    return t("admin.copyPredictionsGroup", { letter: group });
  }
  const translated = t(`dashboard.${group}`);
  return translated === `dashboard.${group}` ? group : translated;
}

// Kickoff shown in both timezones the league cares about: Brazil
// (America/Sao_Paulo) and Florida (America/New_York, 1h behind Brazil). Using
// Intl timeZone keeps DST correct instead of hardcoding the offset.
function formatKickoffLine(dateTime: string): string {
  const date = new Date(dateTime);

  const br = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  const usParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const hour = usParts.find((p) => p.type === "hour")?.value ?? "";
  const minute = usParts.find((p) => p.type === "minute")?.value ?? "00";
  const ampm = (usParts.find((p) => p.type === "dayPeriod")?.value ?? "").toLowerCase();
  const us = minute === "00" ? `${hour}${ampm}` : `${hour}:${minute}${ampm}`;

  return `⏱️ ${br} 🇧🇷 / ${us} 🇺🇸`;
}

function buildMessage(
  liveMatches: LiveMatch[],
  betsByMatch: Map<number, UserBetLine[]>,
  t: TFunction,
): string {
  const blocks = liveMatches.map(({ match, group }) => {
    const lines = (betsByMatch.get(match.id) ?? []).map((entry) => {
      const score = entry.bet
        ? `${entry.bet.homeScore}x${entry.bet.awayScore}`
        : t("admin.copyPredictionsNoBet");
      const advance = entry.advancingTeam
        ? ` (${t("admin.copyPredictionsAdvances")}: ${entry.advancingTeam})`
        : "";
      return `• ${entry.name}: ${score}${advance}`;
    });

    const header = `🎯 ${t("admin.copyPredictionsHeading")} ${match.homeTeam} ${flagEmoji(
      match.homeTeamFlag,
    )} x ${match.awayTeam} ${flagEmoji(match.awayTeamFlag)} (${groupLabel(
      group,
      t,
    )}) ⚽`;

    return [header, formatKickoffLine(match.dateTime), ...lines].join("\n");
  });

  // Two blank lines between matches so WhatsApp keeps them visually separated.
  return blocks.join("\n\n");
}

export const AdminCopyPredictions: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllUsers = async (): Promise<UserRankingDto[]> => {
    const size = 50;
    const first = await rankingService.getRanking(0, size);
    const users = [...first.content];
    for (let page = 1; page < first.totalPages; page++) {
      const next = await rankingService.getRanking(page, size);
      users.push(...next.content);
    }
    return users;
  };

  const handleCopy = async () => {
    setIsLoading(true);
    try {
      const users = await fetchAllUsers();

      const profiles: UserProfileDto[] = await Promise.all(
        users.map((u) => userService.getUserProfile(u.id)),
      );

      // Derive the live matches from the first profile (every profile shares
      // the same fixture list, only the userBet differs).
      const reference = profiles[0];
      const liveMatches: LiveMatch[] = [];
      if (reference) {
        for (const group of reference.bets) {
          for (const match of group.matches) {
            if (isLive(match)) {
              liveMatches.push({ match, group: group.group });
            }
          }
        }
      }

      liveMatches.sort(
        (a, b) =>
          new Date(a.match.dateTime).getTime() -
          new Date(b.match.dateTime).getTime(),
      );

      if (liveMatches.length === 0) {
        showToast(t("admin.copyPredictionsNoLive"), "warning");
        return;
      }

      // For each live match, collect every user's bet (preserving ranking order).
      const liveMatchIds = new Set(liveMatches.map((lm) => lm.match.id));
      const knockoutMatchIds = new Set(
        liveMatches
          .filter((lm) => !/^[A-L]$/.test(lm.group))
          .map((lm) => lm.match.id),
      );
      const betsByMatch = new Map<number, UserBetLine[]>();
      for (const id of liveMatchIds) betsByMatch.set(id, []);

      profiles.forEach((profile, index) => {
        const name = users[index].name;
        const matchById = new Map<number, MatchBetResponse>();
        for (const group of profile.bets) {
          for (const match of group.matches) {
            if (liveMatchIds.has(match.id)) matchById.set(match.id, match);
          }
        }
        for (const id of liveMatchIds) {
          const match = matchById.get(id);
          const bet = match?.userBet;
          // Empate no mata-mata + vencedor escolhido → mostra quem o usuário
          // apontou pra avançar.
          let advancingTeam: string | undefined;
          if (
            bet &&
            knockoutMatchIds.has(id) &&
            bet.homeScore === bet.awayScore &&
            bet.selectedWinnerId != null &&
            match
          ) {
            advancingTeam =
              bet.selectedWinnerId === match.homeTeamId
                ? match.homeTeam
                : bet.selectedWinnerId === match.awayTeamId
                  ? match.awayTeam
                  : undefined;
          }
          betsByMatch.get(id)!.push({
            name,
            bet: bet
              ? { homeScore: bet.homeScore, awayScore: bet.awayScore }
              : undefined,
            advancingTeam,
          });
        }
      });

      const message = buildMessage(liveMatches, betsByMatch, t);
      await navigator.clipboard.writeText(message);
      showToast(t("admin.copyPredictionsCopied"), "success");
    } catch (error) {
      console.error("Failed to copy predictions", error);
      showToast(t("admin.copyPredictionsError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <ClipboardCopy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t("admin.copyPredictions")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("admin.copyPredictionsSubtitle")}
            </p>
          </div>
        </div>
        <JackpotButton
          variant="primary"
          onClick={handleCopy}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading
            ? t("admin.copyPredictionsLoading")
            : t("admin.copyPredictionsButton")}
        </JackpotButton>
      </div>
    </div>
  );
};
