import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import {
    Dimensions,
    GetAnimationFrame,
} from 'src/app/directives/animate-frame/animate-frame.model';
import { BuzzCanvasService } from 'src/app/services/buzz-canvas/buzz-canvas.service';
import { CanvasService } from 'src/app/services/canvas/canvas.service';
import { InteractionService } from 'src/app/services/interaction/interaction.service';
import { MathService } from 'src/app/services/math/math.service';

@Component({
    selector: 'app-fizzbuzz',
    templateUrl: './fizzbuzz.component.html',
    styleUrls: ['./fizzbuzz.component.scss'],
})
export class FizzbuzzComponent implements OnInit, OnDestroy {
    private radians?: number;
    readonly getAnimationFrame: GetAnimationFrame;

    private readonly unsubscribe$ = new Subject<void>();

    constructor(
        private readonly canvasService: CanvasService,
        private readonly buzzCanvasService: BuzzCanvasService,
        private readonly interfaceService: InteractionService,
        private readonly mathService: MathService,
        private readonly elementRef: ElementRef<HTMLDivElement>
    ) {
        const buzzCanvasBuilder = this.buzzCanvasService.getBuzzCanvasBuilder();

        const combinedCanvasBuilder = this.canvasService.combineCanvasesBuilder();

        this.getAnimationFrame = (
            dimensions: Dimensions,
            ctx: CanvasRenderingContext2D,
            timeDelta: number,
            canvas: HTMLCanvasElement
        ) => {
            const buzzCanvas = buzzCanvasBuilder(
                dimensions,
                timeDelta,
                this.radians
            );

            const { width, height } = dimensions;

            const greenCanvas = document.createElement('canvas'); // detached from DOM
            greenCanvas.width = width;
            greenCanvas.height = height;
            let greenContext = greenCanvas.getContext('2d') as CanvasRenderingContext2D;
            greenContext.fillStyle = 'green';
            greenContext.fillRect(0,0,width,height);

            const combinedCanvas = combinedCanvasBuilder(dimensions, timeDelta, buzzCanvas, greenCanvas);

            ctx.drawImage(combinedCanvas, 0, 0, canvas.width, canvas.height);
        };
    }

    ngOnInit(): void {
        this.interfaceService
            .getMousePosition()
            .pipe(
                tap((mousePosition) => {
                    const elementPosition = this.mathService.getElementPosition(
                        this.elementRef.nativeElement
                    );
                    this.radians = this.mathService.radiansBetweenPoints(
                        elementPosition,
                        mousePosition
                    );
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
