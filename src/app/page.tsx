"use client";
import React, { useState } from 'react';
import UserTable from '@/components/UserTable';
import UserForm from '@/components/UserForm';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function Home() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUserCreated = () => {
    setRefreshSignal(s => s + 1);
    handleClose();
  };

  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontWeight: 600, fontSize: 32, marginBottom: 24 }}>Users Dashboard</h1>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>
        Add User
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <UserForm onUserCreated={handleUserCreated} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <UserTable refreshSignal={refreshSignal} />
    </main>
  );
}
