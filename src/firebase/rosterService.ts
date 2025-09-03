import { db } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Player } from '../services/team.services';

// O caminho para o documento do elenco de um usuário.
const getRosterDocRef = (userId: string) => doc(db, 'elencos', userId);

// Busca o elenco completo de um usuário.
export const fetchRoster = async (userId: string): Promise<Player[]> => {
    const docRef = getRosterDocRef(userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().players) {
        return docSnap.data().players as Player[];
    } else {
        // Se o usuário não tiver um elenco, cria um documento vazio.
        await setDoc(docRef, { players: [] });
        return [];
    }
};

// Adiciona um novo jogador ao elenco.
export const addPlayerToRoster = async (userId: string, newPlayer: Player): Promise<void> => {
    const docRef = getRosterDocRef(userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        await setDoc(docRef, { players: [newPlayer] });
    } else {
        const currentPlayers = docSnap.data().players as Player[];
        await updateDoc(docRef, {
            players: [...currentPlayers, newPlayer]
        });
    }
};

// Atualiza um jogador existente no elenco.
export const updatePlayerInRoster = async (userId: string, updatedPlayer: Player): Promise<void> => {
    const docRef = getRosterDocRef(userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const currentPlayers = docSnap.data().players as Player[];
        const playerIndex = currentPlayers.findIndex(p => p.id === updatedPlayer.id);
        
        if (playerIndex > -1) {
            currentPlayers[playerIndex] = updatedPlayer;
            await setDoc(docRef, { players: currentPlayers });
        } else {
            throw new Error("Jogador não encontrado para atualizar.");
        }
    }
};

// Remove um jogador do elenco pelo seu ID.
export const deletePlayerFromRoster = async (userId: string, playerId: string): Promise<void> => {
    const docRef = getRosterDocRef(userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const currentPlayers = docSnap.data().players as Player[];
        const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);
        await setDoc(docRef, { players: updatedPlayers });
    }
};

