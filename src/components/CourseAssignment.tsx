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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography
} from '@mui/material';

interface Course {
    id: string;
    title: string;
    description: string | null;
}

interface User {
    id: string;
    name: string;
    email: string;
    courses?: Course[];
}

interface CourseAssignmentProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    onAssignmentChange: () => void;
}

const CourseAssignment: React.FC<CourseAssignmentProps> = ({
                                                               open, onClose, user, onAssignmentChange
                                                           }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleDialogOpenAndUserChange = () => {
        if (open && user) {
            fetchData();
        }
    };

    useEffect(handleDialogOpenAndUserChange, [open, user]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [coursesRes, userCoursesRes] = await Promise.all([
                fetch('/api/courses'),
                fetch(`/api/user-courses?userId=${user?.id}`)
            ]);

            if (!coursesRes.ok || !userCoursesRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [coursesData, userCoursesData] = await Promise.all([
                coursesRes.json(),
                userCoursesRes.json()
            ]);

            setCourses(coursesData);
            setUserCourses(userCoursesData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignCourse = async () => {
        if (!selectedCourse || !user) return;

        setActionLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/user-courses', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: user.id, courseId: selectedCourse}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to assign course');
            }

            setSelectedCourse('');
            await fetchData();
            onAssignmentChange();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveCourse = async (courseId: string) => {
        if (!user) return;

        setActionLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/user-courses', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: user.id, courseId}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to remove course');
            }

            await fetchData();
            onAssignmentChange();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const availableCourses = courses.filter(
        course => !userCourses.some(userCourse => userCourse.id === course.id)
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Manage Courses for {user?.name}
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, mt: 1}}>
                        {error && <Alert severity="error">{error}</Alert>}

                        {/* Current Courses */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Current Courses ({userCourses.length})
                            </Typography>
                            {userCourses.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                    {userCourses.map(course => (
                                        <Chip
                                            key={course.id}
                                            label={course.title}
                                            onDelete={() => handleRemoveCourse(course.id)}
                                            disabled={actionLoading}
                                            color="primary"
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Typography color="text.secondary">
                                    No courses assigned yet.
                                </Typography>
                            )}
                        </Box>

                        {/* Assign New Course */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Assign New Course
                            </Typography>
                            {availableCourses.length > 0 ? (
                                <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                                    <FormControl size="small" sx={{minWidth: 200}}>
                                        <InputLabel>Select Course</InputLabel>
                                        <Select
                                            value={selectedCourse}
                                            onChange={(e) => setSelectedCourse(e.target.value)}
                                            label="Select Course"
                                            disabled={actionLoading}
                                        >
                                            {availableCourses.map(course => (
                                                <MenuItem key={course.id} value={course.id}>
                                                    {course.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="contained"
                                        onClick={handleAssignCourse}
                                        disabled={!selectedCourse || actionLoading}
                                        size="small"
                                    >
                                        {actionLoading ? 'Assigning...' : 'Assign'}
                                    </Button>
                                </Box>
                            ) : (
                                <Typography color="text.secondary">
                                    All available courses have been assigned.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={actionLoading}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourseAssignment;