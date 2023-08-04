import { PenroseRhombus, PenroseIntersectionPoint, PenroseVertexPoint } from "./penrose";
import { Point } from './point';
import { HashTable } from "./helpers";

export function drawRhombus(
    rhombus: PenroseRhombus, 
    canvasContext: CanvasRenderingContext2D, 
    pointConverter: (p: Point) => Point,
    thinColor: string,
    thickColor: string,
): void {
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
        const firstPoint = getPointBetweenPoints(points[0], points[2], .2);
        const thirdPoint = getPointBetweenPoints(points[0], points[2], .8);
        const secondPoint = getPointBetweenPoints(points[1], points[3], .2);
        const fourthPoint = getPointBetweenPoints(points[1], points[3], .8);

        drawCircle(canvasContext, firstPoint.x, firstPoint.y, 3, 'darkgreen');
        // drawCircle(canvasContext, secondPoint.x, secondPoint.y, 3, 'yellow');
        drawCircle(canvasContext, thirdPoint.x, thirdPoint.y, 3, 'lime');
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

    if (point.type === 'deuce') {
    // if (point.type === 'deuce') {
    // if (point.type === 'kite' || point.type === 'deuce') {
        for (const rhombus of point.rhombuses) {
            if (!drawnRhombs[rhombus.intersectionPoint.hash]) {
                drawnRhombs[rhombus.intersectionPoint.hash] = true;
                drawRhombus(rhombus, canvasContext, pointConverter, '', '');
            }
        }
    }

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
