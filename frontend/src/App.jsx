import "./App.css";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import { Route, Routes } from "react-router-dom";
import Setting from "./pages/setting/Setting";
import EmailVerify from "./pages/auth/verify/EmailVerify";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/user/:id/verify/:token" element={<EmailVerify />} />
    </Routes>
  );
}

export default App;
