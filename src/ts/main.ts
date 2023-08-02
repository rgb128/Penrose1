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
    (o, minX, maxX, minY, maxY, converter) => {
        const generated = generator.generate(minX, maxX, minY, maxY)
        for (const rhombus of generated.rhombuses) {
            drawRhombus(rhombus, smallContext, converter, 'red', 'blue');
        }
    },
);

document.getElementById('btn_min_x').onclick = e => {
    canvasMamager.resize(canvasMamager.getWidth() - 10, canvasMamager.getHeight());
}

document.getElementById('btn_pls_x').onclick = e => {
    canvasMamager.resize(canvasMamager.getWidth() + 10, canvasMamager.getHeight());
}
document.getElementById('btn_min_y').onclick = e => {
    canvasMamager.resize(canvasMamager.getWidth(), canvasMamager.getHeight() - 10);
}
document.getElementById('btn_pls_y').onclick = e => {
    canvasMamager.resize(canvasMamager.getWidth(), canvasMamager.getHeight() + 10);
}
document.getElementById('btn_pls_all').onclick = e => {
    canvasMamager.resize(canvasMamager.getWidth() + 20, canvasMamager.getHeight() - 20);
}
document.getElementById('btn_min_all').onclick = e => {
    canvasMamager.resize(canvasMamager.getWidth() - 20, canvasMamager.getHeight() - 20);
}
