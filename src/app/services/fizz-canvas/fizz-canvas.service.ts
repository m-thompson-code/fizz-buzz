import { Injectable } from '@angular/core';
import { BUBBLE_48_ASSET } from 'src/app/constants/constants';
import {
    Dimensions,
    Position,
} from 'src/app/directives/animate-frame/animate-frame.model';
import { CanvasService } from '../canvas/canvas.service';
import { ImageService } from '../image/image.service';
import { MathService } from '../math/math.service';
import { FizzAsset } from './fizz-canvas.model';

@Injectable({
    providedIn: 'root',
})
export class FizzCanvasService {
    constructor(
        private readonly mathService: MathService,
        private readonly canvasService: CanvasService
    ) {}

    getFizzCanvasBuilder(): (
        dimensions: Dimensions,
        timeDelta: number
    ) => HTMLCanvasElement {
        const bubbles: FizzAsset[] = [];
        bubbles.push(this.getBubbleAsset(0));
        bubbles.push(this.getBubbleAsset(0));
        (window as any).bubbleA = bubbles[0];
        (window as any).bubbleB = bubbles[1];
        
        const baseVelocity = 120;
        const velocityRange = 80;
        const maxVelocity = 120 + 80;
        const getVelocity = this.mathService.getRandVelocityValues(
            baseVelocity,
            velocityRange,
            15,
            5
        );

        return (
            dimensions: Dimensions,
            timeDelta: number,
            radians?: number
        ): HTMLCanvasElement => {
            const { width, height } = dimensions;

            // Create a temp canvas to store our data (because we need to clear the other box after rotation.
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Unexpected missing ctx');
            }

            canvas.width = width;
            canvas.height = height;

            const velocity = getVelocity();

            const offset = timeDelta * velocity;

            const dy = offset;
            const dx = 0;

            // ctx.save();

            bubbles.forEach((bubble) => {
                // bubble.position.x += dx;
                // bubble.position.y += dy;

                this.canvasService.motionAnimation(
                    ctx,
                    bubble.asset,
                    bubble.position.x,
                    height - bubble.position.y - 24
                );
            });

            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

            // ctx.restore();

            return canvas;
        };
    }

    getBubbleAsset(xOffset: number): FizzAsset {
        return {
            position: {
                x: xOffset - BUBBLE_48_ASSET.width / 2,
                y: 0,
            },
            asset: BUBBLE_48_ASSET,
            alpha: 0.4,
        };
    }

    bubblesOverlap(bubbleA: FizzAsset, bubbleB: FizzAsset): boolean {
        const positionA = bubbleA.position;
        const radiusA = bubbleA.asset.width / 2;

        const positionB = bubbleB.position;
        const radiusB = bubbleB.asset.width / 2;

        const maxRadius = Math.max(radiusA, radiusB);

        const distance = this.mathService.distanceBetweenPoints(positionA, positionB);
        console.log(maxRadius, distance);

        return distance <= maxRadius;
    }
}
