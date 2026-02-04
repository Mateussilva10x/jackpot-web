import { useState } from "react";
import { Countdown, BonusPredictions } from "../components/DashboardHeader";
import {
  GroupModal,
  type GroupData,
  type Game,
} from "../components/GroupModal";
import { ChevronDown, Trophy } from "lucide-react";

// Mock Data Generator
const generateGroups = (): GroupData[] => {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  return groups.map((groupLetter) => ({
    id: groupLetter,
    name: groupLetter,
    teams: ["Team 1", "Team 2", "Team 3", "Team 4"], // Placeholders
    games: [
      {
        id: `${groupLetter}1`,
        teamA: "USA",
        teamB: "Mexico",
        flagA: "🇺🇸",
        flagB: "🇲🇽",
        date: "11/06",
        time: "16:00",
        scoreA: "",
        scoreB: "",
      },
      {
        id: `${groupLetter}2`,
        teamA: "Canada",
        teamB: "Brazil",
        flagA: "🇨🇦",
        flagB: "🇧🇷",
        date: "11/06",
        time: "19:00",
        scoreA: "",
        scoreB: "",
      },
    ],
  }));
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"group" | "knockout">("group");
  const [groups, setGroups] = useState<GroupData[]>(generateGroups());
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGroupClick = (group: GroupData) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleSavePredictions = (groupId: string, updatedGames: Game[]) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return { ...g, games: updatedGames };
        }
        return g;
      }),
    );
    // Here you would also call the API to save to backend
  };

  // Calculate progress (mock logic)
  const getProgress = (group: GroupData) => {
    const predicted = group.games.filter(
      (g) => g.scoreA !== "" && g.scoreB !== "",
    ).length;
    return `${predicted}/${group.games.length}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Countdown />

      <BonusPredictions />

      {/* Stage Toggles */}
      <div className="flex bg-secondary/30 p-1 rounded-xl mb-8 border border-border">
        <button
          onClick={() => setActiveTab("group")}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === "group"
              ? "bg-secondary text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Group Stage
        </button>
        <button
          onClick={() => setActiveTab("knockout")}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === "knockout"
              ? "bg-secondary text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Knockout Stage
        </button>
      </div>

      {activeTab === "group" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => handleGroupClick(group)}
              className="group cursor-pointer bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/5 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                    <span className="text-xl font-bold text-green-500">
                      {group.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="text-foreground">US</span>
                    <span className="text-foreground">MX</span>
                    <span className="text-foreground">CA</span>
                    <span className="text-foreground">BR</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* <JackpotBadge status="live" className="hidden sm:flex">
                    1 LIVE
                  </JackpotBadge> */}

                  <span className="text-sm font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                    {getProgress(group)}
                  </span>

                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-card border border-border rounded-xl border-dashed">
          <div className="p-4 bg-secondary/50 rounded-full">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Knockout Stage
            </h3>
            <p className="text-muted-foreground">
              Predictions will open after group stage concludes.
            </p>
          </div>
        </div>
      )}

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        group={selectedGroup}
        onSave={handleSavePredictions}
      />
    </div>
  );
}
