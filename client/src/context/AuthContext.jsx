import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); 

  
    const loginSuccess = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsLoginOpen(false);
        setIsRegisterOpen(false);

        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };

    const executeWithAuth = (action) => {
        if (user) {
            action(); 
        } else {
            setPendingAction(() => action); 
            setIsLoginOpen(true); 
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            isLoginOpen, 
            setIsLoginOpen, 
            isRegisterOpen, 
            setIsRegisterOpen, 
            loginSuccess, 
            executeWithAuth 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);