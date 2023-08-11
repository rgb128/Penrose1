import { Random } from "./random";

const FAVICON_PATHS = [
    'favicons/favicon1.ico',
    'favicons/favicon2.ico',
];

export function setFavicon(random: Random) {
    const faviconPath = random.nextArrayValue(FAVICON_PATHS);
    document.getElementById('favicon').setAttribute('href', faviconPath);
}
