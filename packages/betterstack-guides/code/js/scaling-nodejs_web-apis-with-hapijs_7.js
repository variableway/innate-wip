# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 7

[label src/utils/database.js]
import mongoose from 'mongoose';

export const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hapijs-blog';
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async () => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
};