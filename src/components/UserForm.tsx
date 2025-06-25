import React from 'react';
import {Alert, Box, Button} from '@mui/material';
import {User} from '@/hooks/useUserTable';
import {useUserForm} from '@/hooks/useUserForm';
import FormField from './common/FormField';
import ErrorAlert from './common/ErrorAlert';

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
            {error && <ErrorAlert message={error}/>}
            {success && <Alert severity="success">User {isEdit ? 'updated' : 'created'} successfully!</Alert>}
            <FormField
                label="Name"
                value={name}
                onChange={setName}
                loading={loading}
                required
            />
            <FormField
                label="Email"
                value={email}
                onChange={setEmail}
                loading={loading}
                required
                type="email"
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