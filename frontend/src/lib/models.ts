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
    symptoms: string;
    bodyTemperature: string | null;
    duration: string | null;
    isVerified: boolean | false;
    additionalInfo: string | null;
    response: string | null;
    time: string;
    read: boolean;
    patientId: string | null;
    clinicianId: string | null;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;


