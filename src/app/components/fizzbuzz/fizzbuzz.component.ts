import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import {
    Dimensions,
    GetAnimationFrame,
} from '../../directives/animate-frame/animate-frame.model';
import { BuzzCanvasService } from '../../services/buzz-canvas/buzz-canvas.service';
import { CanvasService } from '../../services/canvas/canvas.service';
import { FizzCanvasService } from '../../services/fizz-canvas/fizz-canvas.service';
import { InteractionService } from '../../services/interaction/interaction.service';
import { MathService } from '../../services/math/math.service';

@Component({
    selector: 'app-fizzbuzz',
    templateUrl: './fizzbuzz.component.html',
    styleUrls: ['./fizzbuzz.component.scss'],
})
export class FizzbuzzComponent implements OnInit, OnDestroy {
    private extraBubbles = false;
    private extraCount = 0;

    private radians?: number;
    readonly getAnimationFrame: GetAnimationFrame;

    private readonly unsubscribe$ = new Subject<void>();

    constructor(
        private readonly canvasService: CanvasService,
        private readonly fizzCanvasService: FizzCanvasService,
        private readonly buzzCanvasService: BuzzCanvasService,
        private readonly interfaceService: InteractionService,
        private readonly mathService: MathService,
        private readonly elementRef: ElementRef<HTMLDivElement>
    ) {
        const delay = this.mathService.getRand(400, 0);
        const length = this.mathService.getRand(5000, 3000);
        this.elementRef.nativeElement.style.animationDelay = `${delay}ms`;
        this.elementRef.nativeElement.style.animationDuration = `${length}ms`;
        
        const fizzCanvasBuilder = this.fizzCanvasService.getFizzCanvasBuilder();
        const buzzCanvasBuilder = this.buzzCanvasService.getBuzzCanvasBuilder();

        const combinedCanvasBuilder = this.canvasService.combineCanvasesBuilder();

        this.getAnimationFrame = (
            dimensions: Dimensions,
            ctx: CanvasRenderingContext2D,
            timeDelta: number,
            canvas: HTMLCanvasElement
        ) => {
            const fizzCanvas = fizzCanvasBuilder(
                dimensions, timeDelta, this.extraBubbles
            );
            this.extraBubbles = false;

            const buzzCanvas = buzzCanvasBuilder(
                dimensions,
                timeDelta,
                this.extraCount,
                this.radians
            );

            this.extraCount = 0;

            const combinedCanvas = combinedCanvasBuilder(dimensions, buzzCanvas, fizzCanvas);

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

    @HostListener('click')
    @HostListener('mouseenter')
    shakeAnimation(): void {
        this.extraBubbles = true;
    }

    @HostListener('click')
    superBee(): void {
        this.extraCount = 149;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
