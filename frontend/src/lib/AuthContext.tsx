"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "./models";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(user){
            const role = user.email?.endsWith("@goa.bits-pilani.ac.in") ? "patient" : "clinician";
            let userData : User = {
                googleId: user.uid,
                displayName: user.displayName || "",
                pfpUrl: user.photoURL || "",
                email: user.email || "",
                role: role,
                maxQueries: role === "patient" ? 0 : 5,
                queries: []
            }

            setUser(userData);
            setLoading(false);
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);


