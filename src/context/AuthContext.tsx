import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export interface AppUser {
    firebaseUser: User;
    displayName: string;
}

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    // Adicione a função de atualização ao tipo do contexto
    setUser: React.Dispatch<React.SetStateAction<AppUser | null>>; 
}

// Atualize o valor padrão do contexto
const AuthContext = createContext<AuthContextType>({ user: null, loading: true, setUser: () => {} });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

const getFirstAndSecondName = (fullName: string | null): string => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    return names.slice(0, 2).join(' ');
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                if (firebaseUser.emailVerified) {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    let fullName = firebaseUser.displayName;

                    if (userDoc.exists()) {
                        fullName = userDoc.data().displayName || fullName;
                    }
                    
                    const appUser: AppUser = {
                        firebaseUser,
                        displayName: getFirstAndSecondName(fullName),
                    };

                    setUser(appUser);
                } else {
                    await signOut(auth);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        setUser, // Exponha a função setUser no provedor
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};