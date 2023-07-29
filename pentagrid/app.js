'use strict';

const absSvgLines = document.getElementById('absSvgOriginLines');
const absSvgTiles = document.getElementById('absSvgOriginTiles');
window.tilesContainer = document.getElementById('main');

const allLines = [];
const allRhomuses = [];

const ANGLE_SHIFT = 90;

const colors = [
    'green',
    'red',
    'blue',
    'magenta',
    'gray',
];

const THIN_RHOMBUS_FILL = 'black';
const THICK_RHOMBUS_FILL = 'white';

const MULTIPLIER_1 = 50; // it's basically, 1 unit (and size of a side of a rhombus)


function generateFamilyOfLines(shifts, familySize, familyWidth, lineLength) {
    for (let i = 0; i < shifts.length; i++) {
        const angle = 360 / shifts.length * i + ANGLE_SHIFT;
        for (let il = 0; il < (familySize / 2); il++) {
            function drawLineWithY(y, lineNumber) {
                const x1src = -lineLength / 2;
                const x2src = lineLength / 2;
                const rotated1 = rotateVectorClockwise(x1src + shifts[i][0], y + shifts[i][1], angle);
                const rotated2 = rotateVectorClockwise(x2src + shifts[i][0], y + shifts[i][1], angle);
                
                const x1 = rotated1.x;
                const y1 = rotated1.y;
                const x2 = rotated2.x;
                const y2 = rotated2.y;
                
                drawLine(
                    x1,
                    y1,
                    x2,
                    y2,
                    colors[i % colors.length],
                );
                allLines.push({ 
                    x1, 
                    y1, 
                    x2, 
                    y2, 
                    shift: [
                        (shifts[i][0]), 
                        (shifts[i][1]),
                    ], 
                    angle,
                    lineFamily: i,
                    lineNumber,
                });
            }
            if (il === 0) {
                drawLineWithY(0, 0);
            } else {
                drawLineWithY(-familyWidth * il, -il);
                drawLineWithY(familyWidth * il, il);
            }
        }
    }
}

function generateShifts(count) {
    const lines = [ [0, 0] ];
    let xSum = 0;
    let ySum = 0;
    for (let i = 0; i < count - 2; i++) {
        const x = 0;
        const y = map(Math.random(), 0, 1, -MULTIPLIER_1, MULTIPLIER_1);
        xSum += x;
        ySum += y;
        lines.push([x, y]);
    }
    lines.push([-xSum, -ySum]);
    return lines;
}

const shifts = generateShifts(5);
const LINES_DIST = MULTIPLIER_1 * 2.5; // ??

generateFamilyOfLines(
    shifts, 
    17, 
    LINES_DIST, 
    10000,
);


const checkedPairs = [];
function linesWereChecked(line1, line2) {
    return !!checkedPairs.find(x => (x[0] === line1 && x[1] === line2) || (x[0] === line2 && x[1] === line1));
}

function findSectionOnLineFamily(lineFamily, x, y) {

    const rotated = rotateVectorClockwise(x, y, -lineFamily*(360 / 5) - ANGLE_SHIFT);
    const res = Math.floor((rotated.y - shifts[lineFamily][1]) / LINES_DIST);
    return res;
}

function drawAllLines(vertexes) {
    for (let i = 0; i < vertexes.length; i++) {
        for(let j = i + 1; j < vertexes.length; j++) {
            const v1 = vertexes[i];
            const v2 = vertexes[j];
            drawLine(v1.x, v1.y, v2.x, v2.y, 'black', 5);
        }
    }
}

