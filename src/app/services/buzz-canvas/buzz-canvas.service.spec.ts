import { TestBed } from '@angular/core/testing';

import { BuzzCanvasService } from './buzz-canvas.service';

describe('BuzzCanvasService', () => {
    let service: BuzzCanvasService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BuzzCanvasService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
