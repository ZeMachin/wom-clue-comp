import { Player } from "./player.model";

interface Participation {
  competitionId: number;
  createdAt: Date;
  playerId: number;
  teamName?: string;
  updatedAt: Date;
}

interface CompetitionParticipation extends Participation {
  player: Player;
}

export interface CompetitionParticipationDetails extends CompetitionParticipation {
  progress: CompetitionProgress;
}

export interface CompetitionProgress {
  end: number;
  gained: number;
  start: number;
}
