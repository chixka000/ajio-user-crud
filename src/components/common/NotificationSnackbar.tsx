import React from 'react';
import {Alert, Snackbar, SnackbarOrigin} from '@mui/material';

interface NotificationSnackbarProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    autoHideDuration?: number;
    anchorOrigin?: SnackbarOrigin;
}

const DEFAULT_AUTO_HIDE_DURATION = 3000;
const DEFAULT_ANCHOR_ORIGIN: SnackbarOrigin = {vertical: 'top', horizontal: 'center'};

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
                                                                       open,
                                                                       message,
                                                                       severity,
                                                                       onClose,
                                                                       autoHideDuration = DEFAULT_AUTO_HIDE_DURATION,
                                                                       anchorOrigin = DEFAULT_ANCHOR_ORIGIN,
                                                                   }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
        >
            <Alert onClose={onClose} severity={severity} sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;