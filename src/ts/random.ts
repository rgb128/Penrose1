
export class Random {
    private seed: number;

    constructor(seed = 420) {
        this.seed = seed;
    }

    private random(): number {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    public next(): number {
        return this.random();
    }

    /**
     * 
     * @param a Including
     * @param b Excluding
     */
    public nextInRange(a: number, b: number): number {
        if (a === b) return a;
        if (a > b) return this.nextInRange(b, a);
        
        return a + (this.random() * (b - a));
    }

    /**
     *
     * @param a Including
     * @param b Excluding
     */
    public nextIntInRange(a: number, b: number): number {
        if (a === b) return a;
        if (a > b) return this.nextIntInRange(b, a);
        
        return Math.floor(this.nextInRange(a, b));
    }

    public nextArrayValue<T>(array: T[]): T {
        const index = this.nextIntInRange(0, array.length);
        return array[index];
    }
}

export async function getSeed(): Promise<number> {
    const SEED_KEY = 'rgb128_penrose1_seed';
    
    const clientSeed = +localStorage[SEED_KEY];
    if (clientSeed) {
        return clientSeed;
    }
    
    const getTimeFromServer = async () => {
        try {
            const resp = await fetch('https://worldtimeapi.org/api/ip');
            const json = await resp.json();
            return +json.unixtime;
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
    const getTimeFromBrowser = () => {
        return Math.floor(Date.now() / 1000);
    }
    
    const seconds = (await getTimeFromServer()) || getTimeFromBrowser();
    const SECONDS_IN_DAY = 60 * 60 * 24;
    
    const seed = Math.floor(seconds / SECONDS_IN_DAY);

    localStorage[SEED_KEY] = seed;
    
    return seed;
}