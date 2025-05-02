import { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../Header';
import { useLanguage } from '../../utils/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [apiKey, setApiKey] = useState('');
  const { language, t } = useLanguage();

  useEffect(() => {
    // Get API key from localStorage when component mounts
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('geminiApiKey') || '';
      setApiKey(storedApiKey);
    }
  }, []);

  // Set the HTML language and direction attributes
  useEffect(() => {
    if (document) {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    }
  }, [language]);

  const handleApiKeySave = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={language === 'he' ? 'rtl' : 'ltr'}>
        <Header onApiKeySave={handleApiKeySave} apiKey={apiKey} />
        <main className="content">{children}</main>
        <footer>
          <p className="text-center">{t.common.footer.copyright}</p>
        </footer>
      </div>
      <style jsx>{`
        .text-center {
          text-align: center;
        }
        
        .rtl {
          direction: rtl;
        }
        
        .ltr {
          direction: ltr;
        }
        
        .content {
          min-height: 70vh;
        }
      `}</style>
    </>
  );
};

export default Layout;