import { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [sentence, setSentence] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [generatedFilename, setGeneratedFilename] = useState('');
  const [error, setError] = useState('');
  
  // Load API key from localStorage if available
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
    }
  }, [apiKey]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key to generate images.');
      return;
    }
    
    setLoading(true);
    setError('');
    setGeneratedImage('');
    setGeneratedFilename('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sentence,
          apiKey
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedImage(data.image_base64);
      setGeneratedFilename(data.filename || 'almondspark-image.png');
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = generatedFilename || 'almondspark-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printImage = () => {
    if (!generatedImage) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print images');
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Print Image - Almond Spark</title>
          <style>
              body {
                  font-family: sans-serif;
                  text-align: center;
                  padding: 20px;
              }
              img {
                  max-width: 100%;
                  margin-bottom: 20px;
              }
              .caption {
                  font-size: 16px;
                  margin-top: 10px;
                  color: #333;
              }
              @media print {
                  .no-print {
                      display: none;
                  }
              }
          </style>
      </head>
      <body>
          <div class="no-print">
              <h1>Print Preview</h1>
              <p>Press Ctrl+P (or Cmd+P on Mac) to print this image</p>
              <button onclick="window.print()">Print</button>
              <button onclick="window.close()">Close</button>
              <hr>
          </div>
          <img src="data:image/png;base64,${generatedImage}" alt="${sentence}">
          <div class="caption">${sentence}</div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div>
      <Head>
        <title>Almond Spark</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </Head>

      <nav className="main-nav">
        <ul>
          <li><Link href="/" className="active">Home</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/personal-note">Personal Note</Link></li>
        </ul>
      </nav>

      <div className="container">
        <header className="hero">
          <div className="hero-image-container">
            <Image 
              src="/images/topbanner.png" 
              alt="Almond Spark" 
              className="hero-image"
              width={1200}
              height={300}
              priority
            />
          </div>
          <div className="title-container">
            <h1 className="main-title">AlmondSpark</h1>
            <p className="tagline">Lighting New Paths to Connection</p>
            <p className="disclaimer">This is experimental only, we can't promise it will help you, we can't even promise it will generate correctly. It's free though...</p>
          </div>
        </header>

        <main className="content">
          <section className="generator-section">
            <h2>Generate Your Visual Strip</h2>
            <p className="generator-intro">Enter the idea or sentence you wish to convey and press the button</p>

            <div className="generator-form">
              <form onSubmit={handleSubmit}>
                <div className="api-key-section">
                  <label htmlFor="apiKey">Your Gemini API Key</label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="apiKey"
                      className="api-key-input"
                      placeholder="Enter your Gemini API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <p className="api-key-info">
                    <small>
                      Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.
                      Your key is stored only in your browser and never sent to our servers.
                    </small>
                  </p>
                </div>

                <div className="input-wrapper">
                  <textarea 
                    className="sentence-input" 
                    placeholder="Type your sentence here..." 
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </div>

                <div className="button-wrapper">
                  <button 
                    type="submit"
                    className="generate-button"
                    disabled={loading || !sentence.trim() || !apiKey.trim()}
                  >
                    {loading ? 'Generating...' : 'Generate Icon Strip'}
                  </button>
                </div>
              </form>
              
              <p className="generation-disclaimer">ALL the generations here will be shown randomly in the gallery section - make sure you don't use personal information in your strips.</p>
              
              {loading && (
                <div id="loading-indicator" className="htmx-indicator" style={{ display: 'flex' }}>
                  <div className="spinner"></div>
                  <p>Creating your visual strip...</p>
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  <p>Sorry, there was an error generating your image.</p>
                  <p>Error: {error}</p>
                </div>
              )}
              
              {generatedImage && (
                <div className="result-container">
                  <h3>Your Visual Strip</h3>
                  <img 
                    src={`data:image/png;base64,${generatedImage}`} 
                    alt="Generated visual strip" 
                    className="result-image"
                  />
                  <p className="prompt-text">"{sentence}"</p>
                  <div className="gallery-actions">
                    <button 
                      className="gallery-action-btn download-btn" 
                      title="Download" 
                      onClick={downloadImage}
                    >
                      Download
                    </button>
                    <button 
                      className="gallery-action-btn print-btn" 
                      title="Print" 
                      onClick={printImage}
                    >
                      Print
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <footer>
        <p>&copy; 2025 Almond Spark. All rights reserved.</p>
      </footer>
    </div>
  );
}