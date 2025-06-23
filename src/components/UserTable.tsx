import React, {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import UserTableToolbar from './UserTableToolbar';
import {User, useUserTable} from '../hooks/useUserTable';
import UserForm from './UserForm';
import CourseAssignment from './CourseAssignment';
import {formatRelativeTime} from '../utils/dateFormat';


// Constants
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25] as const;
const SNACKBAR_AUTO_HIDE_DURATION = 3000;
const DECIMAL_RADIX = 10;

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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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
    return () => { ignore = true; };
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
  const handleShowSnackbar = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });
  const handleSnackbarClose = () => setSnackbar({ open: false, message: '', severity: 'success' });

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteUser.id }),
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

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <UserTableToolbar
        search={search}
        setSearch={setSearch}
        onUserCreated={() => {
          setLocalRefresh(r => r + 1);
          handleShowSnackbar('User created successfully!', 'success');
        }}
      />
      <TableContainer>
        <Table size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.courses && user.courses.length > 0 ? (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                      {user.courses.map(course => (
                        <Chip
                          key={course.id}
                          label={course.title}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  ) : (
                    <em>No courses</em>
                  )}
                </TableCell>
                <TableCell>
                  {user.createdAt && formatRelativeTime(user.createdAt)}
                </TableCell>
                <TableCell>
                  {user.updatedAt && formatRelativeTime(user.updatedAt)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleCourseAssign(user)}
                    title="Manage Courses"
                  >
                    <SchoolIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, DECIMAL_RADIX))}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </Box>
      {/* Edit User Modal */}
      <Dialog open={!!editUser} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <UserForm
              onUserCreated={handleEditSuccess}
              initialValues={editUser}
              isEdit
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          {actionError && <Alert severity="error">{actionError}</Alert>}
          Are you sure you want to delete user <b>{deleteUser?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={actionLoading}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Course Assignment Modal */}
      <CourseAssignment
        open={!!courseAssignUser}
        onClose={handleCourseAssignClose}
        user={courseAssignUser}
        onAssignmentChange={handleAssignmentChange}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserTable; 