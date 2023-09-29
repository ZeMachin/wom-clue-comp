export interface HiScore {
  username: string;
  displayName: string;
  clueGains?: ClueGains;
  DT2Gains?: DT2Gains;
}

export interface ClueGains {
  beginner: number;
  easy: number;
  medium: number;
  hard: number;
  elite: number;
  master: number;
  total?: number;
}

export interface DT2Gains {
  vardorvis: number;
  duke: number;
  leviathan: number;
  whisperer: number;
  total?: number;
}
