import React, { createContext, useState, useContext } from 'react';

const FetchContext = createContext();

export const useFetchContext = () => {
  return useContext(FetchContext);
};

export const FetchProvider = ({ children }) => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notifications, setNotifications] = useState([]);

  return (
    <FetchContext.Provider
      value={{ fetchAgain, setFetchAgain, notifications, setNotifications }}
    >
      {children}
    </FetchContext.Provider>
  );
};
