import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FizzComponent } from './components/fizz/fizz.component';
import { AnimateFrameDirective } from './directives/animate-frame/animate-frame.directive';
import { BuzzComponent } from './components/buzz/buzz.component';
import { ShakeDirective } from './directives/shake/shake.directive';
import { FizzbuzzComponent } from './components/fizzbuzz/fizzbuzz.component';

@NgModule({
    declarations: [
        AppComponent,
        FizzComponent,
        AnimateFrameDirective,
        BuzzComponent,
        ShakeDirective,
        FizzbuzzComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
