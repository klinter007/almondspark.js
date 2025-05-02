import Head from 'next/head';
import { useLanguage } from '../utils/LanguageContext';

export default function Disclaimer() {
  const { t } = useLanguage();

  return (
    <div>
      <Head>
        <title key="title">{t.disclaimer.title} - Almond Spark</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <header className="hero">
          <div className="title-container">
            <h1 className="main-title">{t.disclaimer.title}</h1>
            <p className="tagline">{t.disclaimer.tagline}</p>
          </div>
        </header>
        
        <main className="content disclaimer-page">
          <section className="note-section disclaimer">
            <h2>{t.disclaimer.technical.title}</h2>
            <p>{t.disclaimer.technical.description}</p>
            <ul className="disclaimer-list">
              {t.disclaimer.technical.list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>{t.disclaimer.technical.note}</p>
          </section>
          
          <section className="note-section">
            <h2>{t.disclaimer.apiUsage.title}</h2>
            <p>{t.disclaimer.apiUsage.description1}</p>
            <p>{t.disclaimer.apiUsage.description2}</p>
          </section>
          
          <section className="note-section">
            <h2>{t.disclaimer.contentPolicy.title}</h2>
            <p>{t.disclaimer.contentPolicy.description}</p>
            <ul className="disclaimer-list">
              {t.disclaimer.contentPolicy.list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>{t.disclaimer.contentPolicy.note}</p>
          </section>
        </main>
      </div>
    </div>
  );
}