export interface UserRankingDto {
  id: number;
  name: string;
  totalPoints: number;
  rankingPosition: number;
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

export interface AuthResponse {
  token: string;
  id: number;
  role: string;
  email: string;
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
