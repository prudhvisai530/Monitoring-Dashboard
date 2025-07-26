// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, CircularProgress } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PrivateRoute from './routes/PrivateRoute';
import LogoutButton from './components/common/LogoutButton';
import { useAuth } from './context/AuthContext';

interface AppProps {
  toggleMode: () => void;
  mode: 'light' | 'dark';
}

// Lazy-loaded route components
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
// const NotFound = lazy(() => import('./pages/NotFound')); // optional 404 route

const App: React.FC<AppProps> = ({ toggleMode, mode }) => {
  const { token, setToken } = useAuth();

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IoT Dashboard
          </Typography>
          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          {token && <LogoutButton isToken={setToken} />}
        </Toolbar>
      </AppBar>

      {/* Suspense fallback while lazy components load */}
      <Suspense
        fallback={
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <CircularProgress />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login isToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
