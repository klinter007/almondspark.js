import Head from 'next/head';
import { useEffect } from 'react';
import { useLanguage } from '../utils/LanguageContext';

export default function PersonalNote() {
  const { language, t } = useLanguage();

  return (
    <div>
      <Head>
        <title key="title">{t.personalNote.title} - Almond Spark</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <header className="hero">
          <div className="title-container">
            <h1 className="main-title">{t.personalNote.title}</h1>
            <p className="tagline">{t.personalNote.tagline}</p>
          </div>
        </header>
        
        <main className="content personal-note">
          {t.personalNote.sections.map((section, index) => (
            <section className="note-section" key={index}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.content && <p>{section.content}</p>}
              
              {index === 3 && (
                <>
                  <ul className="feature-list">
                    {t.personalNote.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <p className="note-limits">{t.personalNote.limits}</p>
                  <div className="api-key-notice">
                    <p><strong>{language === 'en' ? 'Important:' : 'חשוב לדעת:'}</strong> {language === 'en' ? 'To generate images with AlmondSpark, you need a Gemini API key.' : 'כדי ליצור תמונות באמצעות AlmondSpark, אתם צריכים מפתח API של Gemini.'}</p>
                    <p className="api-key-notice-info">
                      {language === 'en' ? 
                        <>
                          We use the free gemini-2.0-flash-exp model, so there's no cost to you.<br/>
                          Your API key is saved only locally on your computer—never on our servers.<br/>
                          We don't collect any personal information about users.<br/>
                          Generated images are shared in the gallery for everyone's benefit.<br/>
                          To get started, click the settings icon in the top right corner to enter your API key.
                        </> 
                        : 
                        <>
                          אנו משתמשים במודל gemini-2.0-flash-exp החינמי, כך שאין עלות עבורכם.<br/>
                          מפתח ה-API שלכם נשמר מקומית רק על המחשב שלכם – לעולם לא על השרתים שלנו.<br/>
                          איננו אוספים מידע אישי כלשהו על המשתמשים.<br/>
                          התמונות שנוצרות משותפות בגלריה לטובת כולם.<br/>
                          כדי להתחיל, לחצו על סמל ההגדרות בפינה הימנית העליונה כדי להזין את מפתח ה-API שלכם.
                        </>
                      }
                    </p>
                    <p>{language === 'en' ? 'The use of AlmondSpark is completely free.' : 'השימוש ב-AlmondSpark הוא לחלוטין חינמי.'}</p>
                  </div>
                </>
              )}
              
              {index === 6 && (
                <div className="signature">
                  <p className="signature-name">{t.personalNote.signatureName || 'Gili & Shaked'}</p>
                  <p>{t.personalNote.social || 'Follow us on social media'}</p>
                  <div className="social-links">
                    <a href="https://x.com/GiliBenShahar" target="_blank" rel="noopener noreferrer" title="Follow on X">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com/gilibenshahar/" target="_blank" rel="noopener noreferrer" title="Follow on Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/gilibenshahar/" target="_blank" rel="noopener noreferrer" title="Connect on LinkedIn">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="https://www.facebook.com/gili.benshahar1" target="_blank" rel="noopener noreferrer" title="Follow on Facebook">
                      <i className="fab fa-facebook"></i>
                    </a>
                    <a href="mailto:hanzoom@gmail.com" target="_blank" rel="noopener noreferrer" title="Send an Email">
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
              )}
            </section>
          ))}
        </main>
      </div>

      <style jsx>{`
        .api-key-notice {
          background-color: var(--teal-lighter);
          border: 1px solid var(--teal-light);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-top: var(--space-md);
        }
        
        .api-key-notice-info {
          font-size: 0.9em;
          margin: var(--space-md) 0;
        }
      `}</style>
    </div>
  );
}