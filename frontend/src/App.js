import './index.css';
import Navbar from './components/user/Navbar';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
