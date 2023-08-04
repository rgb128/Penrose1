import { CanvasnManager } from './canvasMamager';
import { drawRhombus, drawIntersectionPoint, drawVertexPoint } from './drawer';
import { PenroseTiligGenerator, PenroseVertexPoint, PenroseRhombus, fillTiling } from './penrose';
import { Point } from './point';
import { lengthOfLineSegment } from './helpers';

const smallCanvas = document.getElementById('small') as HTMLCanvasElement;
const smallContext = smallCanvas.getContext('2d', { willReadFrequently: true });
const bigCanvas = document.getElementById('big') as HTMLCanvasElement;
const bigContext = bigCanvas.getContext('2d',{ willReadFrequently: true });

const generator = new PenroseTiligGenerator(50);

const canvasManager = new CanvasnManager(
    50,
    document.documentElement.clientWidth,
    document.documentElement.clientHeight - 100,
    smallCanvas,
    bigCanvas,
    (o, minX, maxX, minY, maxY, converter) => {
        smallContext.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight - 100);
        const generated = generator.generate(minX, maxX, minY, maxY)
        for (const rhombus of generated.rhombuses) {
            drawRhombus(rhombus, smallContext, converter, 'red', 'blue');
        }
        // for (const r of generated.rhombuses) {
        //     const intersection = r.intersectionPoint;
        //     drawIntersectionPoint(intersection, smallContext, converter, 'black');
        // }
        for (const vertex of Object.values(generated.vertexes)) {
            drawVertexPoint(vertex, smallContext, converter, 'white');
        }
        
        fillTiling(generated);
        return generated;
    },
);

smallCanvas.onclick = e => {
    const x = e.offsetX;
    const y = e.offsetY;

    const vertex = getVertex(x, y);
    if (!vertex) {
        return;
    }

    console.log(vertex.type, vertex.rhombuses.map(x => x.intersectionPoint.type));

}


function getVertex(x: number, y: number): PenroseVertexPoint {
    for (const point of Object.values(canvasManager.getTiling().vertexes)) {
        const pxCoordinatex = canvasManager.convertUnitsToPx(point);
        if (lengthOfLineSegment(pxCoordinatex, new Point(x, y)) <= 5) {
            return point;
        }
    }
    return null;
}
