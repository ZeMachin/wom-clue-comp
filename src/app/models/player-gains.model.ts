import { Activity, Boss, ComputedMetrics, Skill } from "./metric.model";
import { CompetitionProgress } from "./participation.model";

export interface PlayerGains {
  data: {
    activities: any,
    bosses: any,
    computed: any,
    skills: any
  };
  endsAt: Date;
  startsAt: Date;
}

interface Metric {
  metric: Activity | Boss | ComputedMetrics | Skill;
  rank: CompetitionProgress;
  score: CompetitionProgress;
}
