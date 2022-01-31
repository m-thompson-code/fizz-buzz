import { Position } from "src/app/directives/animate-frame/animate-frame.model";
import { Asset } from "src/app/types/types";

export interface FizzAsset {
    asset: Asset;
    position: Position;
    alpha: number;
    xx: number;
    yy: number;
}
