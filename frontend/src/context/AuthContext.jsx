import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();
export const useAuthContext = () => {
  return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
  // const user = JSON.parse(localStorage.getItem("chat-user"));

  const [authUser, setAuthUser] = useState(null);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
