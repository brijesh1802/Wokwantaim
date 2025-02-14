import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check if there's a saved userType in localStorage
  const storedUserType = localStorage.getItem("userType");

  const navigate = useNavigate();

  const [userType, setUserType] = useState(storedUserType ? storedUserType : null);

  const login = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type); // Store userType in localStorage
    console.log(type);
  };

  const logout = () => {
    navigate("/")
    localStorage.clear();
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