import { Component } from '@angular/core';
import { getCountingNumbers, getFizzbuzzValues } from 'src/fizz-buzz/fizz-buzz';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'fizz-buzz-demo';

    numbers = getFizzbuzzValues(getCountingNumbers(100, 1));
}
