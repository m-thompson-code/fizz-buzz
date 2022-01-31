import { Injectable } from '@angular/core';
import { BEE_EXTRA_ASSET, BEE_LEFT_ASSET, BEE_RIGHT_ASSET } from '../../constants/constants';
import { Dimensions, Position } from '../../directives/animate-frame/animate-frame.model';
import { CanvasService, GOLD_COLOR } from '../canvas/canvas.service';
import { MathService } from '../math/math.service';

export const DEFAULT_RADIANS = 75 - 180;

@Injectable({
    providedIn: 'root',
})
export class BuzzCanvasService {
    constructor(
        private readonly mathService: MathService,
        private readonly canvasService: CanvasService
    ) {}

    getBuzzCanvasBuilder(): (dimensions: Dimensions, timeDelta: number, extraCounter: number, radians?: number) => HTMLCanvasElement {
        const bees: Position[] = [
            { x: 0, y: 0 },
            { x: BEE_LEFT_ASSET.width, y: BEE_LEFT_ASSET.height },
            { x: BEE_LEFT_ASSET.width * 2, y: BEE_LEFT_ASSET.height * 2 },
            { x: BEE_LEFT_ASSET.width * 3, y: BEE_LEFT_ASSET.height * 3 },
            { x: BEE_LEFT_ASSET.width * 4, y: BEE_LEFT_ASSET.height * 4 },
        ];

        let extraCounterTotal = 0;
        let extraBee: Position | null = null;

        const baseVelocity = 120;
        const velocityRange = 80;
        const maxVelocity = 120 + 80;
        const getVelocity = this.mathService.getRandVelocityValues(
            baseVelocity,
            velocityRange,
            15,
            5
        );

        return (dimensions: Dimensions, timeDelta: number, extraCounter: number, radians?: number): HTMLCanvasElement => {
            const { width, height } = dimensions;

            if (!extraBee && extraCounterTotal > 300) {
                extraBee = {
                    x: width + 30,
                    y: -BEE_EXTRA_ASSET.height / 2 + height / 2 + this.mathService.getRand(15, -15),
                }

                extraCounterTotal = 0;
            } else {
                extraCounterTotal += extraCounter;
            }

            extraCounterTotal = Math.max(0, extraCounterTotal - 1);


            // Create a temp canvas to store our data (because we need to clear the other box after rotation.
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Unexpected missing ctx');
            }

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = GOLD_COLOR;
            ctx.fillRect(0,0,width,height);

            const velocity = getVelocity((extraCounter ? 60 : 0));

            const offset = timeDelta * velocity;

            const { x: dx, y: dy } = this.mathService.getCoordinates(
                offset,
                radians ?? DEFAULT_RADIANS
            );

            const vibration = velocity / maxVelocity;

            const BEE_ASSET = dx > 0 ? BEE_RIGHT_ASSET : BEE_LEFT_ASSET;

            ctx.globalAlpha = 0.3;

            bees.forEach((bee) => {
                bee.x += dx;
                bee.y += dy;

                const rx = this.mathService.getRandInRange(
                    0,
                    vibration * 3,
                    vibration * 3,
                    10
                );
                const ry = this.mathService.getRandInRange(
                    0,
                    vibration * 3,
                    vibration * 3,
                    10
                );
                this.canvasService.wrappingMotionAnimation(
                    ctx,
                    BEE_ASSET,
                    dimensions,
                    bee.x + rx,
                    bee.y + ry
                );
            });

            if (extraBee) {
                extraBee.x -= 1;

                this.canvasService.motionAnimation(
                    ctx,
                    BEE_EXTRA_ASSET,
                    extraBee.x,
                    extraBee.y,
                );

                if (extraBee.x < -100) {
                    extraBee = null;
                }
            }

            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

            return canvas;
        };
    }
}
