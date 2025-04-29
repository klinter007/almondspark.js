import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import SettingsModal from '../components/SettingsModal';

interface GalleryItem {
  id: string;
  sentence: string;
  filename: string;
  image_base64: string;
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Load API key from localStorage on initial render
  useEffect(() => {
    try {
      const savedApiKey = localStorage.getItem('geminiApiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (err) {
      console.error('Error accessing localStorage:', err);
    }
  }, []);

  // Function to load 5 random gallery items
  const loadGalleryItems = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      // Request 5 random items from the API
      const response = await fetch('/api/gallery?limit=5');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setGalleryItems(data.gallery || []);
    } catch (err) {
      setError(`Error loading gallery: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load initial gallery items on component mount
  useEffect(() => {
    loadGalleryItems();
  }, []);

  // Function to handle "Show me more" button click
  const handleShowMore = () => {
    loadGalleryItems(true);
  };

  const handleApiKeySave = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  const downloadImage = (filename: string, base64Data: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = filename || 'almondspark-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printImage = (base64Data: string, caption: string) => {
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
          <img src="data:image/png;base64,${base64Data}" alt="${caption}">
          <div class="caption">${caption}</div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div>
      <Head>
        <title>Gallery - Almond Spark</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </Head>

      <Header 
        onApiKeySave={handleApiKeySave}
        apiKey={apiKey}
      />
      
      <main className="content">
        <section className="gallery-section">
          <h1 className="main-title">Gallery</h1>
          <p className="gallery-intro">Visual Strips Created by Our Community</p>
          <p className="gallery-intro">Here are past generations from our users. Hope you can find helpful strips for you here.</p>
          
          <div className="gallery-controls">
            <button 
              className="gallery-button" 
              onClick={handleShowMore} 
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <div className="spinner-small"></div> Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-dice"></i> Show me more
                </>
              )}
            </button>
          </div>
          
          <div id="gallery-container" className="gallery-grid">
            {loading ? (
              <div className="gallery-loading">
                <div className="spinner"></div>
                <p>Loading gallery items...</p>
              </div>
            ) : error ? (
              <div className="gallery-error">
                <p>Error loading gallery items. Please try again later.</p>
                <p className="error-details">{error}</p>
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="gallery-empty">
                <p>No gallery items available yet. Generate some images first!</p>
              </div>
            ) : (
              galleryItems.map((item) => (
                <div key={item.id} className="gallery-item">
                  <div className="gallery-image-container">
                    <img
                      src={`data:image/png;base64,${item.image_base64}`}
                      alt={item.sentence}
                      className="gallery-image"
                    />
                    <div className="gallery-actions">
                      <button 
                        className="gallery-action-btn download-btn" 
                        title="Download" 
                        onClick={() => downloadImage(item.filename, item.image_base64)}
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button 
                        className="gallery-action-btn print-btn" 
                        title="Print" 
                        onClick={() => printImage(item.image_base64, item.sentence)}
                      >
                        <i className="fas fa-print"></i>
                      </button>
                    </div>
                  </div>
                  <div className="gallery-caption">
                    <p className="prompt-text">{item.sentence}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="gallery-controls bottom-controls">
            <button 
              className="gallery-button" 
              onClick={handleShowMore}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <div className="spinner-small"></div> Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-dice"></i> Show me more
                </>
              )}
            </button>
          </div>
        </section>
      </main>

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