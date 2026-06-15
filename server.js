const express = require('express');
const router = express.Router();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const corsOptions = require('./config/corsOptions');
const app = express();
const authRoutes = require('./routes/authRoutes');


app.use(cors(corsOptions));
app.use(express.json());


app.use('/users', userRoutes);
app.use('/contacts', contactRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});