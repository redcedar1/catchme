import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [kid, setKid] = useState("");

  const setKidValue = (newKid) => {
    setKid(newKid);
  };

  return (
    <UserContext.Provider value={{ kid, setKidValue }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};