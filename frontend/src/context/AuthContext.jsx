import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check if there's a saved userType in localStorage
  const storedUserType = localStorage.getItem("userType");

  const [userType, setUserType] = useState(storedUserType ? storedUserType : null);

  const login = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type); // Store userType in localStorage
    console.log(type);
  };

  const logout = () => {
    setUserType(null);
    localStorage.removeItem("userType"); // Remove userType from localStorage
    localStorage.clear(); // Optional: Remove all other localStorage data
  };

  useEffect(() => {
    // If there's a userType in localStorage on page load, set it
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [storedUserType]);

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};