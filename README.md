# 🏆 Bolão Copa do Mundo

Sistema de bolão para apostas da Copa do Mundo com autenticação, internacionalização e design system moderno.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Design System](#design-system)
- [Internacionalização (i18n)](#internacionalização-i18n)
- [Componentização](#componentização)
- [Autenticação](#autenticação)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## 🎯 Visão Geral

Aplicação web para gerenciamento de bolões da Copa do Mundo, permitindo que usuários façam apostas, acompanhem resultados e compitam no ranking.

**Funcionalidades principais:**

- ✅ Sistema de autenticação completo (login/registro)
- ✅ Suporte a múltiplos idiomas (PT-BR e EN)
- ✅ Design system consistente e reutilizável
- ✅ Validação de formulários em tempo real
- ✅ Notificações toast para feedback do usuário
- ✅ Responsivo (mobile, tablet, desktop)

---

## 🛠 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS 4** - Framework CSS
- **react-i18next** - Internacionalização
- **Axios** - Cliente HTTP
- **React Router DOM** - Roteamento
- **Lucide React** - Ícones

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passos

```bash
# Clone o repositório
git clone <repository-url>
cd jackpot-web

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
jackpot-web/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes do Design System
│   │   │   ├── JackpotButton.tsx
│   │   │   ├── JackpotInput.tsx
│   │   │   ├── JackpotCard.tsx
│   │   │   ├── JackpotBadge.tsx
│   │   │   ├── JackpotScoreInput.tsx
│   │   │   └── Toast.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useToast.tsx
│   │   └── useLanguage.ts
│   ├── i18n/               # Internacionalização
│   │   ├── i18n.ts
│   │   └── locales/
│   │       ├── pt-BR.json
│   │       └── en.json
│   ├── layouts/            # Layouts de página
│   │   ├── PublicLayout.tsx
│   │   └── PrivateLayout.tsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Admin.tsx
│   │   └── app/
│   │       ├── Bets.tsx
│   │       └── Ranking.tsx
│   ├── services/           # Serviços e APIs
│   │   └── api.ts
│   ├── styles/             # Estilos globais
│   │   ├── index.css
│   │   └── App.css
│   ├── App.tsx
│   └── main.tsx
├── public/                 # Arquivos estáticos
├── .env.example           # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎨 Design System

O projeto utiliza um design system customizado com componentes reutilizáveis baseados em TailwindCSS.

### Cores

Definidas em `src/styles/index.css`:

```css
--background: 222 25% 6% /* Fundo escuro */ --foreground: 210 40% 98%
  /* Texto claro */ --primary: 152 70% 45% /* Verde principal */
  --secondary: 222 20% 16% /* Cinza escuro */ --accent: 210 80% 55%
  /* Azul destaque */ --destructive: 0 72% 55% /* Vermelho erro */
  --success: 152 70% 45% /* Verde sucesso */ --warning: 38 92% 50%
  /* Laranja aviso */;
```

### Componentes do Design System

#### JackpotButton

Botão customizado com variantes e estados de loading.

```tsx
import { JackpotButton } from "@/components/ui/JackpotButton";

<JackpotButton
  variant="primary" // primary | secondary | outline | ghost | destructive
  isLoading={false}
  onClick={handleClick}
>
  Clique aqui
</JackpotButton>;
```

**Variantes:**

- `primary` - Botão principal (verde com sombra)
- `secondary` - Botão secundário (cinza)
- `outline` - Botão com borda
- `ghost` - Botão transparente
- `destructive` - Botão de ação destrutiva (vermelho)

#### JackpotInput

Input customizado com label e mensagens de erro.

```tsx
import { JackpotInput } from "@/components/ui/JackpotInput";

<JackpotInput
  label="Email"
  type="email"
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  errorMessage={errors.email}
  disabled={false}
/>;
```

**Props:**

- `label` - Texto do label
- `errorMessage` - Mensagem de erro (torna o input vermelho)
- Aceita todas as props padrão de `<input>`

#### JackpotCard

Card com gradiente e sombra.

```tsx
import { JackpotCard } from "@/components/ui/JackpotCard";

<JackpotCard noPadding={false}>
  <h2>Título do Card</h2>
  <p>Conteúdo...</p>
</JackpotCard>;
```

#### JackpotBadge

Badge para status (agendado, ao vivo, finalizado).

```tsx
import { JackpotBadge } from "@/components/ui/JackpotBadge";

<JackpotBadge status="live">AO VIVO</JackpotBadge>;
```

**Status:**

- `scheduled` - Cinza
- `live` - Vermelho pulsante
- `finished` - Verde

#### Toast

Sistema de notificações.

```tsx
import { useToast } from "@/hooks/useToast";

const { showToast } = useToast();

showToast("Operação realizada com sucesso!", "success");
showToast("Erro ao processar", "error");
showToast("Atenção!", "warning");
showToast("Informação", "info");
```

### Classes Utilitárias

```css
.stadium-pattern        /* Padrão de fundo estilo estádio */
.card-gradient         /* Gradiente para cards */
.glow-primary          /* Brilho verde */
.glow-accent           /* Brilho azul */
.text-gradient-primary /* Texto com gradiente */
```

---

## 🌍 Internacionalização (i18n)

O projeto suporta múltiplos idiomas usando **react-i18next**.

### Idiomas Disponíveis

- 🇧🇷 Português Brasileiro (`pt-BR`) - Padrão
- 🇺🇸 English (`en`)

### Estrutura de Tradução

Arquivos de tradução em `src/i18n/locales/`:

```json
{
  "common": {
    "appName": "Bolão Copa do Mundo",
    "login": "Entrar",
    "save": "Salvar"
  },
  "auth": {
    "loginTitle": "Entre para fazer suas apostas",
    "email": "Email",
    "password": "Senha"
  },
  "validation": {
    "emailRequired": "Email é obrigatório",
    "passwordMinLength": "Senha deve ter pelo menos {{min}} caracteres"
  }
}
```

### Como Usar i18n em Componentes

```tsx
import { useTranslation } from "react-i18next";

function MeuComponente() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("common.appName")}</h1>
      <p>{t("auth.loginTitle")}</p>

      {/* Com interpolação */}
      <span>{t("validation.passwordMinLength", { min: 6 })}</span>
    </div>
  );
}
```

### Trocar Idioma

```tsx
import { useLanguage } from "@/hooks/useLanguage";

function MeuComponente() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <button onClick={() => changeLanguage("en")}>Mudar para Inglês</button>
  );
}
```

### Adicionar Novo Idioma

1. Crie arquivo de tradução: `src/i18n/locales/es.json`
2. Adicione as traduções seguindo a mesma estrutura
3. Importe em `src/i18n/i18n.ts`:

```typescript
import es from "./locales/es.json";

