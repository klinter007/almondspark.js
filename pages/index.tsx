import { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import SettingsModal from '../components/SettingsModal';

export default function Home() {
  const [sentence, setSentence] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [generatedFilename, setGeneratedFilename] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'api_key' | 'service_unavailable' | 'general' | ''>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  
  // Load API key from localStorage on initial render, but don't show modal
  useEffect(() => {
    try {
      const savedApiKey = localStorage.getItem('geminiApiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
      // We removed the automatic modal opening here
    } catch (err) {
      console.error('Error accessing localStorage:', err);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Check if API key exists, only show modal when user tries to generate
    if (!apiKey.trim()) {
      setIsApiKeyModalOpen(true);
      return;
    }
    
    setLoading(true);
    setError('');
    setErrorType('');
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

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setErrorType(data.errorType || 'general');
        
        // If it's an API key error, show the settings modal
        if (data.errorType === 'api_key') {
          setIsApiKeyModalOpen(true);
        }
        return;
      }

      setGeneratedImage(data.image_base64);
      setGeneratedFilename(data.filename || 'almondspark-image.png');
    } catch (err) {
      setError('Sorry, something went wrong. Please try again in a few minutes.');
      setErrorType('general');
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySave = (newApiKey: string) => {
    setApiKey(newApiKey);
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

      <Header 
        onApiKeySave={handleApiKeySave}
        apiKey={apiKey}
      />

      <main className="content">
        <section className="generator-section">
          <h2>Generate Your Visual Strip</h2>
          <p className="generator-intro">Enter the idea or sentence you wish to convey and press the button</p>

          <div className="generator-form">
            <form onSubmit={handleSubmit}>
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
                  disabled={loading || !sentence.trim()}
                >
                  {loading ? 'Generating...' : 'Generate Icon Strip'}
                </button>
              </div>
            </form>
            
            <p className="generation-disclaimer">ALL the generations here will be shown randomly in the gallery section - make sure you don't use personal information in your strips.</p>
            
            {!apiKey && !loading && !error && (
              <div className="api-key-prompt">
                <p>Please use the Settings to input your Gemini API key so we can generate strips for you.</p>
                <button 
                  onClick={() => setIsApiKeyModalOpen(true)} 
                  className="settings-prompt-btn"
                >
                  Open Settings
                </button>
              </div>
            )}
            
            {loading && (
              <div id="loading-indicator" className="htmx-indicator" style={{ display: 'flex' }}>
                <div className="spinner"></div>
                <p>Creating your visual strip...</p>
              </div>
            )}
            
            {error && (
              <div className={`error-message error-${errorType}`}>
                <p>{error}</p>
                {errorType === 'api_key' && (
                  <button 
                    onClick={() => setIsApiKeyModalOpen(true)} 
                    className="error-action-btn"
                  >
                    Open Settings
                  </button>
                )}
                {errorType === 'service_unavailable' && (
                  <p className="error-hint">The Gemini model experiences high traffic at times. Please try again later.</p>
                )}
                {errorType === 'general' && (
                  <p className="error-hint">If this problem persists, please contact us for assistance.</p>
                )}
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

      {/* API Key Modal - only shown when needed */}
      <SettingsModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleApiKeySave}
        initialApiKey={apiKey}
      />

      <footer>
        <p>&copy; 2025 Almond Spark. All rights reserved.</p>
      </footer>
    </div>
  );
}