import { CanvasManager } from './canvasMamager';
import { PenroseTiligGenerator } from './penrose';
import { Point } from './point';
import { generateShifts, getSeed, Random } from "./random";
import { copyCanvas, copySmallCanvas, downloadCanvas, downloadSmallCanvas } from "./downloader";
import {TILING_COLORS} from "./colors";
import {setFavicon} from "./favicon";
import {getWidthAndHeight} from "./helpers";

const bigCanvas = document.getElementById('big') as HTMLCanvasElement;
const bigContext = bigCanvas.getContext('2d',{ willReadFrequently: true });
const smallCanvas = document.getElementById('small') as HTMLCanvasElement;
const smallContext = smallCanvas.getContext('2d',{ willReadFrequently: true });
let widthAmdHeight = getWidthAndHeight();
const smallCanvasPosition = {
    left: -widthAmdHeight.width,
    top: -widthAmdHeight.height,
    x: 0,
    y: 0,
};
const darkMode = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

const seed = await getSeed();
// const random = new Random(seed); // Prod
// const random = new Random(Date.now()); // Dev
const random = new Random(420); // Dev

setFavicon(random);

const shifts = generateShifts(random);
// const colorTheme = random.nextArrayValue(TILING_COLORS)[darkMode ? 'dark' : 'light'];
const colorTheme = TILING_COLORS[0]['dark'];
const generator = new PenroseTiligGenerator(shifts);

const canvasManager = new CanvasManager(
    random,
    generator,
    colorTheme,
    50,
    widthAmdHeight.width,
    widthAmdHeight.height,
    smallCanvas,
    bigCanvas,
);

if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
    document.body.classList.add('horizontal');
}
window.onresize = e => {
    widthAmdHeight = getWidthAndHeight();
    if (widthAmdHeight.horizontal) {
        document.body.classList.add('horizontal');
    } else {
        document.body.classList.remove('horizontal');
    }
    canvasManager.resize(widthAmdHeight.width, widthAmdHeight.height);
}


function setTouch() {
    let x = 0;
    let y = 0;

    smallCanvas.ontouchstart =  e => {
        if (e.touches.length === 1) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        
    }

    smallCanvas.ontouchmove =  e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        
        if (e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - x;
            const deltaY = e.touches[0].clientY - y;
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;

            smallCanvasPosition.left += deltaX;
            smallCanvasPosition.top += deltaY;
            smallCanvasPosition.x -= deltaX;
            smallCanvasPosition.y -= deltaY;
            smallCanvas.style.top = smallCanvasPosition.top + 'px';
            smallCanvas.style.left = smallCanvasPosition.left + 'px';
        }
    }
    
    smallCanvas.ontouchend =  e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();

        canvasManager.move(new Point(smallCanvasPosition.x, smallCanvasPosition.y));
        smallCanvasPosition.x = 0;
        smallCanvasPosition.y = 0;
        smallCanvasPosition.left = -widthAmdHeight.width;
        smallCanvasPosition.top = -widthAmdHeight.height;
        smallCanvas.style.top = smallCanvasPosition.top + 'px';
        smallCanvas.style.left = smallCanvasPosition.left + 'px';
    }
}
setTouch();

smallCanvas.onmousemove = async e => {
    if (!e.buttons) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    
    const x = -e.movementX;
    const y = -e.movementY;
    smallCanvasPosition.left -= x;
    smallCanvasPosition.top -= y;
    smallCanvasPosition.x += x;
    smallCanvasPosition.y += y;
    smallCanvas.style.top = smallCanvasPosition.top + 'px';
    smallCanvas.style.left = smallCanvasPosition.left + 'px';
}

smallCanvas.onmouseup = async e => {
    canvasManager.move(new Point(smallCanvasPosition.x, smallCanvasPosition.y));
    smallCanvasPosition.x = 0;
    smallCanvasPosition.y = 0;
    smallCanvasPosition.left = -widthAmdHeight.width;
    smallCanvasPosition.top = -widthAmdHeight.height;
    smallCanvas.style.top = smallCanvasPosition.top + 'px';
    smallCanvas.style.left = smallCanvasPosition.left + 'px';
}

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
        await copySmallCanvas(smallCanvas, smallContext);
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
    downloadSmallCanvas(smallCanvas, smallContext);
}

document.getElementById('oneInput').oninput = e => {
    document.getElementById('oneValue').innerText = +(document.getElementById('oneInput') as HTMLInputElement).value + 'px';
}

document.getElementById('setOne').onclick = async e => {
    const one = +(document.getElementById('oneInput') as HTMLInputElement).value;
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.remove('hidden');
    console.log('start');
    canvasManager.changeOne(one);
    console.log('end');
    loadingDiv.classList.add('hidden');
}

