import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    // This effect runs when the component mounts to check for existing user data in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    /**
     * @description Logs the user in by setting state and storing data in localStorage.
     * @param {object} userData - The user object from the API.
     * @param {string} authToken - The JWT from the API.
     */
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
    };

    /**
     * @description Logs the user out by clearing state and removing data from localStorage.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    // The value provided to the context consumers
    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token, // A boolean flag to easily check for authentication
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
