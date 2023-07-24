'use strict';



const THIN_REL_POINTS = [
    new Point(-THIN_BIG_HALF_DIAGONAL_SIZE, 0),
    new Point(0, -THIN_SMALL_HALF_DIAGONAL_SIZE),
    new Point(THIN_BIG_HALF_DIAGONAL_SIZE, 0),
    new Point(0, THIN_SMALL_HALF_DIAGONAL_SIZE),
];
const THICK_REL_POINTS = [
    new Point(-THICK_BIG_HALF_DIAGONAL_SIZE, 0),
    new Point(0, -THICK_SMALL_HALF_DIAGONAL_SIZE),
    new Point(THICK_BIG_HALF_DIAGONAL_SIZE, 0),
    new Point(0, THICK_SMALL_HALF_DIAGONAL_SIZE),
];
const LINES_POINTS = [ 
    [3, 0], 
    [0, 1], 
    [1, 2], 
    [2, 3]
];


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

// No reverse. src/dest are imaginary
const AVAILABLE_CONNECTIONS = [
    // Thin-Thin
    { 
        src:  { type: 'thin', line: 0 }, 
        dest: { type: 'thin', line: 1 }, 
    },
    // 2-3 and 3-2 are unavailable
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





const tile1 = new ThinTile(new Point(500, 200), 0);
const availableTiles = getAvailableConnectionsForTile(tile1);
console.log(availableTiles);
availableTiles[0].getTile();
