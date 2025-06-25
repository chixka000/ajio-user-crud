import {Chip, Stack, Box, Typography} from '@mui/material';
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
    emptyDescription?: string;
    emptyIcon?: React.ReactNode;
    useCompactEmptyState?: boolean;
}

const ChipList: React.FC<ChipListProps> = ({
                                               items,
                                               color = 'primary',
                                               variant = 'outlined',
                                               size = 'small',
                                               emptyText = 'No items',
                                               emptyDescription,
                                               emptyIcon,
                                               useCompactEmptyState = false,
                                           }) => {
    if (!items || items.length === 0) {
        if (useCompactEmptyState) {
            return (
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{color: 'text.secondary'}}
                >
                    {emptyIcon && (
                        <Box sx={{fontSize: '1.2rem', display: 'flex', alignItems: 'center'}}>
                            {emptyIcon}
                        </Box>
                    )}
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {emptyText}
                        </Typography>
                        {emptyDescription && (
                            <Typography variant="caption" color="text.secondary">
                                {emptyDescription}
                            </Typography>
                        )}
                    </Box>
                </Box>
            );
        }
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