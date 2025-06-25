import React, {useEffect, useState} from 'react';
import UserTableToolbar from './UserTableToolbar';
import {User, useUserTable} from '@/hooks/useUserTable';
import UserForm from './UserForm';
import CourseAssignment from './CourseAssignment';
import {formatRelativeTime} from '@/utils/dateFormat';
import DataTable from './common/DataTable';
import FormDialog from './common/FormDialog';
import ConfirmationDialog from './common/ConfirmationDialog';
import NotificationSnackbar from './common/NotificationSnackbar';
import ActionButtons, {createCourseButton, createDeleteButton, createEditButton} from './common/ActionButtons';
import ErrorAlert from './common/ErrorAlert';
import ChipList from './common/ChipList';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';


const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [courseAssignUser, setCourseAssignUser] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [localRefresh, setLocalRefresh] = useState(0);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error'
    }>({open: false, message: '', severity: 'success'});

    const loadUsers = () => {
        let ignore = false;

        setLoading(true);
        setError(null);

        const performFetch = async () => {
            try {
                const response = await fetch('/api/user-courses');
                const data = await response.json();
                if (!ignore) {
                    if (Array.isArray(data)) setUsers(data);
                    else setError(data.error || 'Failed to fetch users');
                }
            } catch (error: any) {
                if (!ignore) setError(error.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        performFetch();
        return () => {
            ignore = true;
        };
    };

    useEffect(loadUsers, [localRefresh]);

    const {
        search,
        setSearch,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        filteredUsers,
        paginatedUsers,
    } = useUserTable(users);

    const handleEdit = (user: User) => setEditUser(user);
    const handleEditClose = () => setEditUser(null);
    const handleCourseAssign = (user: User) => setCourseAssignUser(user);
    const handleCourseAssignClose = () => setCourseAssignUser(null);
    const handleShowSnackbar = (message: string, severity: 'success' | 'error') => setSnackbar({
        open: true,
        message,
        severity
    });
    const handleSnackbarClose = () => setSnackbar({open: false, message: '', severity: 'success'});

    const handleEditSuccess = () => {
        setLocalRefresh(r => r + 1);
        handleEditClose();
        handleShowSnackbar('User updated successfully!', 'success');
    };

    const handleAssignmentChange = () => {
        setLocalRefresh(r => r + 1);
    };

    const handleDelete = (user: User) => setDeleteUser(user);
    const handleDeleteClose = () => setDeleteUser(null);
    const handleDeleteConfirm = async () => {
        if (!deleteUser) return;
        setActionLoading(true);
        setActionError(null);
        try {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: deleteUser.id}),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete user');
            }
            setLocalRefresh(r => r + 1);
            handleDeleteClose();
            handleShowSnackbar('User deleted successfully!', 'error');
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (error) return <ErrorAlert message={error}/>;

    const columns = [
        {key: 'name', label: 'Name'},
        {key: 'email', label: 'Email'},
        {
            key: 'courses',
            label: 'Courses',
            render: (user: User) => (
                <ChipList
                    items={user.courses?.map(course => ({
                        id: course.id,
                        label: course.title,
                    })) || []}
                    color="primary"
                    variant="outlined"
                    size="small"
                    emptyText="No courses assigned"
                    emptyDescription="Click the school icon to assign courses"
                    emptyIcon={<SchoolIcon/>}
                    useCompactEmptyState={true}
                />
            ),
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (user: User) => user.createdAt && formatRelativeTime(user.createdAt),
        },
        {
            key: 'updatedAt',
            label: 'Updated',
            render: (user: User) => user.updatedAt && formatRelativeTime(user.updatedAt),
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right' as const,
            render: (user: User) => (
                <ActionButtons
                    buttons={[
                        createCourseButton(() => handleCourseAssign(user)),
                        createEditButton(() => handleEdit(user)),
                        createDeleteButton(() => handleDelete(user)),
                    ]}
                />
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={paginatedUsers}
                columns={columns}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredUsers.length}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                getRowKey={(user) => user.id}
                emptyMessage="No users found"
                emptyDescription="Create your first user to get started"
                emptyIcon={<PersonIcon fontSize="large"/>}
                tableProps={{'aria-label': 'users table'}}
                toolbar={
                    <UserTableToolbar
                        search={search}
                        setSearch={setSearch}
                        onUserCreated={() => {
                            setLocalRefresh(r => r + 1);
                            handleShowSnackbar('User created successfully!', 'success');
                        }}
                    />
                }
            />
            <FormDialog
                open={!!editUser}
                onClose={handleEditClose}
                title="Edit User"
                maxWidth="xs"
                fullWidth
            >
                {editUser && (
                    <UserForm
                        onUserCreated={handleEditSuccess}
                        initialValues={editUser}
                        isEdit
                    />
                )}
            </FormDialog>

            <ConfirmationDialog
                open={!!deleteUser}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                message={<>Are you sure you want to delete user <b>{deleteUser?.name}</b>?</>}
                confirmText="Delete"
                confirmColor="error"
                loading={actionLoading}
                error={actionError}
            />

            <CourseAssignment
                open={!!courseAssignUser}
                onClose={handleCourseAssignClose}
                user={courseAssignUser}
                onAssignmentChange={handleAssignmentChange}
            />

            <NotificationSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
            />
        </>
    );
};

export default UserTable; 