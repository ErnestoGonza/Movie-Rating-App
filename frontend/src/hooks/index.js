import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeProvider';
import { AuthContext } from '../context/AuthProvider';

export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);
