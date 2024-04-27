import "./App.css";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Setting from "./pages/setting/Setting";
import EmailVerify from "./pages/auth/verify/EmailVerify";
import ForgetPassword from "./pages/auth/forgetPassword/ForgetPassword";
import { useAuthContext } from "./context/AuthContext";
import ResetPassword from "./pages/auth/resetPassword/ResetPassword";

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/Login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/setting"
          element={authUser ? <Setting /> : <Navigate to={"/Login"} />}
        />
        <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
        <Route
          path="/auth/reset-password/:id/:token"
          element={<ResetPassword />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
