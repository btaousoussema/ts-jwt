import { query } from '../models/dbConnection.ts';
import { type Request, type Response } from 'express';

const getContacts = async (req: Request, res: Response) => {
    const contacts = await query('SELECT * FROM contacts', []);
    res.send(contacts.rows);
};

const createContact = async (req: Request, res: Response) => {
    const { email, message} = req.body;
    res.send(`Hello, ${email}! Your message has been received.`);
};

export default {
    getContacts, 
    createContact
};