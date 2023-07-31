'use strict';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const ONE = 100;
const SHIFT_MULT = 1;
const LINES_DIST = 1;

function generateShifts(count) {
    const lines = [ [0, 0] ];
    // const lines = [ ];
    let xSum = 0;
    let ySum = 0;
    for (let i = 0; i < count - 2; i++) {
        const x = 0;
        const y = map(Math.random(), 0, 1, -SHIFT_MULT, SHIFT_MULT);
        xSum += x;
        ySum += y;
        lines.push([x, y]);
    }
    lines.push([-xSum, -ySum]);
    return lines;
}

const shifts = generateShifts(5);

function getIntersectionPoint(line1Family, line1Number, line2Family, line2Number) {
    //y=kx+b. b is shift
    const k1 = Math.tan(degToRad(line1Family * 360 / 5));
    const k2 = Math.tan(degToRad(line2Family * 360 / 5));
    // const b1 = shifts[line1Family][1] + line1Number * LINES_DIST / Math.cos(degToRad(line1Family * 360 / 5));
    // const b2 = shifts[line2Family][1] + line2Number * LINES_DIST / Math.cos(degToRad(line2Family * 360 / 5));
    const b1 = (shifts[line1Family][1] + line1Number) * LINES_DIST / Math.cos(degToRad(line1Family * 360 / 5));
    const b2 = (shifts[line2Family][1] + line2Number) * LINES_DIST / Math.cos(degToRad(line2Family * 360 / 5));

    const x = (b2 - b1) / (k1 - k2);
    const y = k1 * x + b1;
    const y2 = k2 * x + b2;
    if (Math.abs(y - y2) > .001) {
        console.error('bad formula');
    }

    return { x, y };
}

function findSectionOnLineFamily(lineFamily, x, y) {
    // const float = (y - Math.tan(degToRad(lineFamily * 360 / 5)) * x + shifts[lineFamily][1]) * Math.cos(degToRad(lineFamily * 360 / 5)) / LINES_DIST;
    const float = (y - Math.tan(degToRad(lineFamily * 360 / 5)) * x) * Math.cos(degToRad(lineFamily * 360 / 5)) / LINES_DIST - shifts[lineFamily][1];

    return Math.floor(float);
}

function getIntersectionPoints(start, end, line1Family, line2Family) {
    // const line1Number = findSectionOnLineFamily(line1Family, (start.x + end.x) / 2, (start.y + end.y) / 2);
    // const line2Number = findSectionOnLineFamily(line2Family, (start.x + end.x) / 2, (start.y + end.y) / 2);
    const line1Number = findSectionOnLineFamily(line1Family, start.x, start.y);
    const line2Number = findSectionOnLineFamily(line2Family, start.x, start.y);
    const points = [];

    // console.log('getIntersectionPoints', start, end, line1Family,line1Number, line2Family, line2Number);

    const goFromPoint = (l1N, l2N) => {
        if (points.find(a => a.line1Number === l1N && a.line2Number === l2N)) return;
        const point = getIntersectionPoint(line1Family, l1N, line2Family, l2N);
        // console.log(point);
        if (point.x < start.x || point.x > end.x || point.y < start.y || point.y > end.y) return;
        points.push({
            ...point,
            line1Family,
            line2Family,
            line1Number: l1N,
            line2Number: l2N,
        });
        goFromPoint(l1N - 1, l2N);
        goFromPoint(l1N + 1, l2N);
        goFromPoint(l1N, l2N - 1);
        goFromPoint(l1N, l2N + 1);
    }

    const max = 2;
    for (let i = -max; i <= max; i++) {
        for (let j = -max; j <= max; j++) {
            goFromPoint(line1Number + i, line2Number + j);
        }
    }

    // goFromPoint(line1Number, line2Number);

    return points;
}

function getAllIntersectionPoints(start, end) {
    const result = [];
    for(let i = 0; i < 5; i++) {
        for(let j = i + 1; j < 5; j++) {
            result.push(...getIntersectionPoints(start, end, i, j));
        }
    }
    return result;
}
// getIntersectionPoints({ x: 0, y: 0 }, { x: 10, y: 10 }, 0, 3).map(a => {
//     // console.log(a);
//     context.fillRect(a.x * ONE, a.y * ONE, 3, 3);
// });

let mult = 1;


