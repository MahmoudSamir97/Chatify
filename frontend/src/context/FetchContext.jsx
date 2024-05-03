import React, { createContext, useState, useContext } from 'react';

const FetchContext = createContext();

export const useFetchContext = () => {
  return useContext(FetchContext);
};

export const FetchProvider = ({ children }) => {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <FetchContext.Provider value={{ fetchAgain, setFetchAgain }}>
      {children}
    </FetchContext.Provider>
  );
};
