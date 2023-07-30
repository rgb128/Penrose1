'use strict';

const THIN_REL_POINTS = [
    new Point(0, -THIN_SMALL_HALF_DIAGONAL_SIZE),
    new Point(THIN_BIG_HALF_DIAGONAL_SIZE, 0),
    new Point(0, THIN_SMALL_HALF_DIAGONAL_SIZE),
    new Point(-THIN_BIG_HALF_DIAGONAL_SIZE, 0),
];
const THICK_REL_POINTS = [
    new Point(0, -THICK_SMALL_HALF_DIAGONAL_SIZE),
    new Point(THICK_BIG_HALF_DIAGONAL_SIZE, 0),
    new Point(0, THICK_SMALL_HALF_DIAGONAL_SIZE),
    new Point(-THICK_BIG_HALF_DIAGONAL_SIZE, 0),
];
const LINES_POINTS = [ 
    [3, 0], 
    [0, 1], 
    [1, 2], 
    [2, 3]
];


// No reverse. src/dest are imaginary
const AVAILABLE_CONNECTIONS = [
    // Thin-Thin
    { 
        src:  { type: 'thin', line: 0 }, 
        dest: { type: 'thin', line: 1 }, 
    },
    // { src:  { type: 'thin', line: 2 }, dest: { type: 'thin', line: 3 }, }, // Actually unavailable
    // Thick-Thick
    { 
        src:  { type: 'thick', line: 0 }, 
        dest: { type: 'thick', line: 3 }, 
    },
    { 
        src:  { type: 'thick', line: 1 }, 
        dest: { type: 'thick', line: 2 }, 
    },
    // thin-thick
    { 
        src:  { type: 'thin', line: 0 }, 
        dest: { type: 'thick', line: 0 }, 
    },
    { 
        src:  { type: 'thin', line: 1 }, 
        dest: { type: 'thick', line: 3 }, 
    },
    { 
        src:  { type: 'thin', line: 2 }, 
        dest: { type: 'thick', line: 1 }, 
    },
    { 
        src:  { type: 'thin', line: 3 }, 
        dest: { type: 'thick', line: 2 }, 
    },
];

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
 * 
 * @param {Tile} tile 
 * @param {Point} point
 * @returns {Point} 
 */
function getAbsolutePoint(tile, point) {
    const rotated = rotateVectorClockwise(point.x, point.y, -tile.rotation);
    return new Point(tile.center.x + rotated.x, tile.center.y + rotated.y);
}


/**
 * Main fu=unctuin here
 * @param {Tile} srcTile 
 * @returns {Tile}
 */
function generateAvailableConnectedTile(srcTile, src, dest) {
    if (src.type !== srcTile.type) throw new Error('Tile and conn types are not same');

    const points1 = LINES_POINTS[src.line]
        .map(i => srcTile.type === 'thin' ? THIN_REL_POINTS[i] : THICK_REL_POINTS[i])
        .map(x => getAbsolutePoint(srcTile, x));
    const points2 = LINES_POINTS[dest.line]
        .map(i => dest.type === 'thin' ? THIN_REL_POINTS[i] : THICK_REL_POINTS[i])
        .reverse();
    const res = calculateCoordinatesAndRotationToOverlayLines(
        points1[0],
        points1[1],
        points2[0],
        points2[1],
    );
    return dest.type === 'thin' ? 
        new ThinTile(new Point(res.x, res.y), res.rotation) :
        new ThickTile(new Point(res.x, res.y), res.rotation);
}

/**
 * 
 * @param {Tile} tile 
 * @returns {Array}
 */
function getAvailableConnectionsForTile(tile) {
    return [
        ...AVAILABLE_CONNECTIONS
            .filter(x => x.src.type === tile.type)
            .map(x => { return {...x, getTile() { return generateAvailableConnectedTile(tile, x.src, x.dest); } }; }),
        ...AVAILABLE_CONNECTIONS
            .filter(x => x.dest.type === tile.type)
            .map(x => { return { src: x.dest, dest: x.src, getTile() { return generateAvailableConnectedTile(tile, x.dest, x.src); } }; })
    ]
}


const tiles = [ new ThinTile(new Point(500, 200), -36) ];
tiles.push(getAvailableConnectionsForTile(tiles.slice(-1)[0]).find(x => 
    x.src.type === 'thin' && 
    x.dest.type === 'thin' && 
    x.src.line === 1
).getTile());
tiles.push(getAvailableConnectionsForTile(tiles.slice(-1)[0]).find(x => 
    x.src.type === 'thin' && 
    x.dest.type === 'thin' && 
    x.src.line === 3
).getTile());


// /** @type {Tile[]} */
// const tiles = [ new ThickTile(new Point(500, 200), -36) ];
// // const availableTiles = getAvailableConnectionsForTile(tile1);
// // console.log(availableTiles);
// tiles.push(getAvailableConnectionsForTile(tiles.slice(-1)[0]).find(x => 
//     x.src.type === 'thick' && 
//     x.dest.type === 'thick' && 
//     x.src.line === 3
// ).getTile());

// /** @type {Tile[]} */
// const sideTiles = [];

// sideTiles.push(getAvailableConnectionsForTile(tiles[0]).find(x => 
//     x.src.type === 'thick' && 
//     x.dest.type === 'thin' && 
//     x.src.line === 2
// ).getTile());

// /** @type {Tile[]} */
// const tiles2 = [];

// tiles2.push(getAvailableConnectionsForTile(tiles[1]).find(x => 
//     x.src.type === 'thick' && 
//     x.dest.type === 'thin' && 
//     x.src.line === 2
// ).getTile());
// tiles2.push(getAvailableConnectionsForTile(tiles2[0]).find(x => 
//     x.src.type === 'thin' && 
//     x.dest.type === 'thin' && 
//     x.src.line === 1
// ).getTile());
// tiles2.push(getAvailableConnectionsForTile(tiles2[0]).find(x => 
//     x.src.type === 'thin' && 
//     x.dest.type === 'thick' && 
//     x.src.line === 0
// ).getTile());


// /** @type {Tile[]} */
// const sideTilesLeft = [];

// sideTilesLeft.push(getAvailableConnectionsForTile(tiles[1]).find(x => 
//     x.src.type === 'thick' && 
//     x.dest.type === 'thin' && 
//     x.src.line === 3
// ).getTile());
// sideTilesLeft.push(getAvailableConnectionsForTile(tiles[2]).find(x => 
//     x.src.type === 'thick' && 
//     x.dest.type === 'thin' && 
//     x.src.line === 0
// ).getTile());
// sideTilesLeft.push(getAvailableConnectionsForTile(sideTilesLeft[0]).find(x => 
//     x.src.type === 'thin' && 
//     x.dest.type === 'thick' && 
//     x.src.line === 2
// ).getTile());


