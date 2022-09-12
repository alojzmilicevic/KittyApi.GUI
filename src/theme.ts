import { createTheme, ThemeOptions } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material';

const darkTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#212121',
        },
        secondary: {
            main: '#c8e6c9'
        }
    },
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

const lightTheme: ThemeOptions = {
    ...darkTheme,
    palette: {
        ...darkTheme.palette,
        mode: 'light'
    },
    typography: {
        ...darkTheme.typography
    },
    breakpoints: { ...darkTheme.breakpoints }
};

export const createMyTheme = (darkMode: boolean) =>
    responsiveFontSizes(createTheme(darkMode ? { ...darkTheme } : { ...lightTheme }));
