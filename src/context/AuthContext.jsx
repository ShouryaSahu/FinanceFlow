// Stores the current user's authentication state
//React Context API allows multiple components to access shared data without passing props through every component.
//We'll store:
// The current user
// The authentication loading state
// The logout function

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/auth";

// 1. Create Context
const AuthContext = createContext(null); // creates a Context object that allows components to share information

// 2. Create Provider
export function AuthProvider({ children }) { //children represents whatever components are placed inside the provider

    const [user, setUser] = useState(null); // Stores the currently authenticated user.
    const [loading, setLoading] = useState(true);

    // 3. Check whether a user is already logged in

    useEffect(() => { //useEffect() is a React Hook used to perform side effects in a component // we use useEffect() to check whether the user already has an active Appwrite session when the application starts
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []); // The empty dependency array means the effect runs after the component first mounts.

    // 4. Logout function
    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    // 5. Share data with child components
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// 6. Custom hook
export function useAuth() {
    return useContext(AuthContext);
}