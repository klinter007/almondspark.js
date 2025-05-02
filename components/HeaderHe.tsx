import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import GeminiApiKeyModal from './GeminiApiKeyModal';
import { useLanguage } from '../utils/LanguageContext';
import { useRouter } from 'next/router';

interface HeaderProps { 
  onApiKeySave: (apiKey: string) => void; 
  apiKey: string; 
}

const HeaderHe = ({ onApiKeySave, apiKey }: HeaderProps) => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isHomePage = router.pathname === '/';

  return (
    <nav className="main-nav" dir="rtl">
      {/* Start with a div container so we can use float instead of flexbox */}
      <div className="rtl-menu-container">
        {/* Right section - Home and page links */}
        <div className="right-section">
          <Link href="/" className="home-link">בית</Link>
          <Link href="/disclaimer" className={`page-link ${router.pathname === '/disclaimer' ? 'active' : ''}`}>
            {t.common.navigation.disclaimer}
          </Link>
          <Link href="/personal-note" className={`page-link ${router.pathname === '/personal-note' ? 'active' : ''}`}>
            {t.common.navigation.personalNote}
          </Link>
          <Link href="/gallery" className={`page-link ${router.pathname === '/gallery' ? 'active' : ''}`}>
            {t.common.navigation.gallery}
          </Link>
        </div>

        {/* Left section - Language selector and API key */}
        <div className="left-section">
          <div ref={ref} className="language-selector">
            <button onClick={() => setLangOpen(o => !o)} className="language-toggle">
              <i className="fas fa-globe"></i>
            </button>
            {isLangOpen && (
              <div className="language-dropdown">
                <button onClick={() => { setLanguage('en'); setLangOpen(false); }} className={language==='en' ? 'active':''}>EN</button>
                <button onClick={() => { setLanguage('he'); setLangOpen(false); }} className={language==='he' ? 'active':''}>HE</button>
              </div>
            )}
          </div>
          
          <button onClick={() => setSettingsOpen(true)} className="api-key-button">
            {t.common.navigation.apiKey}
          </button>
        </div>
      </div>

      {/* Hero section with title - only shown on homepage */}
      {isHomePage && (
        <div className="container">
          <header className="hero">
            <div className="title-container">
              <h1 className="main-title">AlmondSpark</h1>
              <p className="tagline">{t.home.hero.tagline}</p>
              <p className="disclaimer">{t.home.hero.disclaimer}</p>
            </div>
          </header>
        </div>
      )}

      <GeminiApiKeyModal 
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={onApiKeySave}
        initialApiKey={apiKey}
      />

      <style jsx>{`
        .main-nav {
          text-align: right;
          font-family: 'Noto Sans Hebrew', sans-serif;
        }
        
        .rtl-menu-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row-reverse; /* Reverse for RTL */
          width: 100%;
          padding: 10px 0;
        }
        
        .right-section {
          display: flex;
          align-items: center;
        }
        
        .home-link {
          margin-left: 20px;
          font-weight: 500;
          font-size: 1.2rem;
          text-decoration: none;
          color: var(--teal);
        }
        
        .page-link {
          margin-left: 15px;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          color: var(--teal);
        }
        
        .left-section {
          display: flex;
          align-items: center;
        }
        
        .api-key-button {
          background: none;
          border: none;
          color: inherit;
          font-family: 'Noto Sans Hebrew', sans-serif;
          font-weight: 500;
          cursor: pointer;
          padding: 0 15px;
          font-size: 1rem;
        }
        
        .language-selector {
          position: relative;
          margin-left: 15px;
        }
        
        .language-toggle {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          color: var(--teal);
          cursor: pointer;
          padding: 5px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
        }
        
        .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          z-index: 10;
          min-width: 80px;
          margin-top: 4px;
        }
        
        .language-dropdown button {
          display: block;
          width: 100%;
          border: none;
          background: none;
          padding: 8px 15px;
          text-align: right;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 1rem;
        }
        
        .language-dropdown button.active {
          font-weight: bold;
          color: var(--teal);
          background-color: #f0f8ff;
        }
        
        .title-container {
          text-align: center;
          margin: var(--space-md) auto;
        }
        
        .main-title, .tagline, .disclaimer {
          text-align: center;
        }
      `}</style>
    </nav>
  );
};

export default HeaderHe;