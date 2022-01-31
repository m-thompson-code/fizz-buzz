import { Component } from '@angular/core';
import { Dimensions, GetAnimationFrame } from 'src/app/directives/animate-frame/animate-frame.model';
import { FizzCanvasService } from 'src/app/services/fizz-canvas/fizz-canvas.service';

@Component({
    selector: 'app-fizz',
    templateUrl: './fizz.component.html',
    styleUrls: ['./fizz.component.scss'],
})
export class FizzComponent {
    readonly getAnimationFrame: GetAnimationFrame;

    constructor(
        private readonly fizzCanvasService: FizzCanvasService
    ) {
        const fizzCanvasBuilder = this.fizzCanvasService.getFizzCanvasBuilder();

        this.getAnimationFrame = (
            dimensions: Dimensions,
            ctx: CanvasRenderingContext2D,
            timeDelta: number,
            canvas: HTMLCanvasElement
        ) => {
            const buzzCanvas = fizzCanvasBuilder(dimensions, timeDelta);
            
            ctx.drawImage(buzzCanvas, 0, 0, canvas.width, canvas.height);
        };
    }
}
