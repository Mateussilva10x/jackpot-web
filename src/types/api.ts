export interface PageResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface UserRankingDto {
  id: number;
  name: string;
  totalPoints: number;
  rankingPosition: number;
  avatar?: string;
}

export interface UserProfileDto {
  id: number;
  name: string;
  totalPoints: number;
  rankingPosition: number;
  email?: string;
  avatar?: string;
  bets: MatchGroupResponse[];
}

export interface TeamDto {
  id: number;
  name: string;
  flagUrl?: string;
}

export interface GroupStandingDto {
  teamName: string;
  isoCode: string;
  flagUrl: string;
  points: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface BetResponse {
  id: number;
  matchId: number;
  homeScore: number;
  awayScore: number;
  updatedAt: string;
}

export interface MatchBetResponse {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamFlag: string;
  awayTeamFlag: string;
  dateTime: string;
  status: string;
  group: string;
  userBet?: BetResponse;
}

export interface MatchGroupResponse {
  group: string;
  matches: MatchBetResponse[];
  ruleInfo?: string;
}

export interface BetRequest {
  matchId: number;
  homeScore: number;
  awayScore: number;
}

export interface BonusBetRequest {
  championTeamId: number;
  runnerUpTeamId: number;
  topScorer: string;
}

export interface BonusBetResponse {
  id: number;
  championTeamId: number;
  championTeamName: string;
  runnerUpTeamId: number;
  runnerUpTeamName: string;
  topScorer: string;
}

export interface MatchScoreUpdateDto {
  homeScore: number;
  awayScore: number;
  penaltyWinnerId?: number;
}

export interface BonusBetResolutionRequest {
  championTeamId: number;
  runnerUpTeamId: number;
  topScorer: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  role: string;
  email: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role?: string;
}
