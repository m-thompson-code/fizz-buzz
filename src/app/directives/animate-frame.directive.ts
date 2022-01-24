import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { GetAnimationFrame, Dimensions } from './animate-frame.model';

@Directive({
    selector: '[appAnimateFrame]',
})
export class AnimateFrameDirective implements OnInit, OnDestroy {
    @Input() appAnimateFrame!: GetAnimationFrame;
    private shouldRender = true;
    private renderedAt = Date.now();

    constructor(private elementRef: ElementRef<HTMLCanvasElement>) {}

    ngOnInit(): void {
        this.render();
    }

    getDimensions(): Dimensions {
        return {
            height: this.elementRef.nativeElement.offsetHeight,
            width: this.elementRef.nativeElement.offsetWidth,
        };
    }

    render(): void {
        const dimensions = this.getDimensions();
        const { height, width } = dimensions;

        const getAnimationFrame = () => {
            const canvas = this.elementRef.nativeElement;

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Unexpected missing ctx');
            }

            canvas.height = height;
            canvas.width = width;

            // clear canvas
            ctx.clearRect(0, 0, width, height);

            // insert animation frame
            const now = Date.now();
            const timeDelta = now - this.renderedAt;
            this.appAnimateFrame(dimensions, ctx, timeDelta / 1000, canvas);
            this.renderedAt = Date.now();

            // repeat rendering until component is destroyed
            if (this.shouldRender) {
                this.render();
            }
        };

        window.requestAnimationFrame(getAnimationFrame);
    }

    ngOnDestroy(): void {
        this.shouldRender = false;
    }
}
