import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import CriarTorneio from './components/CriadorDeTorneios';
import CriarDeTimes from './components/CriadorDeTimes';
import Navbar from './components/Navbar';
import { useUIStore } from './store/ui.store';
import RosterManager from './components/RosterManager';

const App: React.FC = () => {
    useTheme();
    const { user, loading } = useAuth();
    const isRosterModalOpen = useUIStore((state) => state.isRosterModalOpen);

    if (loading) {
        return <div className="loading-spinner">Carregando...</div>;
    }

    return (
        <Router>
            <Navbar />
            {/* O modal do elenco agora é renderizado aqui, no topo de tudo */}
            {isRosterModalOpen && user && <RosterManager />}
            
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/criar-times" element={user ? <CriarDeTimes /> : <Navigate to="/login" />} />
                <Route path="/criar-torneio" element={user ? <CriarTorneio /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

const spinnerStyles = `
.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.5rem;
    background-color: var(--cor-fundo);
    color: var(--cor-texto);
}
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = spinnerStyles;
document.head.appendChild(styleSheet);

export default App;

