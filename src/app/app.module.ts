import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FizzComponent } from './components/fizz/fizz.component';
import { AnimateFrameDirective } from './directives/animate-frame.directive';

@NgModule({
    declarations: [
        AppComponent,
        FizzComponent,
        AnimateFrameDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
