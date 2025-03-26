import { createContext } from "react";

export interface User {
    googleId: string;
    displayName: string;
    pfpUrl: string;
    email: string;
    role: string;
    maxQueries: number;
    queries: Query[];
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export interface Query {
    id: string;
    query: string;
    time: string;
    read: boolean;
    patientId: string;
    clinicianId: string;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;


