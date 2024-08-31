import { Boundary } from "./boundary.model";
import { PlayerType } from "./player.model";

export class Bracket {
    constructor(bracket: {
        playerTypes?: PlayerType[],
        lowerBoundary?: Boundary,
        higherBoundary?: Boundary
    }) {
        this.playerTypes = bracket.playerTypes;
        this.lowerBoundary = bracket.lowerBoundary;
        this.higherBoundary = bracket.higherBoundary;
    }

    playerTypes?: PlayerType[];
    lowerBoundary?: Boundary;
    higherBoundary?: Boundary;

    private get playerTypesString(): string {
        return (this.playerTypes && this.playerTypes.length > 0) ? this.playerTypes.map((pt) => pt.toString()).reduce((a, b) => a + ', ' + b) + ': ' : '';
    }

    private get lowerBoundaryString(): string {
        return (this.lowerBoundary && this.lowerBoundary.metric && this.lowerBoundary.number) ? `>= ${this.lowerBoundary.number} ${this.lowerBoundary.metric}` : '';
    }

    private get higherBoundaryString(): string {
        return (this.higherBoundary && this.higherBoundary.metric && this.higherBoundary.number)  ? `<= ${this.higherBoundary.number} ${this.higherBoundary.metric}` : '';
    }
    
    get name(): string {
        return `${this.playerTypesString}${this.lowerBoundaryString} ${this.higherBoundaryString}`;
    }
}