import React,{useState} from "react";
import { PropertyContext } from "./PropertyContext";

export const PropertyContextProvider = ({children}) =>{
    
    const [propertyData, setPropertyData] = useState({
        Property_Name: "",
        Property_Description: "",
        Country: "",
        State: "",
        City: "",
        Zipcode: "",
        Property_Address: "",
        General_Rent: "",
        Security_Deposit: "",
        Type_Of_Property: ""});

    const updatePropertyData = (name, value) =>{
        setPropertyData((prevData)=>({
            ...prevData,
            [name]:value
        }));
    };
    
    return(
        <PropertyContext.Provider value={{propertyData, updatePropertyData}}>
            {children}
        </PropertyContext.Provider>
    )
} 

