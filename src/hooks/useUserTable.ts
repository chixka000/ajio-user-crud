import {useState, useMemo} from 'react';

export interface Course {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    courses?: Course[];
}

// Constants
const DEFAULT_ROWS_PER_PAGE = 5;

export function useUserTable(users: User[]) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

    // Filtered and searched users
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    // Paginated users
    const paginatedUsers = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredUsers.slice(start, start + rowsPerPage);
    }, [filteredUsers, page, rowsPerPage]);

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
        filteredUsers,
        paginatedUsers,
    };
} 