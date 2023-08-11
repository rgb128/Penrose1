import { CanvasManager } from './canvasMamager';
import { PenroseTiligGenerator } from './penrose';
import { Point } from './point';
import { generateShifts, getSeed, Random } from "./random";
import {copyCanvas, copySmallCanvas, downloadCanvas, downloadSmallCanvas} from "./downloader";

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

//todo draw 'RGB128 text': https://github.com/rgb128/plus/blob/master/js/helpers.js#L82

document.getElementById('copyBig').onclick = async e => {
    const copyBtn = document.getElementById('copyBig');
    copyBtn.innerText = 'copying';
    try {
        await copyCanvas(bigCanvas, bigContext);
        copyBtn.innerText = 'copied';
    } catch (ex) {
        console.error(ex);
        copyBtn.innerText = 'failed';
    }
    setTimeout(() => {
        copyBtn.innerText = 'copy big';
    }, 2000);
}
document.getElementById('copySmall').onclick = async e => {
    const copyBtn = document.getElementById('copySmall');
    copyBtn.innerText = 'copying';
    try {
        await copySmallCanvas(middleCanvas, middleContext);
        copyBtn.innerText = 'copied';
    } catch (ex) {
        console.error(ex);
        copyBtn.innerText = 'failed';
    }
    setTimeout(() => {
        copyBtn.innerText = 'copy small';
    }, 2000);
}
document.getElementById('downloadBig').onclick = e => {
    downloadCanvas(bigCanvas, bigContext);
}
document.getElementById('downloadSmall').onclick = e => {
    downloadSmallCanvas(middleCanvas, middleContext);
}
