// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Set port from .env or default to 5000

// MongoDB connection string from .env
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Enable CORS so that the frontend (port 3000) can call the API
app.use(cors());
app.use(bodyParser.json());

// Define a Note schema and model
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', noteSchema);

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// GET all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// GET a single note by ID
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching note' });
  }
});

// CREATE a new note
app.post(
  '/notes',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    try {
      const newNote = new Note({ title, content });
      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (err) {
      res.status(500).json({ message: 'Error creating note' });
    }
  }
);

// UPDATE a note
app.put(
  '/notes/:id',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    try {
      const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
      );
      if (updatedNote) {
        res.json(updatedNote);
      } else {
        res.status(404).json({ message: 'Note not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error updating note' });
    }
  }
);

// DELETE a note
app.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (deletedNote) {
      res.json(deletedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
