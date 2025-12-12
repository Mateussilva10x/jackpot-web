import React, { useState } from "react";
import { JackpotButton } from "../components/ui/JackpotButton";
import { JackpotInput } from "../components/ui/JackpotInput";
import { JackpotCard } from "../components/ui/JackpotCard";
import { JackpotBadge } from "../components/ui/JackpotBadge";
import { JackpotScoreInput } from "../components/ui/JackpotScoreInput";

export const DesignSystemPage: React.FC = () => {
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");

  return (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">
            🎨 Jackpot Design System
          </h1>
          <p className="text-text-muted">
            Componentes base construídos com React + Tailwind v4.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Botões</h2>
          <div className="flex flex-wrap gap-4">
            <JackpotButton>Primary Button</JackpotButton>
            <JackpotButton variant="secondary">Secondary</JackpotButton>
            <JackpotButton variant="outline">Outline</JackpotButton>
            <JackpotButton disabled>Disabled</JackpotButton>
            <JackpotButton isLoading>Loading</JackpotButton>
          </div>
        </section>

        <section className="space-y-4 max-w-md">
          <h2 className="text-xl font-semibold text-white">2. Inputs</h2>
          <div className="space-y-4">
            <JackpotInput label="E-mail" placeholder="exemplo@email.com" />
            <JackpotInput
              label="Senha (Com Erro)"
              type="password"
              defaultValue="123"
              errorMessage="A senha deve ter no mínimo 6 caracteres"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Badges</h2>
          <div className="flex gap-4">
            <JackpotBadge status="live" />
            <JackpotBadge status="ended" />
            <JackpotBadge status="upcoming" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            5. Exemplo Real: Game Card
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <JackpotCard className="relative overflow-hidden">
              {/* Pattern de fundo opcional do CSS */}
              <div className="absolute inset-0 stadium-pattern opacity-50 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <JackpotBadge status="live" />
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                    Copa do Mundo
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-4xl">🇧🇷</span>
                    <span className="font-bold text-sm tracking-wide">BRA</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <JackpotScoreInput
                      value={scoreHome}
                      onChange={setScoreHome}
                      teamLabel="Placar Casa"
                    />
                    <span className="text-muted-foreground font-bold text-xl">
                      :
                    </span>
                    <JackpotScoreInput
                      value={scoreAway}
                      onChange={setScoreAway}
                      teamLabel="Placar Visitante"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-4xl">🇫🇷</span>
                    <span className="font-bold text-sm tracking-wide">FRA</span>
                  </div>
                </div>
              </div>
            </JackpotCard>
          </div>
        </section>
      </div>
    </div>
  );
};
