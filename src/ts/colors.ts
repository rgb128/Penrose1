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
    // 20.07.23
    {
        'dark': {
            thick: '#61481C',
            thin: '#A47E3B',
            bigCircle: '#BF9742',
            smallCircle: '#E6B325',
            border: 'rgba(0, 0, 0, 1)',
        },
        'light': {
            thick: '#E93B81',
            thin: '#F5ABC9',
            bigCircle: '#FFE5E2',
            smallCircle: '#B6C9F0',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#3A4750',
            thin: '#303841',
            bigCircle: '#F6C90E',
            smallCircle: '#EEEEEE',
            border: 'rgba(0, 0, 0, 1)',
        },
        'light': {
            thick: '#FAF1E6',
            thin: '#FAF1E6',
            bigCircle: '#064420',
            smallCircle: '#064420',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#3E432E',
            thin: '#000000',
            bigCircle: '#616F39',
            smallCircle: '#A7D129',
            border: 'rgba(0, 0, 0, 1)',
        },
        'light': {
            thick: '#D36B00',
            thin: '#42032C',
            bigCircle: '#E6D2AA',
            smallCircle: '#F1EFDC',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#3C2A21',
            thin: '#1A120B',
            bigCircle: '#D5CEA3',
            smallCircle: '#E5E5CB',
            border: 'rgba(0, 0, 0, 0)',
        },
        'light': {
            thick: '#FFD93D',
            thin: '#F6F1E9',
            bigCircle: '#FF8400',
            smallCircle: '#4F200D',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#393E46',
            thin: '#222831',
            bigCircle: '#D65A31',
            smallCircle: '#EEEEEE',
            border: 'rgba(0, 0, 0, 0)',
        },
        'light': {
            thick: '#FBF2CF',
            thin: '#FA7070',
            bigCircle: '#C6EBC5',
            smallCircle: '#A1C298',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#F7A440',
            thin: '#E1701A',
            bigCircle: '#F5E6CA',
            smallCircle: '#F6DCBF',
            border: 'rgba(0, 0, 0, 0)',
        },
        'light': {
            thick: '#FF8E9E',
            thin: '#FF597B',
            bigCircle: '#EEEEEE',
            smallCircle: '#F9B5D0',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#52057B',
            thin: '#000000',
            bigCircle: '#BC6FF1',
            smallCircle: '#892CDC',
            border: 'rgba(0, 0, 0, 1)',
        },
        'light': {
            thick: '#F8F3D4',
            thin: '#00B8A9',
            bigCircle: '#FFDE7D',
            smallCircle: '#F6416C',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#88304E',
            thin: '#E23E57',
            bigCircle: '#311D3F',
            smallCircle: '#522546',
            border: 'rgba(0, 0, 0, 0)',
        },
        'light': {
            thick: '#E8DFCA',
            thin: '#F5EFE6',
            bigCircle: '#7895B2',
            smallCircle: '#AEBDCA',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#393E46',
            thin: '#222831',
            bigCircle: '#EEEEEE',
            smallCircle: '#00ADB5',
            border: 'rgba(0, 0, 0, 0)',
        },
        'light': {
            thick: '#DBE2EF',
            thin: '#F9F7F7',
            bigCircle: '#112D4E',
            smallCircle: '#3F72AF',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
    {
        'dark': {
            thick: '#191919',
            thin: '#2D4263',
            bigCircle: '#C84B31',
            smallCircle: '#ECDBBA',
            border: 'rgba(0, 0, 0, 0)',
        },
        'light': {
            thick: '#96B6C5',
            thin: '#ADC4CE',
            bigCircle: '#EEE0C9',
            smallCircle: '#F1F0E8',
            border: 'rgba(0, 0, 0, 0)',
        },
    },
];
