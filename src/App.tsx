import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import CriarTorneio from './components/CriadorDeTorneios';
import CriadorDeTimes from './components/CriadorDeTimes';
import Navbar from './components/Navbar';
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/criar-torneio" element={<CriarTorneio />} />
        <Route path="/criar-times" element={<CriadorDeTimes />} />
      </Routes>
    </Router>
  );
}

export default App;