function checkIntersections() {
    for (let i1 = 0; i1 < allLines.length; i1++) {
        const line1 = allLines[i1];
        for (let i2 = i1 + 1; i2 < allLines.length; i2++) {
            const line2 = allLines[i2];
            const intersection = line_intersect(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1, line2.x2, line2.y2);
            if (!(intersection?.intersect)) continue;
            checkedPairs.push([line1, line2]);

            const color = `hsla(${map(Math.random(), 0, 1, 0, 360)}, 100%, 50%, .5)`;
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('cx', intersection.x);
            circle.setAttribute('cy', intersection.y);
            circle.setAttribute('r', '3');
            circle.style.fill = color;
            circle.style.strokeWidth = '0';
            absSvgLines.appendChild(circle);

            circle.data = {
                line1,
                line2,
            };

            const generateRhombus = () => {
                const defaultK = [0, 1, 2, 3, 4].map(a => findSectionOnLineFamily(a, intersection.x, intersection.y));

                const k1 = [...defaultK];
                const k2 = [...defaultK];
                const k3 = [...defaultK];
                const k4 = [...defaultK];

                k1[line1.lineFamily] = line1.lineNumber - 1;
                k2[line1.lineFamily] = line1.lineNumber - 1;
                k3[line1.lineFamily] = line1.lineNumber;
                k4[line1.lineFamily] = line1.lineNumber;

                k1[line2.lineFamily] = line2.lineNumber - 1;
                k2[line2.lineFamily] = line2.lineNumber;
                k3[line2.lineFamily] = line2.lineNumber;
                k4[line2.lineFamily] = line2.lineNumber - 1;
                
                const vertex1X = mathSum(0, 4, j => k1[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex1Y = -mathSum(0, 4, j => k1[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;

                const vertex2X = mathSum(0, 4, j => k2[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex2Y = -mathSum(0, 4, j => k2[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                
                const vertex3X = mathSum(0, 4, j => k3[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex3Y = -mathSum(0, 4, j => k3[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                
                const vertex4X = mathSum(0, 4, j => k4[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex4Y = -mathSum(0, 4, j => k4[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;

                const points = [
                    { x: vertex1X, y: vertex1Y },
                    { x: vertex2X, y: vertex2Y },
                    { x: vertex3X, y: vertex3Y },
                    { x: vertex4X, y: vertex4Y },
                ];

                // drawAllLines(points);

                // drawLine(points[0].x, points[0].y, points[2].x, points[2].y, 'red', 3); // Short diagonal in thin, long in thick
                // drawLine(points[1].x, points[1].y, points[3].x, points[3].y, 'green', 3); // Long diagonal in thin, short in thick
                const isRhombusThin = lengthOfLineSegment(points[0], points[2]) < lengthOfLineSegment(points[1], points[3]);

                const polygon = document.createElementNS(SVG_NS, 'polygon');
                polygon.setAttribute('points', points.map(a => `${a.x},${a.y}`).join(' '));
                polygon.style.fill = isRhombusThin ? THIN_RHOMBUS_FILL : THICK_RHOMBUS_FILL;
                polygon.style.stroke = 'black';
                polygon.style.strokeWidth = 3;
                absSvgTiles.appendChild(polygon);
                polygon.data = {
                    points,
                    realPoints: [...points],
                    k1,
                    k2,
                    k3,
                    k4,
                    line1family: line1.lineFamily,
                    line1number: line1.lineNumber,
                    line2family: line2.lineFamily,
                    line2number: line2.lineNumber,
                    intersection,
                    intersectionPoint: {
                        x: intersection.x,
                        y: intersection.y,
                    },
                };
                allRhomuses.push(polygon);
            }
            generateRhombus();
        }
    }
}
checkIntersections();   


document.getElementById('slider1').oninput = e => {
    const value = +document.getElementById('slider1').value;
    window.localStorage['slider1'] = value;
    for (const rhombus of allRhomuses) {
        rhombus.data.realPoints = rhombus.data.points.map(a => multiplyPointByScalarRelativelyToPoint(rhombus.data.intersectionPoint, a, value));
        rhombus.setAttribute('points', rhombus.data.realPoints.map(a => `${a.x},${a.y}`).join(' '));
    }
}

document.getElementById('slider1').value = window.localStorage['slider1'] || 1;
document.getElementById('slider1').oninput();

setTimeout(() => {
    window.location.reload();
}, 500);
