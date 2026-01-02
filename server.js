const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
const eventRoutes = require('./routes'); 

// Environment variables load  (.env file )
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// JSON data read/parse
app.use(express.json());

// Uploads folder 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MongoDB Connection Setup ---
let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);

async function connectToDb() {
    try {
        await mongoClient.connect();
        db = mongoClient.db(process.env.DB_NAME);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); 
    }
}

// Server start hone se pehle DB connect karo
connectToDb();

// --- Middleware to pass DB to routes ---
app.use((req, res, next) => {
    if (!db) {
        return res.status(500).json({ error: "Database not initialized yet" });
    }
    req.db = db; 
    next();
});

// --- Routes Mounting ---
app.use('/', eventRoutes);

// Server Start
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});