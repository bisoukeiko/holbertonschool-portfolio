import { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children}) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const login = (Id, accessToken) => {
        setUserId(Id);
        setToken(accessToken);
    }

    const logout = () => {
        setUserId(null);
        setToken(null);
    }

    return (
        <UserContext.Provider value={{ userId, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);

