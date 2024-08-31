import { Boundary } from "./boundary.model";
import { PlayerType } from "./player.model";

export interface Bracket {
    playerTypes?: PlayerType[];
    lowerBoundary?: Boundary;
    higherBoundary?: Boundary;
}