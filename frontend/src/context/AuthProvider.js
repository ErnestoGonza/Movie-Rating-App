import { createContext, useEffect, useState, useCallback } from 'react';
import { getIsAuth, userSignIn } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: '',
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await userSignIn({ email, password });

    if (error) return setAuthInfo({ ...authInfo, isPending: false, error });

    navigate('/', { replace: true });
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: '',
    });
    localStorage.setItem('auth-token', user.token);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setAuthInfo((prev) => ({ ...prev, ...defaultAuthInfo }));
  };

  const isAuth = useCallback(async () => {
    const token = localStorage.getItem('auth-token');

    if (!token) return;

    setAuthInfo((prevAuthInfo) => {
      return { ...prevAuthInfo, isPending: true };
    });

    const { error, user } = await getIsAuth(token);

    if (error)
      return setAuthInfo((prevAuthInfo) => {
        return { ...prevAuthInfo, isPending: false, error };
      });

    setAuthInfo((prevAuthInfo) => {
      return {
        profile: { ...user },
        isPending: false,
        isLoggedIn: true,
        error: '',
      };
    });
  }, []);

  useEffect(() => {
    isAuth();
  }, [isAuth]);

  return (
    <AuthContext.Provider
      value={{
        authInfo,
        handleLogin,
        handleLogout,
        isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
