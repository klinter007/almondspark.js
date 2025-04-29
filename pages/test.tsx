import Head from 'next/head';

export default function TestPage() {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <Head>
        <title>Test Page - Next.js Working</title>
      </Head>
      
      <h1 style={{ color: '#4285f4' }}>Next.js Test Page</h1>
      <p>If you can see this page with blue heading text, your Next.js application is working correctly!</p>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <p>This is a test page to verify routing and styling in the Next.js application.</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{ 
          color: 'white', 
          backgroundColor: '#4285f4', 
          padding: '0.5rem 1rem', 
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}