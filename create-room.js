// Script to create a room on LiveKit
import { RoomServiceClient } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

async function createTestRoom() {
    try {
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            console.error('Error: API key or secret not found in environment variables');
            console.error('Make sure your .env file has LIVEKIT_API_KEY and LIVEKIT_API_SECRET');
            process.exit(1);
        }

        // LiveKit server URL - change this if your LiveKit server is hosted elsewhere
        const livekitHost = 'https://dartylive-1nnf5818.livekit.cloud';

        const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

        // Create room with name 'test-room'
        const room = await roomService.createRoom({
            name: 'test-room',
            emptyTimeout: 60 * 60, // 1 hour in seconds
            maxParticipants: 2,
        });

        console.log('Room created successfully:', room);
    } catch (error) {
        console.error('Error creating room:', error);
    }
}

createTestRoom(); 