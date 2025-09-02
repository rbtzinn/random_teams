import React from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import './styles.scss';

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    const getIcon = () => {
        if (theme === 'light') return <FaSun />;
        if (theme === 'dark') return <FaMoon />;
        return <FaDesktop />;
    };

    return (
        <button onClick={cycleTheme} className="theme-toggle-btn" aria-label={`Mudar para tema ${theme}`}>
            {getIcon()}
        </button>
    );
};

export default ThemeToggle;
