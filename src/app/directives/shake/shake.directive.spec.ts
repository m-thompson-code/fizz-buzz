import { ElementRef } from '@angular/core';
import { MathService } from '../../services/math/math.service';
import { ShakeDirective } from './shake.directive';

describe('ShakeDirective', () => {
    it('should create an instance', () => {
        const directive = new ShakeDirective({} as ElementRef, {getRandomSeed: () => -1} as MathService);
        expect(directive).toBeTruthy();
    });
});
