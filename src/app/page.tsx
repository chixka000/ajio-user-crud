"use client";
import React, {useState} from 'react';
import UserTable from '@/components/UserTable';
import CourseTable from '@/components/CourseTable';
import {Box, Tab, Tabs, Typography} from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{pt: 3}}>{children}</Box>}
        </div>
    );
}

export default function Home() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f5f7f6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                py: {xs: 2, sm: 4},
                px: {xs: 1, sm: 4},
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: {xs: '100vw', sm: 600, md: 1200},
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: {xs: 0, sm: 2},
                    p: {xs: 2, sm: 4},
                    mt: {xs: 1, sm: 4},
                }}
            >
                <Typography variant="h4" component="h1" sx={{fontWeight: 600, mb: 3, textAlign: 'center'}}>
                    Education Management System
                </Typography>

                <Tabs value={tabValue} onChange={handleTabChange} centered
                      sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
                    <Tab label="Users"/>
                    <Tab label="Courses"/>
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <UserTable/>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <CourseTable/>
                </TabPanel>
            </Box>
        </Box>
    );
}
