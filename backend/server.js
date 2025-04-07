// Import required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet"); // Security middleware for HTTP headers
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

// Explicitly load environment variables from a .env file located in the same folder
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

// Use the PORT specified in the environment or default to 5000
const PORT = process.env.PORT || 5000;

// Retrieve the MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

// Connect to MongoDB Atlas using the MONGO_URI
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit if the database connection fails
  });

// Enhance security by setting HTTP headers with Helmet
app.use(helmet());

// Enable CORS so that only the necessary origins can access the API
app.use(
  cors({
    origin: ["https://diary-notes-project.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse incoming JSON payloads
app.use(bodyParser.json());

// Define a Mongoose Schema and Model for diary notes
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
const Note = mongoose.model("Note", noteSchema);

// Root route
app.get("/", (req, res) => {
  console.log("Root route requested");
  res.send("Welcome to the DevOpsSec Project Backend!");
});

// Health endpoint to check server status
app.get("/health", (req, res) => {
  console.log("Health endpoint requested");
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
        id: note._id,
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
      const updatedNote = await Note.findOneAndUpdate(
        { _id: req.params.id },
        { title, content, updated_at: Date.now() },
        { new: true, runValidators: true }
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
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Note: HTTPS termination is managed by the hosting provider (Render).");
});

// Export the app for testing purposes
module.exports = app;
