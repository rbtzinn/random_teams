import React from 'react';
import { FaTimes } from 'react-icons/fa';
import ButtonPadrao from '../ButtonPadrao/index.tsx';
import './styles.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}) => {
    if (!isOpen) {
        return null;
    }

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <div className="modal-header">
                    <h4 className="modal-title">{title}</h4>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <ButtonPadrao texto={cancelText} onClick={onClose} variant="secundario" />
                    <ButtonPadrao texto={confirmText} onClick={onConfirm} variant="primario" />
                </div>
            </div>
        </div>
    );
};

export default Modal;

