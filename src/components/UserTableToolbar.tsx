import React from 'react';
import { Box, TextField } from '@mui/material';

interface UserTableToolbarProps {
  search: string;
  setSearch: (value: string) => void;
}

const UserTableToolbar: React.FC<UserTableToolbarProps> = ({ search, setSearch }) => {
  return (
    <Box mb={2} display="flex" justifyContent="flex-end">
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ minWidth: 240 }}
        inputProps={{ 'aria-label': 'search users by name' }}
      />
    </Box>
  );
};

export default UserTableToolbar; 