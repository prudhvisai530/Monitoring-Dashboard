import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { LogoutButtonProps } from '../../interface/logoutPros';

const LogoutButton: React.FC<LogoutButtonProps> = ({ isToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    isToken(null)
    navigate('/login');
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
