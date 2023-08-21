export interface HiScore {
  username: string;
  displayName: string;
  gains?: Gains
}

export interface Gains {
  beginner: number;
  easy: number;
  medium: number;
  hard: number;
  elite: number;
  master: number;
  total?: number;
}
