import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimateFrameDirective } from '../../directives/animate-frame/animate-frame.directive';

import { BuzzComponent } from './buzz.component';

describe('BuzzComponent', () => {
    let component: BuzzComponent;
    let fixture: ComponentFixture<BuzzComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ BuzzComponent, AnimateFrameDirective ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BuzzComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
