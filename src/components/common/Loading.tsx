import React from 'react';
import {Box, CircularProgress} from '@mui/material';

const Loading: React.FC = () => (
    <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress/>
    </Box>
);

export default Loading;