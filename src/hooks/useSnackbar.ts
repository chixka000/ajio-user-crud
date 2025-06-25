import {useState} from 'react';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

export const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success',
    });

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    };

    const hideSnackbar = () => {
        setSnackbar({open: false, message: '', severity: 'success'});
    };

    return {
        snackbar,
        showSnackbar,
        hideSnackbar,
    };
};