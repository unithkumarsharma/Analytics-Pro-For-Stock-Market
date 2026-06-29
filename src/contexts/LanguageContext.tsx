import React, { createContext, useContext, useState } from 'react';

export type LanguageCode = 'en' | 'hi' | 'es' | 'de';

export const translations = {
  en: {
    dashboard: 'Dashboard',
    markets: 'Markets',
    portfolio: 'Portfolio',
    technicalAnalysis: 'Technical Analysis',
    optionsAnalytics: 'Options Analytics',
    aiSignals: 'AI Signals',
    watchlist: 'Watchlist',
    news: 'News',
    settings: 'Settings',
    searchPlaceholder: 'Search symbols, tickers...',
    overview: 'Overview',
    holdings: 'Holdings',
    analytics: 'Analytics',
    riskScore: 'Risk Score',
    winRate: 'Win Rate',
    maxPain: 'Max Pain',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    markets: 'बाज़ार',
    portfolio: 'पोर्टफोलियो',
    technicalAnalysis: 'तकनीकी विश्लेषण',
    optionsAnalytics: 'ऑप्शंस विश्लेषण',
    aiSignals: 'एआई सिग्नल्स',
    watchlist: 'वॉचलिस्ट',
    news: 'समाचार',
    settings: 'सेटिंग्स',
    searchPlaceholder: 'सिंबल, टिकर खोजें...',
    overview: 'अवलोकन',
    holdings: 'होल्डिंग्स',
    analytics: 'एनालिटिक्स',
    riskScore: 'जोखिम स्कोर',
    winRate: 'जीत दर',
    maxPain: 'मैक्स पेन',
  },
  es: {
    dashboard: 'Panel',
    markets: 'Mercados',
    portfolio: 'Portafolio',
    technicalAnalysis: 'Análisis Técnico',
    optionsAnalytics: 'Análisis de Opciones',
    aiSignals: 'Señales de IA',
    watchlist: 'Lista de Vigilancia',
    news: 'Noticias',
    settings: 'Ajustes',
    searchPlaceholder: 'Buscar símbolos, tickers...',
    overview: 'Resumen',
    holdings: 'Tenencias',
    analytics: 'Analítica',
    riskScore: 'Puntuación de Riesgo',
    winRate: 'Tasa de Ganancia',
    maxPain: 'Dolor Máximo',
  },
  de: {
    dashboard: 'Dashboard',
    markets: 'Märkte',
    portfolio: 'Portfolio',
    technicalAnalysis: 'Technische Analyse',
    optionsAnalytics: 'Optionen-Analyse',
    aiSignals: 'KI-Signale',
    watchlist: 'Beobachtungsliste',
    news: 'Nachrichten',
    settings: 'Einstellungen',
    searchPlaceholder: 'Symbole, Ticker suchen...',
    overview: 'Übersicht',
    holdings: 'Bestände',
    analytics: 'Analysen',
    riskScore: 'Risikobewertung',
    winRate: 'Gewinnquote',
    maxPain: 'Max Schmerz',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('language-preference') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('language-preference', lang);
  };

  const t = (key: keyof typeof translations['en']): string => {
    return translations[language][key] || translations['en'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
