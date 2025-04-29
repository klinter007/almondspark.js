import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  initialApiKey?: string;
}

const SettingsModal = ({ isOpen, onClose, onSave, initialApiKey = '' }: SettingsModalProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setApiKey(initialApiKey);
  }, [initialApiKey]);
  
  const handleSave = () => {
    if (!apiKey.trim()) {
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
        <h2>API Key Settings</h2>
        <p>
          Please enter your Gemini API key from{' '}
          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">
            Google AI Studio
          </a>
        </p>
        <p className="settings-info">
          Your API key is stored only in your browser and never sent to our servers.
          It will be used for generating images with Gemini AI.
        </p>
        
        <div className="settings-form">
          <label htmlFor="apiKeyInput">Gemini API Key</label>
          <input
            id="apiKeyInput"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
          />
          
          {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
          
          <div className="settings-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSave}>
              Save API Key
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
        }
        
        .settings-info {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        
        .settings-form {
          display: flex;
          flex-direction: column;
        }
        
        label {
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        input {
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .settings-actions {
          display: flex;
          justify-content: flex-end;
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
        }
        
        .success-message {
          color: #388e3c;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;