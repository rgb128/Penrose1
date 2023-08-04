import { PenroseRhombus, PenroseIntersectionPoint, PenroseVertexPoint } from "./penrose";
import { Point } from './point';

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
        
        const firstPoint = getPointBetweenPoints(points[1], points[3], .2);
        const secondPoint = getPointBetweenPoints(points[1], points[3], .8);

        drawCircle(canvasContext, firstPoint.x, firstPoint.y, 3, 'green');
        drawCircle(canvasContext, secondPoint.x, secondPoint.y, 3, 'yellow');
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
    drawCircle(canvasContext, real.x, real.y);
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
