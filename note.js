import React, { useState, useEffect } from 'react';

const SimultaneousNote = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    // Fetch the list of notes from the server
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(error => console.error(error));
  }, []);

  const handleNoteChange = event => {
    setCurrentNote(event.target.value);
    // Save the note to the server
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: event.target.value })
    })
      .then(res => res.json())
      .catch(error => console.error(error));
  };

  return (
    <div>
      <textarea value={currentNote} onChange={handleNoteChange} />
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default SimultaneousNote;
