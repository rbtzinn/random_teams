import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaRandom, FaTrash, FaShareAlt } from 'react-icons/fa';
import ButtonPadrao from '../ButtonPadrao/index';
import TextoPadrao from '../TextoPadrao/index';
import LevelSelector from '../LevelSelector/index';
import AverageStars from '../AverageStars/index';
import Modal from '../Modal/index';
import { useTeamsStore } from '../../store/teams.store';
import { formatTeamsForClipboard } from '../../services/team.services';
import { stateToUrl, urlToState } from '../../services/serializer';
import './criador.scss';

const CriadorDeTimes: React.FC = () => {
    const [playerListText, setPlayerListText] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    const {
        players,
        numTeams,
        teams,
        teamNames,
        seed,
        loadPlayersFromText,
        updatePlayerLevel,
        removePlayer,
        setNumTeams,
        setTeamName,
        generateTeams,
        clearPlayers,
        setSeed,
    } = useTeamsStore();

    useEffect(() => {
        setTimeout(() => {
            const stateFromUrl = urlToState();
            if (stateFromUrl) {
                useTeamsStore.setState(stateFromUrl);
            }
        }, 0);
    }, []);

    const handleLoadPlayers = () => {
        loadPlayersFromText(playerListText);
    };

    const handleClearAll = () => {
        setIsClearModalOpen(true);
    };

    const confirmClearAll = () => {
        clearPlayers();
        setPlayerListText('');
        setIsClearModalOpen(false);
    };
    
    const handleCopyToClipboard = () => {
        const formattedText = formatTeamsForClipboard(teams, teamNames);
        navigator.clipboard.writeText(formattedText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        });
    };
    
    const handleCopyLink = () => {
        const url = stateToUrl();
        navigator.clipboard.writeText(url).then(() => {
            setIsLinkCopied(true);
            setTimeout(() => setIsLinkCopied(false), 2500);
        });
    };

    return (
        <>
            <div className="team-creator-container">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="team-creator-card">
                                <TextoPadrao texto="Criador de Times" as="h2" className="text-center mb-4" />
                                
                                <div className="add-player-section mb-4">
                                    <TextoPadrao texto="1. Cole a lista de jogadores" as="h5" className="mb-3" />
                                    <textarea
                                        className="form-control"
                                        rows={8}
                                        placeholder={'Cole aqui a lista de nomes, um por linha.\nEx:\nJoão\nMaria\nCarlos'}
                                        value={playerListText}
                                        onChange={(e) => setPlayerListText(e.target.value)}
                                    />
                                    <div className="d-flex gap-2 mt-3 justify-content-center">
                                       <ButtonPadrao texto="Carregar Jogadores" onClick={handleLoadPlayers} disabled={!playerListText.trim()} />
                                       <ButtonPadrao texto="Limpar Tudo" onClick={handleClearAll} variant="secundario" disabled={!players.length && !playerListText.trim()} />
                                   </div>
                                </div>

                                {players.length > 0 && (
                                    <div className="players-section mb-4">
                                        <TextoPadrao texto="2. Defina os níveis" as="h5" className="mb-3" />
                                        <div className="player-level-list">
                                            {players.map((player, index) => (
                                                <div key={index} className="player-level-item">
                                                    <span className="player-name">{player.name}</span>
                                                    <LevelSelector level={player.level} onChange={(newLevel) => updatePlayerLevel(index, newLevel)} />
                                                    <button onClick={() => removePlayer(index)} className="btn-remove-player" aria-label={`Remover ${player.name}`}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {players.length > 0 && (
                                    <div className="settings-section mb-4">
                                         <TextoPadrao texto="3. Ajuste as configurações" as="h5" className="mb-3" />
                                         <div className="row align-items-center justify-content-center text-center">
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <label className="form-label">Número de Times</label>
                                                <div className="num-teams-control">
                                                    <ButtonPadrao texto="−" onClick={() => setNumTeams(numTeams - 1)} disabled={numTeams <= 2} />
                                                    <span className="fw-bold fs-5">{numTeams}</span>
                                                    <ButtonPadrao texto="+" onClick={() => setNumTeams(numTeams + 1)} disabled={numTeams >= players.length} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                 <label htmlFor="seed" className="form-label">Semente (Opcional)</label>
                                                 <input
                                                    id="seed"
                                                    type="text"
                                                    className="form-control text-center"
                                                    placeholder="Para sorteios reproduzíveis"
                                                    value={seed}
                                                    onChange={(e) => setSeed(e.target.value)}
                                                />
                                            </div>
                                         </div>
                                    </div>
                                )}

                                {players.length > 0 && (
                                    <div className="d-grid mb-4">
                                        <ButtonPadrao texto="Sortear Times Balanceados" onClick={generateTeams} disabled={players.length < numTeams} className="btn-lg" />
                                    </div>
                                )}

                                {teams.length > 0 && (
                                    <div className="teams-section">
                                        <TextoPadrao texto="Times Sorteados" as="h5" className="mb-3 text-center" />
                                        <div className="row g-4">
                                            {teams.map((team, index) => {
                                                const averageLevel = team.reduce((sum, player) => sum + player.level, 0) / (team.length || 1);
                                                return (
                                                    <div key={index} className="col-md-6">
                                                        <div className={`team-card team-${index + 1}`}>
                                                            <div className="team-header-container">
                                                                <input type="text" value={teamNames[index]} onChange={(e) => setTeamName(index, e.target.value)} className="form-control team-header" />
                                                                <div className="team-header-info">
                                                                    <span className="badge">Média: {averageLevel.toFixed(1)}</span>
                                                                    <AverageStars average={averageLevel} />
                                                                </div>
                                                            </div>
                                                            <ul className="team-members">
                                                                {team.map((p, pIndex) => (
                                                                    <li key={pIndex} className="team-member">
                                                                        <span className="member-name">{p.name}</span>
                                                                        <div className="member-info">
                                                                            <AverageStars average={p.level} />
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-4 d-flex flex-wrap gap-2 justify-content-center">
                                            <ButtonPadrao texto={<span className="d-flex align-items-center gap-2"><FaRandom /> Re-sortear</span>} onClick={generateTeams} variant="secundario" />
                                            <ButtonPadrao texto={isCopied ? <span className="d-flex align-items-center gap-2"><FaCheck /> Copiado!</span> : <span className="d-flex align-items-center gap-2"><FaCopy /> Copiar Times</span>} onClick={handleCopyToClipboard} variant={isCopied ? 'success' : 'secundario'} />
                                            <ButtonPadrao texto={isLinkCopied ? <span className="d-flex align-items-center gap-2"><FaCheck /> Link Copiado!</span> : <span className="d-flex align-items-center gap-2"><FaShareAlt /> Copiar Link</span>} onClick={handleCopyLink} variant={isLinkCopied ? 'success' : 'secundario'} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={confirmClearAll}
                title="Confirmar Limpeza"
                confirmText="Sim, Limpar Tudo"
            >
                <p>Você tem certeza de que deseja limpar a lista de jogadores?</p>
                <p><strong>Toda a configuração atual, incluindo os níveis definidos, será perdida.</strong></p>
            </Modal>
        </>
    );
};

export default CriadorDeTimes;

