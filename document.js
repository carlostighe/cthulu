import React, { useState, useEffect } from 'react';

const DocumentEditor = ({ documentId }) => {
  const [document, setDocument] = useState('');

  useEffect(() => {
    // Fetch the document from the server
    fetch(`/api/documents/${documentId}`)
      .then(res => res.text())
      .then(data => setDocument(data))
      .catch(error => console.error(error));
  }, [documentId]);

  const handleEditorChange = event => {
    setDocument(event.target.value);
    // Save the updated document to the server
    fetch(`/api/documents/${documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: event.target.value
    })
      .then(res => res.json())
      .catch(error => console.error(error));
  };

  return (
    <textarea
      value={document}
      onChange={handleEditorChange}
      rows={30}
      cols={80}
    />
  );
};

export default DocumentEditor;
