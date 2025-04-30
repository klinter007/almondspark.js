import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import GeminiApiKeyModal from './GeminiApiKeyModal';

interface HeaderProps {
  onApiKeySave: (apiKey: string) => void;
  apiKey: string;
}

const Header = ({ onApiKeySave, apiKey }: HeaderProps) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <nav className="main-nav">
        <ul>
          <li><Link href="/" className="active">Home</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/personal-note">Personal Note</Link></li>
          <li><Link href="/disclaimer">Disclaimer</Link></li>
          <li className="api-key-li">
            <button 
              onClick={() => setIsSettingsModalOpen(true)} 
              className="api-key-button"
              title="Set Gemini API Key"
            >
              🔑 GEMINI API KEY
            </button>
          </li>
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
      </div>

      <GeminiApiKeyModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={onApiKeySave}
        initialApiKey={apiKey}
      />

      <style jsx>{`
        .api-key-li {
          margin-left: auto;
        }
        
        .api-key-button {
          background: none;
          border: none;
          color: inherit;
          font: inherit;
          cursor: pointer;
          padding: 0 15px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .api-key-button:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
};

export default Header;