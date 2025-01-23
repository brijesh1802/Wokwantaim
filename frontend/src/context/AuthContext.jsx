import { createContext, useState } from "react";

export const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [userType,setUserType]=useState(null);
    const login=(type)=>{
        setUserType(type)
    }
    const logout=()=>{
        setUserType(null);

        localStorage.clear();
    }
    return(
        <AuthContext.Provider value={{userType,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}