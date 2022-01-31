import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import {
    Dimensions,
    GetAnimationFrame
} from '../../directives/animate-frame/animate-frame.model';
import { InteractionService } from 'src/app/services/interaction/interaction.service';
import { MathService } from 'src/app/services/math/math.service';
import { BuzzCanvasService } from 'src/app/services/buzz-canvas/buzz-canvas.service';

@Component({
    selector: 'app-buzz',
    templateUrl: './buzz.component.html',
    styleUrls: ['./buzz.component.scss'],
})
export class BuzzComponent implements OnInit, OnDestroy {
    private extraCount = 0;
    private radians?: number;
    readonly getAnimationFrame: GetAnimationFrame;

    private readonly unsubscribe$ = new Subject<void>();

    constructor(
        private readonly buzzCanvasService: BuzzCanvasService,
        private readonly interfaceService: InteractionService,
        private readonly mathService: MathService,
        private readonly elementRef: ElementRef<HTMLDivElement>
    ) {
        const buzzCanvasBuilder = this.buzzCanvasService.getBuzzCanvasBuilder();

        this.getAnimationFrame = (
            dimensions: Dimensions,
            ctx: CanvasRenderingContext2D,
            timeDelta: number,
            canvas: HTMLCanvasElement
        ) => {
            const buzzCanvas = buzzCanvasBuilder(dimensions, timeDelta, this.extraCount, this.radians);
            this.extraCount = 0;
            
            ctx.drawImage(buzzCanvas, 0, 0, canvas.width, canvas.height);
        };
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

    @HostListener('click')
    superBee(): void {
        this.extraCount = 149;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
