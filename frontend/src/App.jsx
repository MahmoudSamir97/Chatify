import './App.css';
import Home from './pages/home/Home';
import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/login/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EmailVerify from './pages/auth/verify/EmailVerify';
import ForgetPassword from './pages/auth/forgetPassword/ForgetPassword';
import { useAuthContext } from './context/AuthContext';
import ResetPassword from './pages/auth/resetPassword/ResetPassword';
import Profile from './pages/setting/Setting';

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/api/auth/:id/verify/:token" element={<EmailVerify />} />
        <Route
          path="/api/auth/reset-password/:id/:token"
          element={<ResetPassword />}
        />
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to={'/login'} />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
