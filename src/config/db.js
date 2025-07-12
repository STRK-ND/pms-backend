const mongoose = require('mongoose');
const logger = require('./logger'); // Import the logger
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        // Check if the environment variable is present
        if (!mongoURI) {
            logger.error("❌ MongoDB URI is missing in environment variables");
            throw new Error("MongoDB URI is required but missing!");
        }

        await mongoose.connect(mongoURI);
        
        logger.info('✅ MongoDB Connected Successfully');
    } catch (error) {
        logger.error(`❌ MongoDB Connection Failed: ${error.message}`);

        // Handling specific error cases
        if (error.name === 'MongoNetworkError') {
            logger.error('🚨 Network issue detected. Check your internet or database server.');
        } else if (error.name === 'MongoParseError') {
            logger.error('🚨 Invalid MongoDB URI format. Verify your connection string.');
        } else {
            logger.error('🚨 Unexpected error occurred.');
        }

        process.exit(1); // Exit process with failure
    }
};

// Event listener for disconnected state
mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB connection lost. Attempting to reconnect...');
});

module.exports = connectDB;
