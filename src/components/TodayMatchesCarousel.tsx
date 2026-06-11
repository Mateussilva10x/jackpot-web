import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import type { MatchBetResponse, MatchGroupResponse } from "../types/api";
import { formatMatchDateTime } from "../utils/formatDate";

// Tournament has started once the earliest match of any stage has kicked off
// (i.e. the countdown reached zero).
export function hasTournamentStarted(bets: MatchGroupResponse[]): boolean {
  const kickoffs = bets
    .flatMap((g) => g.matches)
    .map((m) => new Date(m.dateTime).getTime())
    .filter((ts) => !isNaN(ts));

  if (kickoffs.length === 0) return false;

  return Date.now() >= Math.min(...kickoffs);
}

// Matches scheduled for the current calendar day, sorted by kickoff.
export function getTodayMatches(
  bets: MatchGroupResponse[],
): MatchBetResponse[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return bets
    .flatMap((group) => group.matches)
    .filter((match) => {
      const matchDate = new Date(match.dateTime);
      matchDate.setHours(0, 0, 0, 0);
      return matchDate.getTime() === today.getTime();
    })
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
}

function TodayMatchCard({
  match,
  showUserBet,
  t,
}: {
  match: MatchBetResponse;
  showUserBet: boolean;
  t: TFunction;
}) {
  const { date, time } = formatMatchDateTime(match.dateTime);

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Date and Time */}
      <div className="pb-4 border-b border-border">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{date}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>

      {/* Match Information */}
      <div className="py-6 px-2">
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-12 h-9 overflow-hidden border border-border/50 bg-secondary mb-2 rounded">
              <img
                src={match.homeTeamFlag}
                alt={match.homeTeam}
                className="w-full h-full object-fill"
              />
            </div>
            <p className="font-medium text-sm line-clamp-2">
              {t(`teams.${match.homeTeam}`) || match.homeTeam}
            </p>
          </div>

          {/* Score or Bet Display */}
          <div className="flex flex-col items-center">
            {showUserBet && match.userBet ? (
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 mb-2">
                <span className="text-2xl font-black text-primary">
                  {match.userBet.homeScore ?? "-"}
                </span>
                <span className="text-muted-foreground font-bold">X</span>
                <span className="text-2xl font-black text-primary">
                  {match.userBet.awayScore ?? "-"}
                </span>
              </div>
            ) : (
              <div className="mb-2">
                <span className="text-xs text-muted-foreground font-medium uppercase">
                  {t("profile.noPrediction") || "No Prediction"}
                </span>
              </div>
            )}
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                match.status?.toLowerCase() === "finished"
                  ? "bg-border/50 text-muted-foreground"
                  : "bg-green-500/20 text-green-500"
              }`}
            >
              {t(`status.${match.status?.toLowerCase()}`) || match.status}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="w-12 h-9 overflow-hidden border border-border/50 bg-secondary mb-2 rounded">
              <img
                src={match.awayTeamFlag}
                alt={match.awayTeam}
                className="w-full h-full object-fill"
              />
            </div>
            <p className="font-medium text-sm line-clamp-2">
              {t(`teams.${match.awayTeam}`) || match.awayTeam}
            </p>
          </div>
        </div>
      </div>

      {/* Group Info */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {/^[A-L]$/.test(match.group)
            ? `${t("dashboard.groupStage") || "Group"} ${match.group}`
            : t(`dashboard.${match.group}`) || match.group}
        </p>
      </div>
    </div>
  );
}

function TodayMatchesCarousel({
  matches,
  showUserBets,
  setShowUserBets,
  t,
}: {
  matches: MatchBetResponse[];
  showUserBets: boolean;
  setShowUserBets: (value: boolean) => void;
  t: TFunction;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? matches.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === matches.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 overflow-hidden">
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowUserBets(!showUserBets)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-secondary/50 hover:bg-secondary text-foreground rounded-lg transition-colors"
        >
          {showUserBets ? (
            <>
              <Eye className="w-4 h-4" />
              {t("profile.hideBets") || "Hide Bets"}
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              {t("profile.showBets") || "Show Bets"}
            </>
          )}
        </button>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Carousel Items */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {matches.map((match) => (
              <div key={match.id} className="w-full flex-shrink-0">
                <div className="min-h-[280px] flex flex-col justify-between bg-secondary/20 border border-border rounded-lg p-4">
                  <TodayMatchCard
                    match={match}
                    showUserBet={showUserBets}
                    t={t}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={matches.length === 1}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-secondary/80 hover:bg-secondary text-foreground rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={matches.length === 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-secondary/80 hover:bg-secondary text-foreground rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {matches.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-primary"
                : "bg-border hover:bg-primary/50"
            }`}
            aria-label={`Go to match ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Self-contained section: header + carousel. Renders nothing unless there are
// matches today AND the knockout stage has started (same rules as the profile).
export function TodayMatchesSection({
  bets,
}: {
  bets: MatchGroupResponse[];
}) {
  const { t } = useTranslation();
  const [showUserBets, setShowUserBets] = useState(true);

  const todayMatches = getTodayMatches(bets);

  if (todayMatches.length === 0 || !hasTournamentStarted(bets)) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        {t("profile.todayMatches") || "Today's Matches"}
        <span className="bg-secondary text-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-2">
          {todayMatches.length}
        </span>
      </h2>

      <TodayMatchesCarousel
        matches={todayMatches}
        showUserBets={showUserBets}
        setShowUserBets={setShowUserBets}
        t={t}
      />
    </div>
  );
}
