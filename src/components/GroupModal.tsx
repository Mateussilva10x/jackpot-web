import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { JackpotScoreInput } from "./ui/JackpotScoreInput";
import { JackpotButton } from "./ui/JackpotButton";
import { Flag } from "lucide-react";

// Mock types
export interface Game {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  date: string;
  time: string;
  scoreA: string;
  scoreB: string;
}

export interface GroupData {
  id: string;
  name: string;
  teams: string[];
  games: Game[];
}

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupData | null;
  onSave: (groupId: string, games: Game[]) => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  group,
  onSave,
}) => {
  const [games, setGames] = useState<Game[]>([]);

  // Reset/Sync state when group changes
  React.useEffect(() => {
    if (group) {
      setGames(JSON.parse(JSON.stringify(group.games)));
    }
  }, [group]);

  const handleScoreChange = (
    gameId: string,
    team: "A" | "B",
    value: string,
  ) => {
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            [team === "A" ? "scoreA" : "scoreB"]: value,
          };
        }
        return game;
      }),
    );
  };

  const handleSave = () => {
    if (group) {
      onSave(group.id, games);
      onClose();
    }
  };

  if (!group) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Group ${group.name} - Predictions`}
    >
      <div className="space-y-8">
        {/* Classification Table Mock */}
        <div className="bg-secondary/20 rounded-xl p-4 border border-border">
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 tracking-wider">
            Standings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium">Team</th>
                  <th className="px-4 py-2 text-center font-medium">P</th>
                  <th className="px-4 py-2 text-center font-medium">W</th>
                  <th className="px-4 py-2 text-center font-medium">D</th>
                  <th className="px-4 py-2 text-center font-medium">L</th>
                  <th className="px-4 py-2 text-center font-medium">GD</th>
                  <th className="px-4 py-2 text-center font-medium">Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team, i) => (
                  <tr
                    key={team}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">
                        {i + 1}
                      </span>
                      <Flag className="w-4 h-4" /> {/* Placeholder for flag */}
                      {team}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      0
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      0
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      0
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      0
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      0
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-primary">
                      0
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Games List */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 tracking-wider">
            Matches
          </h3>
          <div className="space-y-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
              >
                {/* Header */}
                <div className="bg-secondary/30 px-4 py-2 flex items-center justify-between border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-semibold text-foreground">
                      World Cup 2026
                    </span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {game.date} • {game.time}
                  </div>
                </div>

                {/* Match Content */}
                <div className="p-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
                  {/* Team A */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl shadow-sm">
                      {game.flagA}
                    </div>
                    <span className="font-bold text-sm md:text-base text-center hidden md:block">
                      {game.teamA}
                    </span>
                    <span className="font-bold text-sm text-center md:hidden">
                      {game.teamA.substring(0, 3).toUpperCase()}
                    </span>
                  </div>

                  {/* Score Inputs */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <JackpotScoreInput
                      value={game.scoreA}
                      onChange={(val) => handleScoreChange(game.id, "A", val)}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl"
                    />
                    <span className="text-muted-foreground font-bold text-lg">
                      X
                    </span>
                    <JackpotScoreInput
                      value={game.scoreB}
                      onChange={(val) => handleScoreChange(game.id, "B", val)}
                      className="w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl"
                    />
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl shadow-sm">
                      {game.flagB}
                    </div>
                    <span className="font-bold text-sm md:text-base text-center hidden md:block">
                      {game.teamB}
                    </span>
                    <span className="font-bold text-sm text-center md:hidden">
                      {game.teamB.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <JackpotButton variant="ghost" onClick={onClose} type="button">
            Cancel
          </JackpotButton>
          <JackpotButton variant="primary" onClick={handleSave} type="button">
            Save Predictions
          </JackpotButton>
        </div>
      </div>
    </Modal>
  );
};
