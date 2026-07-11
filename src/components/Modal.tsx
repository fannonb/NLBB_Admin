import React, { useEffect, useRef } from 'react';

interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'info';
}

export const Modal = ({ visible, onDismiss, title, children, variant = 'default' }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [visible, onDismiss]);

  if (!visible) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === overlayRef.current) {
      onDismiss();
    }
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={`modal-content modal-${variant}`}>
        {title ? (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button type="button" className="modal-close" onClick={onDismiss} aria-label="Close">
              ×
            </button>
          </div>
        ) : null}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
}: {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}) => {
  return (
    <Modal visible={visible} onDismiss={onDismiss} title={title}>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button type="button" className="ghost-btn" onClick={onDismiss}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`primary-btn ${destructive ? 'btn-destructive' : ''}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export const InfoModal = ({
  visible,
  onDismiss,
  title,
  message,
}: {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
}) => {
  return (
    <Modal visible={visible} onDismiss={onDismiss} title={title} variant="info">
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions" style={{ justifyContent: 'center' }}>
        <button type="button" className="primary-btn" onClick={onDismiss}>
          OK
        </button>
      </div>
    </Modal>
  );
};
