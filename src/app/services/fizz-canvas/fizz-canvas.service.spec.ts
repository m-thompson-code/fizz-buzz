import { TestBed } from '@angular/core/testing';

import { FizzCanvasService } from './fizz-canvas.service';

describe('FizzCanvasService', () => {
    let service: FizzCanvasService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FizzCanvasService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
