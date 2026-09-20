import { createContext, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        try {

            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (token && savedUser) {

                return JSON.parse(savedUser);

            }

        }
        catch (error) {

            console.error("Failed to load user:", error);

        }

        return null;

    });

    const login = (token, userData) => {

        localStorage.setItem("token", token);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);

    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.clear();

        setUser(null);

    };

    const getToken = () => {

        return localStorage.getItem("token");

    };

    const hasRole = (role) => {

        return user?.role === role;

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                token: getToken(),
                login,
                logout,
                getToken,
                hasRole,
                isAuthenticated: !!user
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export { AuthContext, AuthProvider };