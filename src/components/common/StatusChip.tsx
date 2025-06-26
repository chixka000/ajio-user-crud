import {Chip} from '@mui/material';
import React from 'react';

interface StatusChipProps {
    count: number;
    singularLabel: string;
    pluralLabel?: string;
    size?: 'small' | 'medium';
    colorWhenEmpty?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    colorWhenFilled?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const StatusChip: React.FC<StatusChipProps> = ({
                                                   count,
                                                   singularLabel,
                                                   pluralLabel,
                                                   size = 'small',
                                                   colorWhenEmpty = 'default',
                                                   colorWhenFilled = 'primary',
                                               }) => {
    const label = count === 1
        ? `${count} ${singularLabel}`
        : `${count} ${pluralLabel || singularLabel + 's'}`;

    const color = count > 0 ? colorWhenFilled : colorWhenEmpty;

    return (
        <Chip
            label={label}
            size={size}
            color={color}
        />
    );
};

export default StatusChip;