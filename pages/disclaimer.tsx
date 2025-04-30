import Head from 'next/head';
import Link from 'next/link';

export default function Disclaimer() {
  return (
    <div>
      <Head>
        <title>Disclaimer - Almond Spark</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </Head>

      <nav className="main-nav">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/personal-note">Personal Note</Link></li>
          <li><Link href="/disclaimer" className="active">Disclaimer</Link></li>
        </ul>
      </nav>

      <div className="container">
        <header className="hero">
          <div className="title-container">
            <h1 className="main-title">Disclaimer</h1>
            <p className="tagline">Technical and legal information</p>
          </div>
        </header>
        
        <main className="content disclaimer-page">
          <section className="note-section disclaimer">
            <h2>Technical Disclaimer</h2>
            <p>I built Almond Spark for my own learning and to help my son communicate.
            I make no guarantees—technical, therapeutic, or otherwise.</p>
            <ul className="disclaimer-list">
              <li>I&apos;m not responsible for what anyone else generates or shows to their kids.</li>
              <li>The tool may break, vanish, or return content you dislike.</li>
              <li>Lewd, harmful, or false results are possible. Use at your own risk.</li>
            </ul>
            <p>If you spot something offensive or broken, email me and I&apos;ll try to fix or remove it—but I still can&apos;t promise anything.</p>
          </section>
          
          <section className="note-section">
            <h2>API Usage</h2>
            <p>Almond Spark relies on Gemini API, which has usage quotas and limitations. During periods of heavy use, the service may become temporarily unavailable.</p>
            <p>Users are required to input their own API keys to generate content through the service.</p>
          </section>
          
          <section className="note-section">
            <h2>Content Policy</h2>
            <p>Almond Spark is intended for educational and communicative purposes only. Users are prohibited from using the service to:</p>
            <ul className="disclaimer-list">
              <li>Generate hateful, violent, or discriminatory content</li>
              <li>Violate copyright or intellectual property rights</li>
              <li>Create deceptive or misleading information</li>
            </ul>
            <p>I reserve the right to deny service to any user violating these guidelines.</p>
          </section>
        </main>
      </div>

      <footer>
        <p>&copy; 2025 Almond Spark. All rights reserved.</p>
      </footer>
    </div>
  );
}