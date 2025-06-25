import {useState, useEffect} from 'react';

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

interface UseCourseAssignmentProps {
    user: User | null;
    open: boolean;
    onAssignmentChange: () => void;
}

export const useCourseAssignment = ({user, open, onAssignmentChange}: UseCourseAssignmentProps) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const [coursesRes, userCoursesRes] = await Promise.all([
                fetch('/api/courses'),
                fetch(`/api/user-courses?userId=${user.id}`)
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setActionLoading(false);
        }
    };

    // Fetch data when dialog opens and user changes
    const fetchDataWhenDialogOpens = () => {
        if (open && user) {
            fetchData();
        }
    };

    useEffect(fetchDataWhenDialogOpens, [open, user]);

    const availableCourses = courses.filter(
        course => !userCourses.some(userCourse => userCourse.id === course.id)
    );

    return {
        // State
        courses,
        userCourses,
        selectedCourse,
        loading,
        error,
        actionLoading,
        availableCourses,

        // Actions
        setSelectedCourse,
        handleAssignCourse,
        handleRemoveCourse,
        fetchData,
    };
}; 