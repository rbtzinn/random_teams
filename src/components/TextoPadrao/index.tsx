import { ElementType } from 'react';
import './textopadrao.scss';

interface TextoPadraoProps {
    texto: string;
    as?: ElementType;
    className?: string;
}

const TextoPadrao: React.FC<TextoPadraoProps> = ({ texto, as: Tag = 'p', className = '' }) => {
    return <Tag className={`text-custom ${className}`}>{texto}</Tag>;
};

export default TextoPadrao;
