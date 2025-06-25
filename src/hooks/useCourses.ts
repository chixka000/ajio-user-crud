import {useEffect, useState} from 'react';
import {Course} from './useCourseTable';

export const useCourses = (refresh: number = 0) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(loadCourses, [refresh]);

    return {
        courses,
        loading,
        error,
        refetch: loadCourses,
    };
};