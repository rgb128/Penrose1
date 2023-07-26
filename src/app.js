'use strict';

const absSvg = document.getElementById('absSvg');
window.tilesContainer = document.getElementById('main');

// rotation is clockwise (??)

const SVG_NS = 'http://www.w3.org/2000/svg';
const TILE_SIZE = 500;
const PATTERN_SMALL_RADIUS = 50;
const STROKE_HALF = 1;
const INTERSECTION_MARGIN = 5;

const PATTERN_TRIANGLE_CENTER_DIST = 40;
const PATTERN_TRIANGLE_BASE_WIDTH = 15;
const PATTERN_TRIANGLE_HEIGHT = 10;
const PATTERN_CIRCLE_CENTER_DIST = 40;
const PATTERN_CIRCLE_RADIUS = 10;

const THIN_BIG_HALF_DIAGONAL_SIZE =    TILE_SIZE * Math.cos(degToRad(36 / 2));
const THIN_SMALL_HALF_DIAGONAL_SIZE =  TILE_SIZE * Math.sin(degToRad(36 / 2));
const THICK_BIG_HALF_DIAGONAL_SIZE =   TILE_SIZE * Math.cos(degToRad(72 / 2));
const THICK_SMALL_HALF_DIAGONAL_SIZE = TILE_SIZE * Math.sin(degToRad(72 / 2));


/**
 * @param {number} deg 
 * @returns {number}
 */
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function radToDeg(rad) {
    return rad / Math.PI * 180;
}

/**
 * Squares a
 * @param {number} a 
 * @returns {number}
 */
function sq(a) {
    return a * a;
}

function drawLine(x1, y1, x2, y2) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.style.stroke = 'green';
    line.style.strokeWidth = '3px';
    absSvg.appendChild(line);
}



/**
 * I guess, it rotates counter-clockwise
 * @param {number} x 
 * @param {number} y 
 * @param {number} angle In deg
 * @returns {Object} x and y 
 */
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

