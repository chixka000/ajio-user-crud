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
import CourseForm from './CourseForm';
import CourseTableToolbar from './CourseTableToolbar';
import {Course, useCourseTable} from '../hooks/useCourseTable';
import {formatRelativeTime} from '../utils/dateFormat';

// Constants
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25] as const;
const SNACKBAR_AUTO_HIDE_DURATION = 3000;
const DECIMAL_RADIX = 10;

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

    const loadCourses = () => {
        let ignore = false;

        setLoading(true);
        setError(null);

        const performFetch = async () => {
            try {
                const response = await fetch('/api/courses');
                const data = await response.json();
                if (!ignore) {
                    if (Array.isArray(data)) setCourses(data);
                    else setError(data.error || 'Failed to fetch courses');
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

    useEffect(loadCourses, [localRefresh]);

    const handleEdit = (course: Course) => setEditCourse(course);
    const handleEditClose = () => setEditCourse(null);
    const handleShowSnackbar = (message: string, severity: 'success' | 'error') =>
        setSnackbar({open: true, message, severity});

    const {
        search,
        setSearch,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        filteredCourses,
        paginatedCourses,
    } = useCourseTable(courses);
    const handleSnackbarClose = () => setSnackbar({open: false, message: '', severity: 'success'});

    const handleEditSuccess = () => {
        setLocalRefresh(r => r + 1);
        handleEditClose();
        handleShowSnackbar('Course updated successfully!', 'success');
    };

    const handleCreateSuccess = () => {
        setLocalRefresh(r => r + 1);
        handleShowSnackbar('Course created successfully!', 'success');
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: deleteCourse.id}),
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

    if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress/></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Paper elevation={0} sx={{p: 2}}>
            <CourseTableToolbar
                search={search}
                setSearch={setSearch}
                onCourseCreated={handleCreateSuccess}
            />
            <TableContainer>
                <Table size="small" aria-label="courses table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Enrolled Students</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Updated</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCourses.map(course => (
                            <TableRow key={course.id}>
                                <TableCell sx={{fontWeight: 500}}>{course.title}</TableCell>
                                <TableCell sx={{maxWidth: 300}}>
                                    {course.description || <em>No description</em>}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${course._count.users} student${course._count.users !== 1 ? 's' : ''}`}
                                        size="small"
                                        color={course._count.users > 0 ? 'primary' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    {course.createdAt && formatRelativeTime(course.createdAt)}
                                </TableCell>
                                <TableCell>
                                    {course.updatedAt && formatRelativeTime(course.updatedAt)}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(course)}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(course)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedCourses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="flex-end">
                <TablePagination
                    component="div"
                    count={filteredCourses.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, DECIMAL_RADIX))}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                />
            </Box>

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
                        <Alert severity="warning" sx={{mt: 2}}>
                            This course has {deleteCourse._count.users} enrolled
                            student{deleteCourse._count.users !== 1 ? 's' : ''}.
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
                autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default CourseTable;