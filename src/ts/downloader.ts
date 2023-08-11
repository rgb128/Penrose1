const CONFIG = {
    text: '#808080 penrose1',
    fileName: 'penrose.png',
    bottom: 15,
    right: 10,
    font: 'bold 30px Arial',
    strokeWidth: 4,
};
const DARK = false;

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

export async function copyCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const blob = await imageDataToBlob (imageData);
    await navigator.clipboard.write([
        new ClipboardItem({
            'image/png': blob
        })
    ]);

}


export async function copySmallCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const width = canvas.width / 3;
    const height = canvas.height / 3;
    const imageData = context.getImageData(width, height, width, height);
    const blob = await imageDataToBlob (imageData);
    await navigator.clipboard.write([
        new ClipboardItem({
            'image/png': blob
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

// function getImage(imgData: ImageData, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
//     const newCanvas = document.createElement('canvas');
//     newCanvas.style.display = 'none';
//     newCanvas.style.width = imgData.width + 'px';
//     newCanvas.style.height = imgData.height + 'px';
//     newCanvas.width = imgData.width;
//     newCanvas.height = imgData.height;
//
//     const newCtx = newCanvas.getContext('2d');
//     newCtx.putImageData(imgData, 0, 0);
//     drawText(newCtx, imgData.width, imgData.height);
//
//     const myImageDataUrl = newCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
//     const img = document.createElement('img');
//     img.src = myImageDataUrl
//     newCanvas.remove();
//     return img;
// }

async function imageDataToBlob(imageData): Promise<Blob> {
    const w = imageData.width;
    const h = imageData.height;
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
    drawText(ctx, imageData.width, imageData.height);

    return new Promise((resolve) => {
        canvas.toBlob(resolve); // implied image/png format
    });
}
