import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/shorten', { fullUrl: url });
      setShortUrl(res.data.shortUrl);
      setError('');
    } catch {
      setError('Failed to shorten URL');
      setShortUrl('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>URL Shortener</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/long-url"
          required
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button 
          type="submit" 
          style={{ 
            padding: '10px 20px', 
            marginLeft: '10px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Shorten
        </button>
      </form>
      
      {shortUrl && (
        <div style={{ 
          padding: '15px', 
          background: '#f8f9fa', 
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          <p>Short URL:</p>
          <a 
            href={shortUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              fontSize: '18px', 
              wordBreak: 'break-all',
              color: '#007bff'
            }}
          >
            {shortUrl}
          </a>
        </div>
      )}
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
}

export default App;