import { createContext } from "react";
import { AnimalType } from "../DataTypes";

export const PetsContainer = createContext<{ pets: Array<AnimalType>, setPets: Function }>({
    pets: [],
    setPets: () => { }
})