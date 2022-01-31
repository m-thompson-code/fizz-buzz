import { Injectable } from '@angular/core';
import { BUBBLE_12_ASSET, BUBBLE_24_ASSET, BUBBLE_48_ASSET } from '../../constants/constants';
import {
    Dimensions
} from '../../directives/animate-frame/animate-frame.model';
import { Asset } from '../../types/types';
import { BLUE_COLOR, CanvasService } from '../canvas/canvas.service';
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
        timeDelta: number,
        extraBubbles: boolean
    ) => HTMLCanvasElement {
        let bubbles: FizzAsset[] = [];
        
        const baseVelocity = 40;
        const velocityRange = 10;
        const getVelocity = this.mathService.getRandVelocityValues(
            baseVelocity,
            velocityRange,
            5,
            1
        );

        return (
            dimensions: Dimensions,
            timeDelta: number,
            extraBubbles: boolean
        ): HTMLCanvasElement => {
            bubbles = this.removeBubbles(bubbles, dimensions);
            if (bubbles.length < 15 && this.mathService.getRandomSeed() < .05) {
                bubbles = this.addBubbles(bubbles, dimensions);
            }

            if (extraBubbles) {
                bubbles = this.addExtraBubbles(bubbles, dimensions);
            }

            const { width, height } = dimensions;

            // Create a temp canvas to store our data (because we need to clear the other box after rotation.
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Unexpected missing ctx');
            }

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = BLUE_COLOR;
            ctx.fillRect(0,0,width,height);

            const velocity = getVelocity();

            
            bubbles.forEach((bubble) => {
                const dx = timeDelta * bubble.xx;
                const dy = timeDelta * (velocity + bubble.yy);

                ctx.save();
                ctx.globalAlpha = bubble.alpha;

                bubble.position.x += dx + bubble.xx;
                bubble.position.y += dy + bubble.yy;

                this.canvasService.motionAnimation(
                    ctx,
                    bubble.asset,
                    bubble.position.x,
                    height - bubble.position.y
                );
                ctx.restore();
            });

            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);


            return canvas;
        };
    }

    getShuffledArray<T>(array: T[]): T[] {
        return array.map(value => ({ value, sort: this.mathService.getRandomSeed() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

    getBubbleAsset(xOffset: number, asset: Asset): FizzAsset {
        return {
            position: {
                x: xOffset - asset.width / 2,
                y: -this.mathService.getRand(40, 0),
            },
            xx: this.mathService.getRandInRange(0,1),
            yy: this.mathService.getRand(5, 0),
            asset,
            alpha: this.mathService.getRand(.4, .15),
        };
    }

    getShuffledBubbles(xOffset: number): FizzAsset[] {
        const bubbles = [BUBBLE_48_ASSET,BUBBLE_24_ASSET,BUBBLE_12_ASSET].map(asset => this.getBubbleAsset(xOffset, asset))
        
        return this.getShuffledArray(bubbles);
    }

    removeBubbles(bubbles: FizzAsset[], dimensions: Dimensions): FizzAsset[] {
        return bubbles.filter(bubble => (bubble.position.y - bubble.asset.height) < dimensions.height);
    }

    addBubbles(bubbles: FizzAsset[], dimensions: Dimensions): FizzAsset[] {
        const { width } = dimensions;

        const space = width/BUBBLE_12_ASSET.width + this.mathService.getRand(48, 4, 2);
        const count = Math.ceil(width / space);

        const xOffsets = Array(count).fill(0).map((_, i) => i * space);

        const possibleBubbles: FizzAsset[] = xOffsets.map(xOffset => {
            return this.getShuffledBubbles(xOffset)[0];
        });

        const newBubbles: FizzAsset[] = possibleBubbles.reduce((filteredBubbles: FizzAsset[], bubble: FizzAsset) => {
            if (this.bubbleOverlapsSomeBubble(bubble, filteredBubbles)) {
                return filteredBubbles;
            }

            if (this.bubbleOverlapsSomeBubble(bubble, bubbles)) {
                return filteredBubbles;
            }

            return [...filteredBubbles, bubble];
        }, []);

        return [...bubbles, ...newBubbles];
    }

    addExtraBubbles(bubbles: FizzAsset[], dimensions: Dimensions): FizzAsset[] {
        const { width } = dimensions;

        const xOffsets = Array(20).fill(0).map((_, i) => this.mathService.getRand(width, 0));

        const extraBubbles = xOffsets.map(xOffset => {
            return this.getShuffledBubbles(xOffset)[0];
        });

        return [...bubbles, ...extraBubbles];
    }

    bubblesOverlap(bubbleA: FizzAsset, bubbleB: FizzAsset): boolean {
        const positionA = bubbleA.position;
        const radiusA = bubbleA.asset.width / 2;

        const positionB = bubbleB.position;
        const radiusB = bubbleB.asset.width / 2;

        const maxRadius = Math.max(radiusA, radiusB);

        const distance = this.mathService.distanceBetweenPoints(positionA, positionB);

        return maxRadius >= distance / 2;
    }

    bubbleOverlapsSomeBubble(bubble: FizzAsset, bubbles: FizzAsset[]): boolean {
        if (!bubbles.length) {
            return false;
        }

        return bubbles.some(other => this.bubblesOverlap(other, bubble));
    }
}
