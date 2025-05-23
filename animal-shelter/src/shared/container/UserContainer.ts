import { createContext } from "react";
import { User } from "../DataTypes";

export const UserContainer = createContext<{ user: User | null, setUser: Function, forceUpdateUser: Function }>({
    user: null,
    setUser: () => { },
    forceUpdateUser: () => { }
})