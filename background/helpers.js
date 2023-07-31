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

function rotateVector(x, y, angle) {
    // angle = degToRad(-angle);
    return rotateVectorBySinAndCos(x, y, Math.sin(angle), Math.cos(angle))
}
function rotateVectorBySinAndCos(x, y, sin, cos) {
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

    const rotated = rotateVector(ox, oy, angleDeg);

    return {
        x: rotated.x + staticPoint.x,
        y: rotated.y + staticPoint.y,
    }
}
function rotatePointAroundPointBySinAndCos(pointToRotate, staticPoint, sin, cos) {
    const ox = pointToRotate.x - staticPoint.x;
    const oy = pointToRotate.y - staticPoint.y;

    const rotated = rotateVectorBySinAndCos(ox, oy, sin, cos);

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

function pow2(x) {
    return x * x;
}

function lengthOfLineSegment(point1, point2) {
    return Math.sqrt(pow2(point1.x - point2.x) + pow2(point1.y - point2.y));
}

function multiplyPointByScalarRelativelyToPoint(originPoint, point, scalar) {
    const x = (point.x - originPoint.x) * scalar;
    const y = (point.y - originPoint.y) * scalar;
    return {
        x: originPoint.x + x,
        y: originPoint.y + y,
    };
}
