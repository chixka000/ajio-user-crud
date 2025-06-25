import {Chip, Stack} from '@mui/material';
import React from 'react';

interface ChipListProps {
    items: Array<{
        id: string;
        label: string;
    }>;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    variant?: 'filled' | 'outlined';
    size?: 'small' | 'medium';
    emptyText?: string;
}

const ChipList: React.FC<ChipListProps> = ({
    items,
    color = 'primary',
    variant = 'outlined',
    size = 'small',
    emptyText = 'No items',
}) => {
    if (!items || items.length === 0) {
        return <em>{emptyText}</em>;
    }

    return (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            {items.map((item) => (
                <Chip
                    key={item.id}
                    label={item.label}
                    size={size}
                    color={color}
                    variant={variant}
                />
            ))}
        </Stack>
    );
};

export default ChipList;