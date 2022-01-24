import { Injectable } from '@angular/core';
import { Position } from 'src/app/directives/animate-frame.model';

@Injectable({
    providedIn: 'root',
})
export class MathService {
    getCoordinates(distance: number, angle: number): Position {
        return {
            x: distance * Math.cos(angle),
            y: distance * Math.sin(angle),
        };
    }

    getRadians(degrees: number): number {
        return ((degrees * Math.PI) / 180) % 360;
    }

    getElementPosition(element: HTMLElement): Position {
        const box = element.getBoundingClientRect();

        return {
            x: box.x + box.width / 2,
            y: box.y + box.height / 2,
        };
    }

    radiansBetweenPoints(a: Position, b: Position): number {
        const dy = b.y - a.y;
        const dx = b.x - a.x;

        return Math.atan2(dy, dx);
    }
}
