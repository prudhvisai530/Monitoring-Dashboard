import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h2" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Page Not Found
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
            </Button>
        </Container>
    );
};

export default NotFound;
