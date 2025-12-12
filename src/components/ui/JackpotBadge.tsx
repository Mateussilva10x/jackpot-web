import React from "react";
import { Radio, Clock, Calendar } from "lucide-react";

interface JackpotBadgeProps {
  status: "live" | "ended" | "upcoming";
}

export const JackpotBadge: React.FC<JackpotBadgeProps> = ({ status }) => {
  const config = {
    live: {
      label: "AO VIVO",
      className: "badge-live",
      icon: <Radio className="w-3 h-3 mr-1" />,
    },
    ended: {
      label: "ENCERRADO",
      className: "badge-finished",
      icon: <Clock className="w-3 h-3 mr-1" />,
    },
    upcoming: {
      label: "EM BREVE",
      className: "badge-scheduled",
      icon: <Calendar className="w-3 h-3 mr-1" />,
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-transparent shadow-sm ${current.className}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
};
