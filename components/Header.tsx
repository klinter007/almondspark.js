import HeaderEn from './HeaderEn';
import HeaderHe from './HeaderHe';
import { useLanguage } from '../utils/LanguageContext';

interface HeaderProps {
  onApiKeySave: (apiKey: string) => void;
  apiKey: string;
}

const Header = (props: HeaderProps) => {
  const { language } = useLanguage();
  return language === 'he' ? <HeaderHe {...props} /> : <HeaderEn {...props} />;
};

export default Header;