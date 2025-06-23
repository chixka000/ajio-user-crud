import React, { useState } from "react";
import { Box, Button, Dialog, TextField, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import UserForm from '@/components/UserForm';

interface UserTableToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  onUserCreated?: () => void;
}

const UserTableToolbar: React.FC<UserTableToolbarProps> = ({
  search,
  setSearch,
  onUserCreated,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUserCreatedLocal = () => {
    if (onUserCreated) onUserCreated();
    handleClose();
  };

  return (
    <Box
      mb={2}
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      gap={2}
      justifyContent="flex-end"
    >
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <UserForm onUserCreated={handleUserCreatedLocal} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ width: { xs: '100%', sm: 240 }, minWidth: { sm: 240 } }}
      >
        Add User
      </Button>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search by name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ width: { xs: '100%', sm: 240 }, minWidth: { sm: 240 } }}
        inputProps={{ "aria-label": "search users by name" }}
      />
    </Box>
  );
};

export default UserTableToolbar;
