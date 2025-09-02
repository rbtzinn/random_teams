import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './styles.scss';

interface AverageStarsProps {
    average: number;
}

const AverageStars: React.FC<AverageStarsProps> = ({ average }) => {
    const renderStars = () => {
        const stars = [];
        // Arredonda a média para o valor de 0.5 mais próximo (ex: 3.7 vira 3.5, 3.8 vira 4.0)
        const roundedAverage = Math.round(average * 2) / 2;

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedAverage) {
                // Estrela cheia
                stars.push(<FaStar key={`full-${i}`} />);
            } else if (i - 0.5 === roundedAverage) {
                // Meia estrela
                stars.push(<FaStarHalfAlt key={`half-${i}`} />);
            } else {
                // Estrela vazia
                stars.push(<FaRegStar key={`empty-${i}`} />);
            }
        }
        return stars;
    };

    return <div className="average-stars">{renderStars()}</div>;
};

export default AverageStars;
