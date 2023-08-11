import { PenroseVertexPoint } from "./penrose";
import { Point } from './point';
import { rotateVector } from "./helpers";


const THIN_BIG_HALF_DIAGONAL = Math.cos(Math.PI / 10);
const THIN_SMALL_HALF_DIAGONAL = Math.sin(Math.PI / 10);
const THICK_BIG_HALF_DIAGONAL = Math.cos(Math.PI / 5);
const THICK_SMALL_HALF_DIAGONAL = Math.sin(Math.PI / 5);
const THIN_FILL = '#d9d8ff';
const THICK_FILL = '#ffdbdb';
const CIRCLE_WIDTH_MULT = .075; // one * CIRCLE_WIDTH_MULT
const SMALL_CIRCLE_COLOR = '#6d6dff';
const BIG_CIRCLE_COLOR = '#ff7171';
const BORDER_COLOR = 'rgba(0, 0, 0, 1)';
const BORDER_WIDTH = 1;
const CIRCLE_MULTIPLIER = .2;

/**
 * Draws all 3 rhombuses
 * @param angle Angle VERTEX -> CENTER OF THIN
 */
function drawKite(
    one: number,
    ctx: CanvasRenderingContext2D, 
    center: Point, 
    angle: number, 
    pointConverter: (p: Point) => Point
) {

    // angle = 0;
    angle -= Math.PI / 2; // It's because we draw horizontally, but rhombs are calculated vertically
    
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
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realTop.x, realTop.y, one * CIRCLE_MULTIPLIER, angle + Math.PI / 10, angle + Math.PI - Math.PI / 10, false);
        ctx.stroke();

        // Bottom arc ('big')
        ctx.strokeStyle = BIG_CIRCLE_COLOR;
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realCenter.x, realCenter.y, one * CIRCLE_MULTIPLIER, angle - Math.PI / 10, angle - Math.PI + Math.PI / 10, true);
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
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realLeftTop.x, realLeftTop.y, one * (1 - CIRCLE_MULTIPLIER), angle + Math.PI / 10, angle + Math.PI / 2, false);
        ctx.stroke();

        // Bottom arc ('small')
        ctx.strokeStyle = SMALL_CIRCLE_COLOR;
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realBottom.x, realBottom.y, one * CIRCLE_MULTIPLIER, angle - Math.PI / 2, angle - Math.PI / 2 - Math.PI / 5 * 2, true);
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
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realRightTop.x, realRightTop.y, one * (1 - CIRCLE_MULTIPLIER), angle + Math.PI / 2, angle + Math.PI / 2 + Math.PI / 5 * 2, false);
        ctx.stroke();

        // Bottom arc ('small')
        ctx.strokeStyle = SMALL_CIRCLE_COLOR;
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realBottom.x, realBottom.y, one * CIRCLE_MULTIPLIER, angle - Math.PI / 2, angle - Math.PI / 10, false);
        ctx.stroke();
    }
    drawRightThickRhombus();
}

/** 
 * It actually draws thick rhombus only
 * @param angle Angle VERTEX -> CENTER OF THICK
 */
function drawDeuce(
    one: number,
    ctx: CanvasRenderingContext2D, 
    center: Point, 
    angle: number, 
    pointConverter: (p: Point) => Point
) {

    angle -= Math.PI / 2; // It's because we draw horizontally, but rhombs are calculated vertically

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

    const realCenter = pointConverter(center); // Not real center, but intersection point. (and bottom)
    const realTop = pointConverter(addXAndYAndRotate(center, 0, -THICK_BIG_HALF_DIAGONAL * 2, angle));
    const realLeft = pointConverter(addXAndYAndRotate(center, -THICK_SMALL_HALF_DIAGONAL, -THICK_BIG_HALF_DIAGONAL, angle));
    const realRight = pointConverter(addXAndYAndRotate(center, THICK_SMALL_HALF_DIAGONAL, -THICK_BIG_HALF_DIAGONAL, angle));

    const drawThickRhombus = () => {
        // Rhombus itself
        ctx.beginPath();
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = BORDER_WIDTH;
        ctx.fillStyle = THICK_FILL;
        moveTo(realCenter);
        lineTo(realRight);
        lineTo(realTop);
        lineTo(realLeft);
        lineTo(realCenter);
        ctx.stroke();
        ctx.fill();

        // Top arc ('big')
        ctx.strokeStyle = BIG_CIRCLE_COLOR;
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realTop.x, realTop.y, one * (1 - CIRCLE_MULTIPLIER), angle + Math.PI / 2 - Math.PI / 5, angle + Math.PI / 2 + Math.PI / 5, false);
        ctx.stroke();

        // Bottom arc ('small')
        ctx.strokeStyle = SMALL_CIRCLE_COLOR;
        ctx.lineWidth = one * CIRCLE_WIDTH_MULT;
        ctx.beginPath();
        ctx.arc(realCenter.x, realCenter.y, one * CIRCLE_MULTIPLIER, angle - Math.PI / 2 + Math.PI / 5, angle - Math.PI / 2 - Math.PI / 5, true);
        ctx.stroke();
    }
    drawThickRhombus();
}

export function drawVertexPoint(
    one: number,
    point: PenroseVertexPoint, 
    canvasContext: CanvasRenderingContext2D, 
    pointConverter: (p: Point) => Point,
): void {
    if (point.type === 'kite') {
        const thinRhombus = point.rhombuses.find(x => x.isThin);
        const thinCenter = getPointBetweenPoints(thinRhombus.points[0], thinRhombus.points[2]);
        const vector = new Point(point.x - thinCenter.x, point.y - thinCenter.y);
        const angle = Math.atan2(vector.y, vector.x);
        drawKite(one, canvasContext, point, angle, pointConverter);
    } else if (point.type === 'deuce') {
        const thinRhombus = point.rhombuses.find(x => !x.isThin);
        const thickCenter = getPointBetweenPoints(thinRhombus.points[0], thinRhombus.points[2]);
        const vector = new Point(point.x - thickCenter.x, point.y - thickCenter.y);
        const angle = Math.atan2(vector.y, vector.x);
        drawDeuce(one, canvasContext, point, angle, pointConverter);
    }
}

function getPointBetweenPoints(point1: Point, point2: Point, closerToPoint1 = .5): Point {
    const distX = point2.x - point1.x;
    const distY = point2.y - point1.y;

    const x = point1.x + distX * closerToPoint1;
    const y = point1.y + distY * closerToPoint1;

    return new Point(x, y);
}
