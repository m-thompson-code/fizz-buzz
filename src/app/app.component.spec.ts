import { Component, Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'mat-form-field',
})
class MockFormFieldComponent {}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'mat-label',
})
class MockLabelComponent {}

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, ReactiveFormsModule],
            declarations: [
                AppComponent,
                MockFormFieldComponent,
                MockLabelComponent,
                Test,
            ],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
