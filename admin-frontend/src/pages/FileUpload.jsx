import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function FileUpload() {
  const { studentId } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    if (file.size > 3 * 1024 * 1024) return setError('File must be less than 3MB');
    const formData = new FormData();
    formData.append('beceResult', file);
    try {
      await axios.post(`/api/upload/${studentId}`, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload BECE Results</h2>
      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleChange} />
      <button type="submit">Upload</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>File uploaded successfully!</div>}
    </form>
  );
}
