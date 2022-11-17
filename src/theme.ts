import { createTheme, ThemeOptions } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material';

const generalThemeOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Calibri", "Helvetica", "Arial", sans-serif'
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 1024,
            lg: 1200,
            xl: 1536
        }
    }
};

const darkTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#424242',
        },
        secondary: {
            main: '#ffd180'
        }
    },
    ...generalThemeOptions,
};

const lightTheme: ThemeOptions = {
    palette: {
        ...darkTheme.palette,
        mode: 'light'
    },
    ...generalThemeOptions,
};

export const createMyTheme = (darkMode: boolean) =>
    responsiveFontSizes(createTheme(darkMode ? { ...darkTheme } : { ...lightTheme }));
