import { useTranslation } from "react-i18next";
import {
  Trophy,
  Target,
  Zap,
  Clock,
  Shield,
  Star,
  CheckCircle2,
  Info,
  Swords,
  X,
} from "lucide-react";

interface RuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
  color?: "primary" | "accent" | "warning" | "gold";
}

function RuleCard({
  icon,
  title,
  description,
  highlight,
  color = "primary",
}: RuleCardProps) {
  const colorMap = {
    primary: {
      border: "border-primary/30",
      bg: "bg-primary/10",
      text: "text-primary",
      glow: "shadow-primary/10",
      badge: "bg-primary/20 text-primary border-primary/30",
    },
    accent: {
      border: "border-accent/30",
      bg: "bg-accent/10",
      text: "text-accent",
      glow: "shadow-accent/10",
      badge: "bg-accent/20 text-accent border-accent/30",
    },
    warning: {
      border: "border-warning/30",
      bg: "bg-warning/10",
      text: "text-warning",
      glow: "shadow-warning/10",
      badge: "bg-warning/20 text-warning border-warning/30",
    },
    gold: {
      border: "border-gold/30",
      bg: "bg-gold/10",
      text: "text-gold",
      glow: "shadow-gold/10",
      badge: "bg-gold/20 text-gold border-gold/30",
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`relative bg-card border ${c.border} rounded-2xl p-6 flex flex-col gap-4 shadow-lg ${c.glow} hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
        >
          <span className={c.text}>{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {highlight && (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${c.badge} self-start`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {highlight}
        </div>
      )}
    </div>
  );
}

interface PointsBadgeProps {
  points: number;
  label: string;
  sublabel?: string;
  color?: "primary" | "accent" | "warning" | "gold";
}

