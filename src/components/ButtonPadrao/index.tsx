import React from 'react';
import './btnpadrao.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    texto: React.ReactNode;
    variant?: 'primario' | 'secundario' | 'outline-primario' | 'outline-secundario' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    hoverScale?: number | false;
}

const ButtonPadrao: React.FC<Props> = ({
    texto,
    className = '',
    variant = 'primario',
    size = 'md',
    isLoading, // <--- Recebe a propriedade isLoading
    hoverScale = 1.02,
    ...props
}) => {
    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };

    return (
        <button
            className={`btn-${variant} ${sizeClasses[size]} ${hoverScale !== false ? 'hover-scale' : ''} ${className}`}
            disabled={isLoading || props.disabled} // <--- Desabilita se isLoading for true
            {...props}
        >
            {isLoading ? (
                // Lógica condicional: se estiver carregando, exibe o spinner
                <div className="spinner"></div> // <-- Elemento para o spinner
            ) : (
                // Caso contrário, exibe o texto do botão
                texto
            )}
        </button>
    );
};

export default ButtonPadrao;