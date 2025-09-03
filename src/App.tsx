import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import CriarTorneio from './components/CriadorDeTorneios';
import CriadorDeTimes from './components/CriadorDeTimes';
import Navbar from './components/Navbar';

function App() {
  useTheme(); // Ativa o hook de tema globalmente
  const { user, loading } = useAuth(); // Corrigido de isLoading para loading

  // Mostra um spinner ou tela de carregamento enquanto o estado de auth é verificado
  if (loading) { // Corrigido de isLoading para loading
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#222' }}>
        <p style={{ color: 'white', fontSize: '1.5rem' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/criar-times" element={user ? <CriadorDeTimes /> : <Navigate to="/login" />} />
        <Route path="/criar-torneio" element={user ? <CriarTorneio /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

