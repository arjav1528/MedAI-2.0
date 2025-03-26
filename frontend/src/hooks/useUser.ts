import UserContext from "@/lib/models"
import { useContext } from "react"

const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
};


export default useUser;