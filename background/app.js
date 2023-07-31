'use strict';

const canvas = document.getElementById('canvas');




/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {number} speed (horizontal moving). Px/s
 * @param {number} parallax (vertical moving). Coefficient
 */
function generateSmartBackground(canvas, speed = 10, parallax = .5, thinColor, thickColor) {
    const context = canvas.getContext('2d');
    
    const ONE = 50;
    const SHIFT_MULT = 1;
    const LINES_DIST = 2.5;
    let canvasWidth = 1000;
    let canvasHeight = 1000;
    const FILL_STOCK = 3;

    const prepareCanvas = () => {
        if (document.documentElement.clientHeight >= document.body.clientHeight) {
            // No parallax
            canvasHeight = document.documentElement.clientHeight;
        } else {
            canvasHeight = document.documentElement.clientHeight + (document.body.clientHeight - document.documentElement.clientHeight) * parallax;
        }
        canvasWidth = document.documentElement.clientWidth * 3;
        canvas.style.height = canvasHeight + 'px';
        canvas.style.width = canvasWidth + 'px';
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.position = 'fixed';
    }
    prepareCanvas();


    function convertPoint(x, y) {
        // Make normal center
        // center is in left center point
        x = map(x, 0, canvasWidth/ONE, 0, canvasWidth);
        y = map(y, canvasHeight/ONE/2, -canvasHeight/ONE/2, 0, canvasHeight);

        return { x, y };
    }

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
    
    function lengthOfLineSegment(point1, point2) {
        function pow2(x) {
            return x * x;
        }
        return Math.sqrt(pow2(point1.x - point2.x) + pow2(point1.y - point2.y));
    }

    function generateShifts(count) {
        const res = [ 0 ];
        let sum = 0;
        for (let i = 0; i < count - 2; i++) {
            const s = map(Math.random(), 0, 1, -SHIFT_MULT, SHIFT_MULT);
            sum += s;
            res.push(s);
        }
        res.push(-sum);
        return res;
    }

    const shifts = generateShifts(5);

    function getIntersectionPoint(line1Family, line1Number, line2Family, line2Number) {
        //y=kx+b. b is shift
        const k1 = Math.tan(line1Family * 2 * Math.PI / 5);
        const k2 = Math.tan(line2Family * 2 * Math.PI / 5);
        const b1 = (shifts[line1Family] + line1Number) * LINES_DIST / Math.cos(line1Family * 2 * Math.PI / 5);
        const b2 = (shifts[line2Family] + line2Number) * LINES_DIST / Math.cos(line2Family * 2 * Math.PI / 5);

        const x = (b2 - b1) / (k1 - k2);
        const y = k1 * x + b1;
        const y2 = k2 * x + b2;
        if (Math.abs(y - y2) > .001) {
            console.error('bad formula');
        }

        return { x, y };
    }

    function findSectionOnLineFamily(lineFamily, x, y) {
        const float = (y - Math.tan(lineFamily * 2 * Math.PI / 5) * x) * Math.cos(lineFamily * 2 * Math.PI / 5) / LINES_DIST - shifts[lineFamily];

        return Math.floor(float);
    }

    function getIntersectionPoints(minX, maxX, minY, maxY, line1Family, line2Family) {
        const line1Number = findSectionOnLineFamily(line1Family, (minX + maxX) / 2, (minY + maxY) / 2);
        const line2Number = findSectionOnLineFamily(line2Family, (minX + maxX) / 2, (minY + maxY) / 2);
        const points = [];

        const goFromPoint = (l1N, l2N) => {
            if (points.find(a => a.line1Number === l1N && a.line2Number === l2N)) return;
            const point = getIntersectionPoint(line1Family, l1N, line2Family, l2N);
            if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) return;
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

        return points;
    }

    function getAllIntersectionPoints(minX, maxX, minY, maxY) {
        const result = [];
        for(let i = 0; i < 5; i++) {
            for(let j = i + 1; j < 5; j++) {
                result.push(...getIntersectionPoints(minX, maxX, minY, maxY, i, j));
            }
        }
        return result;
    }

    function generateRhonbusFromPoint(point) {
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
        
        const vertex1X = mathSum(0, 4, j => k1[j] * -Math.sin(2 * Math.PI * j / 5));
        const vertex1Y = mathSum(0, 4, j => k1[j] * Math.cos(2 * Math.PI * j / 5));

        const vertex2X = mathSum(0, 4, j => k2[j] * -Math.sin(2 * Math.PI * j / 5));
        const vertex2Y = mathSum(0, 4, j => k2[j] * Math.cos(2 * Math.PI * j / 5));
        
        const vertex3X = mathSum(0, 4, j => k3[j] * -Math.sin(2 * Math.PI * j / 5));
        const vertex3Y = mathSum(0, 4, j => k3[j] * Math.cos(2 * Math.PI * j / 5));
        
        const vertex4X = mathSum(0, 4, j => k4[j] * -Math.sin(2 * Math.PI * j / 5));
        const vertex4Y = mathSum(0, 4, j => k4[j] * Math.cos(2 * Math.PI * j / 5));

        const points = [
            { x: vertex1X, y: vertex1Y },
            { x: vertex2X, y: vertex2Y },
            { x: vertex3X, y: vertex3Y },
            { x: vertex4X, y: vertex4Y },
        ];

        const pixelPoints = points.map(p => convertPoint(p.x, p.y));

        context.beginPath();
        context.moveTo(pixelPoints[0].x, pixelPoints[0].y);
        context.lineTo(pixelPoints[1].x, pixelPoints[1].y);
        context.lineTo(pixelPoints[2].x, pixelPoints[2].y);
        context.lineTo(pixelPoints[3].x, pixelPoints[3].y);
        context.lineTo(pixelPoints[0].x, pixelPoints[0].y);
        // context.stroke();

        const isRhombusThin = lengthOfLineSegment(points[0], points[2]) < lengthOfLineSegment(points[1], points[3]);
        if (isRhombusThin) context.fillStyle = thinColor;
        else context.fillStyle = thickColor;

        context.fill();
    }

    function fillRect(minX, maxX, minY, maxY) {
        getAllIntersectionPoints(
            minX - FILL_STOCK,
            maxX + FILL_STOCK,
            minY - FILL_STOCK,
            maxY + FILL_STOCK,
        )
        .map(generateRhonbusFromPoint);
    }

    fillRect(0, canvasWidth/ONE*3, -canvasHeight/ONE/2, canvasHeight/ONE/2);
}


generateSmartBackground(canvas, 0, 2, 'black', 'rgba(0, 0, 0, 0');
