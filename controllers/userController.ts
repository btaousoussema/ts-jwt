import { query } from '../models/dbConnection.ts';
import bcrypt from 'bcrypt';
import {type Request, type Response} from 'express';

export async function getUser(req: Request, res:Response) {    
    let users = await query('SELECT * FROM users', []);
    res.send(users.rows);
}; 

export async function getUserById(req: Request, res: Response) {
    const id = req.params.id;    
    let users = await query('SELECT * FROM users WHERE id = $1', [id]);
    res.send(users.rows);
}; 

export async function getUserByEmail(email: string) {
    let users = await query('SELECT * FROM users WHERE email = $1', [email]);
    return users.rows[0];
}; 


export const createUser = async (req: Request, res:Response) => {
    const { email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (email, password) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = $1) RETURNING email', [email, hashedPassword]);
    res.send(`Hello, ${email}!`);
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password} = req.body;
    const user = await getUserByEmail(email);
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
    const user = await getUserByEmail(email);
    return bcrypt.compare(password, user.password); 
}