import React from 'react';
import './btnpadrao.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    texto: React.ReactNode;
    variant?: 'primario' | 'secundario' | 'outline-primario' | 'outline-secundario' | 'success';
    size?: 'sm' | 'md' | 'lg';
    hoverScale?: number | false;
}

const ButtonPadrao: React.FC<Props> = ({
    texto,
    className = '',
    variant = 'primario',
    size = 'md',
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
            {...props}
        >
            {texto}
        </button>
    );
};

export default ButtonPadrao;