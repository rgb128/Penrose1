import { PenroseRhombus, PenroseIntersectionPoint, PenroseVertexPoint } from "./penrose";
import { Point } from './point';
import { HashTable, lengthOfLineSegment } from "./helpers";

let converter;
export function drawRhombus(
    rhombus: PenroseRhombus, 
    canvasContext: CanvasRenderingContext2D, 
    pointConverter: (p: Point) => Point,
    thinColor: string,
    thickColor: string,
): void {
    converter = pointConverter;
    const points = rhombus.points.map(pointConverter);

    canvasContext.beginPath();
    canvasContext.moveTo(points[0].x, points[0].y);
    canvasContext.lineTo(points[1].x, points[1].y);
    canvasContext.lineTo(points[2].x, points[2].y);
    canvasContext.lineTo(points[3].x, points[3].y);
    canvasContext.lineTo(points[0].x, points[0].y);
    // canvasContext.fillStyle = rhombus.isThin ? thinColor : thickColor;

    const color = 
        rhombus.intersectionPoint.type === 1 ? '#009' :
        rhombus.intersectionPoint.type === 2 ? '#900' :
        rhombus.intersectionPoint.type === 3 ? '#f55' :
        rhombus.intersectionPoint.type === 4 ? '#55f' :
        'black';
    canvasContext.fillStyle = color;
    canvasContext.fill();

    if (rhombus.isThin) {
        const centerPoint = getPointBetweenPoints(points[0], points[2], .5);
        const firstPoint = getPointBetweenPoints(points[0], points[2], .2);
        const thirdPoint = getPointBetweenPoints(points[0], points[2], .8);
        const secondPoint = getPointBetweenPoints(points[1], points[3], .2);
        const fourthPoint = getPointBetweenPoints(points[1], points[3], .8);

        // drawCircle(canvasContext, centerPoint.x, centerPoint.y, 6, 'black');
        drawCircle(canvasContext, firstPoint.x, firstPoint.y, 3, 'darkgreen');
        canvasPoints.push({ ...centerPoint, rhombus });
        // drawCircle(canvasContext, secondPoint.x, secondPoint.y, 3, 'yellow');
        // drawCircle(canvasContext, thirdPoint.x, thirdPoint.y, 3, 'lime');
        // drawCircle(canvasContext, fourthPoint.x, fourthPoint.y, 3, 'lightblue');

    } else {
        // const firstPoint = getPointBetweenPoints(points[0], points[2], .2);
        // const secondPoint = getPointBetweenPoints(points[0], points[2], .8);

        // drawCircle(canvasContext, firstPoint.x, firstPoint.y, 3, 'green');
        // drawCircle(canvasContext, secondPoint.x, secondPoint.y, 3, 'yellow');

        
        const firstPoint = getPointBetweenPoints(points[0], points[2], .2);
        const thirdPoint = getPointBetweenPoints(points[0], points[2], .8);
        const secondPoint = getPointBetweenPoints(points[1], points[3], .2);
        const fourthPoint = getPointBetweenPoints(points[1], points[3], .8);

        drawCircle(canvasContext, firstPoint.x, firstPoint.y, 3, 'darkgreen');
        // drawCircle(canvasContext, secondPoint.x, secondPoint.y, 3, 'yellow');
        drawCircle(canvasContext, thirdPoint.x, thirdPoint.y, 3, 'lime');
        // drawCircle(canvasContext, fourthPoint.x, fourthPoint.y, 3, 'lightblue');

    }
}

const canvasPoints = [];
const ctx = (document.getElementById('small') as HTMLCanvasElement).getContext('2d');
document.getElementById('small').onclick = e => {
    const point = canvasPoints.find(p => lengthOfLineSegment(p, new Point(e.offsetX, e.offsetY)) < 6);
    if (!point) return;

    const points = point.rhombus.points.map(converter);
    // console.log(point.rhombus.intersectionPoint.line1Family, point.rhombus.intersectionPoint.line2Family, point.rhombus.intersectionPoint.line1Number, point.rhombus.intersectionPoint.line2Number);
    console.log(point.rhombus.intersectionPoint.line1Number, point.rhombus.intersectionPoint.line2Number);
    // console.log((point.rhombus.intersectionPoint.line1Number + point.rhombus.intersectionPoint.line2Number + 200) % 2);

    // ctx.beginPath();
    // ctx.moveTo(points[0].x, points[0].y);
    // ctx.lineTo(points[1].x, points[1].y);
    // ctx.lineTo(points[2].x, points[2].y);
    // ctx.lineTo(points[3].x, points[3].y);
    // ctx.lineTo(points[0].x, points[0].y);
    // // canvasContext.fillStyle = rhombus.isThin ? thinColor : thickColor;

    // const color = 'black';
        
    // ctx.fillStyle = color;
    // ctx.fill();
}

