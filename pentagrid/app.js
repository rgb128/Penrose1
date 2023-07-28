'use strict';

const absSvg = document.getElementById('absSvgOrigin');
window.tilesContainer = document.getElementById('main');

const allLines = [];

const colors = [
    'green',
    'red',
    'blue',
    'magenta',
    'gray',
];

const MULTIPLIER_1 = 1; // it's basically, 1 unit


function generateFamilyOfLines(shifts, familySize, familyWidth, lineLength) {
    for (let i = 0; i < shifts.length; i++) {
        const angle = 360 / shifts.length * i;
        for (let il = 0; il < (familySize / 2); il++) {
            function drawLineWithY(y, lineNumber) {
                const x1src = -lineLength / 2;
                const x2src = lineLength / 2;
                const rotated1 = rotateVectorClockwise(x1src, y, angle);
                const rotated2 = rotateVectorClockwise(x2src, y, angle);
                
                const x1 = rotated1.x + shifts[i][0];
                const y1 = rotated1.y + shifts[i][1];
                const x2 = rotated2.x + shifts[i][0];
                const y2 = rotated2.y + shifts[i][1];
                
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
    const lines = [];
    for (let i = 0; i < count; i++) {
        const x = map(Math.random(), 0, 1, -1, 1);
        const y = map(Math.random(), 0, 1, -1, 1);
        lines.push([x * MULTIPLIER_1, y * MULTIPLIER_1]);
    }
    return lines;
}

const shifts = generateShifts(5);
const LINES_DIST = 1;

generateFamilyOfLines(
    shifts, 
    3, 
    LINES_DIST, 
    10
);


const checkedPairs = [];
function linesWereChecked(line1, line2) {
    return !!checkedPairs.find(x => (x[0] === line1 && x[1] === line2) || (x[0] === line2 && x[1] === line1));
}

function findSectionOnLineFamily(lineFamily, x, y) {

    x -= shifts[lineFamily][0];
    y -= shifts[lineFamily][1];
    const rotated = rotateVectorClockwise(x, y, -lineFamily*72); //todo refactor
    const res = Math.floor(rotated.y / LINES_DIST);
    return res;
}

function drawAllLines(vertexes) {
    for (let i = 0; i < vertexes.length; i++) {
        for(let j = i + 1; j < vertexes.length; j++) {
            const v1 = vertexes[i];
            const v2 = vertexes[j];
            drawLine(v1.x, v1.y, v2.x, v2.y, 'black', .1);
        }
    }
}

function checkIntersections() {
    //todo refactor somehow
    for (let i1 = 0; i1 < allLines.length; i1++) {
        const line1 = allLines[i1];
        for (let i2 = i1 + 1; i2 < allLines.length; i2++) {
            const line2 = allLines[i2];
            // if (
            //     line1 === line2 ||
            //     linesWereChecked(line1, line2)
            // ) {
            //     continue;
            // }
            const intersection = line_intersect(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1, line2.x2, line2.y2);
            if (!(intersection?.intersect)) continue;
            checkedPairs.push([line1, line2]);

            const color = `hsla(${map(Math.random(), 0, 1, 0, 360)}, 100%, 50%, .5)`;
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('cx', intersection.x);
            circle.setAttribute('cy', intersection.y);
            circle.setAttribute('r', '.1');
            circle.style.fill = color;
            circle.style.strokeWidth = '0';
            absSvg.appendChild(circle);

            circle.data = {
                line1,
                line2,
            };

            circle.onclick = e => {
                console.log(line1, line2);
                const defaultK = [0, 1, 2, 3, 4].map(x => findSectionOnLineFamily(x, intersection.x, intersection.y));

                const k1 = [...defaultK];
                const k2 = [...defaultK];
                const k3 = [...defaultK];
                const k4 = [...defaultK];

                k1[line1.lineFamily] = line1.lineNumber + 1;
                k2[line1.lineFamily] = line1.lineNumber + 1;
                k3[line1.lineFamily] = line1.lineNumber;
                k4[line1.lineFamily] = line1.lineNumber;

                k1[line2.lineFamily] = line2.lineNumber;
                k2[line2.lineFamily] = line2.lineNumber + 1;
                k3[line2.lineFamily] = line2.lineNumber + 1;
                k4[line2.lineFamily] = line2.lineNumber;

                // console.log('line1.lineFamily', line1.lineFamily);
                // console.log('line1.lineNumber', line1.lineNumber);
                // console.log('line2.lineFamily', line2.lineFamily);
                // console.log('line2.lineNumber', line2.lineNumber);

                // console.log(k1, k2, k4, k4);

                // const vertex1X = mathSum(0, 4, j => k1[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                // const vertex1Y = mathSum(0, 4, j => k1[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;

                // const vertex2X = mathSum(0, 4, j => k2[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                // const vertex2Y = mathSum(0, 4, j => k2[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                
                // const vertex3X = mathSum(0, 4, j => k3[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                // const vertex3Y = mathSum(0, 4, j => k3[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                
                // const vertex4X = mathSum(0, 4, j => k4[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                // const vertex4Y = mathSum(0, 4, j => k4[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;

                
                const vertex1X = mathSum(0, 4, j => k1[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex1Y = mathSum(0, 4, j => k1[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;

                const vertex2X = mathSum(0, 4, j => k2[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex2Y = mathSum(0, 4, j => k2[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                
                const vertex3X = mathSum(0, 4, j => k3[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex3Y = mathSum(0, 4, j => k3[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                
                const vertex4X = mathSum(0, 4, j => k4[j] * Math.cos(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                const vertex4Y = mathSum(0, 4, j => k4[j] * Math.sin(2 * Math.PI * j / 5)) * MULTIPLIER_1;
                
                drawAllLines([
                    { x: vertex1X, y: vertex1Y },
                    { x: vertex2X, y: vertex2Y },
                    { x: vertex3X, y: vertex3Y },
                    { x: vertex4X, y: vertex4Y },
                ]);
            }

            if (
                (line1.lineFamily === 0 && line1.lineNumber === 0)
            ) {
                circle.onclick();
            }
        }
    }
}
checkIntersections();   




const mouseCircle = document.createElementNS(SVG_NS, 'circle');
mouseCircle.setAttribute('r', '20');
mouseCircle.style.fill = 'red';
mouseCircle.style.strokeWidth = '0';
// absSvg.appendChild(mouseCircle);


document.onmousemove = e => {
    const x = e.x - document.documentElement.clientWidth / 2;
    const y = e.y - document.documentElement.clientHeight / 2;
    mouseCircle.setAttribute('cx', x);
    mouseCircle.setAttribute('cy', y);
    // console * MULTIPLIER_1 + intersection.x0, 1, 2, 3, 4].map(a => findSectionOnLineFamily(a, x, y)));
};

