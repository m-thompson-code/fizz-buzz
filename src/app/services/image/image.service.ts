import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    cache: Record<string, HTMLImageElement> = {};
    constructor() {}

    getImage(src: string): HTMLImageElement {
        this.cache[src] = this.cache[src] ?? this.getNewImage(src);

        return this.cache[src];
    }

    getNewImage(src: string): HTMLImageElement {
        const image = new Image();
        image.src = src;

        return image;
    }
}
