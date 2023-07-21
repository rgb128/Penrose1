'use strict';

const absSvg = document.getElementById('absSvg');

// rotation is clockwise

const SVG_NS = 'http://www.w3.org/2000/svg';
const TILE_SIZE = 200;
const PATTERN_SMALL_RADIUS = 50;
const STROKE_HALF = 5;
const INTERSECTION_MARGIN = 1;

/**
 * @param {number} deg 
 * @returns {number}
 */
function degToRad(deg) {
    return deg * Math.PI / 180;
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} angle In deg
 * @returns {Object} x and y 
 */
function rotateVectorClockwise(x, y, angle) {
    angle = degToRad(-angle);
    const newX = x * Math.cos(angle) - y * Math.sin(angle);
    const newY = x * Math.sin(angle) + y * Math.cos(angle);
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
                const rotation = this.rotation + 144;
                const vectorSize = 2 * this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
                const { x, y } = rotateVectorClockwise(0, -vectorSize, 18 - this.rotation);
                const centerX = this.center.x + x;
                const centerY = this.center.y + y;
                return new ThinTile(new Point(centerX, centerY), rotation);
            },
        }
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
        const root = document.createElementNS(SVG_NS, 'svg');
        root.style.transform = `translate(${this.center.x}px, ${this.center.y}px) rotate(${this.rotation}deg)`;
        root.classList.add('tile');

        const h = this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
        const realXShift = STROKE_HALF * this._bigHalfDiagonal / h;
        const realYShift = STROKE_HALF * this._smallHalfDiagonal / h;

        const getShiftedPoint = (p) => {
            const x = p.x - Math.sign(p.x) * realXShift;
            const y = p.y - Math.sign(p.y) * realYShift;
            return `${x},${y}`;
        }

        const mainPolygon = document.createElementNS(SVG_NS, 'polygon');
        mainPolygon.setAttribute('points', this.points.map(getShiftedPoint).join(' '))
        mainPolygon.classList.add('main');

        root.appendChild(mainPolygon);
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




const thin1 = new ThinTile(new Point(500, 300), 0);
const thin2 = thin1.availableConnections[0].getTile();
const thin3 = thin2.availableConnections[0].getTile();

