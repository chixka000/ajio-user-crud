import React from 'react';
import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableProps,
    TableRow
} from '@mui/material';

interface Column<T> {
    key: keyof T | string;
    label: string;
    align?: 'left' | 'center' | 'right';
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    error?: string | null;
    page: number;
    rowsPerPage: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    rowsPerPageOptions?: readonly number[];
    emptyMessage?: string;
    tableProps?: Partial<TableProps>;
    getRowKey: (item: T) => string | number;
    toolbar?: React.ReactNode;
}

const DECIMAL_RADIX = 10;
const DEFAULT_ROWS_PER_PAGE_OPTIONS = [5, 10, 25] as const;

const DataTable = <T,>({
    data,
    columns,
    loading = false,
    page,
    rowsPerPage,
    totalCount,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
    emptyMessage = 'No data found.',
    tableProps = {},
    getRowKey,
    toolbar,
}: DataTableProps<T>) => {
    const handlePageChange = (event: unknown, newPage: number) => {
        onPageChange(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onRowsPerPageChange(parseInt(event.target.value, DECIMAL_RADIX));
    };

    if (loading) {
        return (
            <Paper elevation={0} sx={{p: 2}}>
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress/>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{p: 2}}>
            {toolbar}
            <TableContainer>
                <Table size="small" {...tableProps}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell key={index} align={column.align || 'left'}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={getRowKey(item)}>
                                {columns.map((column, index) => (
                                    <TableCell key={index} align={column.align || 'left'}>
                                        {column.render 
                                            ? column.render(item)
                                            : String((item as any)[column.key] || '')
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="flex-end">
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={rowsPerPageOptions}
                />
            </Box>
        </Paper>
    );
};

export default DataTable;