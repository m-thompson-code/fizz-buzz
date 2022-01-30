import { Injectable } from '@angular/core';
import { Dimensions } from 'src/app/directives/animate-frame/animate-frame.model';
import { Asset } from 'src/app/types/types';
import { ImageService } from '../image/image.service';
import { MathService } from '../math/math.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasService {
    constructor(private readonly imageService: ImageService, private readonly mathService: MathService) {}

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
        timeDelta: number,
        canvasA: HTMLCanvasElement,
        canvasB: HTMLCanvasElement
    ) => HTMLCanvasElement {
        const getWidthOffset = this.mathService.getRandVelocityValues(
            0,
            1,
            .03,
            .01,
            2
        );

        const getDegrees = 180;
        
        // this.mathService.getRandInRange(
        //     0,
        //     4,
        //     1,
        //     2
        // );

        let degrees = -90;
        let radiusVelocity = 0;

        return (
            dimensions: Dimensions,
            timeDelta: number,
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

            // const offsetWidth = getWidthOffset() * width / 2;
            // const offsetRadians = getDegrees();

            var centerX = width / 2;
            var centerY = height / 2;

            var radius = width;


            radiusVelocity += this.mathService.getRandInRange(
                0,
                2,
                2,
                5
            );

            radiusVelocity = this.mathService.getValueInRange(radiusVelocity, -3, 3);

            degrees += radiusVelocity


            var startingAngle = this.mathService.getRadians(degrees);//Math.PI;
            var endingAngle = startingAngle - Math.PI;

            ctx.save();
            ctx.beginPath();

            ctx.moveTo(centerX, centerY);

            ctx.arc(centerX, centerY, radius, startingAngle,
                endingAngle, true);

            // ctx.moveTo(0, 0);
            // ctx.lineTo(width / 2 - offsetWidth, 0);
            // ctx.lineTo(width / 2 + offsetWidth, height);
            // ctx.lineTo(0, height);

            // ctx.moveTo(0, 0);
            // ctx.lineTo(width / 2 + offsetWidth, height / 2 + offsetHeight);
            // ctx.moveTo(width / 2 + offsetWidth, height / 2 - offsetHeight);
            // ctx.lineTo(width / 2 - offsetWidth, height / 2 + offsetHeight);
            // ctx.lineTo(width / 2 - offsetWidth, height / 2 - offsetHeight);
            // ctx.lineTo(0, height);


            // ctx.moveTo(0, 0);
            // ctx.moveTo(0, height / 2 - offsetHeight);
            // ctx.lineTo(width / 2 + offsetWidth, height / 2 - offsetHeight);
            // ctx.lineTo(width / 2 - offsetWidth, height / 2 + offsetHeight);
            // ctx.lineTo(0, height / 2 + offsetHeight);
            // ctx.lineTo(0, height);

            ctx.closePath();
            ctx.clip();

            ctx.drawImage(canvasB, 0, 0, width, height);

            return canvas;
        };
    }
}
