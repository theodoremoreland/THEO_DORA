import { ReactElement } from 'react';

// Styles
import './Modal.css';

interface Props {
    children: ReactElement;
    title?: string;
    handleClose: () => void;
}

const Modal = ({ children, title, handleClose }: Props) => {
    return (
        <div
            role="button"
            aria-label="Close menu"
            tabIndex={0}
            className="custom-modal-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="custom-modal">
                <header className="custom-modal-header">
                    <button
                        type="button"
                        title="Close menu"
                        className="close-button"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </header>
                {title && <h2 className="custom-modal-title">{title}</h2>}
                <div className="custom-modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
