import { Point} from './point';
import { map } from './helpers';
import { PenroseTiling } from './penrose';

export class CanvasnManager {

    private readonly bigContext: CanvasRenderingContext2D;
    private readonly smallContext: CanvasRenderingContext2D;

    private bigWidthPx: number;
    private bigHeightPx: number;
    private smallPositionOnBigPx: Point; // top/left
    private tilig: PenroseTiling;

    /**
     * @param centerUnits Center of screen in units (Small center units)
     */
    constructor(
        private one: number,
        private pxWidth: number,
        private pxHeight: number,
        private readonly smallCanvas: HTMLCanvasElement,
        private readonly bigCanvas: HTMLCanvasElement,
        private readonly redraw: (one: number, minX: number, maxX: number, minY: number, maxY: number, converter: (p: Point) => Point) => PenroseTiling,
        private centerUnits = new Point(0, 0),
    ) {
        smallCanvas.width = this.pxWidth;
        smallCanvas.height = this.pxHeight;
        this.smallCanvas.style.width = this.smallCanvas.width + 'px';
        this.smallCanvas.style.height = this.smallCanvas.height + 'px';

        this.bigContext = this.bigCanvas.getContext('2d', { willReadFrequently: true });
        this.smallContext = this.smallCanvas.getContext('2d', { willReadFrequently: true });

        bigCanvas.width = this.pxWidth;
        bigCanvas.height = this.pxHeight;
        this.bigWidthPx = this.pxWidth;
        this.bigHeightPx = this.pxHeight;
        this.bigCanvas.style.width = this.bigCanvas.width + 'px';
        this.bigCanvas.style.height = this.bigCanvas.height + 'px';

        this.smallPositionOnBigPx = new Point(0, 0);

        this.draw();
        this.moveToBig();
    }

    public convertUnitsToPx(point: Point): Point {
        const halfWidthUnits = this.pxWidth / this.one / 2;
        const halfHeightUnits = this.pxHeight / this.one / 2;

        const x = map(
            point.x, 
            this.centerUnits.x - halfWidthUnits, 
            this.centerUnits.x + halfWidthUnits,
            0,
            this.pxWidth
        );
        const y = map(
            point.y, 
            this.centerUnits.y - halfHeightUnits, 
            this.centerUnits.y + halfHeightUnits,
            0,
            this.pxHeight
        );

        return new Point(x, y);
    }

    public getWidth(): number {
        return this.pxWidth;
    }
    public getHeight(): number {
        return this.pxHeight;
    }
    public getBigHeight(): number {
        return this.bigHeightPx;
    }
    public getBigWidth(): number {
        return this.bigWidthPx;
    }
    public getOne(): number {
        return this.one;
    }
    public getCenter(): Point {
        return new Point(this.centerUnits.x * this.one, this.centerUnits.y * this.one);
    }
    public getTiling(): PenroseTiling {
        return this.tilig;
    }

    private draw(): void {
        const halfWidthUnits = this.pxWidth / this.one / 2;
        const halfHeightUnits = this.pxHeight / this.one / 2;
        this.tilig = this.redraw(
            this.one,
            this.centerUnits.x - halfWidthUnits,
            this.centerUnits.x + halfWidthUnits,
            this.centerUnits.y - halfHeightUnits,
            this.centerUnits.y + halfHeightUnits,
            p => { return this.convertUnitsToPx(p); },
        );
        // this.moveToBig();
    }

    public resize(newWidth, newHeight): void {
        this.smallPositionOnBigPx.x -= (newWidth - this.pxWidth) / 2;
        this.smallPositionOnBigPx.y -= (newHeight - this.pxHeight) / 2;
        this.pxWidth = newWidth;
        this.pxHeight = newHeight;
        
        this.smallCanvas.width = newWidth;
        this.smallCanvas.style.width = this.smallCanvas.width + 'px';
        this.smallCanvas.height = newHeight;
        this.smallCanvas.style.height = this.smallCanvas.height + 'px';
        
        this.draw();
        
        (async () => {
            this.checkBigSize();
            this.moveToBig();
        })();
    }

    public changeOne(newOne: number): void {
        this.one = newOne;
        
        this.draw();
        
        (async () => {
            this.moveToBig();
        })();
    }

    public move(vector: Point): void {
        const x = vector.x / this.one;
        const y = vector.y / this.one;

        this.centerUnits.x += x;
        this.centerUnits.y += y;
        this.smallPositionOnBigPx.x += vector.x;
        this.smallPositionOnBigPx.y += vector.y;
        
        this.draw();

        (async () => {
            this.checkBigSize();
            this.moveToBig();
        })();
    }

    private moveToBig(): void {
        const imageData = this.smallContext.getImageData(0, 0, this.pxWidth, this.pxHeight);
        this.bigContext.putImageData(imageData, this.smallPositionOnBigPx.x, this.smallPositionOnBigPx.y);
    }

    private checkBigSize(): void {
        // If they are negative, it's ok
        const leftDelta = 0 - this.smallPositionOnBigPx.x; // How many missing to left
        const rightDelta = (this.smallPositionOnBigPx.x + this.pxWidth) - this.bigWidthPx;
        const topDelta = 0 - this.smallPositionOnBigPx.y;
        const bottomDelta = (this.smallPositionOnBigPx.y + this.pxHeight) - this.bigHeightPx;

        if (leftDelta <= 0 && rightDelta <= 0 && topDelta <= 0 && bottomDelta <= 0) return;

        const bigImageData = this.bigContext.getImageData(0, 0, this.bigWidthPx, this.bigHeightPx);


        if (leftDelta > 0) {
            this.bigCanvas.width += leftDelta;
            this.bigCanvas.style.width = this.bigCanvas.width + 'px';
            this.bigWidthPx += leftDelta;
            this.smallPositionOnBigPx.x = 0; // Same as `this.smallPositionOnBigPx.x += leftDelta`
        }
        if (rightDelta > 0) {
            // Move right.
            this.bigCanvas.width += rightDelta;
            this.bigCanvas.style.width = this.bigCanvas.width + 'px';
            this.bigWidthPx += rightDelta;
        }
        if (topDelta > 0) {
            // Move top.
            this.bigCanvas.height += topDelta;
            this.bigCanvas.style.height = this.bigCanvas.height + 'px';
            this.bigHeightPx += topDelta;
            this.smallPositionOnBigPx.y = 0; // Same as `this.smallPositionOnBigPx.y -= topDelta`
        }
        if (bottomDelta > 0) {
            // Move bottom.
            this.bigCanvas.height += bottomDelta;
            this.bigCanvas.style.height = this.bigCanvas.height + 'px';
            this.bigHeightPx += bottomDelta;
        }

        this.bigContext.putImageData(bigImageData, Math.max(leftDelta, 0), Math.max(topDelta, 0));
    }
}
