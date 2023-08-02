import { CanvasnManager } from './canvasMamager';
import { drawRhombus } from './drawer';
import { PenroseTiligGenerator, PenroseRhombus, PenroseTilig } from './penrose';

const smallCanvas = document.getElementById('small') as HTMLCanvasElement;
const smallContext = smallCanvas.getContext('2d');
const bigCanvas = document.getElementById('big') as HTMLCanvasElement;
const bigContext = bigCanvas.getContext('2d');

const generator = new PenroseTiligGenerator(50);

const canvasMamager = new CanvasnManager(
    50,
    100,
    100,
    smallCanvas,
    bigCanvas,
    (o, minX, maxX, minY, maxY) => {
        const generated = generator.generate(minX, maxX, minY, maxY)
        for (const rhombus of generated.rhombuses) {
            drawRhombus(rhombus, smallContext, null, 'red', 'blue');
        }
    },
)

document.getElementById('btn1').onclick = e => {
    //
}

document.getElementById('btn2').onclick = e => {
    //
}
document.getElementById('btn3').onclick = e => {
    //
}
document.getElementById('btn4').onclick = e => {
    //
}
