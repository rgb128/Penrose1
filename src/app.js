'use strict';

const absSvg = document.getElementById('absSvg');

// rotation is clockwise

const SVG_NS = 'http://www.w3.org/2000/svg';
const TILE_SIZE = 200;
const PATTERN_SMALL_RADIUS = 50;
const STROKE_HALF = 1;
const INTERSECTION_MARGIN = 5;

const PATTERN_TRIANGLE_CENTER_DIST = 40;
const PATTERN_TRIANGLE_BASE_WIDTH = 15;
const PATTERN_TRIANGLE_HEIGHT = 10;
const PATTERN_CIRCLE_CENTER_DIST = 40;
const PATTERN_CIRCLE_RADIUS = 10;

const THIN_BIG_HALF_DIAGONAL_SIZE =    TILE_SIZE * Math.sin(degToRad(36 / 2));
const THIN_SMALL_HALF_DIAGONAL_SIZE =  TILE_SIZE * Math.cos(degToRad(36 / 2));
const THICK_BIG_HALF_DIAGONAL_SIZE =   TILE_SIZE * Math.sin(degToRad(72 / 2));
const THICK_SMALL_HALF_DIAGONAL_SIZE = TILE_SIZE * Math.cos(degToRad(72 / 2));

const THIN_THIN_CENTER_DISTANCE =   2 * THIN_BIG_HALF_DIAGONAL_SIZE *  THIN_SMALL_HALF_DIAGONAL_SIZE /  TILE_SIZE;
const THICK_THICK_CENTER_DISTANCE = 2 * THICK_BIG_HALF_DIAGONAL_SIZE * THICK_SMALL_HALF_DIAGONAL_SIZE / TILE_SIZE;
const THIN_THICK_CENTER_DISTANCE = Math.sqrt(sq(THIN_SMALL_HALF_DIAGONAL_SIZE) + sq(THICK_BIG_HALF_DIAGONAL_SIZE) - 2 * THIN_SMALL_HALF_DIAGONAL_SIZE * THICK_BIG_HALF_DIAGONAL_SIZE * Math.cos(degToRad(72 + 36))); // Cos theorem
const THIN_THIN_CONNECTION_ANGLE = 18;
const THICK_THICK_CONNECTION_ANGLE = 18;
const THIN_THICK_CONNECTION_ANGLE = Math.asin(THICK_BIG_HALF_DIAGONAL_SIZE / TILE_SIZE);

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

/**
 * Points should match!
 * @param {Point} line1Start Static line
 * @param {Point} line1End Static line
 * @param {Point} line2Start 
 * @param {Point} line2End 
 * @returns 
 */