export function drawIntersectionPoint(
    point: PenroseIntersectionPoint, 
    canvasContext: CanvasRenderingContext2D, 
    pointConverter: (p: Point) => Point,
    color: string,
): void {
    const real = pointConverter(point);
    canvasContext.beginPath();
    canvasContext.arc(real.x, real.y, 4, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = color;
    canvasContext.fill();
}

export function drawVertexPoint(
    point: PenroseVertexPoint, 
    canvasContext: CanvasRenderingContext2D, 
    pointConverter: (p: Point) => Point,
    color: string,
): void {
    const real = pointConverter(point);
    // drawCircle(canvasContext, real.x, real.y, 3, color);

    const drawnRhombs: HashTable<boolean> = {};


    // Kite / Deuce / Jack

    if (point.type === 'kite') {
    // if (point.type === 'deuce') {
    // if (point.type === 'kite' || point.type === 'deuce') {
        for (const rhombus of point.rhombuses) {
            // if (!rhombus.isThin) continue;
            if (!drawnRhombs[rhombus.intersectionPoint.hash]) {
                drawnRhombs[rhombus.intersectionPoint.hash] = true;
                // drawRhombus(rhombus, canvasContext, pointConverter, '', '');
                const indexOf = indexOfPoint(rhombus.points, point);
                if (indexOf === 0 || indexOf === 2) {
                    // console.log(indexOfPoint(rhombus.points, point), rhombus.intersectionPoint.type);
                    drawRhombus(rhombus, canvasContext, pointConverter, '', '');
                    const centerPoint = getPointBetweenPoints(rhombus.points[0], rhombus.points[2], .5);
                    const ourPoint = getPointBetweenPoints(point, centerPoint, .5);
                    const centerConverted = pointConverter(centerPoint);
                    const ourConverted = pointConverter(ourPoint);                    
                    const pointConverted = pointConverter(point);
                    drawCircle(canvasContext, pointConverted.x, pointConverted.y, 3, 'yellow');
                    const vector = new Point(point.x - centerPoint.x, point.y - centerPoint.y);
                    // const vectorLen = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
                    // const sin = vector.y / vectorLen;
                    // const cos = vector.x / vectorLen;
                    const angle = Math.atan2(vector.y, vector.x);
                    // console.log(Math.round((angle * 20 / Math.PI / 2) * 100) / 100, Math.round(angle * 360 / 2 / Math.PI * 100) / 100, rhombus.intersectionPoint.line1Family, rhombus.intersectionPoint.line2Family);
                    console.log(Math.round((angle * 360 / 2 / Math.PI / 36 + 90 / 36) * 100) / 100, rhombus.intersectionPoint.line1Family, rhombus.intersectionPoint.line2Family);
                    // console.log(Math.round(angle * 10 / Math.PI / 2 * 100) / 100, angle);
                }
            }
        }
    }
}

function indexOfPoint(arr, point) {
    for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        if (lengthOfLineSegment(p, point) < .001) {
            return i;
        }
    }
    return -1;
}

function drawCircle(
    canvas: CanvasRenderingContext2D, 
    x: number, 
    y: number,
    r = 3, 
    color = 'black',
) {
    canvas.beginPath();
    canvas.arc(x, y, r, 0, 2 * Math.PI, false);
    canvas.fillStyle = color;
    canvas.fill();
}

function getPointBetweenPoints(point1: Point, point2: Point, closerToPoint1: number): Point {
    const distX = point2.x - point1.x;
    const distY = point2.y - point1.y;

    const x = point1.x + distX * closerToPoint1;
    const y = point1.y + distY * closerToPoint1;

    return new Point(x, y);
}
