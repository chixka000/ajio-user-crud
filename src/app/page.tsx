"use client";
import React, { useState } from 'react';
import UserTable from '@/components/UserTable';
import UserForm from '@/components/UserForm';
import { Box } from '@mui/material';

export default function Home() {

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f7f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100vw', sm: 600, md: 1200 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: { xs: 0, sm: 2 },
          p: { xs: 2, sm: 4 },
          mt: { xs: 1, sm: 4 },
        }}
      >
        <h1 style={{ fontWeight: 600, fontSize: 32, marginBottom: 24, textAlign: 'center' }}>Users Dashboard</h1>
        <UserTable />
      </Box>
    </Box>
  );
}
