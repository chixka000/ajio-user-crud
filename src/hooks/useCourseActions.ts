import {useState} from 'react';
import {Course} from './useCourseTable';

interface UseCourseActionsProps {
    onRefresh: () => void;
    onShowSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export const useCourseActions = ({onRefresh, onShowSnackbar}: UseCourseActionsProps) => {
    const [editCourse, setEditCourse] = useState<Course | null>(null);
    const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleEdit = (course: Course) => setEditCourse(course);
    const handleEditClose = () => setEditCourse(null);

    const handleEditSuccess = () => {
        onRefresh();
        handleEditClose();
        onShowSnackbar('Course updated successfully!', 'success');
    };

    const handleCreateSuccess = () => {
        onRefresh();
        onShowSnackbar('Course created successfully!', 'success');
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
            onRefresh();
            handleDeleteClose();
            onShowSnackbar('Course deleted successfully!', 'success');
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setActionLoading(false);
        }
    };

    return {
        editCourse,
        deleteCourse,
        actionLoading,
        actionError,
        handleEdit,
        handleEditClose,
        handleEditSuccess,
        handleCreateSuccess,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
    };
};