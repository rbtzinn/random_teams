import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './navbar.scss';
import { FaTh, FaUsers, FaTrophy } from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

const Navbar: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); // Redireciona para a página de login após o logout
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    // Função para fechar o menu mobile ao clicar em um link
    const closeMobileMenu = () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse?.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom p-2">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <FaUsers className="brand-icon" />
                    <span>Sorteio de Times</span>
                </Link>

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

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
                        {user ? (
                            // Links para usuário logado
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/criar-times" onClick={closeMobileMenu}>
                                        <FaUsers />
                                        <span>Criar Times</span>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/criar-torneio" onClick={closeMobileMenu}>
                                        <FaTrophy />
                                        <span>Criar Torneio</span>
                                    </NavLink>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle user-display" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {user.displayName}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogout}>
                                                Sair
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            // Link para usuário deslogado
                             <li className="nav-item">
                                <NavLink className="nav-link" to="/" onClick={closeMobileMenu}>
                                        <FaTh />
                                        <span>Home</span>
                                </NavLink>
                            </li>
                        )}
                         <li className="nav-item">
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

