import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle
} from '@mui/material';

interface FormDialogProps extends Omit<DialogProps, 'open' | 'onClose'> {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    showCancel?: boolean;
    cancelText?: string;
    actions?: React.ReactNode;
}

const FormDialog: React.FC<FormDialogProps> = ({
                                                   open,
                                                   onClose,
                                                   title,
                                                   children,
                                                   showCancel = true,
                                                   cancelText = 'Cancel',
                                                   actions,
                                                   ...dialogProps
                                               }) => {
    return (
        <Dialog open={open} onClose={onClose} {...dialogProps}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {showCancel && (
                    <Button onClick={onClose}>
                        {cancelText}
                    </Button>
                )}
                {actions}
            </DialogActions>
        </Dialog>
    );
};

export default FormDialog;