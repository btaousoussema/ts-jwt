const express = require('express');
const router = express.Router();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const corsOptions = require('./config/corsOptions');
const app = express();
const authRoutes = require('./routes/authRoutes.js');
const refreshTokenRoutes = require('./routes/refreshTokenRoutes.js');

app.use(cors(corsOptions));
app.use(express.json());


app.use('/users', userRoutes);
app.use('/contacts', contactRoutes);
app.use('/auth', authRoutes);
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use('/refreshToken', refreshTokenRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});