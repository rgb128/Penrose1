import { CanvasnManager } from './canvasMamager';
import { drawVertexPoint } from './drawer';
import { PenroseTiligGenerator, fillTiling } from './penrose';
import { Point } from './point';

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
    (one, minX, maxX, minY, maxY, converter) => {
        const timeStart = window.performance.now();
        smallContext.fillStyle = 'white';
        smallContext.fillRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight - 100);
        const timeClearCanvas = window.performance.now();
        const generated = generator.generate(minX, maxX, minY, maxY);
        const timeGenerated = window.performance.now();
        fillTiling(generated);
        const timeFill = window.performance.now();
        for (const vertex of Object.values(generated.vertexes)) {
            drawVertexPoint(one, vertex, smallContext, converter);
        }
        const timeDrawn = window.performance.now();
        
        console.log(
`All time: ${(Math.round((timeDrawn - timeStart) * 1000) / 1000)}ms. ` +
`Clear canvas: ${(Math.round((timeClearCanvas - timeStart) * 1000) / 1000)}ms, ` +
`Generate: ${(Math.round((timeGenerated - timeClearCanvas) * 1000) / 1000)}ms, ` +
`Fill: ${(Math.round((timeFill - timeGenerated) * 1000) / 1000)}ms, ` +
`Draw: ${(Math.round((timeDrawn - timeFill) * 1000) / 1000)}ms.`);
        
        return generated;
    },
);

document.getElementById('oneInput').oninput = e => {
    const value = +(document.getElementById('oneInput') as HTMLInputElement).value;
    canvasManager.changeOne(value);
}

window.onresize = e => {
    canvasManager.resize(document.documentElement.clientWidth, document.documentElement.clientHeight - 100);
}


function setTouch() {
    let x = 0;
    let y = 0;

    smallCanvas.ontouchstart =  e => {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }

    smallCanvas.ontouchmove =  e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        
        const deltaX = e.touches[0].clientX - x;
        const deltaY = e.touches[0].clientY - y;
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;

        console.log(deltaX, deltaY);

        canvasManager.move(new Point(-deltaX, -deltaY));
    }
}
setTouch();

smallCanvas.onmousemove = e => {
    if (!e.buttons) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    const x = -e.movementX;
    const y = -e.movementY;
    canvasManager.move(new Point(x, y));
}

function downlaodCanvas(canvas: HTMLCanvasElement, filename = 'penrose.png'): void {
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
    // drawText(ctx);
  
    return new Promise((resolve) => {
        canvas.toBlob(resolve); // implied image/png format
    });
}
async function copyCanvas(context: CanvasRenderingContext2D, width: number, height: number, button: HTMLElement) {
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

document.getElementById('copySmall').onclick = async e => {
    await copyCanvas(smallContext, canvasManager.getWidth(), canvasManager.getHeight(), document.getElementById('copySmall'));
}
document.getElementById('copyBig').onclick = async e => {
    await copyCanvas(bigContext, canvasManager.getBigWidth(), canvasManager.getBigHeight(), document.getElementById('copyBig'));
}
document.getElementById('downloadSmall').onclick = e => {
    downlaodCanvas(smallCanvas);
}
document.getElementById('downloadBig').onclick = e => {
    downlaodCanvas(bigCanvas);
}

