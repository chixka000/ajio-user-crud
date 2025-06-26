import {useState, useMemo, useEffect, useCallback} from 'react';
import {useRefresh} from './useRefresh';

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

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

// Constants
const DEFAULT_ROWS_PER_PAGE = 5;

export function useUserTable(users: User[]) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

    // Filtered and searched users
    const calculateFilteredUsers = () => {
        return users.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const filteredUsers = useMemo(calculateFilteredUsers, [users, search]);

    // Paginated users
    const calculatePaginatedUsers = () => {
        const start = page * rowsPerPage;
        return filteredUsers.slice(start, start + rowsPerPage);
    };

    const paginatedUsers = useMemo(calculatePaginatedUsers, [filteredUsers, page, rowsPerPage]);

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

// New comprehensive hook for user table management
export function useUserTableActions() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [courseAssignUser, setCourseAssignUser] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const {refreshCounter, refresh} = useRefresh();
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Load users function
    const loadUsers = useCallback(() => {
        let ignore = false;

        setLoading(true);
        setError(null);

        const performFetch = async () => {
            try {
                const response = await fetch('/api/user-courses');
                const data = await response.json();
                if (!ignore) {
                    if (Array.isArray(data)) {
                        setUsers(data);
                    } else {
                        setError(data.error || 'Failed to fetch users');
                    }
                }
            } catch (error: unknown) {
                if (!ignore) {
                    setError(error instanceof Error ? error.message : 'An error occurred');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        performFetch();
        return () => {
            ignore = true;
        };
    }, []);

    // Load users on mount and refresh
    const setupLoadUsers = () => {
        const cleanup = loadUsers();
        return cleanup;
    };

    useEffect(setupLoadUsers, [loadUsers, refreshCounter]);

    // Dialog handlers
    const handleEdit = useCallback((user: User) => setEditUser(user), []);
    const handleEditClose = useCallback(() => setEditUser(null), []);
    const handleCourseAssign = useCallback((user: User) => setCourseAssignUser(user), []);
    const handleCourseAssignClose = useCallback(() => setCourseAssignUser(null), []);
    const handleDelete = useCallback((user: User) => setDeleteUser(user), []);
    const handleDeleteClose = useCallback(() => setDeleteUser(null), []);

    // Snackbar handlers
    const handleShowSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    }, []);

    const handleSnackbarClose = useCallback(() => {
        setSnackbar({open: false, message: '', severity: 'success'});
    }, []);

    // Success handlers
    const handleEditSuccess = useCallback(() => {
        refresh();
        handleEditClose();
        handleShowSnackbar('User updated successfully!', 'success');
    }, [refresh, handleEditClose, handleShowSnackbar]);

    const handleUserCreationSuccess = useCallback(() => {
        refresh();
        handleShowSnackbar('User created successfully!', 'success');
    }, [refresh, handleShowSnackbar]);

    const handleAssignmentChange = useCallback(() => {
        refresh();
    }, [refresh]);

    // Delete confirmation handler
    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteUser) return;

        setActionLoading(true);
        setActionError(null);

        try {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: deleteUser.id}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete user');
            }

            refresh();
            handleDeleteClose();
            handleShowSnackbar('User deleted successfully!', 'error');
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setActionLoading(false);
        }
    }, [deleteUser, refresh, handleDeleteClose, handleShowSnackbar]);

    // Button handler creators
    const createCourseAssignHandler = useCallback((user: User) => () => handleCourseAssign(user), [handleCourseAssign]);
    const createEditHandler = useCallback((user: User) => () => handleEdit(user), [handleEdit]);
    const createDeleteHandler = useCallback((user: User) => () => handleDelete(user), [handleDelete]);

    return {
        // Data state
        users,
        loading,
        error,

        // Dialog state
        editUser,
        deleteUser,
        courseAssignUser,

        // Action state
        actionLoading,
        actionError,

        // Snackbar state
        snackbar,

        // Handlers
        handleEdit,
        handleEditClose,
        handleCourseAssign,
        handleCourseAssignClose,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
        handleEditSuccess,
        handleUserCreationSuccess,
        handleAssignmentChange,
        handleShowSnackbar,
        handleSnackbarClose,

        // Button handler creators
        createCourseAssignHandler,
        createEditHandler,
        createDeleteHandler,
    };
} 