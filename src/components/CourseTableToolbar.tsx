import React, {useState} from "react";
import {Box, Button, Dialog, TextField, DialogTitle, DialogContent, DialogActions} from "@mui/material";
import CourseForm from '@/components/CourseForm';

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
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Course</DialogTitle>
                <DialogContent>
                    <CourseForm onCourseCreated={handleCourseCreatedLocal}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
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