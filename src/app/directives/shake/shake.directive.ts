import { Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { MathService } from '../../services/math/math.service';

@Directive({
    selector: '[appShake]',
})
export class ShakeDirective implements OnDestroy {
    private timeoutRef = this.getShakeTimeout();

    constructor(private readonly elementRef: ElementRef, private readonly mathService: MathService) {}

    getShakeTimeout(): number {
        return window.setTimeout(() => {
            this.shakeAnimation();
            this.timeoutRef = this.getShakeTimeout();
        }, 2000 + this.mathService.getRandomSeed() * 2000);
    }

    @HostListener('click')
    @HostListener('mouseenter')
    shakeAnimation(): void {
        const keyframes: Keyframe[] = [];

        for (let i = 0; i < 50; i++) {
            const c = 4;
            const x = c - this.mathService.getRandomSeed() * c * 2;
            const y = c - this.mathService.getRandomSeed() * c * 2;
            const r = c - this.mathService.getRandomSeed() * c * 2;
            keyframes.push({
                transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
            });
        }

        this.elementRef.nativeElement.animate(keyframes, {
            duration: 300,
        });
    }

    ngOnDestroy(): void {
        clearTimeout(this.timeoutRef);
    }
}
