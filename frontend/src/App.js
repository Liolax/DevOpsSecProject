import { useState, useEffect } from "react";
import "./App.css";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer for notifications
import "react-toastify/dist/ReactToastify.css";

// API_URL to point to the deployed backend
const API_URL = "https://devopssec-backend.onrender.com/notes";

function App() {
  // State variables
  const [notes, setNotes] = useState([]);
  const [formNote, setFormNote] = useState({ id: null, title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(5); // Limit per page
  const [searchTerm, setSearchTerm] = useState(""); // For filtering notes
  const [error, setError] = useState(null);

  // Fetch all notes from the API
  const fetchNotes = async () => {
    try {
      setError(null); // Reset errors
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log("Fetched Notes:", data); // Debug log for backend response
      setNotes(data);
      toast.success("Notes loaded successfully!");
    } catch (err) {
      setError(err.message);
      toast.error("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes(); // Fetch notes on component mount
  }, []);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormNote({ ...formNote, [name]: value }); // Update form state
  };

  // Add a new note
  const handleAddNote = async () => {
    if (!formNote.title.trim() || !formNote.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formNote.title, content: formNote.content }),
      });
      if (!res.ok) throw new Error(`Failed to add note: ${res.status} ${res.statusText}`);
      await fetchNotes(); // Refresh notes list
      setFormNote({ id: null, title: "", content: "" }); // Reset form
      toast.success("Note added successfully!");
    } catch (error) {
      toast.error("Error adding note");
    }
  };

  // Edit an existing note
  const handleEditNote = (note) => {
    setIsEditing(true);
    setFormNote({ id: note.id || note._id, title: note.title, content: note.content });
  };

  // Update an existing note
  const handleUpdateNote = async () => {
    if (!formNote.title.trim() || !formNote.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${formNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formNote.title, content: formNote.content }),
      });
      if (!res.ok) throw new Error(`Failed to update note: ${res.status} ${res.statusText}`);
      
      const updatedNote = await res.json();
      console.log("Updated Note Response:", updatedNote);

      // Update the notes state directly
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note // Update only the edited note
        )
      );

      setFormNote({ id: null, title: "", content: "" }); // Reset form
      setIsEditing(false);
      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error("Error updating note");
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete note: ${res.status} ${res.statusText}`);
      await fetchNotes(); // Refresh notes list
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Error deleting note");
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination: Determine notes for the current page
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1>Private Diary</h1>

      {/* Error Display */}
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Form for Adding/Editing Notes */}
      <div className="note-form">
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formNote.title}
          onChange={handleInputChange}
        />
        <textarea
          placeholder="Content"
          name="content"
          value={formNote.content}
          onChange={(e) => setFormNote({ ...formNote, content: e.target.value })}
        ></textarea>
        {isEditing ? (
          <button onClick={handleUpdateNote}>Update Note</button>
        ) : (
          <button onClick={handleAddNote}>Add Note</button>
        )}
      </div>

      <hr />

      {/* Notes List */}
      <div className="notes-list">
        <h2>Diary Notes</h2>
        {currentNotes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <ul>
            {currentNotes.map((note) => (
              <li key={note.id || note._id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <p>
                  <strong>Created At:</strong> {new Date(note.created_at).toLocaleString()}
                </p>
                {note.updated_at && (
                  <p>
                    <strong>Updated At:</strong> {new Date(note.updated_at).toLocaleString()}
                  </p>
                )}
                <button onClick={() => handleEditNote(note)}>Edit</button>
                <button onClick={() => handleDeleteNote(note.id || note._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        <div className="pagination">
          {[...Array(Math.ceil(filteredNotes.length / notesPerPage)).keys()].map((number) => (
            <button key={number} onClick={() => paginate(number + 1)}>
              {number + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
