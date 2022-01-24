import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { BEE_ASSET } from 'src/app/constants/constants';
import {
    Dimensions,
    GetAnimationFrame,
    Position,
} from 'src/app/directives/animate-frame.model';
import { ImageService } from 'src/app/services/image/image.service';
import { InteractionService } from 'src/app/services/interaction/interaction.service';
import { MathService } from 'src/app/services/math/math.service';
import { Asset } from 'src/app/types/types';

@Component({
    selector: 'app-fizz',
    templateUrl: './fizz.component.html',
    styleUrls: ['./fizz.component.scss'],
})
export class FizzComponent implements OnInit, OnDestroy {
    private radians = this.mathService.getRadians(75 - 180);
    getAnimationFrame: GetAnimationFrame;

    private readonly unsubscribe$ = new Subject<void>();

    private readonly bees: Position[] = [];

    private timeoutRef = this.getShakeTimeout();

    constructor(
        private readonly imageService: ImageService,
        private readonly interfaceService: InteractionService,
        private readonly mathService: MathService,
        private readonly elementRef: ElementRef<HTMLDivElement>
    ) {
        this.bees = [
            {x: 0, y: 0},
            {x: BEE_ASSET.width, y: BEE_ASSET.height},
            {x: BEE_ASSET.width * 2, y: BEE_ASSET.height * 2},
            {x: BEE_ASSET.width * 3, y: BEE_ASSET.height * 3},
        ];

        this.getAnimationFrame = (
            dimensions: Dimensions,
            ctx: CanvasRenderingContext2D,
            timeDelta: number,
            canvas: HTMLCanvasElement
        ) => {
            const { width, height } = dimensions;

            // Create a temp canvas to store our data (because we need to clear the other box after rotation.
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");

            if (!tempCtx) {
                throw new Error("Unexpected missing tempCtx");
            }

            tempCanvas.width = width;
            tempCanvas.height = height;
            // put our data onto the temp canvas

            const velocity = 80;
            const offset = 0;//timeDelta * velocity;

            // const { x: dx , y: dy } = this.mathService.getCoordinates(offset, this.radians);
            const { x: dx , y: dy } = this.mathService.getCoordinates(offset, 0);

            this.bees.forEach(bee => {
                bee.x += dx;
                bee.y += dy;
                this.wrappingMotionAnimation(tempCtx, BEE_ASSET, dimensions, bee.x, bee.y);
                // this.wrappingMotionAnimation(ctx, BEE_ASSET, dimensions, bee.x, bee.y);
            });

            // ctx.save();
            // ctx.beginPath();
            // ctx.moveTo(0, 0);
            // ctx.lineTo(0, height);
            // ctx.lineTo(width, 0);
            // ctx.closePath();
            // ctx.clip();

            const greenCanvas = document.createElement('canvas'); // detached from DOM
            greenCanvas.width = width;
            greenCanvas.height = height;
            var redContext = greenCanvas.getContext('2d') as CanvasRenderingContext2D;
            redContext.fillStyle = 'green';
            redContext.fillRect(0,0,width,height);

            const redCanvas = document.createElement('canvas'); // detached from DOM
            redCanvas.width = width;
            redCanvas.height = height;
            var redContext = redCanvas.getContext('2d') as CanvasRenderingContext2D;
            redContext.fillStyle = 'red';
            redContext.fillRect(0,0,width,height);

            var offscreen = document.createElement('canvas'); // detached from DOM
            offscreen.width = width;
            offscreen.height = height;
            var context = offscreen.getContext('2d') as CanvasRenderingContext2D;
            context.drawImage(greenCanvas, 0, 0, width, height);

            var gradient = context.createLinearGradient(0, height, width, 0);
            gradient.addColorStop(.45, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(.55, "rgba(255, 255, 255, 1.0)");
            context.globalCompositeOperation = "destination-out";
            context.fillStyle = gradient;
            context.fillRect(0, 0, width, height);

            // ctx.fillStyle = 'red';
            // ctx.fillRect(0,0,width,height);
            // ctx.drawImage(tempCanvas,0,0, canvas.width, canvas.height);
            ctx.drawImage(redCanvas,0,0, canvas.width, canvas.height);
            ctx.drawImage(offscreen,0,0, canvas.width, canvas.height);
            // ctx.restore();
        };
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
            const x = dx + widthOffset;
            const y = dy + heightOffset;

            if (x < -imageWidth || x > width + imageWidth || y < -imageHeight || y > height + imageHeight) {
                return;
            }

            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.rect(x, y, imageWidth, imageHeight);
            ctx.fill();
            ctx.drawImage(assetImage, x, y);
        });
    }

    ngOnInit(): void {
        this.interfaceService.getMousePosition().pipe(
            tap((mousePosition) => {
                const elementPosition = this.mathService.getElementPosition(this.elementRef.nativeElement);
                this.radians = this.mathService.radiansBetweenPoints(elementPosition, mousePosition);
            }),
            takeUntil(this.unsubscribe$)

        ).subscribe();
    }

    getShakeTimeout(): number {
        return window.setTimeout(() => {
            this.shakeAnimation();
            this.timeoutRef = this.getShakeTimeout();
        }, 2000 + Math.random() * 2000);
    }

    @HostListener('click')
    @HostListener('mouseover')
    shakeAnimation(): void {
        const element = this.elementRef.nativeElement;

        const keyframes: Keyframe[] = [];

        for (let i = 0; i < 50; i++) {
            const c = 4;
            const x = c - Math.random() * c * 2;
            const y = c - Math.random() * c * 2;
            const r = c - Math.random() * c * 2;
            keyframes.push({ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` })
        }

        element.animate(keyframes, {
            duration: 300
        });
    }

    ngOnDestroy(): void {
        clearTimeout(this.timeoutRef);
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
