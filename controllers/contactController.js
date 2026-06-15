const db = require('../database/dbConnection.js');

const getContacts = async (req, res) => {    
    console.log('Fetching contacts from the database...');
    const contacts = await db.query('SELECT * FROM contacts');
    console.log(contacts.rows);
    res.send(contacts.rows);
};

const createContact = (req, res) => {
    const { email, message} = req.body;
    res.send(`Hello, ${email}! Your message has been received.`);
};

module.exports = { 
    getContacts, 
    createContact, 
};