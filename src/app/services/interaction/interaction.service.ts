import { Injectable } from '@angular/core';
import { fromEvent, map, Observable, share, throttleTime } from 'rxjs';
import { Position } from '../../directives/animate-frame/animate-frame.model';

@Injectable({
    providedIn: 'root',
})
export class InteractionService {
    getMousePosition(): Observable<Position> {
        return fromEvent(document, 'mousemove').pipe(
            map((event: Event) => {
                const mouseEvent = event as MouseEvent;

                return {
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY,
                };
            }),
            throttleTime(200),
            share()
        );
    }
}
