import { Component, ElementRef, HostListener } from '@angular/core';
import { Dimensions, GetAnimationFrame } from '../../directives/animate-frame/animate-frame.model';
import { FizzCanvasService } from '../../services/fizz-canvas/fizz-canvas.service';
import { MathService } from '../../services/math/math.service';

@Component({
    selector: 'app-fizz',
    templateUrl: './fizz.component.html',
    styleUrls: ['./fizz.component.scss'],
})
export class FizzComponent {
    private extraBubbles = false;
    readonly getAnimationFrame: GetAnimationFrame;

    constructor(
        private readonly mathService: MathService,
        private readonly elementRef: ElementRef<HTMLDivElement>,
        private readonly fizzCanvasService: FizzCanvasService
    ) {
        const delay = this.mathService.getRand(400, 0);
        const length = this.mathService.getRand(5000, 3000);
        this.elementRef.nativeElement.style.animationDelay = `${delay}ms`;
        this.elementRef.nativeElement.style.animationDuration = `${length}ms`;

        const fizzCanvasBuilder = this.fizzCanvasService.getFizzCanvasBuilder();

        this.getAnimationFrame = (
            dimensions: Dimensions,
            ctx: CanvasRenderingContext2D,
            timeDelta: number,
            canvas: HTMLCanvasElement
        ) => {
            const buzzCanvas = fizzCanvasBuilder(dimensions, timeDelta, this.extraBubbles);
            this.extraBubbles = false;
            
            ctx.drawImage(buzzCanvas, 0, 0, canvas.width, canvas.height);
        };
    }

    @HostListener('click')
    @HostListener('mouseenter')
    shakeAnimation(): void {
        this.extraBubbles = true;
    }
}
