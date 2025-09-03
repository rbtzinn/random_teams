import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  signOut,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase/config";
import { useAuth, AppUser } from "../context/AuthContext";

const getFirstAndSecondName = (fullName: string | null): string => {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");
  return names.slice(0, 2).join(" ");
};

// Um wrapper para lidar com o estado de loading e mensagens
const handleAsync = async (
  callback: () => Promise<void>,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  setSuccessMessage: (message: string) => void
) => {
  setIsLoading(true);
  setError("");
  setSuccessMessage("");
  try {
    await callback();
  } catch (err: any) {
    let errorMessage = "Ocorreu um erro. Tente novamente.";
    if (err.code === "auth/email-already-in-use") {
      errorMessage = "Este e-mail já está em uso.";
    } else if (
      err.code === "auth/invalid-credential" ||
      err.code === "auth/user-not-found"
    ) {
      errorMessage = "E-mail ou senha inválidos.";
    }
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

export const useAuthForm = () => {
  const { setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [resendCooldown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    await handleAsync(
      async () => {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const firebaseUser = userCredential.user;

        await updateProfile(firebaseUser, { displayName: name }).catch(() =>
          console.warn("⚠️ Falha ao atualizar o nome de exibição")
        );
        await setDoc(doc(db, "users", firebaseUser.uid), {
          displayName: name,
          email: firebaseUser.email,
        }).catch(() => console.warn("⚠️ Falha ao salvar no Firestore"));
        await firebaseUser.reload();
        await sendEmailVerification(firebaseUser);
        setSuccessMessage(
          `Registro realizado! Um e-mail de verificação foi enviado para ${firebaseUser.email}. Verifique sua caixa de entrada ou a pasta de spam.`
        );
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      },
      setIsLoading,
      setError,
      setSuccessMessage
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnverifiedUser(null);
    await handleAsync(
      async () => {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const loggedUser = userCredential.user;
        await loggedUser.reload();
        if (loggedUser.emailVerified) {
          const userDocRef = doc(db, "users", loggedUser.uid);
          const userDoc = await getDoc(userDocRef);
          let fullName = loggedUser.displayName;
          if (userDoc.exists()) {
            fullName = userDoc.data().displayName || fullName;
          }
          const appUser: AppUser = {
            firebaseUser: loggedUser,
            displayName: getFirstAndSecondName(fullName),
          };
          setUser(appUser);
        } else {
          setUnverifiedUser(loggedUser);
          setError("Por favor, verifique seu e-mail para continuar.");
          await signOut(auth);
        }
      },
      setIsLoading,
      setError,
      setSuccessMessage
    );
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser || resendCooldown > 0) return;
    try {
      await sendEmailVerification(unverifiedUser);
      setSuccessMessage(
        "E-mail de verificação reenviado! Lembre-se de checar sua caixa de spam ou lixo eletrônico."
      );
      setError("");
      setResendCooldown(60);
    } catch (error) {
      setError(
        "Ocorreu um erro ao reenviar o e-mail. Tente novamente mais tarde."
      );
    }
  };

  const handleGoogleSignIn = async () => {
    await handleAsync(
      async () => {
        await signInWithPopup(auth, googleProvider);
      },
      setIsLoading,
      setError,
      setSuccessMessage
    );
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Por favor, insira seu e-mail.");
      return;
    }
    await handleAsync(
      async () => {
        await sendPasswordResetEmail(auth, resetEmail);
        setSuccessMessage(
          `Um e-mail de redefinição de senha foi enviado para ${resetEmail}. Verifique sua caixa de entrada.`
        );
        setResetEmail("");
        setIsResetting(false);
      },
      setIsLoading,
      setError,
      setSuccessMessage
    );
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    resendCooldown,
    unverifiedUser,
    resetEmail,
    setResetEmail,
    isResetting,
    setIsResetting,
    isLoading,
    activeTab,
    setActiveTab,
    handleRegister,
    handleLogin,
    handleResendVerification,
    handleGoogleSignIn,
    handlePasswordReset,
  };
};
