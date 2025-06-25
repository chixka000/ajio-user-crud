import {useState, useMemo} from 'react';

export interface Course {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    _count: {
        users: number;
    };
}

// Constants
const DEFAULT_ROWS_PER_PAGE = 5;

export function useCourseTable(courses: Course[]) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

    // Filtered and searched courses
    const calculateFilteredCourses = () => {
        const filtered = courses.filter(course => {
            const searchLower = search.toLowerCase();
            return (
                course.title.toLowerCase().includes(searchLower) ||
                (course.description && course.description.toLowerCase().includes(searchLower))
            );
        });
        // Reset to first page when search changes
        setPage(0);
        return filtered;
    };

    const filteredCourses = useMemo(calculateFilteredCourses, [courses, search]);

    // Paginated courses
    const calculatePaginatedCourses = () => {
        const start = page * rowsPerPage;
        return filteredCourses.slice(start, start + rowsPerPage);
    };

    const paginatedCourses = useMemo(calculatePaginatedCourses, [filteredCourses, page, rowsPerPage]);

    // Handler for changing rows per page
    const handleRowsPerPageChange = (value: number) => {
        setRowsPerPage(value);
        setPage(0);
    };

    return {
        search,
        setSearch,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage: handleRowsPerPageChange,
        filteredCourses,
        paginatedCourses,
    };
}