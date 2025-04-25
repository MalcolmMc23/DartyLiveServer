// Utility script to generate LiveKit tokens for testing
import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configuration - change these values as needed
const room = "test-room";
const identity = "test-user";

// Load API credentials from .env
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error('Error: API key or secret not found in environment variables');
    console.error('Make sure your .env file has LIVEKIT_API_KEY and LIVEKIT_API_SECRET');
    process.exit(1);
}

// Create token with permissions
const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name: identity,
    ttl: '24h' // Set explicit TTL for 24 hours
});

token.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
});

// Generate the JWT and print it out
token.toJwt().then(jwt => {
    console.log('\n========== LIVEKIT TOKEN INFO ==========');
    console.log(`Room: ${room}`);
    console.log(`Identity: ${identity}`);
    console.log(`API Key: ${apiKey}`);
    console.log('\n========== TOKEN ==========');
    console.log(jwt);
    console.log('\n========== HOW TO USE ==========');
    console.log('1. Copy this token and use it in your App.tsx');
    console.log('2. Make sure the room name in App.tsx is set to: "test-room"');
    console.log('3. Make sure your LiveKit URL is correct: wss://dartylive-1nnf5818.livekit.cloud');
}).catch(error => {
    console.error('Error generating token:', error);
}); 