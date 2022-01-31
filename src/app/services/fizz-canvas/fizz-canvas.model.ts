import { Position } from "../../directives/animate-frame/animate-frame.model";
import { Asset } from "../../types/types";

export interface FizzAsset {
    asset: Asset;
    position: Position;
    alpha: number;
    xx: number;
    yy: number;
}
