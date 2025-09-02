import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './styles.scss';

interface LevelSelectorProps {
    level: number;
    onChange: (newLevel: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ level, onChange }) => {
    // Novo estado para controlar o efeito de hover
    const [hoverLevel, setHoverLevel] = useState(0);

    return (
        <div 
            className="level-selector-stars"
            // Limpa o hover quando o mouse sai do container
            onMouseLeave={() => setHoverLevel(0)}
        >
            {[...Array(5)].map((_, index) => {
                const currentLevel = index + 1;
                
                // Determina se a estrela deve estar preenchida (laranja)
                const isFilled = currentLevel <= (hoverLevel || level);

                return (
                    <label 
                        key={currentLevel}
                        // Define o nível de hover quando o mouse entra em uma estrela
                        onMouseEnter={() => setHoverLevel(currentLevel)}
                    >
                        <input
                            type="radio"
                            name={`rating-${Math.random()}`}
                            value={currentLevel}
                            checked={currentLevel === level}
                            onChange={() => onChange(currentLevel)}
                            style={{ display: 'none' }}
                        />
                        <FaStar
                            className="star"
                            size={22}
                            // A cor agora é controlada pelo estado isFilled
                            color={isFilled ? '#ffc107' : '#e4e5e9'}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default LevelSelector;

