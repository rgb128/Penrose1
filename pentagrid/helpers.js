'use strict';


const SVG_NS = 'http://www.w3.org/2000/svg';

function map(num, frombottom, fromtop, tobottom, totop) {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}

/**
 * 
 * @param {number} iFrom Including 
 * @param {number} iTo Including
 * @param {*} func 
 */
function mathSum(iFrom, iTo, func) {
    let sum = 0;
    for (let i = iFrom; i <= iTo; i++) {
        sum += func(i);
    }
    return sum;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}
function radToDeg(rad) {
    return rad / Math.PI * 180;
}

function rotateVectorClockwise(x, y, angle) {
    angle = degToRad(-angle);
    return rotateVectorClockwiseBySinAndCos(x, y, Math.sin(angle), Math.cos(angle))
}
function rotateVectorClockwiseBySinAndCos(x, y, sin, cos) {
    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;
    return {
        x: newX,
        y: newY,
    }
}

function rotatePointAroundPoint(pointToRotate, staticPoint, angleDeg) {
    const ox = pointToRotate.x - staticPoint.x;
    const oy = pointToRotate.y - staticPoint.y;

    const rotated = rotateVectorClockwise(ox, oy, angleDeg);

    return {
        x: rotated.x + staticPoint.x,
        y: rotated.y + staticPoint.y,
    }
}
function rotatePointAroundPointBySinAndCos(pointToRotate, staticPoint, sin, cos) {
    const ox = pointToRotate.x - staticPoint.x;
    const oy = pointToRotate.y - staticPoint.y;

    const rotated = rotateVectorClockwiseBySinAndCos(ox, oy, sin, cos);

    return {
        x: rotated.x + staticPoint.x,
        y: rotated.y + staticPoint.y,
    }
}

function drawLine(x1, y1, x2, y2, color = 'green', strokeWidth = 1) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.style.stroke = color;
    line.style.strokeWidth = strokeWidth;
    absSvg.appendChild(line);
}

