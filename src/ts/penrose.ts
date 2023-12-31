import { Point } from './point';
import { mathSum, lengthOfLineSegment, HashTable, map } from './helpers';

const LINES_DISTANCE = 2.5;
const FILL_STOCK = 5;

export class PenroseTiling {
    constructor(
        public readonly vertices: HashTable<PenroseVertexPoint>,
        public readonly rhombuses: PenroseRhombus[],
    ) { }
}

export type PenroseVertexType = 'kite'|'deuce'|'jack'|'ace'|'king'|'queen'|'sun'|'star'|'uncomplete';
// export type PenroseIntersectionType = 1|2|3|4;

/** Rhombus vertex (a point between lines) */
export class PenroseVertexPoint extends Point {

    public readonly hash: string;
    public type: PenroseVertexType;

    constructor(
        public readonly lineNumbers: number[],
        public readonly rhombuses: PenroseRhombus[] = [],
    ) {
        if (lineNumbers.length != 5) throw new Error('There should be 5 line numbers.');
        const x = mathSum(0, 4, j => lineNumbers[j] * -Math.sin(2 * Math.PI * j / 5));
        const y = mathSum(0, 4, j => lineNumbers[j] *  Math.cos(2 * Math.PI * j / 5));
        super(x, y);
        this.hash = lineNumbers.join('_');
    }
}

/** Intersection of 2 lines (a rhombus). Line2Family > Line1Family lol. */
export class PenroseIntersectionPoint extends Point {

    /** [1-4]. 2 and 3 for Thin */
    public readonly type: number;

    public readonly hash: string;

    constructor(
        x: number,
        y: number,
        public readonly line1Family: number,
        public readonly line2Family: number,
        public readonly line1Number: number,
        public readonly line2Number: number,
    ) {
        super(x, y);
        this.type = (line2Family - line1Family) % 5; // Hoping line2Family - line1Family
        this.hash = `${line1Family}_${line1Number}_${line2Family}_${line2Number}`;
    }
}

export class PenroseRhombus {

    public readonly isThin: boolean;
    
    constructor(
        public readonly points: PenroseVertexPoint[],
        public readonly intersectionPoint: PenroseIntersectionPoint
    ) {
        if (points.length != 4) throw new Error('There should be penrose points.');
        // this.isThin = lengthOfLineSegment(points[0], points[2]) < lengthOfLineSegment(points[1], points[3]);
        this.isThin = intersectionPoint.type === 2 || intersectionPoint.type === 3;
    }
}


export class PenroseTiligGenerator {


    constructor(
        public readonly shifts: number[],
    ) { }

    public generate(
        minX: number, 
        maxX: number, 
        minY: number, 
        maxY: number
    ): PenroseTiling {
        const generateStart = window.performance.now();
        const intersectionPoints = this.getAllIntersectionPoints(
            minX - FILL_STOCK,
            maxX + FILL_STOCK,
            minY - FILL_STOCK,
            maxY + FILL_STOCK,
        );
        const vertices: HashTable<PenroseVertexPoint> = {};
        const rhombuses = intersectionPoints.map(p => this.generateRhombusFromPoint(p, vertices));
       
        return new PenroseTiling(vertices, rhombuses)
    }
    
    private getIntersectionPoint(
        line1Family: number, 
        line1Number: number, 
        line2Family: number, 
        line2Number: number,
    ): Point {
        //y=kx+b. b is shift
        const k1 = Math.tan(line1Family * 2 * Math.PI / 5);
        const k2 = Math.tan(line2Family * 2 * Math.PI / 5);
        const b1 = (this.shifts[line1Family] + line1Number) * LINES_DISTANCE / Math.cos(line1Family * 2 * Math.PI / 5);
        const b2 = (this.shifts[line2Family] + line2Number) * LINES_DISTANCE / Math.cos(line2Family * 2 * Math.PI / 5);
    
        const x = (b2 - b1) / (k1 - k2);
        const y = k1 * x + b1;
        // const y2 = k2 * x + b2;

        // if (Math.abs(y - y2) > .001) {
        //     console.error('bad formula');
        // }
    
        return new Point(x, y);
    }
    
