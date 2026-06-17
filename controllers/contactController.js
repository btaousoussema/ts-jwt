const db = require('../models/dbConnection.js');

const getContacts = async (req, res) => {
    const contacts = await db.query('SELECT * FROM contacts');
    res.send(contacts.rows);
};

const createContact = async (req, res) => {
    const { email, message} = req.body;
    res.send(`Hello, ${email}! Your message has been received.`);
};

module.exports = { 
    getContacts, 
    createContact, 
};