import bcrypt from 'bcrypt';
import { query } from '../models/dbConnection.ts';
import {type Request, type Response} from 'express';
import  { type User } from '../types/types.ts'

export async function getAllUsers(req: Request, res:Response): Promise<void> {    
    const results = await query('SELECT * FROM users', []);

    if(results.rows.length === 0) {
        res.send(200);
        return;
    }

    let users: User[] = []; 
    for (const row of results.rows) {
        const user: User = {
            id: row.id,
            email: row.email,
            password: "",
        };
        users.push(user)
    }

    res.status(200).send(users);
}; 

export async function getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;    
    
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
        res.status(404).send('User not found');
        return
    }
    
    const user:User = {
        id: result.rows[0].id,
        email: result.rows[0].email, 
        password: ""
    }
    
    res.status(200).send(user);
}; 

export async function getUserByEmail(email: string) : Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
        return null;
    }
    
    const user: User = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        password: result.rows[0].password,
    };
    
    return user;
}; 


export const createUser = async (req: Request, res:Response): Promise<void> => {
    const { email, password}: {email: string, password: string} = req.body;
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (email, password) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = $1) RETURNING email', [email, hashedPassword]);
    if(result.rows.length === 0) {
        res.status(500).send('Cannot create user with email : ' + email);
        return;
    }

    res.status(200).send(`Account created for user ${email}!`);
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password}: {email: string, password: string} = req.body;
    const user: User | null = await getUserByEmail(email);
    if (user === null) {
        res.status(401).send('Invalid email or password');
        return;
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);
    bcrypt.compare(hashedPassword, user.password, function(err, result) {
        if (err) {
            res.status(500).send('Error comparing passwords');
        }
        if (result) {
            res.send(`Welcome back, ${email}!`);
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
}

export const validateUser = async (email: string, password: string): Promise<boolean> => {
    const user: User | null = await getUserByEmail(email);
    if(user === null) {
        return false;
    }
    return bcrypt.compare(password, user.password); 
}