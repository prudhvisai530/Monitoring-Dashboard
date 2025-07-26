import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../api/auth';

const Signup: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userName || !role || !password) {
            setError('All fields are required');
            return;
        }

        try {
            await signupUser({ username: userName, password, role });
            navigate('/login');
        } catch (err) {
            setError('Signup failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Sign Up
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

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <Box mt={2}>
                        <Button type="submit" variant="contained" fullWidth>
                            Sign Up
                        </Button>
                    </Box>
                </form>

                <Box mt={2}>
                    <Typography variant="body2">
                        Already have an account? <a href="/login">Login</a>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup;