function PointsBadge({
  points,
  label,
  sublabel,
  color = "primary",
}: PointsBadgeProps) {
  const colorMap = {
    primary: "from-primary/20 to-primary/5 border-primary/30 text-primary",
    accent: "from-accent/20 to-accent/5 border-accent/30 text-accent",
    warning: "from-warning/20 to-warning/5 border-warning/30 text-warning",
    gold: "from-gold/20 to-gold/5 border-gold/30 text-gold",
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-2 sm:p-5 rounded-2xl bg-gradient-to-b ${colorMap[color]} border text-center transition-all duration-300 hover:scale-105`}
    >
      <span
        className={`text-2xl sm:text-4xl font-black mb-0.5 sm:mb-1 tabular-nums ${colorMap[color].split(" ").pop()}`}
      >
        {points}
      </span>
      <span className="text-[10px] sm:text-xs font-bold text-foreground uppercase tracking-wider leading-tight">
        {label}
      </span>
      {sublabel && (
        <span className="hidden sm:block text-xs text-muted-foreground mt-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
}

interface MatchExampleProps {
  bet: string;
  result: string;
  note?: string;
  pts: string;
  ptsColor?: string;
}

function MatchExample({
  bet,
  result,
  note,
  pts,
  ptsColor = "text-primary",
}: MatchExampleProps) {
  const { t } = useTranslation();
  return (
    <div className="mt-2 bg-secondary/40 border border-border/40 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs space-y-1.5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-muted-foreground/70 w-16 sm:w-20 shrink-0 font-medium">
          {t("rules.example.yourBet")}
        </span>
        <span className="font-mono font-semibold text-foreground truncate flex-1 min-w-0">
          {bet}
        </span>
        <span className={`font-black shrink-0 invisible`}>{pts}</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-muted-foreground/70 w-16 sm:w-20 shrink-0 font-medium">
          {t("rules.example.result")}
        </span>
        <span className="font-mono font-semibold text-foreground truncate flex-1 min-w-0">
          {result}
        </span>
        <span className={`font-black shrink-0 ${ptsColor}`}>{pts}</span>
      </div>
      {note && (
        <p className="text-muted-foreground/80 italic pt-0.5 border-t border-border/30 leading-relaxed">
          {note}
        </p>
      )}
    </div>
  );
}

export default function Rules() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Header */}
      <div className="relative mb-10 rounded-3xl overflow-hidden bg-gradient-to-br from-secondary/80 via-card to-secondary/40 border border-border p-8 text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/3 blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            {t("rules.badge", "Regulamento Oficial")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
            {t("rules.title", "Regras Marca da")}{" "}
            <span className="text-gradient-primary">
              {t("rules.titleHighlight", "Cal Bet")}
            </span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            {t(
              "rules.subtitle",
              "Entenda como funciona o sistema de pontuação, os prazos e as regras especiais da fase de mata-mata.",
            )}
          </p>
        </div>
      </div>

      {/* Scoring Summary Grid */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Star className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("rules.scoring.title", "Tabela de Pontuação")}
          </h2>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
          <PointsBadge
            points={10}
            label={t("rules.scoring.exactScore", "Placar Exato")}
            sublabel={t("rules.scoring.exactScoreSub", "Ambos os gols")}
            color="gold"
          />
          <PointsBadge
            points={7}
            label={t("rules.scoring.winner", "Vencedor")}
            sublabel={t("rules.scoring.winnerSub", "+ 1 placar certo")}
            color="primary"
          />
          <PointsBadge
            points={5}
            label={t("rules.scoring.result", "Resultado")}
            sublabel={t("rules.scoring.resultSub", "Vitória/Empate")}
            color="accent"
          />
          <PointsBadge
            points={3}
            label={t("rules.scoring.oneScore", "1 Placar")}
            sublabel={t("rules.scoring.oneScoreSub", "Gols de um time")}
            color="warning"
          />
          <PointsBadge
            points={0}
            label={t("rules.scoring.wrong", "Errou")}
            sublabel={t("rules.scoring.wrongSub", "Nenhum acerto")}
            color="warning"
          />
        </div>

        {/* Detailed scoring with examples */}
        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {/* 10 pts */}
          <div className="px-5 py-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 text-gold mt-0.5">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {t("rules.scoring.detail1Title", "Placar Exato")}
                  </p>
                  <span className="text-sm font-black tabular-nums shrink-0 text-gold">
                    10 pts
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "rules.scoring.detail1Desc",
                    "Acertou os gols do time da casa E do time visitante exatamente.",
                  )}
                </p>
                <MatchExample
                  bet={t("rules.scoring.detail1Bet")}
                  result={t("rules.scoring.detail1Result")}
                  note={t("rules.scoring.detail1Note")}
                  pts="+10 pts"
                  ptsColor="text-gold"
                />
              </div>
            </div>
          </div>

          {/* 7 pts */}
          <div className="px-5 py-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {t(
                      "rules.scoring.detail2Title",
                      "Vencedor + Gols de um Time",
                    )}
                  </p>
                  <span className="text-sm font-black tabular-nums shrink-0 text-primary">
                    7 pts
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "rules.scoring.detail2Desc",
                    "Acertou quem venceu (ou empate) e os gols de pelo menos uma das equipes, mas não o placar exato.",
                  )}
                </p>
                <MatchExample
                  bet={t("rules.scoring.detail2Bet1")}
                  result={t("rules.scoring.detail2Result1")}
                  note={t("rules.scoring.detail2Note1")}
                  pts="+7 pts"
                  ptsColor="text-primary"
                />
                <MatchExample
                  bet={t("rules.scoring.detail2Bet2")}
                  result={t("rules.scoring.detail2Result2")}
                  note={t("rules.scoring.detail2Note2")}
                  pts="+7 pts"
                  ptsColor="text-primary"
                />
              </div>
            </div>
          </div>

          {/* 5 pts */}
          <div className="px-5 py-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {t("rules.scoring.detail3Title", "Resultado Correto")}
                  </p>
                  <span className="text-sm font-black tabular-nums shrink-0 text-accent">
                    5 pts
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "rules.scoring.detail3Desc",
                    "Acertou apenas quem venceu ou que seria empate, mas errou os gols das duas equipes.",
                  )}
                </p>
                <MatchExample
                  bet={t("rules.scoring.detail3Bet1")}
                  result={t("rules.scoring.detail3Result1")}
                  note={t("rules.scoring.detail3Note1")}
                  pts="+5 pts"
                  ptsColor="text-accent"
                />
                <MatchExample
                  bet={t("rules.scoring.detail3Bet2")}
                  result={t("rules.scoring.detail3Result2")}
                  note={t("rules.scoring.detail3Note2")}
                  pts="+5 pts"
                  ptsColor="text-accent"
                />
              </div>
            </div>
          </div>

          {/* 3 pts */}
          <div className="px-5 py-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0 text-warning mt-0.5">
                <Star className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {t("rules.scoring.detail4Title", "Acerto de Um Placar")}
                  </p>
                  <span className="text-sm font-black tabular-nums shrink-0 text-warning">
                    3 pts
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "rules.scoring.detail4Desc",
                    "Errou o resultado (vencedor/empate), mas acertou exatamente os gols de uma das equipes.",
                  )}
                </p>
                <MatchExample
                  bet={t("rules.scoring.detail4Bet")}
                  result={t("rules.scoring.detail4Result")}
                  note={t("rules.scoring.detail4Note")}
                  pts="+3 pts"
                  ptsColor="text-warning"
                />
              </div>
            </div>
          </div>

          {/* 0 pts */}
          <div className="px-5 py-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 text-muted-foreground mt-0.5">
                <X className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {t("rules.scoring.detail5Title", "Nenhum Acerto")}
                  </p>
                  <span className="text-sm font-black tabular-nums shrink-0 text-muted-foreground">
                    0 pts
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    "rules.scoring.detail5Desc",
                    "Errou o resultado e os gols das duas equipes. Nenhum ponto é concedido.",
                  )}
                </p>
                <MatchExample
                  bet={t("rules.scoring.detail5Bet")}
                  result={t("rules.scoring.detail5Result")}
                  note={t("rules.scoring.detail5Note")}
                  pts="0 pts"
                  ptsColor="text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Penalty Bonus */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Target className="w-4 h-4 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("rules.penalty.title", "Bônus por Pênaltis")}
          </h2>
        </div>

        <div className="bg-card border border-accent/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-black text-accent">+5</span>
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">
                  pts bônus
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "rules.penalty.desc",
                  "Se a partida for decidida nos pênaltis, você ganha +5 pontos ao acertar qual seleção avança. Esse bônus é independente da pontuação do placar nos 90 minutos.",
                )}
              </p>
              <div className="mt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t("rules.example.label")}
                </p>
                <div className="bg-secondary/40 border border-border/40 rounded-xl px-3 py-2.5 text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/70 w-16 sm:w-20 shrink-0 font-medium">
                      {t("rules.example.yourBet")}
                    </span>
                    <span className="font-mono font-semibold text-foreground truncate flex-1 min-w-0">
                      {t("rules.penalty.exampleBet")}
                    </span>
                    <span className="font-black shrink-0 invisible">+15 pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/70 w-16 sm:w-20 shrink-0 font-medium">
                      {t("rules.example.result")}
                    </span>
                    <span className="font-mono font-semibold text-foreground truncate flex-1 min-w-0">
                      {t("rules.penalty.exampleResult")}
                    </span>
                    <span className="font-black text-accent shrink-0">
                      +15 pts
                    </span>
                  </div>
                  <p className="text-muted-foreground/80 italic pt-0.5 border-t border-border/30">
                    {t("rules.penalty.exampleNote")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Knockout Rules */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Swords className="w-4 h-4 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("rules.knockout.title", "Fase de Mata-Mata")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RuleCard
            icon={<Swords className="w-5 h-5" />}
            title={t(
              "rules.knockout.rule1Title",
              "Placar no Tempo Regulamentar",
            )}
            description={t(
              "rules.knockout.rule1Desc",
              "Na fase eliminatória, as apostas de placar consideram apenas o resultado ao final dos 90 minutos (ou prorrogação, caso haja). Pênaltis não contam para o placar.",
            )}
            color="accent"
          />
          <RuleCard
            icon={<Shield className="w-5 h-5" />}
            title={t("rules.knockout.rule2Title", "Escolha do Vencedor")}
            description={t(
              "rules.knockout.rule2Desc",
              "Se você prevê um empate no placar de um jogo eliminatório, deve obrigatoriamente escolher o time que avança (vencedor nos pênaltis). Este campo fica disponível apenas em jogos de mata-mata.",
            )}
            color="primary"
          />
          <RuleCard
            icon={<Target className="w-5 h-5" />}
            title={t(
              "rules.knockout.rule3Title",
              "Pontuação de Empate com Pênaltis",
            )}
            description={t(
              "rules.knockout.rule3Desc",
              "Se o jogo terminar empatado e for para pênaltis, você ganha pontos pelo placar/resultado previsto normalmente. Acertar o vencedor nos pênaltis adiciona +5 bônus extra.",
            )}
            color="warning"
          />
          <RuleCard
            icon={<Trophy className="w-5 h-5" />}
            title={t("rules.knockout.rule4Title", "Desbloqueio da Fase")}
            description={t(
              "rules.knockout.rule4Desc",
              "As apostas da fase de mata-mata só ficam disponíveis após o encerramento de todos os jogos da fase de grupos. Fique atento para não perder o prazo!",
            )}
            color="gold"
          />
        </div>
      </section>

      {/* Deadline Section */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("rules.deadline.title", "Prazo para Apostas")}
          </h2>
        </div>

        <div className="bg-card border border-warning/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-warning/5 blur-2xl pointer-events-none" />
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="flex items-center gap-2 text-warning">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t("rules.deadline.groupDeadlineTitle", "Fase de Grupos")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "rules.deadline.groupDeadlineDesc",
                  "Você pode fazer (ou alterar) sua aposta até 5 minutos antes do início de cada partida. Após esse prazo, a aposta é bloqueada para aquele jogo específico.",
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="flex items-center gap-2 text-warning">
                <Swords className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t("rules.deadline.knockoutDeadlineTitle", "Mata-Mata")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "rules.deadline.knockoutDeadlineDesc",
                  "O mesmo prazo se aplica: as apostas dos jogos eliminatórios ficam disponíveis assim que a fase anterior encerra, mas trancam 5 minutos antes de cada jogo.",
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="flex items-center gap-2 text-warning">
                <Star className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t("rules.deadline.bonusDeadlineTitle", "Apostas Bônus")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "rules.deadline.bonusDeadlineDesc",
                  "Campeão, vice-campeão e artilheiro devem ser escolhidos antes do início da Copa. Após o primeiro apito, essas apostas são bloqueadas definitivamente.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Bets */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-gold" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("rules.bonus.title", "Apostas Bônus")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              emoji: "🏆",
              label: t("rules.bonus.champion", "Campeão"),
              desc: t(
                "rules.bonus.championDesc",
                "Acerte o time que vai erguer a taça e ganhe pontos bônus no encerramento da Copa.",
              ),
              highlight: t("rules.bonus.championHighlight"),
              color: "gold" as const,
            },
            {
              emoji: "🥈",
              label: t("rules.bonus.runnerUp", "Vice-Campeão"),
              desc: t(
                "rules.bonus.runnerUpDesc",
                "Acerte o finalista que vai perder a decisão e some mais pontos ao seu total.",
              ),
              highlight: t("rules.bonus.runnerUpHighlight"),
              color: "accent" as const,
            },
            {
              emoji: "⚽",
              label: t("rules.bonus.topScorer", "Artilheiro"),
              desc: t(
                "rules.bonus.topScorerDesc",
                "Acerte o jogador que vai marcar mais gols no torneio e garanta os pontos extras.",
              ),
              highlight: t("rules.bonus.topScorerHighlight"),
              color: "primary" as const,
            },
          ].map((item) => (
            <RuleCard
              key={item.label}
              icon={<span className="text-xl">{item.emoji}</span>}
              title={item.label}
              description={item.desc}
              highlight={item.highlight}
              color={item.color}
            />
          ))}
        </div>
      </section>

      {/* General Rules */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("rules.general.title", "Regras Gerais")}
          </h2>
        </div>

        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {[
            t(
              "rules.general.rule1",
              "Os pontos são calculados automaticamente pelo sistema assim que o administrador finalizar e confirmar o resultado de cada partida.",
            ),
            t(
              "rules.general.rule2",
              "Não é possível alterar uma aposta após o início do jogo. Planeje suas previsões com antecedência.",
            ),
            t(
              "rules.general.rule3",
              "Em caso de empate no ranking, a posição é definida pelo critério de desempate: maior número de acertos exatos de placar.",
            ),
            t(
              "rules.general.rule4",
              "Jogadores banidos ou desativados não aparecerão no ranking e perderão seus pontos acumulados.",
            ),
            t(
              "rules.general.rule5",
              "O regulamento pode ser atualizado a qualquer momento pela administração, com aviso prévio aos participantes.",
            ),
          ].map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-black text-primary">
                  {idx + 1}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
