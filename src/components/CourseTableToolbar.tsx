import React, {useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import CourseForm from '@/components/CourseForm';
import FormDialog from '@/components/common/FormDialog';

interface CourseTableToolbarProps {
    search: string;
    setSearch: (value: string) => void;
    onCourseCreated?: () => void;
}

const CourseTableToolbar: React.FC<CourseTableToolbarProps> = ({
                                                                   search,
                                                                   setSearch,
                                                                   onCourseCreated,
                                                               }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCourseCreatedLocal = () => {
        if (onCourseCreated) onCourseCreated();
        handleClose();
    };

    return (
        <Box
            mb={2}
            display="flex"
            flexDirection={{xs: 'column', sm: 'row'}}
            alignItems="center"
            gap={2}
            justifyContent="flex-end"
        >
            <FormDialog
                open={open}
                onClose={handleClose}
                title="Add Course"
                maxWidth="sm"
                fullWidth
            >
                <CourseForm onCourseCreated={handleCourseCreatedLocal}/>
            </FormDialog>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
            >
                Add Course
            </Button>
            <TextField
                size="small"
                variant="outlined"
                placeholder="Search courses"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                sx={{width: {xs: '100%', sm: 240}, minWidth: {sm: 240}}}
                inputProps={{"aria-label": "search courses by title or description"}}
            />
        </Box>
    );
};

export default CourseTableToolbar;