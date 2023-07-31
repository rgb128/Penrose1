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

const ONE = 50;
const SHIFT_MULT = 1;
const LINES_DIST = 2.5;
let canvasWidth = 1000;
let canvasHeight = 1000;
const THIN_FILL = 'black';
const THICK_FILL = 'white';
const FILL_STOCK = 3;

function convertPoint(x, y) {
    // Make normal center
    x = map(x, -canvasWidth/ONE/2, canvasWidth/ONE/2, 0, canvasWidth);
    y = map(y, canvasHeight/ONE/2, -canvasHeight/ONE/2, 0, canvasHeight);

    return { x, y };
}

function generateShifts(count) {
    const lines = [ [0, 0] ];
    // const lines = [ ];
    let xSum = 0;
    let ySum = 0;
    for (let i = 0; i < count - 2; i++) {
        const x = 0;
        const y = map(Math.random(), 0, 1, -SHIFT_MULT, SHIFT_MULT);
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
    const b1 = (shifts[line1Family][1] + line1Number) * LINES_DIST / Math.cos(degToRad(line1Family * 360 / 5));
    const b2 = (shifts[line2Family][1] + line2Number) * LINES_DIST / Math.cos(degToRad(line2Family * 360 / 5));

    const x = (b2 - b1) / (k1 - k2);
    const y = k1 * x + b1;
    const y2 = k2 * x + b2;
    if (Math.abs(y - y2) > .001) {
        console.error('bad formula');
    }

    return { x, y };
}

function findSectionOnLineFamily(lineFamily, x, y) {
    const float = (y - Math.tan(degToRad(lineFamily * 360 / 5)) * x) * Math.cos(degToRad(lineFamily * 360 / 5)) / LINES_DIST - shifts[lineFamily][1];

    return Math.floor(float);
}

function getIntersectionPoints(minX, maxX, minY, maxY, line1Family, line2Family) {
    const line1Number = findSectionOnLineFamily(line1Family, (minX + maxX) / 2, (minY + maxY) / 2);
    const line2Number = findSectionOnLineFamily(line2Family, (minX + maxX) / 2, (minY + maxY) / 2);
    const points = [];

    const goFromPoint = (l1N, l2N) => {
        if (points.find(a => a.line1Number === l1N && a.line2Number === l2N)) return;
        const point = getIntersectionPoint(line1Family, l1N, line2Family, l2N);
        if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) return;
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

    const max = 2;
    for (let i = -max; i <= max; i++) {
        for (let j = -max; j <= max; j++) {
            goFromPoint(line1Number + i, line2Number + j);
        }
    }

    return points;
}

function getAllIntersectionPoints(minX, maxX, minY, maxY) {
    const result = [];
    for(let i = 0; i < 5; i++) {
        for(let j = i + 1; j < 5; j++) {
            result.push(...getIntersectionPoints(minX, maxX, minY, maxY, i, j));
        }
    }
    return result;
}

let mult = 1;

function generateRhonbusFromPoint(point) {
    const defaultK = [0, 1, 2, 3, 4].map(a => findSectionOnLineFamily(a, point.x, point.y));
    
    const k1 = [...defaultK];
    const k2 = [...defaultK];
    const k3 = [...defaultK];
    const k4 = [...defaultK];

    k1[point.line1Family] = point.line1Number - 1;
    k2[point.line1Family] = point.line1Number - 1;
    k3[point.line1Family] = point.line1Number;
    k4[point.line1Family] = point.line1Number;

    k1[point.line2Family] = point.line2Number - 1;
    k2[point.line2Family] = point.line2Number;
    k3[point.line2Family] = point.line2Number;
    k4[point.line2Family] = point.line2Number - 1;
    
    const vertex1X = mathSum(0, 4, j => k1[j] * -Math.sin(2 * Math.PI * j / 5));
    const vertex1Y = mathSum(0, 4, j => k1[j] * Math.cos(2 * Math.PI * j / 5));

    const vertex2X = mathSum(0, 4, j => k2[j] * -Math.sin(2 * Math.PI * j / 5));
    const vertex2Y = mathSum(0, 4, j => k2[j] * Math.cos(2 * Math.PI * j / 5));
    
    const vertex3X = mathSum(0, 4, j => k3[j] * -Math.sin(2 * Math.PI * j / 5));
    const vertex3Y = mathSum(0, 4, j => k3[j] * Math.cos(2 * Math.PI * j / 5));
    
    const vertex4X = mathSum(0, 4, j => k4[j] * -Math.sin(2 * Math.PI * j / 5));
    const vertex4Y = mathSum(0, 4, j => k4[j] * Math.cos(2 * Math.PI * j / 5));

    const points = [
        { x: vertex1X, y: vertex1Y },
        { x: vertex2X, y: vertex2Y },
        { x: vertex3X, y: vertex3Y },
        { x: vertex4X, y: vertex4Y },
    ];

    const pixelPoints = points.map(p => convertPoint(p.x, p.y));

    context.beginPath();
    context.moveTo(pixelPoints[0].x, pixelPoints[0].y);
    context.lineTo(pixelPoints[1].x, pixelPoints[1].y);
    context.lineTo(pixelPoints[2].x, pixelPoints[2].y);
    context.lineTo(pixelPoints[3].x, pixelPoints[3].y);
    context.lineTo(pixelPoints[0].x, pixelPoints[0].y);
    // context.stroke();

    const isRhombusThin = lengthOfLineSegment(points[0], points[2]) < lengthOfLineSegment(points[1], points[3]);
    if (isRhombusThin) context.fillStyle = THIN_FILL;
    else context.fillStyle = THICK_FILL;

    context.fill();
}

function fillRect(minX, maxX, minY, maxY) {
    getAllIntersectionPoints(
        minX - FILL_STOCK,
        maxX + FILL_STOCK,
        minY - FILL_STOCK,
        maxY + FILL_STOCK,
    )
    .map(generateRhonbusFromPoint);
}

// fillRect(0, 10, 0, 10);
fillRect(-10, 10, -10, 10);




// context.fillStyle = 'black';
// const point1 = convertPoint(0, 0);
// context.fillRect(point1.x - 5, point1.y - 5, 10, 10);

