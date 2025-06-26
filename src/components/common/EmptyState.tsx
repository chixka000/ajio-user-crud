import {Box, Typography} from '@mui/material';
import React from 'react';

interface EmptyStateProps {
    message: string;
    description?: string;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   message,
                                                   description,
                                                   icon,
                                               }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            textAlign="center"
        >
            {icon && (
                <Box mb={2} color="text.secondary">
                    {icon}
                </Box>
            )}
            <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
            >
                {message}
            </Typography>
            {description && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {description}
                </Typography>
            )}
        </Box>
    );
};

export default EmptyState;