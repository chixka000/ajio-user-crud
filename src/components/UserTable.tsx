import React from 'react';
import UserTableToolbar from './UserTableToolbar';
import {User, useUserTable, useUserTableActions} from '@/hooks/useUserTable';
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
    // Use the comprehensive hook for all business logic
    const {
        users,
        loading,
        error,
        editUser,
        deleteUser,
        courseAssignUser,
        actionLoading,
        actionError,
        snackbar,
        handleEditClose,
        handleCourseAssignClose,
        handleDeleteClose,
        handleDeleteConfirm,
        handleEditSuccess,
        handleUserCreationSuccess,
        handleAssignmentChange,
        handleSnackbarClose,
        createCourseAssignHandler,
        createEditHandler,
        createDeleteHandler,
    } = useUserTableActions();

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
                        createCourseButton(createCourseAssignHandler(user)),
                        createEditButton(createEditHandler(user)),
                        createDeleteButton(createDeleteHandler(user)),
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
                        onUserCreated={handleUserCreationSuccess}
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