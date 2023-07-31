'use strict';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const ONE = 100;

function generateShifts(count) {
    const lines = [ [0, 0] ];
    let xSum = 0;
    let ySum = 0;
    for (let i = 0; i < count - 2; i++) {
        const x = 0;
        // const y = map(Math.random(), 0, 1, -ONE, ONE);
        const y = map(Math.random(), 0, 1, -1, 1);
        xSum += x;
        ySum += y;
        lines.push([x, y]);
    }
    lines.push([-xSum, -ySum]);
    return lines;
}

const shifts = generateShifts(5);

function getIntersectionPoint(line1Family, line1Number, line2Family, line2Number) {
    //y=kx+b. b is shift
    const k1 = Math.tan(degToRad(line1Family * 360 / 5));
    const k2 = Math.tan(degToRad(line2Family * 360 / 5));
    const b1 = shifts[line1Family][1] + line1Number;
    const b2 = shifts[line2Family][1] + line2Number;

    const x = (b2 - b1) / (k1 - k2);
    const y = k1 * x + b1;

    return { x, y };
}

function findSectionOnLineFamily(lineFamily, x, y) {
    x -= shifts[lineFamily][0];
    y -= shifts[lineFamily][1];
    const rotated = rotateVector(x, y, -lineFamily*(360 / 5));
    const res = Math.floor((rotated.y));
    return res;
}

function getIntersectionPoints(start, end, line1Family, line2Family) {
    const line1Number = findSectionOnLineFamily(line1Family, (start.x + end.x) / 2, (start.y + end.y) / 2);
    const line2Number = findSectionOnLineFamily(line2Family, (start.x + end.x) / 2, (start.y + end.y) / 2);
    // console.log(line1Number, line2Number);
    // const startingPoint = {
    //     ...getIntersectionPoint(line1Family, line1Number, line2Family, line2Number),
    //     line1Family, 
    //     line1Number, 
    //     line2Family, 
    //     line2Number,
    // };
    // const points = [startingPoint];
    const points = [];

    const goFromPoint = (l1N, l2N) => {
        const point = getIntersectionPoint(line1Family, l1N, line2Family, l2N);
        // console.log(point);
        if (point.x < start.x || point.x > end.x || point.y < start.y || point.y > end.y) return;
        if (points.find(a => a.line1Number === l1N && a.line2Number === l2N)) return;
        points.push({
            ...point,
            line1Family,
            line2Family,
            line1Number: l1N,
            line2Number: l2N,
        });
        goFromPoint(l1N - 1, l2N);
        goFromPoint(l1N + 1, l2N);
        goFromPoint(l1N, l2N - 1);
        goFromPoint(l1N, l2N + 1);
    }

    goFromPoint(line1Number, line2Number);

    return points;
}

getIntersectionPoints({ x: 0, y: 0 }, { x: 10, y: 10 }, 0, 1).map(a => {
    console.log(a);
    context.fillRect(a.x * ONE, a.y * ONE, 3, 3);
});

