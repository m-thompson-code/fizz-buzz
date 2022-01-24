import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';

export const MILLISECONDS = 1000;
export const FRAMES_PER_SECOND = 60;
export const MILLISECONDS_PER_FRAME = MILLISECONDS / FRAMES_PER_SECOND;

@Injectable({
    providedIn: 'root',
})
export class FrameService {
    getFrameChanged(): Observable<number> {
        return interval(MILLISECONDS_PER_FRAME);
    }
}
