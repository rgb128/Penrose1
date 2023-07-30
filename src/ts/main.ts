import { greet } from './folder1/something';
import { Canvas } from './canvas';

const canvas = new Canvas(
    document.getElementById('main') as HTMLCanvasElement,
    100,
    100,
    100,
    100
);

(window as any).canvas = canvas;

greet('John a');
