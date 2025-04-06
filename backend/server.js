// Import required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Set port from .env or default to 5000

// MongoDB connection string from .env
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Enable CORS so that the frontend can call the API
app.use(cors({
  origin: ["https://diary-notes-project.vercel.app", "http://localhost:3000"], // Allow both deployed and local frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  credentials: true // 
}));

app.use(bodyParser.json());

// Define a Note schema and model
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the DevOpsSec Backend!");
});

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// GET all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    console.log("Fetched notes:", notes);
    res.json(
      notes.map((note) => ({
        ...note.toJSON(),
        id: note._id, // Map MongoDB _id to id for frontend compatibility
      }))
    );
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// GET a single note by ID
app.get("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      console.log("Fetched note by ID:", note);
      res.json({
        ...note.toJSON(),
        id: note._id,
      });
    } else {
      console.log(`Note not found for ID: ${req.params.id}`);
      res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ message: "Error fetching note" });
  }
});

// CREATE a new note
app.post(
  "/notes",
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("content").notEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    try {
      const newNote = new Note({ title, content });
      const savedNote = await newNote.save();
      console.log("Created new note:", savedNote);
      res.status(201).json({ ...savedNote.toJSON(), id: savedNote._id });
    } catch (err) {
      console.error("Error creating note:", err);
      res.status(500).json({ message: "Error creating note" });
    }
  }
);

// UPDATE a note
app.put(
  "/notes/:id",
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("content").notEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    console.log(`Updating note with ID: ${req.params.id}`);

    try {
      // Ensure only the specific note is updated
      const updatedNote = await Note.findOneAndUpdate(
        { _id: req.params.id },
        { title, content, updated_at: Date.now() },
        { new: true, runValidators: true } // Return the updated document and validate fields
      );

      if (updatedNote) {
        console.log("Updated note:", updatedNote);
        res.json({ ...updatedNote.toJSON(), id: updatedNote._id });
      } else {
        console.log(`Note not found for ID: ${req.params.id}`);
        res.status(404).json({ message: "Note not found" });
      }
    } catch (err) {
      console.error("Error updating note:", err);
      res.status(500).json({ message: "Error updating note" });
    }
  }
);

// DELETE a note
app.delete("/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (deletedNote) {
      console.log("Deleted note:", deletedNote);
      res.json({ ...deletedNote.toJSON(), id: deletedNote._id });
    } else {
      console.log(`Note not found for ID: ${req.params.id}`);
      res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Error deleting note" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
