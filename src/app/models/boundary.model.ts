import { Skill, Activity, Boss, ComputedMetrics } from "./metric.model";

export interface Boundary {
    metric: Skill | Activity | Boss | ComputedMetrics;
    number: number;
}