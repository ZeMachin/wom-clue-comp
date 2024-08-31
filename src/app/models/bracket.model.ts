import { Skill, Activity, Boss, ComputedMetrics } from "./metric.model";
import { PlayerType } from "./player.model";

export class Bracket {
    constructor(bracket: {
        playerTypes?: PlayerType[],
        metric: Skill | Activity | Boss | ComputedMetrics,
        lowerBoundary?: number,
        higherBoundary?: number
    }) {
        this.metric = bracket.metric;
        this.playerTypes = bracket.playerTypes;
        this.lowerBoundary = bracket.lowerBoundary;
        this.higherBoundary = bracket.higherBoundary;
    }

    playerTypes?: PlayerType[];
    metric?: Skill | Activity | Boss | ComputedMetrics;
    lowerBoundary?: number;
    higherBoundary?: number;

    private get playerTypesString(): string {
        return (this.playerTypes && this.playerTypes.length > 0) ? this.playerTypes.map((pt) => pt.toString()).reduce((a, b) => a + ', ' + b) + ': ' : '';
    }

    private get lowerBoundaryString(): string {
        return (this.lowerBoundary && this.metric) ? `>= ${this.lowerBoundary} ${this.metric}` : '';
    }

    private get higherBoundaryString(): string {
        return (this.higherBoundary && this.metric)  ? `<= ${this.higherBoundary} ${this.metric}` : '';
    }
    
    get name(): string {
        return `${this.playerTypesString}${this.lowerBoundaryString} ${this.higherBoundaryString}`;
    }
}