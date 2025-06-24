import React from 'react';
import {Alert, Box, Button, TextField} from '@mui/material';
import {User} from '@/hooks/useUserTable';
import {useUserForm} from '@/hooks/useUserForm';

interface UserFormProps {
    onUserCreated?: () => void;
    initialValues?: User;
    isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({onUserCreated, initialValues, isEdit}) => {
    const {
        name,
        setName,
        email,
        setEmail,
        loading,
        error,
        success,
        handleSubmit,
    } = useUserForm({initialValues, isEdit, onUserCreated});

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