const resources = {
  "pt-BR": { translation: ptBR },
  en: { translation: en },
  es: { translation: es }, // Novo idioma
};
```

4. Atualize o tipo em `src/hooks/useLanguage.ts`:

```typescript
type Language = "pt-BR" | "en" | "es";
```

### Adicionar Novas Traduções

1. Adicione a chave em **todos** os arquivos de idioma:

```json
// pt-BR.json
{
  "pages": {
    "dashboard": {
      "title": "Painel de Controle",
      "welcome": "Bem-vindo, {{name}}!"
    }
  }
}

// en.json
{
  "pages": {
    "dashboard": {
      "title": "Dashboard",
      "welcome": "Welcome, {{name}}!"
    }
  }
}
```

2. Use no componente:

```tsx
<h1>{t('pages.dashboard.title')}</h1>
<p>{t('pages.dashboard.welcome', { name: user.name })}</p>
```

---

## 🧩 Componentização

### Princípios

1. **Componentes Pequenos e Focados**: Cada componente deve ter uma única responsabilidade
2. **Reutilizáveis**: Componentes devem ser genéricos o suficiente para serem reutilizados
3. **Tipados**: Sempre use TypeScript com interfaces bem definidas
4. **Acessíveis**: Inclua ARIA labels e suporte a teclado

### Estrutura de um Componente

```tsx
import React from "react";

// 1. Defina a interface de props
interface MeuComponenteProps {
  title: string;
  onAction: () => void;
  isActive?: boolean;
  className?: string;
}

// 2. Exporte o componente com FC (Function Component)
export const MeuComponente: React.FC<MeuComponenteProps> = ({
  title,
  onAction,
  isActive = false,
  className = "",
}) => {
  // 3. Lógica do componente
  const handleClick = () => {
    onAction();
  };

  // 4. Renderização
  return (
    <div className={`base-classes ${className}`}>
      <h2>{title}</h2>
      <button onClick={handleClick} disabled={!isActive}>
        Ação
      </button>
    </div>
  );
};
```

### Exemplo: Criar Novo Componente do Design System

Vamos criar um componente `JackpotSelect`:

```tsx
// src/components/ui/JackpotSelect.tsx
import React from "react";

interface JackpotSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errorMessage?: string;
  options: Array<{ value: string; label: string }>;
}

