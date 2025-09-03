import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./navbar.scss";
import { FaTh, FaUsers, FaTrophy, FaListAlt } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useUIStore } from "../../store/ui.store";
import { FaBars } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openRosterModal } = useUIStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const closeMobileMenu = () => {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse?.classList.contains("show")) {
      const toggler = document.querySelector(".navbar-toggler") as HTMLElement;
      if (toggler) toggler.click();
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
          <FaBars className="hamburger-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
            {user ? (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link as-button"
                    onClick={() => {
                      openRosterModal();
                      closeMobileMenu();
                    }}
                  >
                    <FaListAlt />
                    <span>Meu Elenco</span>
                  </button>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/criar-times"
                    onClick={closeMobileMenu}
                  >
                    <FaUsers />
                    <span>Criar Times</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/criar-torneio"
                    onClick={closeMobileMenu}
                  >
                    <FaTrophy />
                    <span>Criar Torneio</span>
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle user-display"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
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

const styles = `
.nav-link.as-button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--cor-texto);
    font-weight: 500;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}
.nav-link.as-button:hover {
    color: var(--cor-primaria);
    background-color: var(--cor-fundo);
}
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Navbar;
