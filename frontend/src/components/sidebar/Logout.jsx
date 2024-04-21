import axios from "axios";
import React from "react";
import { BiLogOut } from "react-icons/bi";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Logout() {
  const { setAuthUser } = useAuthContext();
  const handleLogOut = async () => {
    try {
      const url = "http://localhost:4000/api/auth/logout";
      await axios.post(url, {});
      setAuthUser(null);
      localStorage.removeItem("chat-user");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div className="mt-auto">
      <BiLogOut
        className="w-6 h-6 text-white cursor-pointer hover:text-blue-500"
        onClick={handleLogOut}
      />
    </div>
  );
}

export default Logout;
