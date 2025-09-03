import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.tsx';
import { useUIStore } from '../../store/ui.store.ts';
import { Player } from '../../services/team.services.ts';
import { addPlayerToRoster, deletePlayerFromRoster, fetchRoster, updatePlayerInRoster } from '../../firebase/rosterService.ts';
import ButtonPadrao from '../ButtonPadrao/index.tsx';
import InputPadrao from '../InputPadrao.tsx';
import LevelSelector from '../LevelSelector/index.tsx';
import './styles.scss';

const RosterManager: React.FC = () => {
    const { user } = useAuth();
    const { isRosterModalOpen, closeRosterModal } = useUIStore();
    const [roster, setRoster] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [playerName, setPlayerName] = useState('');
    const [playerLevel, setPlayerLevel] = useState(3);

    const loadRoster = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError('');
        try {
            const userRoster = await fetchRoster(user.firebaseUser.uid);
            setRoster(userRoster);
        } catch (err) {
            setError('Não foi possível carregar o elenco.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isRosterModalOpen) {
            loadRoster();
        }
    }, [isRosterModalOpen, loadRoster]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !playerName.trim()) return;

        setError('');
        const playerPayload: Player = { 
            id: editingPlayer?.id || `${Date.now()}`, 
            name: playerName.trim(), 
            level: playerLevel 
        };

        try {
            if (editingPlayer) {
                await updatePlayerInRoster(user.firebaseUser.uid, playerPayload);
            } else {
                await addPlayerToRoster(user.firebaseUser.uid, playerPayload);
            }
            resetForm();
            await loadRoster();
        } catch (err) {
            setError('Ocorreu um erro ao salvar o jogador.');
        }
    };

    const handleEdit = (player: Player) => {
        setEditingPlayer(player);
        setPlayerName(player.name);
        setPlayerLevel(player.level);
    };

    const handleDelete = async (playerId: string) => {
        if (!user) return;
        try {
            await deletePlayerFromRoster(user.firebaseUser.uid, playerId);
            await loadRoster();
        } catch (err) {
            setError('Não foi possível remover o jogador.');
        }
    };
    
    const resetForm = () => {
        setEditingPlayer(null);
        setPlayerName('');
        setPlayerLevel(3);
    };

    if (!isRosterModalOpen) {
        return null;
    }

    return (
        <div className="roster-manager-overlay" onClick={closeRosterModal}>
            <div className="roster-manager-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Meu Elenco</h3>
                    <button onClick={closeRosterModal} className="close-btn"><FaTimes /></button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleFormSubmit} className="player-form">
                        <h4>{editingPlayer ? 'Editar Jogador' : 'Adicionar Novo Jogador'}</h4>
                        <InputPadrao
                            placeholder="Nome do Jogador"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                        <div className='level-input'>
                             <label>Nível:</label>
                             <LevelSelector level={playerLevel} onChange={setPlayerLevel} />
                        </div>
                        <div className="form-actions">
                            <ButtonPadrao texto={editingPlayer ? 'Salvar Alterações' : <><FaPlus /> Adicionar</>} type="submit" />
                            {editingPlayer && (
                                <ButtonPadrao texto="Cancelar" variant="outline-secundario" onClick={resetForm} type="button" />
                            )}
                        </div>
                    </form>

                    <hr />

                    <div className="roster-list">
                        {isLoading && <p>Carregando elenco...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!isLoading && roster.length === 0 && <p>Seu elenco está vazio. Adicione jogadores acima!</p>}
                        
                        {roster.map((player) => (
                            <div key={player.id} className="roster-item">
                                <span className="player-name">{player.name}</span>
                                <div className="player-details">
                                    <LevelSelector level={player.level} onChange={() => {}} />
                                    <div className="player-actions">
                                        <button onClick={() => handleEdit(player)} title="Editar"><FaEdit /></button>
                                        <button onClick={() => handleDelete(player.id)} title="Excluir"><FaTrash /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RosterManager;

