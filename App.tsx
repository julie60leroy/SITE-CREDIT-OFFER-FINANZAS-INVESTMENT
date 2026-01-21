import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SimulatorPage from './pages/SimulatorPage';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <HashRouter>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            </Routes>
        </HashRouter>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

export default App;