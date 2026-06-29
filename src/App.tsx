import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { MainLayout } from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Portfolio from './pages/Portfolio';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import Options from './pages/Options';
import AISignals from './pages/AISignals';
import Watchlist from './pages/Watchlist';
import News from './pages/News';
import Settings from './pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/technical" element={<TechnicalAnalysis />} />
            <Route path="/options" element={<Options />} />
            <Route path="/signals" element={<AISignals />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/news" element={<News />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
