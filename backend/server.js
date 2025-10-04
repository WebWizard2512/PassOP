const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// MongoDB Configuration
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'PassOP';
let db;
let passwordsCollection;

// Connect to MongoDB
const connectDB = async () => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        passwordsCollection = db.collection('passwords');
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Get all passwords
app.get('/api/passwords', async (req, res) => {
    try {
        const passwords = await passwordsCollection.find({}).toArray();
        res.json(passwords);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch passwords' });
    }
});

// Save a new password
app.post('/api/passwords', async (req, res) => {
    try {
        const { site, username, password, id } = req.body;

        // Validation
        if (!site || !username || !password || !id) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const newPassword = { site, username, password, id };
        const result = await passwordsCollection.insertOne(newPassword);

        res.status(201).json({ 
            success: true, 
            message: 'Password saved successfully',
            data: result 
        });
    } catch (error) {
        console.error('Error saving password:', error);
        res.status(500).json({ success: false, message: 'Failed to save password' });
    }
});

// Delete a password
app.delete('/api/passwords/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID is required' 
            });
        }

        const result = await passwordsCollection.deleteOne({ id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Password not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Password deleted successfully',
            data: result 
        });
    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ success: false, message: 'Failed to delete password' });
    }
});

// Update a password
app.put('/api/passwords/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { site, username, password } = req.body;

        if (!id || !site || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const result = await passwordsCollection.updateOne(
            { id },
            { $set: { site, username, password } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Password not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Password updated successfully',
            data: result 
        });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Failed to update password' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};

startServer();