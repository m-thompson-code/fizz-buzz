export interface Dimensions {
    width: number;
    height: number;
}

export interface Position {
    x: number;
    y: number;
}

export type GetAnimationFrame = (
    dimensions: Dimensions,
    ctx: CanvasRenderingContext2D,
    timeDelta: number,
    canvas: HTMLCanvasElement
) => void;
