import { Injectable } from '@angular/core';
import { Position } from '../../directives/animate-frame/animate-frame.model';

@Injectable({
    providedIn: 'root',
})
export class MathService {
    randomSeedTable: number[] = [];
    randomSeedIndex = 0;

    constructor() {
        this.generateRandomSeedTable();
    }

    getRandVelocityValues(base: number, range: number, accRange: number, jerk: number = 0, exp = 0): (additional?: number) => number {
        const min = base - range;
        const max = base + range;

        let velocity = 0;
        let acc = 0;

        return (additional?: number) => {
            acc = this.getRandInRange(acc, jerk, 0, exp);

            acc = this.getValueInRange(acc, -accRange, +accRange) + (additional ?? 0);

            velocity = this.getValueInRange(velocity + acc, min, max)

            return velocity;
        }
    }

    getRandInRange(base: number, range: number, velocity = 0, exp = 0): number {
        const radius = (velocity || range) / 2;
        const min = base - range;
        const max = base + range;

        const rand = this.getRand(base + radius, base - radius, exp);

        return this.getValueInRange(rand, min, max);
    }

    getValueInRange(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }

        return value;
    }

    generateRandomSeedTable(): void {
        this.randomSeedTable = Array(1000).fill(0).map((_, i) => Math.random());
        // for (var i=1e6, lookupTable=[]; i--;) {
        //     lookupTable.push(Math.random());
        //   }
        //   function lookup() {
        //     return ++i >= lookupTable.length ? lookupTable[i=0] : lookupTable[i];
        //   }
    }

    getRandomSeed(): number {
        // return Math.random();
        this.randomSeedIndex = this.randomSeedIndex + 1;

        if (this.randomSeedIndex > this.randomSeedTable.length - 1) {
            this.randomSeedIndex = 0;
        }

        return this.randomSeedTable[this.randomSeedIndex];
    }

    getRand(max: number, min = 0, exp = 0): number {
        const range = max - min;
        const rand = range * this.getRandomSeed();
        
        if (!exp) {
            return rand + min;
        }

        const radius = range / 2;

        const pow = exp - 1;

        return Math.pow(rand - radius, 2 * pow + 1) / Math.pow(radius, 2 * pow) + radius + min;
    }

    getBasicRand(max: number, min = 0): number {
        return max * this.getRandomSeed() - min;
    }

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
    
    distanceBetweenPoints(a: Position, b: Position): number {
        const xx = a.x - b.x;
        const yy = a.y - b.y;

        return Math.sqrt( Math.pow(xx, 2) + Math.pow(yy, 2) );
    }
}