const main = () => {
    context.clearRect(0, 0, 1000, 1000);
    const rhombuses = getAllIntersectionPoints({ x: -10, y: -10 }, { x: 10, y: 10 }).map(point => {
        // point.x += 10;
        // point.y += 10;
        // console.log(point);
        
        const generateRhombus = () => {
            const defaultK = [0, 1, 2, 3, 4].map(a => findSectionOnLineFamily(a, point.x, point.y));
    
            const k1 = [...defaultK];
            const k2 = [...defaultK];
            const k3 = [...defaultK];
            const k4 = [...defaultK];
    
            k1[point.line1Family] = point.line1Number - 1;
            k2[point.line1Family] = point.line1Number - 1;
            k3[point.line1Family] = point.line1Number;
            k4[point.line1Family] = point.line1Number;
    
            k1[point.line2Family] = point.line2Number - 1;
            k2[point.line2Family] = point.line2Number;
            k3[point.line2Family] = point.line2Number;
            k4[point.line2Family] = point.line2Number - 1;
            
            const vertex1X = mathSum(0, 4, j => k1[j] * Math.cos(2 * Math.PI * j / 5)) + 10;
            const vertex1Y = mathSum(0, 4, j => k1[j] * Math.sin(2 * Math.PI * j / 5)) - 10;
    
            const vertex2X = mathSum(0, 4, j => k2[j] * Math.cos(2 * Math.PI * j / 5)) + 10;
            const vertex2Y = mathSum(0, 4, j => k2[j] * Math.sin(2 * Math.PI * j / 5)) - 10;
            
            const vertex3X = mathSum(0, 4, j => k3[j] * Math.cos(2 * Math.PI * j / 5)) + 10;
            const vertex3Y = mathSum(0, 4, j => k3[j] * Math.sin(2 * Math.PI * j / 5)) - 10;
            
            const vertex4X = mathSum(0, 4, j => k4[j] * Math.cos(2 * Math.PI * j / 5)) + 10;
            const vertex4Y = mathSum(0, 4, j => k4[j] * Math.sin(2 * Math.PI * j / 5)) - 10;
    
            const points = [
                { x: vertex1X, y: vertex1Y },
                { x: vertex2X, y: vertex2Y },
                { x: vertex3X, y: vertex3Y },
                { x: vertex4X, y: vertex4Y },
            ];
    
            const points2 = points.map(p => multiplyPointByScalarRelativelyToPoint(point, p, mult));
    
            context.beginPath();
            context.moveTo(points2[0].x * ONE, points2[0].y * -ONE);
            context.lineTo(points2[1].x * ONE, points2[1].y * -ONE);
            context.lineTo(points2[2].x * ONE, points2[2].y * -ONE);
            context.lineTo(points2[3].x * ONE, points2[3].y * -ONE);
            context.lineTo(points2[0].x * ONE, points2[0].y * -ONE);
            context.stroke();
    
            const isRhombusThin = lengthOfLineSegment(points[0], points[2]) < lengthOfLineSegment(points[1], points[3]);
            if (isRhombusThin) context.fillStyle = 'red';
            else context.fillStyle = 'blue';
    
            context.fill();
        }
        generateRhombus();
        // context.fillRect(point.x * ONE, point.y * ONE, 3, 3);
        // context.fillRect(point.x, point.y, 1, 1);
        return 0;
    });
}




// context.fillStyle = 'black';
// for(let lf = 0; lf <= 4; lf ++) {
//     for (let ln = -10; ln <= 10; ln++) {
//         const k1 = Math.tan(degToRad(lf * 360 / 5));
//         const b1 = shifts[lf][1] + ln * LINES_DIST / Math.cos(degToRad(lf * 360 / 5));
//         const func = x => k1*x + b1;
//         for(let x = 0; x <= 10; x += .01) {
//             const y = func(x);
//             context.fillRect(x * ONE, y * ONE, 2, 2);
//         }
//     }
// }

// canvas.onmousemove = e => {
//     const x = e.offsetX / ONE;
//     const y = e.offsetY / ONE;
//     console.log(findSectionOnLineFamily(0, x, y), findSectionOnLineFamily(1, x, y));
// }

// const m = -5;
// for (let i = 0; i < 10; i+=.1) {
//     for (let j = 0; j < 10; j+=.1) {
//         if (findSectionOnLineFamily(1, i, j) === m - 1) {
//             context.fillStyle = 'red';
//             context.fillRect(i * ONE, j * ONE, 3, 3);
//         }
//         if (findSectionOnLineFamily(1, i, j) === m) {
//             context.fillStyle = 'green';
//             context.fillRect(i * ONE, j * ONE, 3, 3);
//         }
//         if (findSectionOnLineFamily(1, i, j) === m + 1) {
//             context.fillStyle = 'blue';
//             context.fillRect(i * ONE, j * ONE, 3, 3);
//         }
//     }
    
// }

// const lf = 3;


document.getElementById('slider1').oninput = e => {
    const value = +document.getElementById('slider1').value;
    window.localStorage['slider1'] = value;
    mult = value;
    main();
}

document.getElementById('slider1').value = window.localStorage['slider1'] || 1;
document.getElementById('slider1').oninput();


