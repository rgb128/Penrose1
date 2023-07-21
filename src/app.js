'use strict';

// rotation is clockwise

const SVG_NS = 'http://www.w3.org/2000/svg';
const TILE_SIZE = 200;

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

    availableConnections = [
        { 
            src:  { type: 'thin', line: 0 }, 
            dest: { type: 'thin', line: 1 }, 
            /** @returns {ThinTine} */ getTile: () => {
                const rotation = this.rotation + 144;
                const vectorSize = 2 * this._smallHalfDiagonal * this._bigHalfDiagonal / this.size;
                const { x, y } = rotateVectorClockwise(0, -vectorSize, 18);
                const centerX = this.center.x + x;
                const centerY = this.center.y + y;
                console.log(this._bigHalfDiagonal, this._smallHalfDiagonal);
                console.log(this.center.y);
                console.log(centerY);
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
    constructor(center, size, rotation, type) {
        this.center = center;
        this.rotation = rotation;
        this.size = size;
        this.type = type;

        this._setPointsAndLines();
        this._generateRoot();
    }
    
    /** Assumes, everything is filled, sets root, and adds it to container */
    _generateRoot() {
        const root = document.createElementNS(SVG_NS, 'svg');
        root.style.transform = `translate(${this.center.x}px, ${this.center.y}px) rotate(${this.rotation}deg)`;
        root.classList.add('tile');

        const mainPolygon = document.createElementNS(SVG_NS, 'polygon');
        mainPolygon.setAttribute('points', this.points.map(p => `${p.x},${p.y}`).join(' '))
        mainPolygon.classList.add('main');

        root.appendChild(mainPolygon);

        window.tilesContainer.appendChild(root);
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
}

class ThinTile extends Tile {
    
    /**
     * 
     * @param {Point} center 
     * @param {number} size 
     * @param {number} rotation 
     */
    constructor(center, rotation, size = TILE_SIZE) {
        super(center, size, rotation, 'thin');
    }
}
class ThickTile extends Tile {
    
    /**
     * 
     * @param {Point} center 
     * @param {number} size 
     * @param {number} rotation 
     */
    constructor(center, rotation, size = TILE_SIZE) {
        super(center, size, rotation, 'thick');
    }
}


const thin1 = new ThinTile(new Point(200, 100), 0);
const thin2 = new ThinTile(new Point(600, 100), 0);
thin1.availableConnections[0].getTile()
new ThickTile(new Point(200, 300), 0);
