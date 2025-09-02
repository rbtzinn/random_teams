import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.scss';
import { FaComments, FaTh, FaUsers, FaTrophy } from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle/index.tsx'; // Caminho corrigido e explícito

const Navbar: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-custom p-2">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <FaComments className="brand-icon" />
                    <span>Criador de times</span>
                </Link>

                <div className="d-flex align-items-center gap-2">
                    <ThemeToggle /> {/* Botão de tema */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto gap-3">
                         <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center gap-2" to="/" onClick={() => document.querySelector('.navbar-collapse')?.classList.remove('show')}>
                                <FaTh />
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center gap-2" to="/criar-times" onClick={() => document.querySelector('.navbar-collapse')?.classList.remove('show')}>
                                <FaUsers />
                                Criar Times
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center gap-2" to="/criar-torneio" onClick={() => document.querySelector('.navbar-collapse')?.classList.remove('show')}>
                                <FaTrophy />
                                Criar Torneio
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

