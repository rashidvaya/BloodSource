import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      About: 'About',
      'Download the app': 'Download the app',
      Grok: 'Grok',
      'Help Center': 'Help Center',
      'Terms of Service': 'Terms of Service',
      'Privacy Policy': 'Privacy Policy',
      'Cookie Policy': 'Cookie Policy',
      Accessibility: 'Accessibility',
      'Ads info': 'Ads info',
      Blog: 'Blog',
      Careers: 'Careers',
      English: 'English',
      Bangla: 'Bangla',
      Advertising: 'Advertising',
      Developers: 'Developers',
      Settings: 'Settings',
      // Add more keys as needed
    },
  },
  bn: {
    translation: {
      About: 'পরিচিতি',
      'Download the app': 'অ্যাপ ডাউনলোড করুন',
      Grok: 'গ্রোক',
      'Help Center': 'সহায়তা কেন্দ্র',
      'Terms of Service': 'পরিষেবার শর্তাবলী',
      'Privacy Policy': 'গোপনীয়তা নীতি',
      'Cookie Policy': 'কুকি নীতি',
      Accessibility: 'প্রবেশযোগ্যতা',
      'Ads info': 'বিজ্ঞাপন তথ্য',
      Blog: 'ব্লগ',
      Careers: 'ক্যারিয়ার',
      English: 'ইংরেজি',
      Bangla: 'বাংলা',
      Advertising: 'বিজ্ঞাপন',
      Developers: 'ডেভেলপার',
      Settings: 'সেটিংস',
      // Add more keys as needed
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 