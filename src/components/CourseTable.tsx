import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Box, CircularProgress, Alert, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, Snackbar, Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CourseForm from './CourseForm';

interface Course {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
  };
}

const CourseTable: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [localRefresh, setLocalRefresh] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, message: '', severity: 'success' 
  });

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (!ignore) {
          if (Array.isArray(data)) setCourses(data);
          else setError(data.error || 'Failed to fetch courses');
        }
      })
      .catch(err => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, [localRefresh]);

  const handleEdit = (course: Course) => setEditCourse(course);
  const handleEditClose = () => setEditCourse(null);
  const handleShowSnackbar = (message: string, severity: 'success' | 'error') => 
    setSnackbar({ open: true, message, severity });
  const handleSnackbarClose = () => setSnackbar({ open: false, message: '', severity: 'success' });

  const handleEditSuccess = () => {
    setLocalRefresh(r => r + 1);
    handleEditClose();
    handleShowSnackbar('Course updated successfully!', 'success');
  };

  const handleDelete = (course: Course) => setDeleteCourse(course);
  const handleDeleteClose = () => setDeleteCourse(null);
  const handleDeleteConfirm = async () => {
    if (!deleteCourse) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch('/api/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteCourse.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete course');
      }
      setLocalRefresh(r => r + 1);
      handleDeleteClose();
      handleShowSnackbar('Course deleted successfully!', 'success');
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
      <TableContainer>
        <Table size="small" aria-label="courses table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Enrolled Students</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course.id}>
                <TableCell sx={{ fontWeight: 500 }}>{course.title}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  {course.description || <em>No description</em>}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${course._count.users} student${course._count.users !== 1 ? 's' : ''}`}
                    size="small"
                    color={course._count.users > 0 ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(course)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Course Modal */}
      <Dialog open={!!editCourse} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          {editCourse && (
            <CourseForm
              onCourseCreated={handleEditSuccess}
              initialValues={editCourse}
              isEdit
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCourse} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          {actionError && <Alert severity="error">{actionError}</Alert>}
          Are you sure you want to delete course <b>{deleteCourse?.title}</b>?
          {deleteCourse && deleteCourse._count.users > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This course has {deleteCourse._count.users} enrolled student{deleteCourse._count.users !== 1 ? 's' : ''}. 
              Deleting it will remove all enrollments.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={actionLoading}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default CourseTable;