import React from 'react';
import {
    Box,
    Button,
    Chip,
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
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Loading from './common/Loading';
import ErrorAlert from './common/ErrorAlert';
import EmptyState from './common/EmptyState';
import {useCourseAssignment} from '@/hooks/useCourseAssignment';

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
                                                               open,
                                                               onClose,
                                                               user,
                                                               onAssignmentChange
                                                           }) => {
    const {
        userCourses,
        loading,
        error,
        actionLoading,
        availableCourses,
        selectedCourse,
        setSelectedCourse,
        handleAssignCourse,
        handleRemoveCourse,
    } = useCourseAssignment({user, open, onAssignmentChange});

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Manage Courses for {user?.name}
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Loading/>
                ) : (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, mt: 1}}>
                        {error && <ErrorAlert message={error}/>}

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
                                <EmptyState
                                    message="No courses assigned yet"
                                    description="Start by assigning some courses to this user"
                                    icon={<SchoolIcon fontSize="large"/>}
                                />
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
                                <EmptyState
                                    message="All courses assigned"
                                    description="This user has been assigned to all available courses"
                                    icon={<AssignmentIcon fontSize="large"/>}
                                />
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