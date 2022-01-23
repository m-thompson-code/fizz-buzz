import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-fizz',
    templateUrl: './fizz.component.html',
    styleUrls: ['./fizz.component.scss']
})
export class FizzComponent implements OnInit {
    ngOnInit(): void {
        console.log("Hello world");
    }
}
