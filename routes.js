const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ObjectId } = require('mongodb'); // ObjectId chahiye unique ID ke liye

// --- Multer Configuration (Image Uploads ke liye) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Uploads folder mein save karega
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // File ka naam unique banane ke liye timestamp add kar rahe hain
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueName);
    }
});

const upload = multer({ storage: storage });

// --- API Endpoints ---

// 1. GET Events (By ID or Latest/Pagination)
router.get('/api/v3/app/events', async (req, res) => {
    try {
        const collection = req.db.collection('events');
        const { id, type, limit, page } = req.query;

        // Case A: Get Single Event by ID (?id=...)
        if (id) {
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid Event ID format" });
            }
            const event = await collection.findOne({ _id: new ObjectId(id) });
            return res.status(200).json(event || {});
        }

        // Case B: Get Latest Events with Pagination (?type=latest&limit=5&page=1)
        if (type === 'latest') {
            const limitNum = parseInt(limit) || 5;
            const pageNum = parseInt(page) || 1;
            const skipNum = (pageNum - 1) * limitNum;

            const events = await collection.find()
                .sort({ _id: -1 }) // Newest first (ObjectId contains timestamp)
                .skip(skipNum)
                .limit(limitNum)
                .toArray();
            
            return res.status(200).json(events);
        }

        // Default: Return empty or all (safety fallback)
        return res.status(200).json([]);

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. POST Create Event
// Note: Frontend se field name "files[image]" aayega as per requirement
router.post('/api/v3/app/events', upload.single('files[image]'), async (req, res) => {
    try {
        const collection = req.db.collection('events');
        
        // Data model create karna (Requirement ke hisaab se)
        const newEvent = {
            type: "event",
            uid: req.body.uid ? parseInt(req.body.uid) : 18, // Default 18 agar nahi bheja
            name: req.body.name,
            tagline: req.body.tagline,
            schedule: new Date(req.body.schedule), // Date object mein convert kiya
            description: req.body.description,
            // Agar file upload hui hai toh uska path save karo
            files: req.file ? { image: req.file.path } : null,
            moderator: req.body.moderator,
            category: req.body.category,
            sub_category: req.body.sub_category,
            rigor_rank: parseInt(req.body.rigor_rank),
            attendees: []
        };

        const result = await collection.insertOne(newEvent);
        
        // Return Created ID
        res.status(201).json({ id: result.insertedId });

    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. PUT Update Event
router.put('/api/v3/app/events/:id', upload.single('files[image]'), async (req, res) => {
    try {
        const collection = req.db.collection('events');
        const eventId = req.params.id;

        if (!ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const updates = { ...req.body };
        
        // Image update logic
        if (req.file) {
            updates.files = { image: req.file.path };
        }
        
        // Data types fix (example: rigor_rank should be int)
        if (updates.rigor_rank) updates.rigor_rank = parseInt(updates.rigor_rank);

        await collection.updateOne(
            { _id: new ObjectId(eventId) },
            { $set: updates }
        );

        res.status(200).json({ message: "Event updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. DELETE Event
router.delete('/api/v3/app/events/:id', async (req, res) => {
    try {
        const collection = req.db.collection('events');
        const eventId = req.params.id;

        if (!ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        await collection.deleteOne({ _id: new ObjectId(eventId) });
        res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;