import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import GeminiApiKeyModal from './GeminiApiKeyModal';
import { useLanguage } from '../utils/LanguageContext';
import { useRouter } from 'next/router';

interface HeaderProps { onApiKeySave: (apiKey: string) => void; apiKey: string; }

const HeaderEn = ({ onApiKeySave, apiKey }: HeaderProps) => {
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

  const items = [
    { href: '/', label: 'AlmondSpark' },
    { href: '/disclaimer', label: t.common.navigation.disclaimer },
    { href: '/personal-note', label: t.common.navigation.personalNote },
    { href: '/gallery', label: t.common.navigation.gallery },
  ];

  const isHomePage = router.pathname === '/';

  return (
    <nav className="main-nav" dir="ltr">
      <div className="menu-container ltr-menu">
        <div className="nav-section primary-nav">
          {items.map((x, i) => (
            <Link href={x.href} key={i} className={`nav-link ${i === 0 ? 'home-link' : 'page-link'} ${router.pathname === x.href ? 'active' : ''}`}>
              {x.label}
            </Link>
          ))}
        </div>
        
        <div className="nav-section controls">
          <button onClick={() => setSettingsOpen(true)} className="api-key-button">
            {t.common.navigation.apiKey}
          </button>
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

      <GeminiApiKeyModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} onSave={onApiKeySave} initialApiKey={apiKey} />

      <style jsx>{`
        .main-nav {
          text-align: left;
          font-family: 'Noto Sans', sans-serif;
        }
        .menu-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 0;
        }
        .nav-section {
          display: flex;
          align-items: center;
        }
        .primary-nav {
          gap: 15px;
        }
        .controls {
          gap: 15px;
        }
        .nav-link {
          text-decoration: none;
          color: var(--teal);
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .home-link {
          font-weight: 500;
          font-size: 1.2rem;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--coral);
          border-bottom: 2px solid var(--coral);
        }
        .api-key-button {
          background: none;
          border: none;
          color: var(--teal);
          font-family: 'Noto Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          font-size: 1rem;
          padding: 5px;
          transition: color 0.2s ease;
        }
        .api-key-button:hover {
          color: var(--coral);
        }
        .language-selector {
          position: relative;
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
          transition: all 0.2s ease;
        }
        .language-toggle:hover {
          background-color: #f1f1f1;
        }
        .language-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
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
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 1rem;
        }
        .language-dropdown button.active {
          font-weight: bold;
          color: var (--teal);
          background-color: #f0f8ff;
        }
        
        /* Hero section styles */
        .container {
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: var(--white);
          border: 2px solid var(--teal);
          margin-top: 15px;
        }
        
        .title-container {
          text-align: center;
          margin: var(--space-md) auto;
        }
        
        .main-title, .tagline, .disclaimer {
          text-align: center;
        }
        
        .main-title {
          color: var(--teal);
          font-size: 2.5em;
          margin-bottom: 0;
          border-bottom: none;
          line-height: 1;
        }
        
        .tagline {
          color: var(--almond);
          font-size: 1.3em;
          font-weight: 300;
          margin-top: 0;
        }
      `}</style>
    </nav>
  );
};

export default HeaderEn;