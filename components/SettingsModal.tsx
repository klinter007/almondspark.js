import { useState, useEffect } from 'react';
import { useLanguage } from '../utils/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  initialApiKey?: string;
}

const SettingsModal = ({ isOpen, onClose, onSave, initialApiKey = '' }: SettingsModalProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [message, setMessage] = useState('');
  const { language, t } = useLanguage();

  useEffect(() => {
    setApiKey(initialApiKey);
  }, [initialApiKey]);
  
  const handleSave = () => {
    if (!apiKey.trim()) {
      // Keep error messages in English as they're technical
      setMessage('Please enter a valid Gemini API key');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('geminiApiKey', apiKey);
    setMessage('API key saved successfully!');
    
    // Call the parent component's save handler
    onSave(apiKey);
    
    // Close modal after short delay to show success message
    setTimeout(() => {
      onClose();
      setMessage('');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h2>GEMINI API KEY</h2>
        <p>
          {language === 'en' ? 'Please enter your Gemini API key from' : 'אנא הזן את מפתח ה-API של Gemini שלך מ'}{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
            Google AI Studio
          </a>
        </p>
        <p className="settings-info">
          {language === 'en' ? 
            'Your API key is stored in your browser and used to generate images with the gemini-2.0-flash-exp model. To create a new API key:' : 
            'מפתח ה-API שלך מאוחסן בדפדפן שלך ומשמש ליצירת תמונות עם המודל gemini-2.0-flash-exp. ליצירת מפתח API חדש:'}
          <ol className="key-instructions">
            <li>{language === 'en' ? 'Visit' : 'בקר באתר'} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio API Keys page</a></li>
            <li>{language === 'en' ? 'Sign in with your Google account' : 'התחבר עם חשבון Google שלך'}</li>
            <li>{language === 'en' ? 'Click "Create API key"' : 'לחץ על "Create API key"'}</li>
            <li>{language === 'en' ? 'Copy the generated key and paste it here' : 'העתק את המפתח שנוצר והדבק אותו כאן'}</li>
          </ol>
          {language === 'en' ? 
            'The API key is only used for this service and stored locally in your browser.' : 
            'מפתח ה-API משמש רק לשירות זה ומאוחסן מקומית בדפדפן שלך.'}
        </p>
        
        <div className="settings-form">
          <label htmlFor="apiKeyInput">{language === 'en' ? 'Gemini API Key' : 'מפתח API של Gemini'}</label>
          <input
            id="apiKeyInput"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={language === 'en' ? 'Enter your Gemini API key' : 'הזן את מפתח ה-API של Gemini שלך'}
          />
          
          {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
          
          <div className="settings-actions">
            <button className="cancel-button" onClick={onClose}>
              {language === 'en' ? 'Cancel' : 'ביטול'}
            </button>
            <button className="save-button" onClick={handleSave}>
              {language === 'en' ? 'Save API Key' : 'שמור מפתח API'}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .settings-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .settings-modal {
          background: white;
          padding: 25px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        h2 {
          margin-top: 0;
          color: #333;
          text-align: ${language === 'he' ? 'right' : 'left'};
        }
        
        .settings-info {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
          text-align: ${language === 'he' ? 'right' : 'left'};
        }
        
        .key-instructions {
          margin-top: 8px;
          padding-left: ${language === 'he' ? '0' : '20px'};
          padding-right: ${language === 'he' ? '20px' : '0'};
          text-align: ${language === 'he' ? 'right' : 'left'};
        }
        
        .key-instructions li {
          margin-bottom: 5px;
        }
        
        .key-instructions a {
          color: #4a8fe7;
          text-decoration: underline;
        }
        
        .settings-form {
          display: flex;
          flex-direction: column;
        }
        
        label {
          margin-bottom: 8px;
          font-weight: bold;
          text-align: ${language === 'he' ? 'right' : 'left'};
        }
        
        input {
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          text-align: ${language === 'he' ? 'right' : 'left'};
        }
        
        .settings-actions {
          display: flex;
          justify-content: ${language === 'he' ? 'flex-start' : 'flex-end'};
          flex-direction: ${language === 'he' ? 'row-reverse' : 'row'};
          gap: 10px;
          margin-top: 15px;
        }
        
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .cancel-button {
          background-color: #f1f1f1;
          color: #333;
        }
        
        .save-button {
          background-color: #4a8fe7;
          color: white;
        }
        
        .error-message {
          color: #d32f2f;
          font-size: 14px;
          text-align: ${language === 'he' ? 'right' : 'left'};
        }
        
        .success-message {
          color: #388e3c;
          font-size: 14px;
          text-align: ${language === 'he' ? 'right' : 'left'};
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;