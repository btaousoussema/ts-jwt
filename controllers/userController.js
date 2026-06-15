const db = require('../database/dbconnection.js');
const bcrypt = require('bcrypt');

async function getUser(req, res) {    
    let users = await db.query('SELECT * FROM users');
    console.log(users.rows);
    res.send(users.rows);
}; 

async function getUserById(req, res) {
    const id = req.params.id;    
    let users = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    console.log(users.rows);
    res.send(users.rows);
}; 

async function getUserByEmail(email) {
    let users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log(users.rows);
    return users.rows[0];
}; 


const createUser = async (req, res) => {
    const { email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (email, password) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = $1) RETURNING email', [email, hashedPassword]);
    res.send(`Hello, ${email}!`);
};

const loginUser = async (req, res) => {
    const { email, password} = req.body;
    const user = await getUserByEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    bcrypt.compare(password, user.password, function(err, result) {
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

const validateUser = async (email, password) => {
    const user = await getUserByEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    return bcrypt.compare(password, user.password); 
}


module.exports = {getUser, getUserById, createUser, loginUser, validateUser, getUserByEmail};
