import { styled } from '@mui/material';
import TextField from '@mui/material/TextField';

export const StyledTextField = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: theme.palette.primary.contrastText
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.secondary.main
        }
    }
}));
