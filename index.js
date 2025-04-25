import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes and origins
app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Debug endpoint to check server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Debug endpoint to check environment variables
app.get('/debug', (req, res) => {
    // Don't expose secrets in production
    res.json({
        apiKeyExists: !!process.env.LIVEKIT_API_KEY,
        apiSecretExists: !!process.env.LIVEKIT_API_SECRET,
        port: process.env.PORT
    });
});

app.get('/get-token', (req, res) => {
    const { room, username } = req.query;

    console.log(`Token request for room: ${room}, username: ${username}`);

    if (!room || !username) {
        console.log('Missing room or username parameters');
        return res.status(400).json({ error: 'Room and username are required' });
    }

    try {
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        console.log(`API Key exists: ${!!apiKey}, API Secret exists: ${!!apiSecret}`);

        if (!apiKey || !apiSecret) {
            console.error('Missing API key or secret in environment variables');
            return res.status(500).json({ error: 'Server configuration error - missing API credentials' });
        }

        const token = new AccessToken(apiKey, apiSecret, {
            identity: username,
        });

        token.addGrant({
            roomJoin: true,
            room,
            canPublish: true,
            canSubscribe: true,
        });

        const jwt = token.toJwt();
        console.log(`Token generated successfully for ${username}`);
        res.json({ token: jwt });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Key exists: ${!!process.env.LIVEKIT_API_KEY}, API Secret exists: ${!!process.env.LIVEKIT_API_SECRET}`);
}); 