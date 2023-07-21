
/**
 * Not a rhombus intersection check, but for now it will be enough (i hope)
 * @param {Tile} tile1 
 * @param {Tile} tile2 
 * @returns {boolean}
 */
function areTilesIntersect(tile1, tile2) {
    for (const line1 of tile1.intersectionLines) {
        for (const line2 of tile2.intersectionLines) {
            const intersection = line_intersect(
                line1.point1.x, 
                line1.point1.y, 
                line1.point2.x, 
                line1.point2.y, 
                line2.point1.x, 
                line2.point1.y, 
                line2.point2.x, 
                line2.point2.y
            );
            if (intersection != null && intersection.seg1 === true && intersection.seg2 === true) {
                return true;
            }
        } 
    }

    return false;
}

// https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    const denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    const ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    const ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1,
    };
}


console.log('areTilesIntersect(thin1, thin2):', areTilesIntersect(thin1, thin2), 'should', false);
console.log('areTilesIntersect(thin2, thin3):', areTilesIntersect(thin2, thin3), 'should', false);
console.log('areTilesIntersect(thin1, thin3):', areTilesIntersect(thin1, thin3), 'should', true);

console.log('areTilesIntersect(thin2, thin1):', areTilesIntersect(thin2, thin1), 'should', false);
console.log('areTilesIntersect(thin3, thin2):', areTilesIntersect(thin3, thin2), 'should', false);
console.log('areTilesIntersect(thin3, thin1):', areTilesIntersect(thin3, thin1), 'should', true);
