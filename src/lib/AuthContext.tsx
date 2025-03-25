"use client";

import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { auth, db, FirebaseUser, provider, signInWithPopup } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { WebUser } from "./models";

// Define the type for the context
interface AuthContextType {
    user: WebUser | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {}
});

// Define props type for the provider component
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<WebUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if(firebaseUser){
        const userRef = doc(db, "users", firebaseUser?.uid);
        const userSnap = await getDoc(userRef);
        
        let userData: WebUser;

        if(!userSnap.exists()){
          const role = firebaseUser?.email?.endsWith("goa.bits-pilani.ac.in") ? "patient" : "clinician";

          userData = {
            googleId: firebaseUser?.uid || "",
            displayName: firebaseUser?.displayName || "",
            pfpUrl: firebaseUser?.photoURL || "",
            email: firebaseUser?.email || "",
            role: role,
            queries: [],
            maxQueries: role === "patient" ? 0 : 5,
          }

          await setDoc(userRef, userData);
        } else {
          userData = userSnap.data() as WebUser;
        }

        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true);
    try {
      // Fixed: Using signOut function from firebase/auth
      await signOut(auth);
      setUser(null);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
