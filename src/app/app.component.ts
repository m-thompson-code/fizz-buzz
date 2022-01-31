import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { getCountingNumbers, getFizzbuzzValues } from '../fizz-buzz/fizz-buzz';
import { InteractionService } from './services/interaction/interaction.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    title = 'fizz-buzz-demo';

    show = true;

    numbers = getFizzbuzzValues(getCountingNumbers(100, 1));

    private readonly unsubscribe = new Subject<void>();

    formGroup = this.fb.group({
        start: [1, [Validators.required, Validators.pattern("^-?[0-9]*$"), Validators.min(-100), Validators.max(100)]],
        end: [100, [Validators.required, Validators.pattern("^-?[0-9]*$"), Validators.min(-100), Validators.max(100)]],
    });

    constructor(
        private readonly fb: FormBuilder,
        private readonly interactionService: InteractionService
    ) {
        this.interactionService
            .getMousePosition()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe();

        this.formGroup.valueChanges.pipe(
            tap(({ start, end}) => {
                if (!Number.isInteger(start) || !Number.isInteger(end)) {
                    return;
                }
                const count = end - start + 1;

                try {
                    this.numbers = getFizzbuzzValues(getCountingNumbers(count, start));
                } catch(error) {
                    console.error(error);
                    this.numbers = [];
                }
            }),
            takeUntil(this.unsubscribe),
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
