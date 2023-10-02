import { createContext, useState } from 'react';
import { userSignIn } from '../api/auth';

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

    setAuthInfo({ profile: { ...user }, isPending: false, isLoggedIn: true });
    localStorage.setItem('auth-token', user.token);
  };

  // handleLogout,
  // isAuth,
  return (
    <AuthContext.Provider
      value={{
        authInfo,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
