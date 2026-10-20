
import { useState, useEffect } from "react";
import "./App.css";

const colors = ["#fff4cc", "#e1f3e8", "#e5e9ff", "#ffe5e5"];

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("myNotes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("myNotes", JSON.stringify(notes));
  }, [notes]);

  function saveNote(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and note content.");
      return;
    }

    if (editingId !== null) {
      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
              }
            : note
        )
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
        date: new Date().toLocaleDateString(),
      };

      setNotes((previousNotes) => [newNote, ...previousNotes]);
    }

    setTitle("");
    setContent("");
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id) {
    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== id)
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-app">
      <header className="header">
       
        <span className="note-count">{notes.length} Notes</span>
      </header>

      <form className="note-form" onSubmit={saveNote}>
        <h2>{editingId !== null ? "Edit Note" : "Create Note"}</h2>

        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          placeholder="Write your thoughts here..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows="4"
        />

        <div className="form-actions">
          <button type="submit">
            {editingId !== null ? "Save Changes" : "Add Note"}
          </button>

          {editingId !== null && (
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search your notes..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p className="empty-message">
            {search ? "No matching notes found." : "No notes yet. Create your first note!"}
          </p>
        ) : (
          filteredNotes.map((note) => (
            <article
              className="note-card"
              key={note.id}
              style={{ backgroundColor: note.color }}
            >
              <h3>{note.title}</h3>
              <p className="note-content">{note.content}</p>

              <div className="note-footer">
                <small>{note.date}</small>

                <div>
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => editNote(note)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
