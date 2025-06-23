import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Alert } from '@mui/material';
import { User } from '../hooks/useUserTable';
import { validateUserForm } from '../utils/validation';

interface UserFormProps {
  onUserCreated?: () => void;
  initialValues?: User;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated, initialValues, isEdit }) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setEmail(initialValues.email || '');
    }
  }, [initialValues]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const validationError = validateUserForm(name, email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isEdit && initialValues) {
        res = await fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: initialValues.id, name, email }),
        });
      } else {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save user');
      }
      setSuccess(true);
      if (!isEdit) {
        setName('');
        setEmail('');
      }
      if (onUserCreated) onUserCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      mb={3}
      pt={2}
      display="flex"
      flexDirection="column"
      gap={2}
      maxWidth={400}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">User {isEdit ? 'updated' : 'created'} successfully!</Alert>}
      <TextField
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={loading}
        fullWidth
        required
      />
      <TextField
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={loading}
        required
        type="email"
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update User' : 'Add User'}
      </Button>
    </Box>
  );
};

export default UserForm; 