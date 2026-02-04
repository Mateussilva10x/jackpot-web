/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Trophy, Medal, Target } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
  const targetDate = new Date("2026-06-11T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 mb-8 mt-16 md:mt-0">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium tracking-wide uppercase">
          World Cup 2026 Starts In
        </span>
      </div>

      <div className="flex justify-center items-center gap-4 md:gap-8">
        <TimeUnit value={timeLeft.days} label="Days" />
        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-secondary/50 rounded-lg p-3 md:p-4 min-w-[30px] md:min-w-[100px] flex items-center justify-center mb-2">
        <span className="text-2xl md:text-5xl font-bold tabular-nums text-foreground">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground font-medium uppercase">
        {label}
      </span>
    </div>
  );
}

export function BonusPredictions() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-bold text-foreground">Bonus Predictions</h2>
        <span className="text-sm text-muted-foreground ml-2">
          +50 points each
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BonusCard
          icon={<Trophy className="w-6 h-6 text-yellow-500" />}
          title="Champion"
          subtitle="Who will win it all?"
          placeholder="Select Team..."
        />
        <BonusCard
          icon={<Medal className="w-6 h-6 text-gray-400" />}
          title="Vice-Champion"
          subtitle="Runner-up prediction"
          placeholder="Select Team..."
        />
        <BonusCard
          icon={<Target className="w-6 h-6 text-blue-500" />}
          title="Top Scorer"
          subtitle="Golden Boot winner"
          isInput
          placeholder="Enter player name..."
        />
      </div>
    </div>
  );
}

function BonusCard({ icon, title, subtitle, placeholder, isInput }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-secondary rounded-lg group-hover:bg-secondary/80 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {isInput ? (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
        />
      ) : (
        <select className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer">
          <option value="">{placeholder}</option>
          <option value="br">Brazil</option>
          <option value="fr">France</option>
          <option value="ar">Argentina</option>
        </select>
      )}
    </div>
  );
}
