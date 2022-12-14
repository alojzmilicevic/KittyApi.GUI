import { styled } from '@mui/material';
import TextField from '@mui/material/TextField';

export const StyledTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    width: '100%',
    '& label.Mui-focused': {
        color: theme.palette.primary.contrastText
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.secondary.main
        }
    }
}));
