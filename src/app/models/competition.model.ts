import { Group } from "./group.model";
import { Activity, Boss, ComputedMetrics, Skill } from "./metric.model";
import { CompetitionParticipationDetails } from "./participation.model";

export interface CompetitionDetails extends Competition {
  participations: CompetitionParticipationDetails[];
}

export interface Competition {
  id: number;
  title: string;
  metric: Skill | Activity | Boss | ComputedMetrics;
  type: CompetitionType;
  startsAt: Date;
  endsAt: Date;
  groupId?: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  participantCount: number;
  group: Group;
}

enum CompetitionType {
  'classic', 'team'
}
