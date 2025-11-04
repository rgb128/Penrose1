const CONFIG = {
    text: '#808080 penrose1',
    fileName: 'penrose.png',
    bottom: 15,
    right: 10,
    font: 'bold 30px Arial',
    strokeWidth: 4,
};
const DARK = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

export function downloadCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    downloadImgData(imageData);
}
export function downloadSmallCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const width = canvas.width / 3;
    const height = canvas.height / 3;
    const imageData = context.getImageData(width, height, width, height);
    downloadImgData(imageData);
}

/**
 * Converts an ImageData object to a Blob.
 * This helper function is now fully typed and includes error handling.
 * @param {ImageData} imageData The image data to convert.
 * @returns {Promise<Blob>} A promise that resolves with the Blob or rejects on failure.
 */
function imageDataToBlob(imageData: ImageData): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Ensure the context was successfully created
    if (!ctx) {
        return Promise.reject(new Error('Failed to create a 2D rendering context.'));
    }

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas toBlob() failed to create a blob.'));
            }
        }, 'image/png');
    });
}

/**
 * Copies the entire canvas content to the clipboard in a Safari-compatible way.
 * @param {HTMLCanvasElement} canvas The canvas element to copy from.
 * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
 */
export function copyCanvas(canvas: HTMLCanvasElement): Promise<void> {
    const blobPromise: Promise<Blob> = new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas toBlob() failed to create a blob.'));
            }
        }, 'image/png');
    });

    // The promise is passed directly to the ClipboardItem constructor.
    return navigator.clipboard.write([
        new ClipboardItem({
            'image/png': blobPromise
        })
    ]);
}

/**
 * Copies a smaller, central portion of a canvas to the clipboard.
 * @param {HTMLCanvasElement} canvas The canvas element to copy from.
 * @param {CanvasRenderingContext2D} context The 2D context of the canvas.
 * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
 */
export function copySmallCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): Promise<void> {
    const width = canvas.width / 3;
    const height = canvas.height / 3;
    const imageData = context.getImageData(width, height, width, height);
    
    const blobPromise = imageDataToBlob(imageData);

    return navigator.clipboard.write([
        new ClipboardItem({
            'image/png': blobPromise
        })
    ]);
}


function drawText(context: CanvasRenderingContext2D, width: number, height: number) {
    context.font = CONFIG.font;
    context.textAlign = 'end';
    context.fillStyle = DARK ? 'black' : 'white';
    context.strokeStyle = DARK ? 'white' : 'black';
    context.lineWidth = CONFIG.strokeWidth;
    context.strokeText(CONFIG.text, width - CONFIG.right, height - CONFIG.bottom);
    context.fillText(CONFIG.text, width - CONFIG.right, height - CONFIG.bottom);
}

function downloadImgData(imgData: ImageData) {
    const newCanvas = document.createElement('canvas');
    newCanvas.style.display = 'none';
    newCanvas.style.width = imgData.width + 'px';
    newCanvas.style.height = imgData.height + 'px';
    newCanvas.width = imgData.width;
    newCanvas.height = imgData.height;

    const newCtx = newCanvas.getContext('2d');
    newCtx.putImageData(imgData, 0, 0);
    drawText(newCtx, imgData.width, imgData.height);

    const myImageDataUrl = newCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = myImageDataUrl;
    link.download = CONFIG.fileName;

    link.click();

    link.remove();
    newCanvas.remove();
}

// async function imageDataToBlob(imageData): Promise<Blob> {
//     const w = imageData.width;
//     const h = imageData.height;
//     let canvas = document.createElement("canvas");
//     canvas.width = w;
//     canvas.height = h;
//     const ctx = canvas.getContext("2d");
//     ctx.putImageData(imageData, 0, 0);
//     drawText(ctx, imageData.width, imageData.height);

//     return new Promise((resolve) => {
//         canvas.toBlob(resolve); // implied image/png format
//     });
// }