function calculateCoordinatesAndRotationToOverlayLines(line1Start, line1End, line2Start, line2End) {
    const vector1 = {
        x: line1End.x - line1Start.x,
        y: line1End.y - line1Start.y,
    };
    const vector2 = {
        x: line2End.x - line2Start.x,
        y: line2End.y - line2Start.y,
    };

    const angleArad = Math.atan2(vector1.y, vector1.x);
    const angleBrad = Math.atan2(vector2.y, vector2.x);
    const rotationRad = angleArad - angleBrad;

    const basicX = line1Start.x - line2Start.x; // Center's shift in abs
    const basicY = line1Start.y - line2Start.y; // Center's shift in abs

    const centerShifted = rotatePointAroundPointBySinAndCos({ x: basicX, y: basicY }, line1Start, Math.sin(rotationRad), Math.cos(rotationRad));

    return {
        x: centerShifted.x,
        y: centerShifted.y,
        rotation: radToDeg(rotationRad),
    };
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

window.tilesContainer = document.getElementById('main');

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

    availableConnections = [
        { 
            src:  { type: 'thin', line: 0 }, 
            dest: { type: 'thin', line: 1 }, 
            /** @returns {ThinTine} */ getTile: () => {
                const res = calculateCoordinatesAndRotationToOverlayLines(
                    this._getAbsolutePoint(this.points[0]),
                    this._getAbsolutePoint(this.points[3]),
                    this.points[0],
                    this.points[1],
                )
                return new ThinTile(new Point(res.x, res.y), res.rotation);
            },
        },
        { 
            src:  { type: 'thin', line: 1 }, 
            dest: { type: 'thin', line: 0 }, 
            /** @returns {ThinTine} */ getTile: () => {
                const res = calculateCoordinatesAndRotationToOverlayLines(
                    this._getAbsolutePoint(this.points[0]),
                    this._getAbsolutePoint(this.points[1]),
                    this.points[0],
                    this.points[3],
                )
                return new ThinTile(new Point(res.x, res.y), res.rotation);
            },
        },
        // 2-3 and 3-2 are unavailable
        { 
            src:  { type: 'thick', line: 0 }, 
            dest: { type: 'thick', line: 3 }, 
            /** @returns {ThickTile} */ getTile: () => {
                const rotation = this.rotation - 72;
                const vectorSize = 2 * this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
                const { x, y } = rotateVectorClockwise(0, -vectorSize, 36 - this.rotation);
                const centerX = this.center.x + x;
                const centerY = this.center.y + y;
                return new ThickTile(new Point(centerX, centerY), rotation);
            },
        },
        { 
            src:  { type: 'thick', line: 3 }, 
            dest: { type: 'thick', line: 0 }, 
            /** @returns {ThickTile} */ getTile: () => {
                const rotation = this.rotation + 72;
                const vectorSize = 2 * this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
                const { x, y } = rotateVectorClockwise(0, vectorSize, -36 - this.rotation);
                const centerX = this.center.x + x;
                const centerY = this.center.y + y;
                return new ThickTile(new Point(centerX, centerY), rotation);
            },
        },
        { 
            src:  { type: 'thick', line: 1 }, 
            dest: { type: 'thick', line: 2 }, 
            /** @returns {ThickTile} */ getTile: () => {
                const rotation = this.rotation + 72;
                const vectorSize = 2 * this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
                const { x, y } = rotateVectorClockwise(0, -vectorSize, -36 - this.rotation);
                const centerX = this.center.x + x;
                const centerY = this.center.y + y;
                return new ThickTile(new Point(centerX, centerY), rotation);
            },
        },
        { 
            src:  { type: 'thick', line: 2 }, 
            dest: { type: 'thick', line: 1 }, 
            /** @returns {ThickTile} */ getTile: () => {
                const rotation = this.rotation - 72;
                const vectorSize = 2 * this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
                const { x, y } = rotateVectorClockwise(0, vectorSize, 36 - this.rotation);
                const centerX = this.center.x + x;
                const centerY = this.center.y + y;
                return new ThickTile(new Point(centerX, centerY), rotation);
            },
        },
    ]

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
                                0,
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
                                1,
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

        // this.intersectionLines = [line0, line1, line2, line3];
        this.intersectionLines = [line0, line1, line2, line3, diagV, diagH];
        for(const l of this.intersectionLines) {
            const line = document.createElementNS(SVG_NS, 'line');
            line.setAttribute('x1', l.point1.x);
            line.setAttribute('y1', l.point1.y);
            line.setAttribute('x2', l.point2.x);
            line.setAttribute('y2', l.point2.y);
            line.style.stroke = 'green';
            line.style.strokeWidth = '3px';
            absSvg.appendChild(line);
        }
    }

    /**
     * 
     * @param {Point} point 
     * @returns {Point}
     */
    _getAbsolutePoint(point) {
        const rotated = rotateVectorClockwise(point.x, point.y, -this.rotation);
        return new Point(this.center.x + rotated.x, this.center.y + rotated.y);
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


// const thin1 = new ThinTile(new Point(200, 100), 0);
// const thin2 = new ThinTile(new Point(600, 100), 0);
// thin1.availableConnections[0].getTile()
// new ThickTile(new Point(200, 300), 0);




// const tile2 = new ThinTile(new Point(500, 300), 0);
// const tile1 = new ThinTile(new Point(500, 200), 0);
// const tile2 = new ThickTile(new Point(500, 500), 0);

// let temp = thick1;
// for (let i = 0; i < 4; i++) {
//     temp = temp.availableConnections[3].getTile();
// }
// temp = thick1;
// for (let i = 0; i < 4; i++) {
//     temp = temp.availableConnections[5].getTile();
// }



const tile1 = new ThinTile(new Point(500, 200), 30);
const t2 = tile1.availableConnections[0].getTile();
const t3 = tile1.availableConnections[1].getTile();
