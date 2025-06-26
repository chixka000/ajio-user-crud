import {TextField, TextFieldProps} from '@mui/material';
import React from 'react';

interface FormFieldProps extends Omit<TextFieldProps, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    loading?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 value,
                                                 onChange,
                                                 loading = false,
                                                 disabled,
                                                 fullWidth = true,
                                                 ...props
                                             }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <TextField
            value={value}
            onChange={handleChange}
            disabled={disabled || loading}
            fullWidth={fullWidth}
            {...props}
        />
    );
};

export default FormField;