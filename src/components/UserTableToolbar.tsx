import React, {useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import UserForm from '@/components/UserForm';
import FormDialog from '@/components/common/FormDialog';

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

    // Named function for search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

    return (
        <Box
            mb={2}
            display="flex"
            flexDirection={{xs: 'column', sm: 'row'}}
            alignItems="center"
            gap={2}
            justifyContent="flex-end"
        >
            <FormDialog
                open={open}
                onClose={handleClose}
                title="Add User"
                maxWidth="xs"
                fullWidth
            >
                <UserForm onUserCreated={handleUserCreatedLocal}/>
            </FormDialog>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
            >
                Add User
            </Button>
            <TextField
                size="small"
                variant="outlined"
                placeholder="Search by name"
                value={search}
                onChange={handleSearchChange}
                sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
                inputProps={{"aria-label": "search users by name"}}
            />
        </Box>
    );
};

export default UserTableToolbar;
