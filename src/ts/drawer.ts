import { PenroseRhombus } from "./penrose";
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
    canvasContext.fillStyle = rhombus.isThin ? thinColor : thickColor;
    canvasContext.fill();
}
