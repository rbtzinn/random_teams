import React from 'react';
import { FaStar } from 'react-icons/fa';
import './styles.scss';

interface LevelSelectorProps {
    level: number;
    onChange: (newLevel: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ level, onChange }) => {
    return (
        <div className="level-selector-stars">
            {[...Array(5)].map((_, index) => {
                const currentLevel = index + 1;
                return (
                    <label key={currentLevel}>
                        <input
                            type="radio"
                            name={`rating-${Math.random()}`} // Nome único para evitar conflitos
                            value={currentLevel}
                            onClick={() => onChange(currentLevel)}
                            style={{ display: 'none' }}
                            defaultChecked={currentLevel === level}
                        />
                        <FaStar
                            className="star"
                            size={22}
                            color={currentLevel <= level ? 'var(--cor-estrela-preenchida)' : 'var(--cor-estrela-vazia)'}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default LevelSelector;

