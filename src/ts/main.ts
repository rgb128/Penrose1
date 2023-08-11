import { CanvasManager } from './canvasMamager';
import { PenroseTiligGenerator } from './penrose';
import { generateShifts, getSeed, Random } from "./random";
import {copyCanvas, copySmallCanvas, downloadCanvas, downloadSmallCanvas} from "./downloader";

const SCROLL_END_MS = 1000;
let scrollTimeout;

const bigCanvas = document.getElementById('big') as HTMLCanvasElement;
const bigContext = bigCanvas.getContext('2d',{ willReadFrequently: true });
const smallCanvas = document.getElementById('small') as HTMLCanvasElement;
const smallContext = smallCanvas.getContext('2d',{ willReadFrequently: true });
// const smallCanvasPosition = {
//     left: -document.documentElement.clientWidth,
//     top: (100 - document.documentElement.clientHeight),
//     x: 0,
//     y: 0,
// };

function getWidth() {
    return document.documentElement.clientWidth;
}
function getHeight() {
    return document.documentElement.clientHeight - 100;
}

const seed = await getSeed();
// const random = new Random(seed); // Prod
const random = new Random(Date.now()); // Dev

const shifts = generateShifts(random);
const generator = new PenroseTiligGenerator(shifts);

const canvasManager = new CanvasManager(
    random,
    generator,
    50,
    getWidth(), 
    getHeight(),
    smallCanvas,
    bigCanvas,
);

window.onresize = e => {
    canvasManager.resize(getWidth(), getHeight());
    container.scrollTo(getWidth(), getHeight());
}

const container = document.getElementById('smallContainer');
container.scrollTo(getWidth(), getHeight());
function setGrabScroll() {
    
    window.onmousemove = e => {
        if (!e.buttons) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        const x = -e.movementX;
        const y = -e.movementY;
        container.scrollBy(x, y);
    }

    
}
setGrabScroll();
container.addEventListener('scrollend', e => {
    console.log(e);
    console.log(container.scrollTop, container.scrollLeft);
})

// function setTouch() {
//     let x = 0;
//     let y = 0;
//
//     smallCanvas.ontouchstart =  e => {
//         if (e.touches.length === 1) {
//             x = e.touches[0].clientX;
//             y = e.touches[0].clientY;
//         }
//        
//     }
//
//     smallCanvas.ontouchmove =  e => {
//         e.preventDefault();
//         e.stopImmediatePropagation();
//         e.stopPropagation();
//        
//         if (e.touches.length === 1) {
//             const deltaX = e.touches[0].clientX - x;
//             const deltaY = e.touches[0].clientY - y;
//             x = e.touches[0].clientX;
//             y = e.touches[0].clientY;
//
//             smallCanvasPosition.left += deltaX;
//             smallCanvasPosition.top += deltaY;
//             smallCanvasPosition.x -= deltaX;
//             smallCanvasPosition.y -= deltaY;
//             smallCanvas.style.top = smallCanvasPosition.top + 'px';
//             smallCanvas.style.left = smallCanvasPosition.left + 'px';
//         }
//     }
//    
//     smallCanvas.ontouchend =  e => {
//         e.preventDefault();
//         e.stopImmediatePropagation();
//         e.stopPropagation();
//
//         canvasManager.move(new Point(smallCanvasPosition.x, smallCanvasPosition.y));
//         smallCanvasPosition.x = 0;
//         smallCanvasPosition.y = 0;
//         smallCanvasPosition.left = -document.documentElement.clientWidth;
//         smallCanvasPosition.top = 100 - document.documentElement.clientHeight;
//         smallCanvas.style.top = smallCanvasPosition.top + 'px';
//         smallCanvas.style.left = smallCanvasPosition.left + 'px';
//     }
// }
// setTouch();
//
// smallCanvas.onmousemove = async e => {
//     if (!e.buttons) return;
//     e.preventDefault();
//     e.stopImmediatePropagation();
//     e.stopPropagation();
//    
//     const x = -e.movementX;
//     const y = -e.movementY;
//     smallCanvasPosition.left -= x;
//     smallCanvasPosition.top -= y;
//     smallCanvasPosition.x += x;
//     smallCanvasPosition.y += y;
//     smallCanvas.style.top = smallCanvasPosition.top + 'px';
//     smallCanvas.style.left = smallCanvasPosition.left + 'px';
// }
//
// smallCanvas.onmouseup = async e => {
//     canvasManager.move(new Point(smallCanvasPosition.x, smallCanvasPosition.y));
//     smallCanvasPosition.x = 0;
//     smallCanvasPosition.y = 0;
//     smallCanvasPosition.left = -document.documentElement.clientWidth;
//     smallCanvasPosition.top = 100 - document.documentElement.clientHeight;
//     smallCanvas.style.top = smallCanvasPosition.top + 'px';
//     smallCanvas.style.left = smallCanvasPosition.left + 'px';
// }

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
