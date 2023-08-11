import { CanvasManager } from './canvasMamager';
import { drawVertexPoint } from './drawer';
import { PenroseTiligGenerator, fillTiling } from './penrose';
import { Point } from './point';
import {generateShifts, getSeed, Random} from "./random";

const bigCanvas = document.getElementById('big') as HTMLCanvasElement;
const bigContext = bigCanvas.getContext('2d',{ willReadFrequently: true });
const middleCanvas = document.getElementById('middle') as HTMLCanvasElement;
const middleContext = middleCanvas.getContext('2d',{ willReadFrequently: true });
const middleCanvasPosition = {
    left: -document.documentElement.clientWidth,
    top: (100 - document.documentElement.clientHeight),
    x: 0,
    y: 0,
};

const seed = await getSeed();
// const random = new Random(seed); // Prod
const random = new Random(Date.now()); // Dev

const shifts = generateShifts(random);
const generator = new PenroseTiligGenerator(shifts);

const canvasManager = new CanvasManager(
    random,
    generator,
    50,
    document.documentElement.clientWidth,
    document.documentElement.clientHeight - 100,
    middleCanvas,
    bigCanvas,
);

window.onresize = e => {
    canvasManager.resize(document.documentElement.clientWidth, document.documentElement.clientHeight - 100);
}


function setTouch() {
    let x = 0;
    let y = 0;

    middleCanvas.ontouchstart =  e => {
        if (e.touches.length === 1) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        
    }

    middleCanvas.ontouchmove =  e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        
        if (e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - x;
            const deltaY = e.touches[0].clientY - y;
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;

            middleCanvasPosition.left += deltaX;
            middleCanvasPosition.top += deltaY;
            middleCanvasPosition.x -= deltaX;
            middleCanvasPosition.y -= deltaY;
            middleCanvas.style.top = middleCanvasPosition.top + 'px';
            middleCanvas.style.left = middleCanvasPosition.left + 'px';
        }
    }
    
    middleCanvas.ontouchend =  e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();

        canvasManager.move(new Point(middleCanvasPosition.x, middleCanvasPosition.y));
        middleCanvasPosition.x = 0;
        middleCanvasPosition.y = 0;
        middleCanvasPosition.left = -document.documentElement.clientWidth;
        middleCanvasPosition.top = 100 - document.documentElement.clientHeight;
        middleCanvas.style.top = middleCanvasPosition.top + 'px';
        middleCanvas.style.left = middleCanvasPosition.left + 'px';
    }
}
setTouch();

middleCanvas.onmousemove = async e => {
    if (!e.buttons) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    
    const x = -e.movementX;
    const y = -e.movementY;
    middleCanvasPosition.left -= x;
    middleCanvasPosition.top -= y;
    middleCanvasPosition.x += x;
    middleCanvasPosition.y += y;
    middleCanvas.style.top = middleCanvasPosition.top + 'px';
    middleCanvas.style.left = middleCanvasPosition.left + 'px';
}

middleCanvas.onmouseup = async e => {
    canvasManager.move(new Point(middleCanvasPosition.x, middleCanvasPosition.y));
    middleCanvasPosition.x = 0;
    middleCanvasPosition.y = 0;
    middleCanvasPosition.left = -document.documentElement.clientWidth;
    middleCanvasPosition.top = 100 - document.documentElement.clientHeight;
    middleCanvas.style.top = middleCanvasPosition.top + 'px';
    middleCanvas.style.left = middleCanvasPosition.left + 'px';
}

function downloadCanvas(canvas: HTMLCanvasElement, filename = 'penrose.png'): void {
    const myImageDataUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = myImageDataUrl;
    link.download = filename;

    link.click();

    link.remove();
}

async function imageDataToBlob(imageData: ImageData): Promise<Blob> {
    const w = imageData.width;
    const h = imageData.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
  
    return new Promise((resolve) => {
        canvas.toBlob(resolve); // implied image/png format
    });
}
async function copyCanvas(context: CanvasRenderingContext2D, width: number, height: number, button: HTMLElement, x = 0, y = 0) {
    const innerText = button.innerText;
    button.innerText = 'copying';
    const blob = await imageDataToBlob(context.getImageData(0, 0, width, height));
    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob,
            })
        ]);
        button.innerText = 'copied';
    } catch (ex) {
        console.error(ex);
        button.innerText = 'failed';
    }
    setTimeout(() => {
        button.innerText = innerText;
    }, 2000);
 }

//todo draw 'RGB128 text': https://github.com/rgb128/plus/blob/master/js/helpers.js#L82

document.getElementById('copyBig').onclick = async e => {
    await copyCanvas(bigContext, canvasManager.getBigWidth(), canvasManager.getBigHeight(), document.getElementById('copyBig'));
}
document.getElementById('downloadBig').onclick = e => {
    downloadCanvas(bigCanvas);
}

