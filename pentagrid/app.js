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

const MULTIPLIER_1 = 100;


function generateFamilyOfLines(shifts, familySize, familyWidth, lineLength) {
    for (let i = 0; i < shifts.length; i++) {
        const angle = 360 / shifts.length * i;
        for (let il = 0; il < (familySize / 2); il++) {
            function drawLineWithY(y, lineNumber) {
                const x1src = -lineLength / 2;
                const x2src = lineLength / 2;
                const rotated1 = rotateVectorClockwise(x1src, y, angle);
                const rotated2 = rotateVectorClockwise(x2src, y, angle);
                
                const x1 = rotated1.x + shifts[i][0] * MULTIPLIER_1;
                const y1 = rotated1.y + shifts[i][1] * MULTIPLIER_1;
                const x2 = rotated2.x + shifts[i][0] * MULTIPLIER_1;
                const y2 = rotated2.y + shifts[i][1] * MULTIPLIER_1;
                
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
                        (shifts[i][0] * MULTIPLIER_1), 
                        (shifts[i][1] * MULTIPLIER_1),
                    ], 
                    angle,
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
        lines.push([x, y]);
    }
    return lines;
}

generateFamilyOfLines(
    generateShifts(5), 
    5, 
    200, 
    1500
);


const checkedPairs = [];
function linesWereChecked(line1, line2) {
    return !!checkedPairs.find(x => (x[0] === line1 && x[1] === line2) || (x[0] === line2 && x[1] === line1));
}

function checkIntersections() {
    //todo refactor somehow
    for (const line1 of allLines) {
        for (const line2 of allLines) {
            if (
                line1 === line2 ||
                linesWereChecked(line1, line2)
            ) {
                continue;
            }
            const intersection = line_intersect(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1, line2.x2, line2.y2);
            if (!intersection?.intersect) continue;
            checkedPairs.push([line1, line2]);

            const color = `hsla(${map(Math.random(), 0, 1, 0, 360)}, 100%, 50%, .5)`;
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('cx', intersection.x);
            circle.setAttribute('cy', intersection.y);
            circle.setAttribute('r', '10');
            circle.style.fill = color;
            circle.style.strokeWidth = '0';
            absSvg.appendChild(circle);
        }
    }
}
checkIntersections();   



