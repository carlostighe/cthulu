import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:3000/note");
      setNote(result.data.note);
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.put("http://localhost:3000/note", { note });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={note} onChange={(event) => setNote(event.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
};

export default App;
