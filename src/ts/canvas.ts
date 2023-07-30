
export class Canvas {

    private readonly context: CanvasRenderingContext2D;

    
    constructor(
        private readonly root: HTMLCanvasElement,
        private width: number,
        private height: number,
        private top: number,
        private left: number,
    ) {
        this.root.width = this.width;
        this.root.height = this.height;
        this.root.style.top = this.top + 'px';
        this.root.style.left = this.left + 'px';
        this.root.style.width = this.width + 'px';
        this.root.style.height = this.height + 'px';
        this.context = this.root.getContext('2d');
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;


        this.root.onmousedown = e => {
            this.context.beginPath();
            this.context.moveTo(e.offsetX, e.offsetY);
        }
        this.root.onmouseup = e => {
            this.context.stroke();
        }
        this.root.onmousemove = e => {
            if(e.buttons) {
                this.context.lineTo(e.offsetX, e.offsetY);
                this.context.stroke();
            }
        }
    }

    public clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    private updateBindings(): void {
        this.root.width = this.width;
        this.root.height = this.height;
        this.root.style.top = this.top + 'px';
        this.root.style.left = this.left + 'px';
        this.root.style.width = this.width + 'px';
        this.root.style.height = this.height + 'px';
    }

    /**
     * + extends, - makes smaller
     */
    public extend(top = 0, bottom = 0, left = 0, right = 0): void {
        const imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.context.clearRect(0, 0, this.width, this.height);

        const newWidth = this.width + left + right;
        const newHeight = this.height + top + bottom;
        const newTop = this.top - top;
        const newLeft = this.left - left;

        this.width = newWidth;
        this.height = newHeight;
        this.top = newTop;
        this.width = newLeft;

        this.updateBindings();

        this.context.putImageData(imageData, left, top);
    }
}
