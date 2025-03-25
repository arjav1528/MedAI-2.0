

export interface User{
    googleId: string;
    displayName: string;
    pfpUrl: string;
    email: string;
    role: string;
}


export interface Notification{
    id: string;
    notif: string;
    time: string;
    read: boolean;
    patientId: string;
    clinicianId: string;
}


export interface Query{
    id: string;
    query: string;
    time: string;
    read: boolean;
    patientId: string;
    clinicianId: string;
}


