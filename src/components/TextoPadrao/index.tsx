import React from 'react';
import './textopadrao.scss'

interface TextoPadraoProps {
    texto: string;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
}

const TextoPadrao: React.FC<TextoPadraoProps> = ({ texto, as = 'p', className = '' }) => {
    const Tag = as;
    return <Tag className={`text-custom ${className}`}>{texto}</Tag>;
};

export default TextoPadrao;
