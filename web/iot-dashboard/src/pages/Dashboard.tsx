import React from 'react';
import { Typography, Container } from '@mui/material';
import DashboardChart from '../components/DashboardChart';

const Dashboard: React.FC = () => {

    return (
        <Container sx={{ mt: 3 }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ mtb: 2 }}>
                Welcome to Dashboard
            </Typography>
            <DashboardChart />
        </Container>
    );
};

export default Dashboard;
