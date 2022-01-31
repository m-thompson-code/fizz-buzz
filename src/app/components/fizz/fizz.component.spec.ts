import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AnimateFrameDirective } from '../../directives/animate-frame/animate-frame.directive';

import { FizzComponent } from './fizz.component';

describe('FizzComponent', () => {
    let component: FizzComponent;
    let fixture: ComponentFixture<FizzComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FizzComponent, AnimateFrameDirective ],
            imports: [ReactiveFormsModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FizzComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
