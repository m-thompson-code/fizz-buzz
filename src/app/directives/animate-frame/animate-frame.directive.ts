import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { GetAnimationFrame, Dimensions } from './animate-frame.model';

@Directive({
    selector: '[appAnimateFrame]',
})
export class AnimateFrameDirective implements OnInit, OnDestroy {
    @Input() appAnimateFrame!: GetAnimationFrame;
    private shouldRender = true;
    private renderedAt = Date.now();

    private timeoutRef?: number;

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
        if (!this.isElementInViewport()) {
            this.timeoutRef = window.setTimeout(() => {
                this.render();
            }, 600);
            return;
        }

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

    isElementInViewport (): boolean {
        const rect = this.elementRef.nativeElement.getBoundingClientRect();

        const { height, width } = this.getDimensions()
    
        return (
            rect.top + height >= 0 &&
            rect.left + width >= 0 &&
            rect.bottom - height <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right - width <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    ngOnDestroy(): void {
        window.clearTimeout(this.timeoutRef);
        this.shouldRender = false;
    }
}
