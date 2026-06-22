import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { rankingService } from "../../services/rankingService";
import type { RankingEvolutionPoint } from "../../types/api";

interface EvolutionChartProps {
  userId: string | number;
}

const WIDTH = 720;
const HEIGHT = 320;
const PADDING = { top: 24, right: 24, bottom: 40, left: 44 };

function formatDay(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
  });
}

export function EvolutionChart({ userId }: EvolutionChartProps) {
  const { t } = useTranslation();
  const [points, setPoints] = useState<RankingEvolutionPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await rankingService.getUserEvolution(userId);
        if (isMounted) setPoints(data);
      } catch (err) {
        console.error("Failed to load evolution", err);
        if (isMounted)
          setError(t("profile.evolutionError") || "Failed to load evolution");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [userId, t]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
        <TrendingUp className="w-10 h-10 mb-3 opacity-50" />
        <p>{t("profile.evolutionEmpty") || "No ranking history yet."}</p>
      </div>
    );
  }

  const positions = points.map((p) => p.position);
  const bestPos = Math.min(...positions); // best = closest to 1, top
  const worstPos = Math.max(...positions);
  const posRange = Math.max(1, worstPos - bestPos);

  const plotW = WIDTH - PADDING.left - PADDING.right;
  const plotH = HEIGHT - PADDING.top - PADDING.bottom;

  const x = (i: number) =>
    PADDING.left +
    (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);

  // Inverted: best position (smallest number) at top.
  const y = (pos: number) =>
    PADDING.top + ((pos - bestPos) / posRange) * plotH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.position)}`)
    .join(" ");

  const areaPath =
    `${linePath} L ${x(points.length - 1)} ${PADDING.top + plotH} ` +
    `L ${x(0)} ${PADDING.top + plotH} Z`;

  // Y axis ticks: best and worst position.
  const yTicks = Array.from(new Set([bestPos, worstPos]));

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
      >
        <defs>
          <linearGradient id="evoArea" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-primary)"
              stopOpacity="0.25"
            />
            <stop
              offset="100%"
              stopColor="var(--color-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Y grid + position labels */}
        {yTicks.map((pos) => (
          <g key={pos}>
            <line
              x1={PADDING.left}
              y1={y(pos)}
              x2={WIDTH - PADDING.right}
              y2={y(pos)}
              stroke="var(--color-border)"
              strokeDasharray="4 4"
            />
            <text
              x={PADDING.left - 10}
              y={y(pos) + 4}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize="12"
              fontWeight="700"
            >
              #{pos}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#evoArea)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <g
            key={p.date}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* X labels */}
            <text
              x={x(i)}
              y={HEIGHT - PADDING.bottom + 22}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="11"
            >
              {formatDay(p.date)}
            </text>

            {/* Hover hit area */}
            <rect
              x={x(i) - plotW / Math.max(points.length, 2) / 2}
              y={PADDING.top}
              width={plotW / Math.max(points.length, 2)}
              height={plotH}
              fill="transparent"
            />

            <circle
              cx={x(i)}
              cy={y(p.position)}
              r={hovered === i ? 6 : 4}
              fill="var(--color-primary)"
              stroke="var(--color-card)"
              strokeWidth="2"
            />

            {hovered === i && (
              <g pointerEvents="none">
                <rect
                  x={Math.min(Math.max(x(i) - 60, 4), WIDTH - 124)}
                  y={Math.max(y(p.position) - 58, 4)}
                  width="120"
                  height="46"
                  rx="6"
                  fill="var(--color-card)"
                  stroke="var(--color-border)"
                />
                <text
                  x={Math.min(Math.max(x(i), 64), WIDTH - 64)}
                  y={Math.max(y(p.position) - 38, 24)}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="12"
                  fontWeight="700"
                >
                  #{p.position} · {p.totalPoints} {t("ranking.pts") || "pts"}
                </text>
                <text
                  x={Math.min(Math.max(x(i), 64), WIDTH - 64)}
                  y={Math.max(y(p.position) - 22, 40)}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="11"
                >
                  {formatDay(p.date)}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
