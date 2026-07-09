import { query } from '../models/dbConnection.ts';
import bcrypt from 'bcrypt';
import {type Request, type Response} from 'express';
import type { User } from '../types/types.ts'
export async function getUser(req: Request, res:Response) {    
    let users = await query('SELECT * FROM users', []);
    res.send(users.rows);
}; 

export async function getUserById(req: Request, res: Response) {
    const id = req.params.id;    
    let users = await query('SELECT * FROM users WHERE id = $1', [id]);
    res.send(users.rows);
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


export const createUser = async (req: Request, res:Response) => {
    const { email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (email, password) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = $1) RETURNING email', [email, hashedPassword]);
    res.send(`Hello, ${email}!`);
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password} = req.body;
    const user: User | null = await getUserByEmail(email);
    if (user === null) {
        res.status(401).send('Invalid email or password');
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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

export const validateUser = async (email: string, password: string) => {
    const user: User | null = await getUserByEmail(email);
    if(user === null) {
        return false;
    }
    return bcrypt.compare(password, user.password); 
}