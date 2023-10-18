import './index.css';
import Navbar from './components/user/Navbar';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import EmailVerification from './components/auth/EmailVerification';
import ForgotPassword from './components/auth/ForgotPassword';
import ConfirmPassword from './components/auth/ConfirmPassword';
import { Routes, Route } from 'react-router-dom';
import Home from './components/user/Home';
import NotFound from './components/NotFound';
import NotVerified from './components/user/NotVerified';
import { useAuth } from './hooks';
import AdminNavigator from './navigator/AdminNavigator';

function App() {
  const { authInfo } = useAuth();
  const isAdmin = authInfo.profile?.role === 'admin';

  if (isAdmin) return <AdminNavigator />;

  return (
    <>
      <Navbar />
      <NotVerified />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/verification" element={<EmailVerification />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
