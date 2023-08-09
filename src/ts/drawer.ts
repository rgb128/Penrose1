import { PenroseRhombus, PenroseIntersectionPoint, PenroseVertexPoint } from "./penrose";
import { Point } from './point';
import {HashTable, lengthOfLineSegment, rotateVector, rotateVectorBySinAngCos} from "./helpers";


//todo to be deleted
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

function drawKite(ctx: CanvasRenderingContext2D, center: Point, angle: number, pointConverter: (p: Point) => Point) {
    const THIN_BIG_HALF_DIAGONAL = Math.cos(Math.PI / 10);
    const THIN_SMALL_HALF_DIAGONAL = Math.sin(Math.PI / 10);
    const THICK_BIG_HALF_DIAGONAL = Math.cos(Math.PI / 5);
    const THICK_SMALL_HALF_DIAGONAL = Math.sin(Math.PI / 5);
    const THIN_FILL = '#f55';
    const THICK_FILL = '#55f';
    const CIRCLE_WIDTH = 5;
    const SMALL_CIRCLE_COLOR = 'white';
    const BIG_CIRCLE_COLOR = '#333';
    const BORDER_COLOR = 'black';
    const BORDER_WIDTH = 1;

    // angle = 0;
    angle -= Math.PI / 2; // It's because we draw horisontally, but rhombs are calculated verticcally
    
    const addXAndYAndRotate = (origin: Point, x: number, y: number, angle: number): Point => {
        const rotated = rotateVector(new Point(x, y), angle);
        // const rotated = rotateVector(new Point(x, y), 0);
        return new Point(rotated.x + origin.x, rotated.y + origin.y);
    }
    
    const moveTo = (point: Point) => {
        ctx.moveTo(point.x, point.y);
    }
    const lineTo = (point: Point) => {
        ctx.lineTo(point.x, point.y);
    }

    const realCenter =      pointConverter(center); // Not real center, but intersection point.
    const realTop =         pointConverter(addXAndYAndRotate(center, 0, -THIN_SMALL_HALF_DIAGONAL * 2, angle));
    const realBottom =      pointConverter(addXAndYAndRotate(center, 0, 1, angle));
    const realLeftTop =     pointConverter(addXAndYAndRotate(center, -THIN_BIG_HALF_DIAGONAL, -THIN_SMALL_HALF_DIAGONAL, angle));
    const realLeftBottom =  pointConverter(addXAndYAndRotate(center, -THIN_BIG_HALF_DIAGONAL, 1-THIN_SMALL_HALF_DIAGONAL, angle));
    const realRightTop =    pointConverter(addXAndYAndRotate(center, THIN_BIG_HALF_DIAGONAL, -THIN_SMALL_HALF_DIAGONAL, angle));
    const realRightBottom = pointConverter(addXAndYAndRotate(center, THIN_BIG_HALF_DIAGONAL, 1-THIN_SMALL_HALF_DIAGONAL, angle));
    // const realOne = Math.abs(pointConverter(new Point(1, 0)).x);
    const realOne = 50;
    const circleMultiplier = .2;
    
    const drawThinRhombus = () => {
        // Rhombus itself
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = BORDER_WIDTH;
        ctx.fillStyle = THIN_FILL;
        ctx.beginPath();
        moveTo(realCenter);
        lineTo(realRightTop);
        lineTo(realTop);
        lineTo(realLeftTop);
        lineTo(realCenter);
        ctx.stroke();
        ctx.fill();
        
        // Top arc ('small')
        ctx.strokeStyle = SMALL_CIRCLE_COLOR;
        ctx.lineWidth = CIRCLE_WIDTH;
        ctx.beginPath();
        ctx.arc(realTop.x, realTop.y, realOne * circleMultiplier, angle + Math.PI / 10, angle + Math.PI - Math.PI / 10, false);
        ctx.stroke();

        // Bottom arc ('big')
        ctx.strokeStyle = BIG_CIRCLE_COLOR;
        ctx.lineWidth = CIRCLE_WIDTH;
        ctx.beginPath();
        ctx.arc(realCenter.x, realCenter.y, realOne * circleMultiplier, angle - Math.PI / 10, angle - Math.PI + Math.PI / 10, true);
        ctx.stroke();
    }
    drawThinRhombus();
    const drawLeftThickRhombus = () => {
        // Rhombus itself
        ctx.beginPath();
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = BORDER_WIDTH;
        ctx.fillStyle = THICK_FILL;
        moveTo(realCenter);
        lineTo(realLeftTop);
        lineTo(realLeftBottom);
        lineTo(realBottom);
        lineTo(realCenter);
        ctx.stroke();
        ctx.fill();

        // Top arc ('big')
        ctx.strokeStyle = BIG_CIRCLE_COLOR;
        ctx.lineWidth = CIRCLE_WIDTH;
        ctx.beginPath();
        ctx.arc(realLeftTop.x, realLeftTop.y, realOne * (1 - circleMultiplier), angle + Math.PI / 10, angle + Math.PI / 2, false);
        ctx.stroke();

        // Bottom arc ('small')
        ctx.strokeStyle = SMALL_CIRCLE_COLOR;
        ctx.lineWidth = CIRCLE_WIDTH;
        ctx.beginPath();
        ctx.arc(realBottom.x, realBottom.y, realOne * circleMultiplier, angle - Math.PI / 2, angle - Math.PI / 2 - Math.PI / 5 * 2, true);
        ctx.stroke();
    }
    drawLeftThickRhombus();

    const drawRightThickRhombus = () => {
        // Rhombus itself
        ctx.beginPath();
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = BORDER_WIDTH;
        ctx.fillStyle = THICK_FILL;
        moveTo(realCenter);
        lineTo(realRightTop);
        lineTo(realRightBottom);
        lineTo(realBottom);
        lineTo(realCenter);
        ctx.stroke();
        ctx.fill();

        // Top arc ('big')
        ctx.strokeStyle = BIG_CIRCLE_COLOR;
        ctx.lineWidth = CIRCLE_WIDTH;
        ctx.beginPath();
        ctx.arc(realRightTop.x, realRightTop.y, realOne * (1 - circleMultiplier), angle + Math.PI / 2, angle + Math.PI / 2 + Math.PI / 5 * 2, false);
        ctx.stroke();

        // Bottom arc ('small')
        ctx.strokeStyle = SMALL_CIRCLE_COLOR;
        ctx.lineWidth = CIRCLE_WIDTH;
        ctx.beginPath();
        ctx.arc(realBottom.x, realBottom.y, realOne * circleMultiplier, angle - Math.PI / 2, angle - Math.PI / 10, false);
        ctx.stroke();
    }
    drawRightThickRhombus();
}

const canvasPoints = [];
const ctx = (document.getElementById('small') as HTMLCanvasElement).getContext('2d');
document.getElementById('small').onclick = e => {
    const point = canvasPoints.find(p => lengthOfLineSegment(p, new Point(e.offsetX, e.offsetY)) < 6);
    if (!point) return;
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
    if (point.type === 'kite') {
        const thinRhombus = point.rhombuses.find(x => x.isThin);
        // drawRhombus(thinRhombus, canvasContext, pointConverter, '', '');
        const thinCenter = getPointBetweenPoints(thinRhombus.points[0], thinRhombus.points[2], .5);
        const vector = new Point(point.x - thinCenter.x, point.y - thinCenter.y);
        const angle = Math.atan2(vector.y, vector.x);
        drawKite(canvasContext, point, angle, pointConverter);
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
