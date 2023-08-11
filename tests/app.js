'use strict';

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

const CANVAS_SIDE = 100;
const THIN_BIG_HALF_DIAGONAL = CANVAS_SIDE * Math.cos(Math.PI / 10);
const THIN_SMALL_HALF_DIAGONAL = CANVAS_SIDE * Math.sin(Math.PI / 10);
const THICK_BIG_HALF_DIAGONAL = CANVAS_SIDE * Math.cos(Math.PI / 5);
const THICK_SMALL_HALF_DIAGONAL = CANVAS_SIDE * Math.sin(Math.PI / 5);

function drawThinTile(context) {
    context.moveTo(CANVAS_WIDTH / 2 - THIN_BIG_HALF_DIAGONAL, CANVAS_HEIGHT / 2);
    context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - THIN_SMALL_HALF_DIAGONAL);
    context.lineTo(CANVAS_WIDTH / 2 + THIN_BIG_HALF_DIAGONAL, CANVAS_HEIGHT / 2);
    context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + THIN_SMALL_HALF_DIAGONAL);
    context.lineTo(CANVAS_WIDTH / 2 - THIN_BIG_HALF_DIAGONAL, CANVAS_HEIGHT / 2);
    context.strokeStyle = 'black';
    context.stroke();
    context.fillStyle = '#f99';
    context.fill();
}
function drawThickTile(context) {
    context.moveTo(CANVAS_WIDTH / 2 - THICK_BIG_HALF_DIAGONAL, CANVAS_HEIGHT / 2);
    context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - THICK_SMALL_HALF_DIAGONAL);
    context.lineTo(CANVAS_WIDTH / 2 + THICK_BIG_HALF_DIAGONAL, CANVAS_HEIGHT / 2);
    context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + THICK_SMALL_HALF_DIAGONAL);
    context.lineTo(CANVAS_WIDTH / 2 - THICK_BIG_HALF_DIAGONAL, CANVAS_HEIGHT / 2);
    context.strokeStyle = 'black';
    context.stroke();
    context.fillStyle = '#99f';
    context.fill();
}

const thinCanvas = document.getElementById('thin');
const thickCanvas = document.getElementById('thick');

drawThinTile(thinCanvas.getContext('2d'));
drawThickTile(thickCanvas.getContext('2d'));

document.onmousemove = e => {
    if (!e.buttons) return;
    const x = e.movementX;
    const y = e.movementY;
    if (current) {
        current.data.x += x;
        current.data.y += y;
        current.style.top = current.data.y + 'px';
        current.style.left = current.data.x + 'px';
    } else {
        for (const img of document.querySelectorAll('img')) {
            img.data.x += x;
            img.data.y += y;
            img.style.top = img.data.y + 'px';
            img.style.left = img.data.x + 'px';
        }
    }
}

let current = null;

document.ondblclick = e => {
    current = null;
    console.log('Free!');
}

document.onwheel = e => {
    if (e.deltaY < 0) {
        if (current) {
            current.data.angle += 18;
            current.style.transform = `rotate(${current.data.angle}deg)`;
        } else {
            for (const img of document.querySelectorAll('img')) {
                img.data.angle += 18;
                img.style.transform = `rotate(${current.data.angle}deg)`;
            }
        }
    } else {
        if (current) {
            current.data.angle -= 18;
            current.style.transform = `rotate(${current.data.angle}deg)`;
        } else {
            for (const img of document.querySelectorAll('img')) {
                img.data.angle -= 18;
                img.style.transform = `rotate(${current.data.angle}deg)`;
            }
        }
    }
}



for(const canvas of document.querySelectorAll('canvas')) {
    canvas.onmousedown = e => {
        e.preventDefault();
        const img = document.createElement('img');
        img.style.top = canvas.offsetTop;
        img.style.left = canvas.offsetLeft;
        img.style.width = CANVAS_WIDTH;
        img.style.height = CANVAS_HEIGHT;
        img.src = canvas.toDataURL('image/png');
        img.data = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop,
            angle: 0,
        };
        document.body.appendChild(img);
        current = img;
        img.onmousedown = e2 => {
            e2.preventDefault();
            current = img;
        }
    }
}



class Random {
    seed;

    constructor(seed = 420) {
        this.seed = seed;
    }

    _random() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    next() {
        return this._random();
    }

    nextInRange(a, b) {
        if (a >= b) {
            throw new Error('Invalid range: a must be less than b');
        }
        return a + (this._random() * (b - a));
    }
}


let rnd = new Random();
