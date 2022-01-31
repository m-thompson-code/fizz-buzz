import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimateFrameDirective } from '../../directives/animate-frame/animate-frame.directive';

import { FizzbuzzComponent } from './fizzbuzz.component';

describe('FizzbuzzComponent', () => {
    let component: FizzbuzzComponent;
    let fixture: ComponentFixture<FizzbuzzComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FizzbuzzComponent, AnimateFrameDirective ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FizzbuzzComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
