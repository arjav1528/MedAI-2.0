

export interface WebUser{
    googleId: string;
    displayName: string;
    pfpUrl: string;
    email: string;
    role: string;
    maxQueries: number;
    queries: Query[];
}





export interface Query{
    id: string;
    query: string;
    time: string;
    read: boolean;
    patientId: string;
    clinicianId: string;
}


