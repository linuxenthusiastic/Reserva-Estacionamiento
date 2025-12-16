import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const userData = await response.json();
                // Map API response to our app's expected user format if needed
                // Backend sends: id, nombre, email, rol, token (maybe? no token in inspected code, basic auth or session)
                // Inspected controller returns: { id, nombre, email, rol ... }
                // We'll normalize 'rol' to 'role' for our frontend logic if naming differs
                const cleanUser = {
                    ...userData,
                    role: userData.rol // Backend sends 'rol', Frontend uses 'role' in DashboardLayout
                };

                setUser(cleanUser);
                localStorage.setItem('user', JSON.stringify(cleanUser));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
