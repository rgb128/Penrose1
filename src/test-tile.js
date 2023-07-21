
// rotate(deg) {
//     this.rotation = deg;
//     this.root.style.transform = `translate(${this.center.x}px, ${this.center.y}px) rotate(${this.rotation}deg)`;
// }


/** @type {Tile} */ let testTile;


function createTestTile(type) {
    const isThin = type === 'thin' || type === 1;
    if (testTile) {
        // ?
    }

    testTile = isThin ? new ThinTile(new Point(200, 200), 0) : new ThickTile(new Point(200, 200), 0);
}

const ONE_MOVE = 1;
const ONE_ROTATE = 1;

document.onkeydown = e => {
    if (!testTile) {
        return;
    }

    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        testTile.center.y -= ONE_MOVE;
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        testTile.center.y += ONE_MOVE;
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        testTile.center.x -= ONE_MOVE;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        testTile.center.x += ONE_MOVE;
    } else if (e.code === 'KeyQ') {
        testTile.rotation -= ONE_ROTATE;
    } else if (e.code === 'KeyE') {
        testTile.rotation += ONE_ROTATE;
    } else if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        testTile = null;
    } else {
        return;
    }
    testTile.root.style.transform = `translate(${testTile.center.x}px, ${testTile.center.y}px) rotate(${testTile.rotation}deg)`;
}
