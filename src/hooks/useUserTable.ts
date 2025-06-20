import { useState, useMemo } from 'react';

export interface Course {
  id: string;
  title: string;
  description: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  courses?: Course[];
}

export function useUserTable(users: User[]) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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