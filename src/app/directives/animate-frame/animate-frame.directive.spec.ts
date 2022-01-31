import { ElementRef } from '@angular/core';
import { AnimateFrameDirective } from './animate-frame.directive';

describe('AnimateFrameDirective', () => {
    it('should create an instance', () => {
        const directive = new AnimateFrameDirective({} as ElementRef);
        expect(directive).toBeTruthy();
    });
});