/** Draws clockwise */
function createCircleSector(cx, cy, r, startDeg, endDeg, pathType) {
    // Convert degrees to radians
    const aRad = degToRad(startDeg);
    const bRad = degToRad(endDeg);
  
    // Calculate the start and end points of the sector
    const startX = cx + r * Math.cos(aRad);
    const startY = cy + r * Math.sin(aRad);
    const endX = cx + r * Math.cos(bRad);
    const endY = cy + r * Math.sin(bRad);
  
    // Determine the arc flag (1 if b - a <= 180, otherwise 0 for large arc)
    const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
  
    // Create the SVG path element and set its attributes
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${startX},${startY} A ${r},${r} 0 ${largeArcFlag},1 ${endX},${endY}`);
    // path.setAttribute('d', `M ${cx},${cy} L ${startX},${startY} A ${r},${r} 0 ${largeArcFlag},1 ${endX},${endY} Z`);
    path.classList.add(pathType);
    
    return path;
}

class Point {
    /** @type {number} */ x;
    /** @type {number} */ y;

    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    /** @type {Point} */ point1;
    /** @type {Point} */ point2; // This i's point

    /**
     * @param {Point} point1 
     * @param {Point} point2 
     */
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }
}


class Tile {

    /** @type {Point} */ center;
    /** @type {Point[]} */ points; // Top -> Right -> Bottom -> Left (as margins/paddings)
    /** @type {Line[]} */ lines; // TopLeft -> TopRight -> BottomRight -> BottomLeft (as border-radius). Line[i] BEFORE Point[i] clockwise
    /** @type {number} */ rotation; // todo decide (now let be deg)
    /** @type {number} */ size; // Size of a side in px
    /** @type {'thin'|'thick'} */ type; // тонкий | толстый

    /** @type {number} */ _smallHalfDiagonal; // Horizontal
    /** @type {number} */ _bigHalfDiagonal; // Vertical

    /** @type {SVGSVGElement} */ root;

    /** @type {Line[]} */ intersectionLines; // Lines in REAL coordinates

    /**
     * @param {Point} center 
     * @param {number} rotation 
     * @param {number} size 
     * @param {'thin'|'thick'} type 
     */
    constructor(center, rotation, type) {
        this.center = center;
        this.rotation = rotation;
        this.size = TILE_SIZE;
        this.type = type;

        this._setPointsAndLines();
        this._generateRoot();
        this._generatePattern();
        this._generateIntersectionLines();
    }

    _setPointsAndLines() {
        /**
         * @param {number} size 
         * @param {number} angle in deg. Full left angle (36 or 72)
        */
        const calculateDiagonalsHalfs = (size, angle) => {
            const anglePrepared = degToRad(angle / 2);

            const big = size * Math.cos(anglePrepared);
            const small = size * Math.sin(anglePrepared);

            this._bigHalfDiagonal = big;
            this._smallHalfDiagonal = small;
        }

        const angle = this.type === 'thin' ? 36 : this.type === 'thick' ? 72 : undefined;
        if (!angle) {
            throw new Error('Incorrect tile type: ', this.type);
        }
        calculateDiagonalsHalfs(this.size, angle);
        const point0 = new Point(0,                      -this._smallHalfDiagonal);
        const point1 = new Point(this._bigHalfDiagonal,  0);
        const point2 = new Point(0,                      this._smallHalfDiagonal);
        const point3 = new Point(-this._bigHalfDiagonal, 0);
        const line0 = new Line(point3, point0);
        const line1 = new Line(point0, point1);
        const line2 = new Line(point1, point2);
        const line3 = new Line(point2, point3);
        
        this.points = [ point0, point1, point2, point3 ];
        this.lines = [ line0, line1, line2, line3 ];
    }
    
    /** Assumes, everything is filled, sets root, and adds it to container */
    _generateRoot() {
        const generatePathD = () => {
            const h = this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
            const realXShift = STROKE_HALF * this._bigHalfDiagonal / h;
            const realYShift = STROKE_HALF * this._smallHalfDiagonal / h;

            const x = this._bigHalfDiagonal - realXShift;
            const y = this._smallHalfDiagonal - realYShift;
            const s = Math.sqrt(sq(x) + sq(y));

            if (this.type === 'thin') {

                const line0Points = [
                    {
                        x: -x,
                        y: 0,
                    },
                    {
                        x: Math.cos(degToRad(18)) * (PATTERN_TRIANGLE_CENTER_DIST - PATTERN_TRIANGLE_BASE_WIDTH / 2) - x,
                        y: -Math.sin(degToRad(18)) * (PATTERN_TRIANGLE_CENTER_DIST - PATTERN_TRIANGLE_BASE_WIDTH / 2),
                    },
                    (() => {
                        const hypotenuse = Math.sqrt(sq(PATTERN_TRIANGLE_CENTER_DIST) + sq(PATTERN_TRIANGLE_HEIGHT));
                        const rotateVector1 = rotateVectorClockwise(hypotenuse, 0, -18);
                        const rotateVector2 = rotateVectorClockwiseBySinAndCos(rotateVector1.x, rotateVector1.y, PATTERN_TRIANGLE_HEIGHT / hypotenuse, PATTERN_TRIANGLE_CENTER_DIST / hypotenuse);
                        return {
                            x: rotateVector2.x - x,
                            y: -rotateVector2.y,
                        };
                    })(),
                    {
                        x: Math.cos(degToRad(18)) * (PATTERN_TRIANGLE_CENTER_DIST + PATTERN_TRIANGLE_BASE_WIDTH / 2) - x,
                        y: -Math.sin(degToRad(18)) * (PATTERN_TRIANGLE_CENTER_DIST + PATTERN_TRIANGLE_BASE_WIDTH / 2),
                    },
                    {
                        x: 0,
                        y: -y,
                    },
                ];
                const line1Points = line0Points.map(p => {
                    const newVectorX = p.x;
                    const newVectorY = y + p.y;
                    const rotated = rotateVectorClockwise(newVectorX, newVectorY, 144);
                    const retY = rotated.y - y;
                    const retX = rotated.x;
                    return { x: retX, y: retY };
                });
                const line2D = [
                    {
                        a: 'L',
                        p: [ x, 0 ],
                    },
                    {
                        a: 'L',
                        p: [
                            x - Math.cos(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS),
                            Math.sin(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS),
                        ],
                    },
                    (() => {
                        return {
                            a: 'A',
                            p: [
                                PATTERN_CIRCLE_RADIUS,
                                PATTERN_CIRCLE_RADIUS,
                                0,
                                0,
                                1,
                                x - Math.cos(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS),
                                Math.sin(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS),
                            ]
                        }
                    })(),
                    {
                        a: 'L',
                        p: [ 0, y ],
                    },
                ];
                const line3D = [
                    {
                        a: 'L',
                        p: [ 0, y ],
                    },
                    {
                        a: 'L',
                        p: [
                            Math.cos(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS) - x,
                            Math.sin(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS),
                        ],
                    },
                    (() => {
                        return {
                            a: 'A',
                            p: [
                                PATTERN_CIRCLE_RADIUS,
                                PATTERN_CIRCLE_RADIUS,
                                0,
                                0,
                                0,
                                Math.cos(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS) - x,
                                Math.sin(degToRad(18)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS),
                            ]
                        }
                    })(),
                    {
                        a: 'L',
                        p: [ -x, 0 ],
                    },
                ];

                return `M ${-x},${0} ` +
                    line0Points.map(p => `L ${p.x},${p.y} `).join() + 
                    line1Points.map(p => `L ${p.x},${p.y} `).reverse().join() + 
                    line2D.map(x => `${x.a} ${x.p.join(' ')} `).join() + 
                    line3D.map(x => `${x.a} ${x.p.join(' ')} `).join() + 
                    `Z`;
            } else {
                const triangleCenterDist = s - PATTERN_TRIANGLE_CENTER_DIST;
                const line0Points = [
                    {
                        x: -x,
                        y: 0,
                    },
                    {
                        x: Math.cos(degToRad(36)) * (triangleCenterDist - PATTERN_TRIANGLE_BASE_WIDTH / 2) - x,
                        y: -Math.sin(degToRad(36)) * (triangleCenterDist - PATTERN_TRIANGLE_BASE_WIDTH / 2),
                    },
                    (() => {
                        const hypotenuse = Math.sqrt(sq(triangleCenterDist) + sq(PATTERN_TRIANGLE_HEIGHT));
                        const rotateVector1 = rotateVectorClockwise(hypotenuse, 0, -36);
                        const rotateVector2 = rotateVectorClockwiseBySinAndCos(rotateVector1.x, rotateVector1.y, -PATTERN_TRIANGLE_HEIGHT / hypotenuse, triangleCenterDist / hypotenuse);
                        return {
                            x: rotateVector2.x - x,
                            y: -rotateVector2.y,
                        };
                    })(),
                    {
                        x: Math.cos(degToRad(36)) * (triangleCenterDist + PATTERN_TRIANGLE_BASE_WIDTH / 2) - x,
                        y: -Math.sin(degToRad(36)) * (triangleCenterDist + PATTERN_TRIANGLE_BASE_WIDTH / 2),
                    },
                    {
                        x: 0,
                        y: -y,
                    },
                ];
                const line1D = [
                    {
                        a: 'L',
                        p: [ 0, -y ],
                    },
                    {
                        a: 'L',
                        p: [
                            x - Math.cos(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS),
                            -Math.sin(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS),
                        ],
                    },
                    (() => {
                        return {
                            a: 'A',
                            p: [
                                PATTERN_CIRCLE_RADIUS,
                                PATTERN_CIRCLE_RADIUS,
                                0,
                                0,
                                0,
                                x - Math.cos(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS),
                                -Math.sin(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS),
                            ]
                        }
                    })(),
                    {
                        a: 'L',
                        p: [ x, 0 ],
                    },
                ];
                const line2D = [
                    {
                        a: 'L',
                        p: [ x, 0 ],
                    },
                    {
                        a: 'L',
                        p: [
                            x - Math.cos(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS),
                            Math.sin(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST - PATTERN_CIRCLE_RADIUS),
                        ],
                    },
                    (() => {
                        return {
                            a: 'A',
                            p: [
                                PATTERN_CIRCLE_RADIUS,
                                PATTERN_CIRCLE_RADIUS,
                                0,
                                0,
                                1,
                                x - Math.cos(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS),
                                Math.sin(degToRad(36)) * (PATTERN_CIRCLE_CENTER_DIST + PATTERN_CIRCLE_RADIUS),
                            ]
                        }
                    })(),
                    {
                        a: 'L',
                        p: [ 0, y ],
                    },
                ];
                const line3Points = line0Points.map(p => {
                    const newVectorX = p.x + x;
                    const newVectorY = p.y;
                    const rotated = rotateVectorClockwise(newVectorX, newVectorY, -72);
                    const retY = rotated.y;
                    const retX = rotated.x - x;
                    return { x: retX, y: retY };
                });
                return `M ${-x},${0} ` +
                    line0Points.map(p => `L ${p.x},${p.y} `).join() + 
                    line1D.map(x => `${x.a} ${x.p.join(' ')} `).join() + 
                    line2D.map(x => `${x.a} ${x.p.join(' ')} `).join() + 
                    line3Points.map(p => `L ${p.x},${p.y} `).reverse().join() + 
                    `Z`;
            }
        }
        const root = document.createElementNS(SVG_NS, 'svg');
        root.style.transform = `translate(${this.center.x}px, ${this.center.y}px) rotate(${this.rotation}deg)`;
        root.classList.add('tile');

        const mainPath = document.createElementNS(SVG_NS, 'path');
        mainPath.setAttribute('d', generatePathD())
        mainPath.classList.add('main');

        root.appendChild(mainPath);
        this.root = root;

        window.tilesContainer.appendChild(root);
    }

    _generatePattern() {
        if (this.type === 'thin') {
            const path1 = createCircleSector(0, -this._smallHalfDiagonal, PATTERN_SMALL_RADIUS, 18, 18 + 144, 'path1');
            this.root.appendChild(path1);
            const path2 = createCircleSector(0, this._smallHalfDiagonal, PATTERN_SMALL_RADIUS, -18 - 144, -18, 'path2');
            this.root.appendChild(path2);
        } else if (this.type === 'thick') {
            const path1 = createCircleSector(-this._bigHalfDiagonal, 0, PATTERN_SMALL_RADIUS, -36, 36, 'path1');
            this.root.appendChild(path1);
            const path2 = createCircleSector(this._bigHalfDiagonal, 0, TILE_SIZE - PATTERN_SMALL_RADIUS, 180 - 36, 36 - 180, 'path2');
            this.root.appendChild(path2);
        } else {
            throw new Error('Unknown tile type', this.type);
        }
    }

    _generateIntersectionLines() {
        const h = this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
        const realXShift = INTERSECTION_MARGIN * this._bigHalfDiagonal / h;
        const realYShift = INTERSECTION_MARGIN * this._smallHalfDiagonal / h;

        const getShiftedAbsolutePoint = (p) => {
            const x = p.x - Math.sign(p.x) * realXShift;
            const y = p.y - Math.sign(p.y) * realYShift;
            const rotated = rotateVectorClockwise(x, y, -this.rotation);
            return new Point(this.center.x + rotated.x, this.center.y + rotated.y);
        }

        const newPoints = this.points.map(getShiftedAbsolutePoint);

        const line0 = new Line(newPoints[3], newPoints[0]);
        const line1 = new Line(newPoints[0], newPoints[1]);
        const line2 = new Line(newPoints[1], newPoints[2]);
        const line3 = new Line(newPoints[2], newPoints[3]);
        const diagV = new Line(newPoints[0], newPoints[2]);
        const diagH = new Line(newPoints[3], newPoints[1]);

        this.intersectionLines = [line0, line1, line2, line3, diagV, diagH];
    }
}

class ThinTile extends Tile {
    
    /**
     * 
     * @param {Point} center 
     * @param {number} rotation 
     */
    constructor(center, rotation) {
        super(center, rotation, 'thin');
    }
}
class ThickTile extends Tile {
    
    /**
     * 
     * @param {Point} center 
     * @param {number} rotation 
     */
    constructor(center, rotation) {
        super(center, rotation, 'thick');
    }
}

