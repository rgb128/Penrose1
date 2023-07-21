'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';

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
    /** @type {number} */ rotation; // todo decide (now let be radiand)
    /** @type {number} */ size; // Size of a side in px
    /** @type {'thin'|'thick'} */ type; // тонкий | толстый

    /** @type {SVGSVGElement} */ root;

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
        root.style.transform = `translate(${this.center.x}px, ${this.center.y}px) rotate(${this.rotation}rad)`;
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
         * @returns {Object} An object containing the half lengths of the big and small diagonals.
         * @property {number} big - The half length of the big diagonal.
         * @property {number} small - The half length of the small diagonal.
     
        */
        function calculateDiagonalsHalfs(size, angle) {
            const anglePrepared = (angle / 2 * Math.PI) / 180; // rad(angle1 / 2)

            const big = size * Math.cos(anglePrepared);
            const small = size * Math.sin(anglePrepared);
        
            return {
                big,
                small,
            };
        }

        const angle = this.type === 'thin' ? 36 : this.type === 'thick' ? 72 : undefined;
        if (!angle) {
            throw new Error('Incorrect tile type: ', this.type);
        }
        const diagonalsHalfs = calculateDiagonalsHalfs(this.size, angle);
        const point0 = new Point(0,                   -diagonalsHalfs.small);
        const point1 = new Point(diagonalsHalfs.big,  0);
        const point2 = new Point(0,                   diagonalsHalfs.small);
        const point3 = new Point(-diagonalsHalfs.big, 0);
        const line0 = new Line(point3, point0);
        const line1 = new Line(point0, point1);
        const line2 = new Line(point1, point2);
        const line3 = new Line(point2, point3);
        
        this.points = [ point0, point1, point2, point3 ];
        this.lines = [ line0, line1, line2, line3 ];
    }
}

class ThinTile extends Tile {
    constructor(
        /** @type {Point} */ center,
        /** @type {number} */ size,
        /** @type {number} */ rotation,
    ) {
        super(center, size, rotation, 'thin');
    }
}
class ThickTile extends Tile {
    constructor(
        /** @type {Point} */ center,
        /** @type {number} */ size,
        /** @type {number} */ rotation,
    ) {
        super(center, size, rotation, 'thick');
    }
}


new ThinTile(new Point(200, 100), 200, 0);
new ThickTile(new Point(200, 300), 200, 0);
