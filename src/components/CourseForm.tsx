import React from 'react';
import {Button, Box} from '@mui/material';
import FormField from './common/FormField';
import ErrorAlert from './common/ErrorAlert';
import {useCourseForm} from '@/hooks/useCourseForm';

interface Course {
    id: string;
    title: string;
    description: string | null;
}

interface CourseFormProps {
    onCourseCreated?: () => void;
    initialValues?: Course;
    isEdit?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({onCourseCreated, initialValues, isEdit = false}) => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        loading,
        error,
        handleSubmit,
    } = useCourseForm({initialValues, isEdit, onCourseCreated});

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            {error && <ErrorAlert message={error}/>}

            <FormField
                label="Course Title"
                value={title}
                onChange={setTitle}
                required
                loading={loading}
                size="small"
            />

            <FormField
                label="Description"
                value={description}
                onChange={setDescription}
                multiline
                rows={3}
                loading={loading}
                size="small"
            />

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{alignSelf: 'flex-start'}}
            >
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Course' : 'Create Course')}
            </Button>
        </Box>
    );
};

export default CourseForm;