import { useState, FormEvent, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import SettingsModal from '../components/SettingsModal';
import { useLanguage } from '../utils/LanguageContext';

export default function Home() {
  const [sentence, setSentence] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [generatedFilename, setGeneratedFilename] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'api_key' | 'service_unavailable' | 'general' | ''>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const { language, t } = useLanguage();
  
  // Retry state
  const [retryCount, setRetryCount] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retriesLeft, setRetriesLeft] = useState(0);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Handle countdown timer for retries
  useEffect(() => {
    // If we're retrying and have a countdown value, start the timer
    if (isRetrying && retryCountdown > 0) {
      countdownTimerRef.current = setInterval(() => {
        setRetryCountdown((prevCount) => {
          // When countdown reaches 0, clear the interval and trigger retry
          if (prevCount <= 1) {
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
            }
            // Trigger the retry in the next event loop cycle
            setTimeout(() => {
              retryGeneration();
            }, 0);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isRetrying, retryCountdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Check if API key exists, only show modal when user tries to generate
    if (!apiKey.trim()) {
      setIsApiKeyModalOpen(true);
      return;
    }
    
    // Reset retry state when starting a new generation
    setRetryCount(0);
    setIsRetrying(false);
    
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
          apiKey,
          retryCount: 0 // Initial request, retry count is 0
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setErrorType(data.errorType || 'general');
        
        // Handle service unavailable errors with retries
        if (data.errorType === 'service_unavailable' && data.retryAfter && data.retriesLeft >= 0) {
          setRetryCount(1); // First retry will be count 1
          setRetryCountdown(data.retryAfter);
          setIsRetrying(true);
          setRetriesLeft(data.retriesLeft);
        } 
        // Handle API key errors
        else if (data.errorType === 'api_key') {
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

  // Function to handle automatic retry
  const retryGeneration = async () => {
    setLoading(true);
    setIsRetrying(false);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sentence,
          apiKey,
          retryCount: retryCount
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setErrorType(data.errorType || 'general');
        
        // Handle retry for service unavailable
        if (data.errorType === 'service_unavailable' && data.retryAfter && data.retriesLeft >= 0) {
          setRetryCount(prevCount => prevCount + 1);
          setRetryCountdown(data.retryAfter);
          setIsRetrying(true);
          setRetriesLeft(data.retriesLeft);
        } else if (data.errorType === 'api_key') {
          setIsApiKeyModalOpen(true);
        }
        return;
      }

      // Success! Reset retry state and show the image
      setRetryCount(0);
      setIsRetrying(false);
      setGeneratedImage(data.image_base64);
      setGeneratedFilename(data.filename || 'almondspark-image.png');
    } catch (err) {
      setError('Sorry, something went wrong. Please try again in a few minutes.');
      setErrorType('general');
      setIsRetrying(false);
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
        <title key="title">{t.home.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </Head>

      <div className="hero-banner">
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
      </div>

      <section className="generator-section">
        <h2 className="text-center">{t.home.generator.title}</h2>
        <p className="generator-intro text-center">{t.home.generator.intro}</p>

        <div className="api-key-banner">
          <div className="api-key-banner-content text-center">
            <h3>{t.home.generator.apiKeyBanner.title}</h3>
            <p>{t.home.generator.apiKeyBanner.description}</p>
            <p className="api-key-banner-info">
              {t.home.generator.apiKeyBanner.info.map((info, index) => (
                <span key={index}>
                  {info}<br/>
                </span>
              ))}
              {t.home.generator.apiKeyBanner.settings}
            </p>
          </div>
        </div>

        {language === 'he' && (
          <p className="hebrew-limitation">
            ג'מיני לא יודע לג'נרט מילים בעברית בצורה מספיק טובה. ולכן כל הפלט שלנו יצא תמיד עם מילים באנגלית. מצטערים מאד, ומקווים שזה ישתנה בעתיד הקרוב.
          </p>
        )}

        <div className="generator-form">
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <textarea 
                className="sentence-input" 
                placeholder={t.home.generator.form.placeholder}
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
                {loading ? t.home.generator.loading : t.home.generator.form.button}
              </button>
            </div>
          </form>
          
          <p className="generation-disclaimer text-center">{t.home.generator.form.disclaimer}</p>
          
          {!apiKey && !loading && !error && (
            <div className="api-key-prompt text-center">
              <p>{t.home.generator.form.apiKeyPrompt}</p>
              <button 
                onClick={() => setIsApiKeyModalOpen(true)} 
                className="settings-prompt-btn"
              >
                {t.home.generator.form.openSettings}
              </button>
            </div>
          )}
          
          {loading && (
            <div id="loading-indicator" className="htmx-indicator" style={{ display: 'flex' }}>
              <div className="spinner"></div>
              <p>{t.home.generator.loading}</p>
            </div>
          )}
          
          {error && (
            <div className={`error-message error-${errorType} text-center`}>
              <p>{
                errorType === 'api_key' ? t.home.generator.error.apiKey :
                errorType === 'service_unavailable' ? t.home.generator.error.serviceUnavailable :
                t.home.generator.error.general
              }</p>
              {errorType === 'api_key' && (
                <button 
                  onClick={() => setIsApiKeyModalOpen(true)} 
                  className="error-action-btn"
                >
                  {t.home.generator.form.openSettings}
                </button>
              )}
              {errorType === 'service_unavailable' && !isRetrying && retriesLeft === 0 && (
                <p className="error-hint">{t.home.generator.error.serviceUnavailable}</p>
              )}
              {errorType === 'service_unavailable' && isRetrying && (
                <div className="retry-countdown">
                  <div className="countdown-timer">
                    <span className="countdown-number">{retryCountdown}</span>
                    <svg className="countdown-svg" width="40" height="40">
                      <circle 
                        className="countdown-circle" 
                        cx="20" 
                        cy="20" 
                        r="16"
                        style={{ 
                          strokeDashoffset: `${100 - (retryCountdown / (retryCount === 1 ? 10 : retryCount === 2 ? 15 : 20) * 100)}` 
                        }}
                      />
                    </svg>
                  </div>
                  <p className="retry-message">
                    {t.home.generator.error.retryMessage} {retriesLeft > 0 ? 
                      t.home.generator.error.retryMoreAttempts.replace('{count}', retriesLeft.toString()) : 
                      t.home.generator.error.retryLastAttempt}
                  </p>
                </div>
              )}
              {errorType === 'general' && (
                <p className="error-hint">{t.home.generator.error.persistentError}</p>
              )}
            </div>
          )}
          
          {generatedImage && (
            <div className="result-container text-center">
              <h3>{t.home.generator.result.title}</h3>
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
                  {t.home.generator.result.download}
                </button>
                <button 
                  className="gallery-action-btn print-btn" 
                  title="Print" 
                  onClick={printImage}
                >
                  {t.home.generator.result.print}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* API Key Modal - only shown when needed */}
      <SettingsModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleApiKeySave}
        initialApiKey={apiKey}
      />
      
      <style jsx>{`
        .text-center {
          text-align: center;
        }
        
        .hero-banner {
          margin-bottom: var(--space-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .hero-image-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .hero-image {
          width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border: 2px solid var(--teal);
        }
        
        .title-container {
          text-align: center;
          margin-top: var(--space-md);
        }
        
        .main-title, .tagline, .disclaimer, .hebrew-limitation {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }
        
        .hebrew-limitation {
          color: var(--coral);
          font-style: italic;
          max-width: 700px;
          margin: 1em auto;
          padding: 10px;
          border: 1px dashed var(--coral-light);
          background: var(--coral-light);
          border-radius: 8px;
        }
        
        .generator-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .generator-intro {
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .api-key-banner-content {
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .api-key-banner-info {
          margin: 15px auto;
          max-width: 700px;
        }
        
        .generation-disclaimer {
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
}