import React from 'react';
import { Typography, Container } from '@mui/material';
import DashboardChart from '../components/DashboardChart';

const Dashboard: React.FC = () => {

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to Dashboard
            </Typography>
            <DashboardChart />
        </Container>
    );
};

export default Dashboard;
