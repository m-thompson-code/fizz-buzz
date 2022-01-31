import { Injectable } from '@angular/core';
import { Dimensions } from 'src/app/directives/animate-frame/animate-frame.model';
import { Asset } from 'src/app/types/types';
import { ImageService } from '../image/image.service';
import { MathService } from '../math/math.service';

export const BLUE_COLOR = "#00c9d6";
export const GOLD_COLOR = "#f9ab00";

@Injectable({
    providedIn: 'root',
})
export class CanvasService {
    constructor(private readonly imageService: ImageService, private readonly mathService: MathService) {}

    motionAnimation(
        ctx: CanvasRenderingContext2D,
        asset: Asset,
        x: number,
        y: number
    ): void {
        const assetImage = this.imageService.getImage(asset.src);

        const xx = x;
        const yy = y;

        ctx.drawImage(assetImage, xx, yy);
    }

    wrappingMotionAnimation(
        ctx: CanvasRenderingContext2D,
        asset: Asset,
        dimensions: Dimensions,
        x: number,
        y: number
    ): void {
        const { width, height } = dimensions;

        const dx: number = x % width;
        const dy: number = y % height;

        const assetImage = this.imageService.getImage(asset.src);

        const { height: imageHeight, width: imageWidth } = asset;

        const offsets = [-width, 0, width].flatMap((widthOffset) =>
            [-height, 0, height].map((heightOffset) => ({
                widthOffset,
                heightOffset,
            }))
        );

        offsets.forEach(({ widthOffset, heightOffset }) => {
            const xx = dx + widthOffset;
            const yy = dy + heightOffset;

            // Optimization, skip rendering for assets clearly outside of canvas
            if (
                xx < -imageWidth ||
                xx > width + imageWidth ||
                yy < -imageHeight ||
                yy > height + imageHeight
            ) {
                return;
            }

            ctx.drawImage(assetImage, xx, yy);
        });
    }

    combineCanvasesBuilder(): (
        dimensions: Dimensions,
        canvasA: HTMLCanvasElement,
        canvasB: HTMLCanvasElement
    ) => HTMLCanvasElement {
        let degrees = -90;
        let radiusVelocity = 0;

        return (
            dimensions: Dimensions,
            canvasA: HTMLCanvasElement,
            canvasB: HTMLCanvasElement
        ) => {
            const { width, height } = dimensions;

            // Create a temp canvas to store our data (because we need to clear the other box after rotation.
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Unexpected missing ctx');
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(canvasA, 0, 0, width, height);

            const radius = Math.max(width, height);

            const tilt = this.mathService.getCoordinates(1, this.mathService.getRadians(degrees));
            const tiltX = Math.abs(tilt.x);
            const tiltY = Math.abs(tilt.y);
            radiusVelocity += this.mathService.getRandInRange(
                0,
                0.1 + .35 * tiltX,
                .1 + .3 * tiltY,
                1
            );

            const maxRadiusChange = 1 + tiltY * 3;

            radiusVelocity = this.mathService.getValueInRange(radiusVelocity, -maxRadiusChange, maxRadiusChange);

            degrees += radiusVelocity;

            const radians = degrees * Math.PI / 180;

            ctx.save();
            ctx.beginPath();

            const centerX = width / 2;
            const centerY = height / 2;

            const x1 = centerX + radius * Math.cos(radians);
            const y1 = centerY + radius * Math.sin(radians);

            const x2 = centerX + radius * Math.cos(radians - Math.PI);
            const y2 = centerY + radius * Math.sin(radians - Math.PI);

            const x3 = x1 + 2 * radius * Math.cos(radians - Math.PI / 2);
            const y3 = y1 + 2 * radius * Math.sin(radians - Math.PI / 2);

            const x4 = x2 + 2 * radius * Math.cos(radians - Math.PI / 2);
            const y4 = y2 + 2 * radius * Math.sin(radians - Math.PI / 2);

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x4, y4);
            ctx.lineTo(x3, y3);
            
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(canvasB, 0, 0, width, height);

            return canvas;
        };
    }
}
