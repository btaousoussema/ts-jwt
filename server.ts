import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.ts';
import contactRoutes from './routes/contact.ts';
import corsOptions from "./config/corsOptions.ts";
import authRoutes from './routes/auth.ts';
import refreshTokenRoutes from './routes/refreshToken.ts';
import logoutRoutes from './routes/logout.ts';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());


app.use('/users', userRouter);
app.use('/contacts', contactRoutes);
app.use('/auth', authRoutes);
app.use('/logout', logoutRoutes);


import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use('/refreshToken', refreshTokenRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});