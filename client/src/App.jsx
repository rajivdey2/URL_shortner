import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://url-shortner22.onrender.com/api/shorten', {
        fullUrl: url,
      });
      setShortUrl(res.data.shortUrl);
      setError('');
    } catch {
      setError('Failed to shorten URL');
      setShortUrl('');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="card">
      <h1>🔗 URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/long-link"
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <div>
          <p>✨ Your Short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button onClick={toggleTheme} style={{ marginTop: '1rem' }}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
}

export default App;
