export interface HiScore {
  username: string;
  displayName: string;
  playerId: number;
  gains?: any; // { key: number, key: number, ..., total: number }
}