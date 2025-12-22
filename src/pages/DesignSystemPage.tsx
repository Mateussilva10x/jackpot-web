import React, { useState } from "react";
import { JackpotButton } from "../components/ui/JackpotButton";
import { JackpotInput } from "../components/ui/JackpotInput";
import { JackpotCard } from "../components/ui/JackpotCard";
import { JackpotBadge } from "../components/ui/JackpotBadge";
import { JackpotScoreInput } from "../components/ui/JackpotScoreInput";
import api from "../services/api";

export const DesignSystemPage: React.FC = () => {
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");

  const [apiLoading, setApiLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const testConnection = async () => {
    setApiLoading(true);
    setApiResponse(null);
    setIsError(false);

    try {
      const response = await api.get("/");
      setApiResponse(`Sucesso! Status: ${response.status} (Servidor Online)`);
    } catch (error: any) {
      if (error.response) {
        setApiResponse(
          `Conectado! O servidor respondeu: ${error.response.status} (Isso é normal se não houver rota home)`
        );
        setIsError(false);
      } else if (error.request) {
        setApiResponse(
          "Erro de Conexão: O Backend não respondeu. Verifique a URL."
        );
        setIsError(true);
      } else {
        setApiResponse(`Erro: ${error.message}`);
        setIsError(true);
      }
    } finally {
      setApiLoading(false);
    }
  };

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

        <section className="p-6 border border-dashed border-primary/50 rounded-lg bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">
              6. Teste de Integração (QA)
            </h2>
            <JackpotBadge
              status={isError ? "ended" : apiResponse ? "live" : "upcoming"}
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              Este botão testa a comunicação real com o Backend configurado em:{" "}
              <br />
              <code className="bg-black/30 px-2 py-1 rounded text-xs">
                {import.meta.env.VITE_API_URL || "http://localhost:8080"}
              </code>
            </p>

            <div className="flex items-center gap-4">
              <JackpotButton onClick={testConnection} isLoading={apiLoading}>
                Testar Ping no Backend
              </JackpotButton>
            </div>

            {apiResponse && (
              <div
                className={`p-4 rounded border ${
                  isError
                    ? "bg-red-900/20 border-red-500"
                    : "bg-green-900/20 border-green-500"
                }`}
              >
                <p
                  className={`font-mono text-sm ${
                    isError ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {apiResponse}
                </p>
              </div>
            )}
          </div>
        </section>

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
