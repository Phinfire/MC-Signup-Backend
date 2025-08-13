import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT, allowedOrigins } from './config';
import authRoutes from './routes/auth';
import registerRoutes from './routes/register';
import healthRoutes from './routes/health';
import signups from './routes/signups';
import { createRegistrationsTable } from './db/registrations';

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => origin && origin.startsWith(o))) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    }
}));
app.use(bodyParser.json());

createRegistrationsTable().catch(console.error);

app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/signups', signups);

app.listen(PORT, () => console.log(`Discord OAuth backend running on port ${PORT}`));
