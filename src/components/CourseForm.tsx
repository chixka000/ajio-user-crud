import React, {useState} from 'react';
import {TextField, Button, Box, Alert} from '@mui/material';

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
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const method = isEdit ? 'PATCH' : 'POST';
            const body = isEdit
                ? JSON.stringify({id: initialValues?.id, title: title.trim(), description: description.trim() || null})
                : JSON.stringify({title: title.trim(), description: description.trim() || null});

            const res = await fetch('/api/courses', {
                method,
                headers: {'Content-Type': 'application/json'},
                body,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'create'} course`);
            }

            if (!isEdit) {
                setTitle('');
                setDescription('');
            }
            onCourseCreated?.();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                size="small"
            />

            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                disabled={loading}
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