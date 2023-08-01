'use strict';

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {number} speed (horizontal moving). Px/s
 * @param {number} parallax (vertical moving). Coefficient
 */
function generateSmartBackground(div, speed = 10, parallax = .5, thinColor, thickColor) {
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
    
    const ONE = 50;
    const SHIFT_MULT = 1;
    const LINES_DIST = 2.5;
    const FILL_STOCK = 3;
    const shifts = generateShifts(5);

    let width
    let screenWidth;
    let height;
    const startedMillis = Date.now();
    let lastMillis = startedMillis;
    const getCurrentShift = (currentMillis) => {
        const millisDelta = currentMillis - startedMillis;
        const px = speed * (millisDelta / 1000); // (px/sec) * (ms / (ms/s));
        return px;
    }

    function prepareDiv() {
        div.style.position = 'fixed';
        div.style.top = '0px';
        div.style.left = '0px';
        window.addEventListener('resize', e => {
            resizeDiv();
        });
        document.addEventListener('scroll', e => {
            div.style.top = (-document.documentElement.scrollTop * parallax) + 'px';
        });
    }
    function resizeDiv() {
        const screenHeight = document.documentElement.clientHeight;
        const contentHeight = document.body.clientHeight;
        screenWidth = document.body.clientWidth;
        if (screenHeight >= contentHeight) {
            // No parallax
            height = screenHeight;
        } else {
            height = screenHeight + (contentHeight - screenHeight) * parallax;
        }
        width = screenWidth * 2;
        div.style.width = width + 'px';
        div.style.height = height + 'px';

        const imgShift = getCurrentShift(Date.now());
        const img = getImageForPx(imgShift, width, height);
        img.data = {
            width, 
            height,
            shift: imgShift,
            top: 0,
            left: 0,
        }
        img.style.position = 'absolute';
        img.style.top = '0px';
        img.style.left = '0px';

        div.innerHTML = '';
        div.appendChild(img);

    }
    prepareDiv();
    resizeDiv();



    function createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        return canvas;
    }

    /**
     * All in PX
     */
    function convertPoint(x, y, canvasWidth, canvasHeight, canvasShiftX) {
        // center is in left top point. X goest to left, Y goes down
        x = map(x, canvasShiftX / ONE, (canvasShiftX + canvasWidth)/ONE, 0, canvasWidth);
        y = map(y, 0, canvasHeight/ONE, 0, canvasHeight);

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

    function generateRhonbusFromPoint(point, context, canvasWidth, canvasHeight, canvasShiftX) {
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

        const pixelPoints = points.map(p => convertPoint(p.x, p.y, canvasWidth, canvasHeight, canvasShiftX));

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

    function fillRect(minX, maxX, minY, maxY, canvas, width, height, canvasShiftX) {
        const caanvasContext = canvas.getContext('2d');

        const intersectionPoints = getAllIntersectionPoints(
            minX - FILL_STOCK,
            maxX + FILL_STOCK,
            minY - FILL_STOCK,
            maxY + FILL_STOCK,
        );

        for (const point of intersectionPoints) {
            generateRhonbusFromPoint(point, caanvasContext, width, height, canvasShiftX);
        }
    }

    function getImageForPx(xPx, width, height) {
        console.log('newImage');
        const xUnitsStart = xPx / ONE;
        const xUnitsEnd = (xPx + width) / ONE;
        const yUnitsStart = 0;
        const yUnitsEnd = height / ONE;

        const canvas = createCanvas(width, height);
        div.appendChild(canvas);
        fillRect(xUnitsStart, xUnitsEnd, yUnitsStart, yUnitsEnd, canvas, width, height, xPx);
        const img = document.createElement('img');
        img.width = width;
        img.height = height;
        img.src = canvas.toDataURL('image/png');
        canvas.remove();
        return img;
    }

    

    function onAnimation() {
        const currentMillis = Date.now();
        const delta = currentMillis - lastMillis;
        const deltaPx = speed * (delta / 1000);
        lastMillis = currentMillis;

        // Check an image to add
        const lastImage = div.lastChild;
        if (!lastImage || lastImage.data.left < 0) {
            const imgShift = getCurrentShift(currentMillis);
            const img = getImageForPx(imgShift, width, height);
            img.data = {
                width, 
                height,
                shift: imgShift,
                top: 0,
                left: (lastImage ? (lastImage.data.left + lastImage.data.width) : 0),
            }
            img.style.position = 'absolute';
            img.style.top = '0px';
            img.style.left = img.data.left + 'px';

            div.appendChild(img);
        }
        
        // Check an image to delete
        const firstImage = div.firstChild;
        if (firstImage.data.left + firstImage.data.width < 0) {
            firstImage.remove();
        }

        // move all the images
        for (const img of div.children) {
            img.data.left -= deltaPx;
            img.style.left = img.data.left + 'px';
        }

        console.log(!!firstImage, !!lastImage);
        window.requestAnimationFrame(onAnimation);
    }
    window.requestAnimationFrame(onAnimation);
}


// generateSmartBackground(document.getElementById('background'), 0, 2, 'black', 'rgba(0, 0, 0, 0');
generateSmartBackground(document.getElementById('background'), 300, .5, '#f99', '#99f');
