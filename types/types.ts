export interface User {
    id: string;
    email: string, 
    password: string,
}

export type RefreshToken = {
    id: number;
    user_id: number;
    token: string;
    expiry_date: string;
    active: boolean;
}

export type Contact = {
    id: number, 
    firstName: string 
    lastName: string
}