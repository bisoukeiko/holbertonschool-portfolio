import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children}) => {
    const [userId, setUserId] = useState('');
    // const [childrenIdList, setChildrenIdList] = useState([]);

    const login = (Id) => setUserId(Id);
    const logout = () => setUserId('');

    return (
        <UserContext.Provider value={{ userId, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);
export const useChildrenIdList = () => useContext(UserContext);
