import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '../utils/LanguageContext';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LanguageProvider>
  );
}

export default MyApp;