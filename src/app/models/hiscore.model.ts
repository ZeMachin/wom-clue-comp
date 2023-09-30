import { PlayerType } from "./player.model";

export interface HiScore {
  username: string;
  displayName: string;
  playerId: number;
  gains?: any; // { key: number, key: number, ..., total: number }
  lastUpdated: Date;
  updating?: boolean;
  category: PlayerType;
  position?: number;
}