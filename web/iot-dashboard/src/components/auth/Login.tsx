import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import type { LogoutButtonProps } from '../../interface/logoutPros';

const Login: React.FC<LogoutButtonProps> = ({ isToken }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        if (!userName || !password) {
            setError('Both fields are required');
            return;
        }

        try {
            const { access_token } = await loginUser({ username: userName, password });
            isToken(access_token)
            setError('')
            navigate('/dashboard')
        } catch (err: any) {
            if (err.message === 'Request failed with status code 404')
                setError('User not available');
            else { setError('Invalid username or password') }
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="User Name"
                        type="userName"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <Box mt={2}>
                        <Button type="submit" variant="contained" fullWidth>
                            Login
                        </Button>
                    </Box>
                </form>

                <Box mt={2}>
                    <Typography variant="body2">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
