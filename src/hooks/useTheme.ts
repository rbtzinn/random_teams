import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Tenta ler o tema salvo no localStorage, ou usa 'system' como padrão
        return (localStorage.getItem('theme') as Theme) || 'system';
    });

    useEffect(() => {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = theme === 'system' ? systemTheme : theme;

        // Adiciona ou remove o atributo 'data-theme' do elemento <html>
        document.documentElement.setAttribute('data-theme', currentTheme);
        // Salva a escolha do usuário no localStorage
        localStorage.setItem('theme', theme);
        
    }, [theme]); // Este efeito executa sempre que o 'theme' mudar

    return { theme, setTheme };
};