export const JackpotSelect: React.FC<JackpotSelectProps> = ({
  label,
  errorMessage,
  options,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <select
        className={`
          flex h-10 w-full rounded-lg border border-input bg-background 
          px-3 py-2 text-sm text-foreground
          focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${errorMessage ? "border-destructive focus-visible:ring-destructive" : ""}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {errorMessage && (
        <span className="text-xs text-destructive font-medium animate-pulse">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
```

**Uso:**

```tsx
import { JackpotSelect } from "@/components/ui/JackpotSelect";

<JackpotSelect
  label="Selecione o time"
  options={[
    { value: "br", label: "Brasil" },
    { value: "ar", label: "Argentina" },
    { value: "de", label: "Alemanha" },
  ]}
  value={selectedTeam}
  onChange={(e) => setSelectedTeam(e.target.value)}
  errorMessage={errors.team}
/>;
```

---

## 🔐 Autenticação

### Fluxo de Autenticação

1. Usuário faz login/registro
2. Backend retorna token JWT
3. Token é salvo no `localStorage`
4. Axios interceptor injeta token em todas as requisições
5. Em caso de 401, usuário é redirecionado para login

### AuthContext

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MeuComponente() {
  const { user, login, logout, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: "user@example.com", password: "123456" });
      // Redireciona automaticamente para /dashboard
    } catch (err) {
      // Erro já está em `error` state
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Olá, {user.name}!</p>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      )}
    </div>
  );
}
```

### API Service

```tsx
import { api } from "@/services/api";

// GET request
const response = await api.get("/users");

// POST request
const response = await api.post("/bets", {
  matchId: 1,
  homeScore: 2,
  awayScore: 1,
});

// Token é injetado automaticamente
```

---

## 📚 Guia de Desenvolvimento

### Criar Nova Página

1. **Crie o arquivo da página:**

```tsx
// src/pages/MinhasPagina.tsx
import { useTranslation } from "react-i18next";
import { JackpotCard } from "@/components/ui/JackpotCard";

export default function MinhaPagina() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {t("pages.minhaPagina.title")}
      </h1>

      <JackpotCard>
        <p>{t("pages.minhaPagina.content")}</p>
      </JackpotCard>
    </div>
  );
}
```

2. **Adicione traduções:**

```json
// src/i18n/locales/pt-BR.json
{
  "pages": {
    "minhaPagina": {
      "title": "Minha Página",
      "content": "Conteúdo da página"
    }
  }
}
```

3. **Adicione rota:**

```tsx
// src/App.tsx
import MinhaPagina from "./pages/MinhaPagina";

<Route
  path="/minha-pagina"
  element={
    <PrivateLayout>
      <MinhaPagina />
    </PrivateLayout>
  }
/>;
```

### Criar Formulário com Validação

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { JackpotInput } from "@/components/ui/JackpotInput";
import { JackpotButton } from "@/components/ui/JackpotButton";
import { useToast } from "@/hooks/useToast";

export default function MeuFormulario() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): boolean {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // await api.post('/endpoint', formData)
      showToast(t("common.success"), "success");
    } catch (error) {
      showToast(t("common.error"), "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <JackpotInput
        label={t("common.name")}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        errorMessage={errors.name}
      />

      <JackpotInput
        label={t("common.email")}
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        errorMessage={errors.email}
      />

      <JackpotButton type="submit" isLoading={isLoading}>
        {t("common.submit")}
      </JackpotButton>
    </form>
  );
}
```

### Boas Práticas

#### ✅ Fazer

- Use componentes do design system
- Sempre adicione traduções para novos textos
- Valide formulários no frontend
- Use TypeScript com tipos explícitos
- Mantenha componentes pequenos e focados
- Use hooks customizados para lógica reutilizável
- Adicione loading states em operações assíncronas
- Forneça feedback ao usuário (toast, mensagens de erro)

#### ❌ Evitar

- Hardcoded strings (use i18n)
- Componentes gigantes (quebre em componentes menores)
- Lógica de negócio em componentes de UI
- Estilos inline (use classes do Tailwind)
- Ignorar tratamento de erros
- Deixar formulários sem validação

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção
npm run preview      # Preview da build de produção

# Qualidade de código
npm run lint         # Executa ESLint
```

---

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API
VITE_API_BASE_URL=http://localhost:8080

# Ou use VITE_API_URL (fallback)
VITE_API_URL=http://localhost:8080
```

---

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -m 'feat: adiciona nova feature'`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

### Convenção de Commits

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação, sem mudança de código
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Tarefas de manutenção

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👥 Equipe

Desenvolvido com ❤️ pela equipe Jackpot Web

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
