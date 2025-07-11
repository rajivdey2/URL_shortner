import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/shorten', { fullUrl: url });
      setShortUrl(res.data.shortUrl);
      setError('');
    } catch {
      setError('Failed to shorten URL');
      setShortUrl('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
          style={{ width: '300px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', marginLeft: '10px' }}>
          Shorten
        </button>
      </form>
      
      {shortUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
        </div>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;