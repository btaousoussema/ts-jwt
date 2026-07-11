import { query } from '../models/dbConnection.ts';
import { type Request, type Response } from 'express';
import type { Contact } from '../types/types.ts';

const getContacts = async (req: Request, res: Response) : Promise<void> => {
    const result = await query('SELECT * FROM contacts', []);
    if (result.rows.length === 0) {
        res.status(200).json({'message': 'No contacts found'});
        return;
    }
    
    const contacts: Contact[] = [];
    for (const row of result.rows) {
        let contact: Contact = {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name
        }
        contacts.push(contact); 
    }
    res.status(200).json({'contacts': contacts});
};

const createContact = async (req: Request, res: Response) : Promise<void> => {
    const { email, message} = req.body;
    res.send(`Hello, ${email}! Your message has been received.`);
};

export default {
    getContacts, 
    createContact
};