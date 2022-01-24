import { Injectable, Renderer2 } from '@angular/core';
import { fromEvent, map, Observable, share, throttleTime } from 'rxjs';
import { Dimensions, Position } from 'src/app/directives/animate-frame.model';
import { MILLISECONDS_PER_FRAME } from '../frame/frame.service';

@Injectable({
    providedIn: 'root',
})
export class InteractionService {
    private renderer!: Renderer2;
    constructor() {}

    setRenderer(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    getMousePosition(): Observable<Position> {
        if (!this.renderer) {
            throw new Error("renderer not set. Call setRenderer()");
        }

        return fromEvent(document, 'mousemove').pipe(
            map((event: Event) => {
                const mouseEvent = event as MouseEvent;

                return {
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY,
                };
            }),
            throttleTime(MILLISECONDS_PER_FRAME),
            share()
        );
    }
}
