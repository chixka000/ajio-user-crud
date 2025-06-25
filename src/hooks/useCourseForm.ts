import {useState, useEffect} from 'react';

interface Course {
    id: string;
    title: string;
    description: string | null;
}

interface UseCourseFormProps {
    initialValues?: Course;
    isEdit?: boolean;
    onCourseCreated?: () => void;
}

export function useCourseForm({initialValues, isEdit, onCourseCreated}: UseCourseFormProps) {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update form when initial values change
    useEffect(() => {
        if (initialValues) {
            setTitle(initialValues.title || '');
            setDescription(initialValues.description || '');
        }
    }, [initialValues]);

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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return {
        // Form state
        title,
        setTitle,
        description,
        setDescription,
        loading,
        error,

        // Form actions
        handleSubmit,
    };
} 