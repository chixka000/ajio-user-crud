import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, CircularProgress, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserTableToolbar from './UserTableToolbar';
import { useUserTable, User } from '../hooks/useUserTable';
import UserForm from './UserForm';

interface UserTableProps {
  refreshSignal?: number;
}

const UserTable: React.FC<UserTableProps> = ({ refreshSignal }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [localRefresh, setLocalRefresh] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (!ignore) {
          if (Array.isArray(data)) setUsers(data);
          else setError(data.error || 'Failed to fetch users');
        }
      })
      .catch(err => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, [refreshSignal, localRefresh]);

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
  const handleEditSuccess = () => {
    setLocalRefresh(r => r + 1);
    handleEditClose();
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
      <UserTableToolbar search={search} setSearch={setSearch} />
      <TableContainer>
        <Table size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(user)}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(user)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => setRowsPerPage(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25]}
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
    </Paper>
  );
};

export default UserTable; 