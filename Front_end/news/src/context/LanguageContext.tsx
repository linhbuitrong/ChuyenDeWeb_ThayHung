import React, { createContext, useContext, useState } from 'react';

interface LanguageContextProps {
    language: 'vi' | 'en';
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps>({
    language: 'vi',
    toggleLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<'vi' | 'en'>('vi');

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