    private findSectionOnLineFamily(lineFamily: number, x: number, y: number): number {
        const float = (y - Math.tan(lineFamily * 2 * Math.PI / 5) * x) * Math.cos(lineFamily * 2 * Math.PI / 5) / LINES_DISTANCE - this.shifts[lineFamily];
    
        return Math.floor(float);
    }
    
    private getIntersectionPoints(
        minX: number, 
        maxX: number, 
        minY: number, 
        maxY: number, 
        line1Family: number, 
        line2Family: number,
    ): PenroseIntersectionPoint[] {
        const line1Number = this.findSectionOnLineFamily(line1Family, (minX + maxX) / 2, (minY + maxY) / 2);
        const line2Number = this.findSectionOnLineFamily(line2Family, (minX + maxX) / 2, (minY + maxY) / 2);
        const points: PenroseIntersectionPoint[] = [];
        
        const pointsToGo: { l1N: number, l2N: number }[] = [];
    
        const max = 1;
        for (let i = -max; i <= max; i++) {
            for (let j = -max; j <= max; j++) {
                pointsToGo.push({ l1N: line1Number + i, l2N: line2Number + j });
            }
        }
        
        while (pointsToGo.length) {
            const { l1N, l2N } = pointsToGo.pop();

            if (points.find(a => a.line1Number === l1N && a.line2Number === l2N)) continue;
            const point = this.getIntersectionPoint(line1Family, l1N, line2Family, l2N);
            if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) continue;
            points.push(new PenroseIntersectionPoint(
                point.x,
                point.y,
                line1Family,
                line2Family,
                l1N,
                l2N,
            ));

            pointsToGo.push({ l1N: l1N - 1, l2N });
            pointsToGo.push({ l1N: l1N + 1, l2N });
            pointsToGo.push({ l1N, l2N: l2N - 1 });
            pointsToGo.push({ l1N, l2N: l2N + 1 });
        }
    
        return points;
    }
    
    private getAllIntersectionPoints(
        minX: number, 
        maxX: number, 
        minY: number, 
        maxY: number, 
    ): PenroseIntersectionPoint[] {
        const intersections: PenroseIntersectionPoint[] = [];
        for(let i = 0; i < 5; i++) {
            for(let j = i + 1; j < 5; j++) {
                intersections.push(...this.getIntersectionPoints(minX, maxX, minY, maxY, i, j));
            }
        }
        return intersections;
    }

    private generateRhombusFromPoint(
        point: PenroseIntersectionPoint, 
        vertices: HashTable<PenroseVertexPoint>,
    ): PenroseRhombus {
        const defaultK = [0, 1, 2, 3, 4].map(a => this.findSectionOnLineFamily(a, point.x, point.y));
        
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

        const current_vertices = [
            new PenroseVertexPoint(k1),
            new PenroseVertexPoint(k2),
            new PenroseVertexPoint(k3),
            new PenroseVertexPoint(k4),
        ];

        const rhombus = new PenroseRhombus(current_vertices, point);

        for (const current_vertex of current_vertices) {
            let existing = vertices[current_vertex.hash];
            if (!existing) {
                vertices[current_vertex.hash] = current_vertex;
                existing = current_vertex;
            }
            existing.rhombuses.push(rhombus);
        }

        return rhombus;
    }
}


/** FIlling all missing data on the tiling after generation. */
export function fillTiling(tiling: PenroseTiling): void {
    const getType = (thinCount: number, thickCount: number): PenroseVertexType => {
        if (thickCount === 5 && thinCount === 0) {
            return 'star'; // todo or sun
        }
        if (thickCount === 2 && thinCount === 1) {
            return 'kite';
        }
        if (thickCount === 1 && thinCount === 2) {
            return 'deuce';
        }
        if (thickCount === 3 && thinCount === 1) {
            return 'jack';
        }
        if (thickCount === 3 && thinCount === 2) {
            return 'ace';
        }
        if (thickCount === 4 && thinCount === 2) {
            return 'king';
        }
        if (thickCount === 3 && thinCount === 4) {
            return 'queen';
        }

        return 'uncomplete';
    }

    for (const vertex of Object.values(tiling.vertices)) {
        const thinCount = vertex.rhombuses.filter(x => x.isThin).length;
        const thickCount = vertex.rhombuses.length - thinCount;
        vertex.type = getType(thinCount, thickCount);
    }
}
