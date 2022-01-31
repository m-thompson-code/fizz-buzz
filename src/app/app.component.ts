import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { getCountingNumbers, getFizzbuzzValues } from 'src/fizz-buzz/fizz-buzz';
import { InteractionService } from './services/interaction/interaction.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    title = 'fizz-buzz-demo';

    show = true;

    numbers = getFizzbuzzValues(getCountingNumbers(100, 1));

    private readonly unsubscribe = new Subject<void>();

    constructor(private renderer: Renderer2, private readonly interactionService: InteractionService) {
        this.interactionService.setRenderer(this.renderer);
        this.interactionService.getMousePosition().pipe(
            takeUntil(this.unsubscribe),
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
