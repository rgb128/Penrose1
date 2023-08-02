import { Point } from './point';

/**
 * Like Sigma char in math
 * @param iFrom Including 
 * @param iTo Including
 * @param func 
 */
export function mathSum(iFrom: number, iTo: number, func: (j: number) => number) {
    let sum = 0;
    for (let i = iFrom; i <= iTo; i++) {
        sum += func(i);
    }
    return sum;
}

export function lengthOfLineSegment(point1: Point, point2: Point): number {
    function pow2(x: number): number {
        return x * x;
    }
    return Math.sqrt(pow2(point1.x - point2.x) + pow2(point1.y - point2.y));
}

export interface HashTable<T> {
    [key: string]: T;
}

export function map(
    num: number, 
    frombottom: number, 
    fromtop: number, 
    tobottom: number, 
    totop: number,
): number {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}