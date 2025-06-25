import React, {useState} from 'react';
import CourseForm from './CourseForm';
import CourseTableToolbar from './CourseTableToolbar';
import {Course, useCourseTable} from '@/hooks/useCourseTable';
import {useCourses} from '@/hooks/useCourses';
import {useCourseActions} from '@/hooks/useCourseActions';
import {useSnackbar} from '@/hooks/useSnackbar';
import {formatRelativeTime} from '@/utils/dateFormat';
import DataTable from './common/DataTable';
import FormDialog from './common/FormDialog';
import ConfirmationDialog from './common/ConfirmationDialog';
import NotificationSnackbar from './common/NotificationSnackbar';
import ActionButtons, {createDeleteButton, createEditButton} from './common/ActionButtons';
import ErrorAlert from './common/ErrorAlert';
import StatusChip from './common/StatusChip';
import SchoolIcon from '@mui/icons-material/School';

const CourseTable: React.FC = () => {
    const [localRefresh, setLocalRefresh] = useState(0);

    const {courses, loading, error} = useCourses(localRefresh);
    const {snackbar, showSnackbar, hideSnackbar} = useSnackbar();

    const refreshCourses = () => setLocalRefresh(r => r + 1);

    const {
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
    } = useCourseActions({
        onRefresh: refreshCourses,
        onShowSnackbar: showSnackbar,
    });

    const {
        search,
        setSearch,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        filteredCourses,
        paginatedCourses,
    } = useCourseTable(courses);

    if (error) return <ErrorAlert message={error}/>;

    const columns = [
        {key: 'title', label: 'Title', render: (course: Course) => <strong>{course.title}</strong>},
        {
            key: 'description',
            label: 'Description',
            render: (course: Course) => course.description || <em>No description</em>
        },
        {
            key: 'enrolledStudents',
            label: 'Enrolled Students',
            render: (course: Course) => (
                <StatusChip
                    count={course._count.users}
                    singularLabel="student"
                    size="small"
                    colorWhenEmpty="default"
                    colorWhenFilled="primary"
                />
            ),
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (course: Course) => course.createdAt && formatRelativeTime(course.createdAt),
        },
        {
            key: 'updatedAt',
            label: 'Updated',
            render: (course: Course) => course.updatedAt && formatRelativeTime(course.updatedAt),
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right' as const,
            render: (course: Course) => (
                <ActionButtons
                    buttons={[
                        createEditButton(() => handleEdit(course)),
                        createDeleteButton(() => handleDelete(course)),
                    ]}
                />
            ),
        },
    ];

    return (
        <>
            <DataTable
                data={paginatedCourses}
                columns={columns}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredCourses.length}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                getRowKey={(course) => course.id}
                emptyMessage="No courses found"
                emptyDescription="Create your first course to get started"
                emptyIcon={<SchoolIcon fontSize="large"/>}
                tableProps={{'aria-label': 'courses table'}}
                toolbar={
                    <CourseTableToolbar
                        search={search}
                        setSearch={setSearch}
                        onCourseCreated={handleCreateSuccess}
                    />
                }
            />

            <FormDialog
                open={!!editCourse}
                onClose={handleEditClose}
                title="Edit Course"
                maxWidth="sm"
                fullWidth
            >
                {editCourse && (
                    <CourseForm
                        onCourseCreated={handleEditSuccess}
                        initialValues={editCourse}
                        isEdit
                    />
                )}
            </FormDialog>

            <ConfirmationDialog
                open={!!deleteCourse}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                title="Delete Course"
                message={<>Are you sure you want to delete course <b>{deleteCourse?.title}</b>?</>}
                confirmText="Delete"
                confirmColor="error"
                loading={actionLoading}
                error={actionError}
                warning={
                    deleteCourse && deleteCourse._count.users > 0 ? (
                        <>
                            This course has {deleteCourse._count.users} enrolled
                            student{deleteCourse._count.users !== 1 ? 's' : ''}.
                            Deleting it will remove all enrollments.
                        </>
                    ) : undefined
                }
            />

            <NotificationSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={hideSnackbar}
            />
        </>
    );
};

export default CourseTable;