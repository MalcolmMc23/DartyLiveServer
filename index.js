import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// You'll need to set these in your .env file
// LIVEKIT_API_KEY=your_api_key
// LIVEKIT_API_SECRET=your_api_secret

app.get('/get-token', (req, res) => {
    const { room, username } = req.query;

    if (!room || !username) {
        return res.status(400).json({ error: 'Room and username are required' });
    }

    try {
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            return res.status(500).json({ error: 'Server configuration error' });
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

        res.json({ token: token.toJwt() });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 