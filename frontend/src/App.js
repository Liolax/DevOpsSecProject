import { useState, useEffect } from 'react';
import './App.css';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer along with toast
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/notes';

function App() {
  // State variables for notes, loading, form, pagination, search, and error tracking
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [formNote, setFormNote] = useState({ id: null, title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Fetch notes from the API
  const fetchNotes = async () => {
    try {
      console.log("Calling fetchNotes...");
      setLoading(true);
      setError(null); // Reset any previous errors
      const res = await fetch(API_URL);
      console.log("Response from API:", res);
      if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log("Fetched notes:", data);
      setNotes(data);
      toast.success("Notes loaded successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error("Error fetching notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormNote({ ...formNote, [name]: value });
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
      if (!res.ok)
        throw new Error(`Failed to add note: ${res.status} ${res.statusText}`);
      await fetchNotes();
      setFormNote({ id: null, title: "", content: "" });
      toast.success("Note added successfully!");
    } catch (error) {
      toast.error("Error adding note");
      console.error(error);
    }
  };

  // Edit a note
  const handleEditNote = (note) => {
    setIsEditing(true);
    setFormNote(note);
  };

  // Update a note
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
      if (!res.ok)
        throw new Error(`Failed to update note: ${res.status} ${res.statusText}`);
      await fetchNotes();
      setFormNote({ id: null, title: "", content: "" });
      setIsEditing(false);
      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error("Error updating note");
      console.error(error);
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Failed to delete note: ${res.status} ${res.statusText}`);
      await fetchNotes();
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Error deleting note");
      console.error(error);
    }
  };

  // Filter notes based on the search term
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic: determine notes for the current page
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1>Private Diary</h1>

      {/* Error Display if any */}
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

      {/* Form for Adding/Editing a Note */}
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

      {/* List of Diary Notes */}
      <div className="notes-list">
        <h2>Diary Notes</h2>
        {currentNotes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <ul>
            {currentNotes.map((note) => (
              <li key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => handleEditNote(note)}>Edit</button>
                <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
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

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
