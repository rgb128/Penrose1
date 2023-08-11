export interface ColorTheme {
    border: string;
    thin: string;
    thick: string;
    bigCircle: string;
    smallCircle: string;
}

export type TilingColorsBox = { 'dark': ColorTheme, 'light': ColorTheme }[];
export const TILING_COLORS: TilingColorsBox = [
    {
        'dark': {
            thin: '#d9d8ff',
            thick: '#ffdbdb',
            smallCircle: '#6d6dff',
            bigCircle: '#ff7171',
            border: 'rgba(0, 0, 0, 1)',
        },
        'light': {
            thin: '#d9d8ff',
            thick: '#ffdbdb',
            smallCircle: '#6d6dff',
            bigCircle: '#ff7171',
            border: 'rgba(0, 0, 0, 1)',
        },
    },
    {
        'dark': {
            thin: 'red',
            thick: 'blue',
            smallCircle: 'black',
            bigCircle: 'black',
            border: 'rgba(0, 0, 0, 0)',
        },
        'light': {
            thin: 'red',
            thick: 'blue',
            smallCircle: 'white',
            bigCircle: 'white',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
];
