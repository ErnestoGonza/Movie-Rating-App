import { createContext, useEffect, useState, useCallback } from 'react';
import { getIsAuth, userSignIn } from '../api/auth';

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: '',
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await userSignIn({ email, password });

    if (error) return setAuthInfo({ ...authInfo, isPending: false, error });

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: '',
    });
    localStorage.setItem('auth-token', user.token);
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

  // handleLogout,
  return (
    <AuthContext.Provider
      value={{
        authInfo,
        handleLogin,
        isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
