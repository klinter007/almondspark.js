import Head from 'next/head';
import Link from 'next/link';

export default function PersonalNote() {
  return (
    <div>
      <Head>
        <title>Personal Note - Almond Spark</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </Head>

      <nav className="main-nav">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/personal-note" className="active">Personal Note</Link></li>
        </ul>
      </nav>

      <div className="container">
        <header className="hero">
          <div className="title-container">
            <h1 className="main-title">Personal Note</h1>
            <p className="tagline">AlmondSpark in a nutshell</p>
          </div>
        </header>
        
        <main className="content personal-note">
          <section className="note-section">
            <h2>Why this isn&apos;t an &quot;About Us&quot; page</h2>
            <p>Almond Spark isn&apos;t a company. It&apos;s a promise I made to my son to break the wall between us.</p>
          </section>
          
          <section className="note-section">
            <h2>The problem</h2>
            <p>My non-verbal boy got a school-issued AAC app. It looked like Windows 95 and took ten taps for a simple request. He gave up; I was frustrated.</p>
          </section>
          
          <section className="note-section">
            <h2>The idea</h2>
            <p>When Generative AI hit, I decided to build a cleaner, faster helper. I knew zero Python, but with AI pair-programming and many late nights, &quot;vibe-coding&quot; turned sketches into a working tool.</p>
          </section>
          
          <section className="note-section">
            <h2>How it works today</h2>
            <ul className="feature-list">
              <li>Takes any sentence or concept you wish to convey.</li>
              <li>breaks it down to atomic concepts and use them to create a four-panel visual strip.</li>
              <li>Returns a clear PNG you can print, show on a tablet, or stick on the fridge.</li>
            </ul>
            <p className="note-limits">Limits: free model quota; heavy use may stall—refresh later.</p>
          </section>
          
          <section className="note-section">
            <h2>Why not paywall this service?</h2>
            <p>I truly believe in &quot;Tikun Olam&quot; and if even one family gains smoother mornings or calmer bedtimes, my time is paid back. No ads, no subscriptions—just a tiny server bill and a lot of stubborn love.</p>
          </section>
          
          <section className="note-section">
            <h2>How you can help</h2>
            <p>Test it, share it, tell schools or support groups. Feedback, bug reports, new-feature wishes—send them over; I read everything.</p>
          </section>
          
          <section className="note-section signature">
            <p>Thanks for dropping by.</p>
            <p className="signature-name">Gili & Shaked</p>
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
          </section>
          
          <section className="note-section disclaimer">
            <h2>BIG DISCLAIMER</h2>
            <p>I built Almond Spark for my own learning and to help my son communicate.
            I make no guarantees—technical, therapeutic, or otherwise.</p>
            <ul className="disclaimer-list">
              <li>I&apos;m not responsible for what anyone else generates or shows to their kids.</li>
              <li>The tool may break, vanish, or return content you dislike.</li>
              <li>Lewd, harmful, or false results are possible. Use at your own risk.</li>
            </ul>
            <p>If you spot something offensive or broken, email me and I&apos;ll try to fix or remove it—but I still can&apos;t promise anything.</p>
          </section>
        </main>
      </div>

      <footer>
        <p>&copy; 2025 Almond Spark. All rights reserved.</p>
      </footer>
    </div>
  );
}