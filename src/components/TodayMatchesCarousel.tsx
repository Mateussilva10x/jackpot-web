import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Save,
} from "lucide-react";
import type { MatchBetResponse, MatchGroupResponse } from "../types/api";
import { formatMatchDateTime } from "../utils/formatDate";
import { JackpotScoreInput } from "./ui/JackpotScoreInput";
import { betsService } from "../services/betsService";
import { useToast } from "../hooks/useToast";

const LOCK_BEFORE_MS = 5 * 60 * 1000; // bet locks 5 min before kickoff

function isMatchLocked(match: MatchBetResponse): boolean {
  return (
    match.status !== "SCHEDULED" ||
    new Date(match.dateTime).getTime() - LOCK_BEFORE_MS <= Date.now()
  );
}

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

// Early-morning matches (00:00–04:00) count as part of the previous day, so a
// game at 01:00 on the 21st shows up alongside the 20th's matches.
const EARLY_MORNING_CUTOFF_HOURS = 4;

// The calendar day a match/instant belongs to, shifting the first 4 hours back
// into the previous day. Returns midnight (local) of that effective day.
function effectiveDayStart(dateTime: string | number | Date): number {
  const d = new Date(dateTime);
  d.setHours(d.getHours() - EARLY_MORNING_CUTOFF_HOURS, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Matches scheduled for the current calendar day, sorted by kickoff. Madrugada
// matches (00:00–04:00 of the next day) are included with the current day.
export function getTodayMatches(
  bets: MatchGroupResponse[],
): MatchBetResponse[] {
  const today = effectiveDayStart(new Date());

  return bets
    .flatMap((group) => group.matches)
    .filter((match) => effectiveDayStart(match.dateTime) === today)
    .sort(
      (a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
}

function TodayMatchCard({
  match,
  showUserBet,
  isEditing,
  editHome,
  editAway,
  editWinner,
  onEditHomeChange,
  onEditAwayChange,
  onSelectWinner,
  onStartEdit,
  t,
}: {
  match: MatchBetResponse;
  showUserBet: boolean;
  isEditing: boolean;
  editHome: string;
  editAway: string;
  editWinner: number | null;
  onEditHomeChange: (value: string) => void;
  onEditAwayChange: (value: string) => void;
  onSelectWinner: (winnerId: number) => void;
  onStartEdit: () => void;
  t: TFunction;
}) {
  const { date, time } = formatMatchDateTime(match.dateTime);
  const locked = isMatchLocked(match);
  const canEdit = showUserBet && !locked;

  // Mata-mata + empate previsto → escolher quem avança (+5 bônus)
  const isKnockout = !/^[A-L]$/.test(match.group);
  const homeNum = parseInt(editHome, 10);
  const awayNum = parseInt(editAway, 10);
  const editIsDraw =
    editHome.trim() !== "" &&
    editAway.trim() !== "" &&
    !Number.isNaN(homeNum) &&
    !Number.isNaN(awayNum) &&
    homeNum === awayNum;
  const showWinnerPicker = isEditing && isKnockout && editIsDraw;

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
            {isEditing ? (
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 mb-2">
                <JackpotScoreInput
                  value={editHome}
                  onChange={onEditHomeChange}
                  teamLabel={match.homeTeam}
                  className="w-10 h-10 text-lg shadow-inner bg-background"
                />
                <span className="text-muted-foreground font-bold">X</span>
                <JackpotScoreInput
                  value={editAway}
                  onChange={onEditAwayChange}
                  teamLabel={match.awayTeam}
                  className="w-10 h-10 text-lg shadow-inner bg-background"
                />
              </div>
            ) : showUserBet && match.userBet ? (
              <button
                type="button"
                onClick={canEdit ? onStartEdit : undefined}
                disabled={!canEdit}
                className={`flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 mb-2 transition-colors ${
                  canEdit
                    ? "hover:bg-primary/20 cursor-pointer"
                    : "cursor-default"
                }`}
              >
                <span className="text-2xl font-black text-primary">
                  {match.userBet.homeScore ?? "-"}
                </span>
                <span className="text-muted-foreground font-bold">X</span>
                <span className="text-2xl font-black text-primary">
                  {match.userBet.awayScore ?? "-"}
                </span>
                {canEdit && <Pencil className="w-3.5 h-3.5 text-primary/70" />}
              </button>
            ) : canEdit ? (
              <button
                type="button"
                onClick={onStartEdit}
                className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2 mb-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t("profile.addPrediction") || "Add Prediction"}
              </button>
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

        {/* Mata-mata: previu empate → escolher quem avança (+5 bônus) */}
        {showWinnerPicker && (
          <div className="mt-4 bg-accent/5 border border-accent/30 rounded-lg p-2.5 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-accent uppercase tracking-wider text-center">
              {t("groupModal.whoAdvances", "Quem avança? (+5 bônus)")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: match.homeTeamId, name: match.homeTeam },
                { id: match.awayTeamId, name: match.awayTeam },
              ].map((team) => {
                const selected = team.id != null && editWinner === team.id;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => onSelectWinner(team.id)}
                    className={`flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-md border-2 transition-all truncate ${
                      selected
                        ? "bg-accent border-accent text-accent-foreground ring-2 ring-accent/40 shadow-sm"
                        : "bg-background border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
                    }`}
                    title={team.name}
                  >
                    {selected && <Check className="w-3 h-3 shrink-0" />}
                    <span className="truncate">{t(`teams.${team.name}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
  onSave,
  t,
}: {
  matches: MatchBetResponse[];
  showUserBets: boolean;
  setShowUserBets: (value: boolean) => void;
  onSave: (
    match: MatchBetResponse,
    homeScore: number,
    awayScore: number,
    selectedWinnerId: number | null,
  ) => Promise<void>;
  t: TFunction;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editHome, setEditHome] = useState("");
  const [editAway, setEditAway] = useState("");
  const [editWinner, setEditWinner] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const cancelEdit = () => setEditingId(null);

  // Quem avança só vale enquanto o placar for empate; placar decidido limpa.
  const clearWinnerIfNotDraw = (home: string, away: string) => {
    const h = parseInt(home, 10);
    const a = parseInt(away, 10);
    const isDraw =
      home.trim() !== "" &&
      away.trim() !== "" &&
      !Number.isNaN(h) &&
      !Number.isNaN(a) &&
      h === a;
    if (!isDraw) setEditWinner(null);
  };

  const handleEditHome = (value: string) => {
    setEditHome(value);
    clearWinnerIfNotDraw(value, editAway);
  };

  const handleEditAway = (value: string) => {
    setEditAway(value);
    clearWinnerIfNotDraw(editHome, value);
  };

  const goToPrevious = () => {
    cancelEdit();
    setCurrentIndex((prev) => (prev === 0 ? matches.length - 1 : prev - 1));
  };

  const goToNext = () => {
    cancelEdit();
    setCurrentIndex((prev) => (prev === matches.length - 1 ? 0 : prev + 1));
  };

  const startEdit = (match: MatchBetResponse) => {
    setEditingId(match.id);
    setEditHome(match.userBet?.homeScore?.toString() ?? "");
    setEditAway(match.userBet?.awayScore?.toString() ?? "");
    setEditWinner(match.userBet?.selectedWinnerId ?? null);
  };

  const editingMatch = matches.find((m) => m.id === editingId);
  const editHomeNum = parseInt(editHome, 10);
  const editAwayNum = parseInt(editAway, 10);
  const scoresFilled =
    editHome.trim() !== "" &&
    editAway.trim() !== "" &&
    !Number.isNaN(editHomeNum) &&
    !Number.isNaN(editAwayNum);
  // Mata-mata com empate exige escolher quem avança antes de salvar.
  const needsWinner =
    !!editingMatch &&
    !/^[A-L]$/.test(editingMatch.group) &&
    scoresFilled &&
    editHomeNum === editAwayNum;
  const isEditValid = scoresFilled && (!needsWinner || editWinner !== null);

  const handleSave = async () => {
    if (editingId === null || !isEditValid || isSaving) return;
    const match = matches.find((m) => m.id === editingId);
    if (!match) return;
    setIsSaving(true);
    try {
      await onSave(
        match,
        parseInt(editHome, 10),
        parseInt(editAway, 10),
        editWinner,
      );
      setEditingId(null);
    } catch {
      // toast surfaced by parent; keep edit open so the user can retry
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 overflow-hidden">
      {/* Toggle + Save Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        {editingId !== null && (
          <button
            onClick={handleSave}
            disabled={!isEditValid || isSaving}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {t("profile.savePrediction") || "Save Prediction"}
          </button>
        )}
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
                    isEditing={editingId === match.id}
                    editHome={editHome}
                    editAway={editAway}
                    editWinner={editWinner}
                    onEditHomeChange={handleEditHome}
                    onEditAwayChange={handleEditAway}
                    onSelectWinner={setEditWinner}
                    onStartEdit={() => startEdit(match)}
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
            onClick={() => {
              cancelEdit();
              setCurrentIndex(index);
            }}
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
  onBetSaved,
}: {
  bets: MatchGroupResponse[];
  onBetSaved?: () => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [showUserBets, setShowUserBets] = useState(true);

  const todayMatches = getTodayMatches(bets);

  const handleSave = async (
    match: MatchBetResponse,
    homeScore: number,
    awayScore: number,
    selectedWinnerId: number | null,
  ) => {
    try {
      await betsService.placeBets([
        {
          matchId: match.id,
          homeScore,
          awayScore,
          selectedWinnerId: selectedWinnerId ?? undefined,
        },
      ]);
      showToast(
        t("dashboard.predictionsSavedSuccess", "Apostas salvas com sucesso!"),
        "success",
      );
      await onBetSaved?.();
    } catch (error) {
      console.error("Failed to save prediction", error);
      showToast(
        t("dashboard.predictionsSavedError", "Erro ao salvar apostas."),
        "error",
      );
      throw error;
    }
  };

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
        onSave={handleSave}
        t={t}
      />
    </div>
  );
}
