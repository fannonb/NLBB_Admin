import React, { useEffect, useRef, useState } from 'react';

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
      <div
        className={`modal-content modal-${variant}`}
        onClick={(event) => event.stopPropagation()}
      >
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
  busyLabel,
  cancelLabel = 'Cancel',
  destructive = false,
}: {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  busyLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}) => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!visible) {
      setConfirming(false);
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (confirming) {
      return;
    }

    setConfirming(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setConfirming(false);
    }
  };

  const dismiss = () => {
    if (confirming) {
      return;
    }
    onDismiss();
  };

  return (
    <Modal visible={visible} onDismiss={dismiss} title={title}>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button type="button" className="ghost-btn" onClick={dismiss} disabled={confirming}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`primary-btn ${destructive ? 'btn-destructive' : ''}`}
          onClick={() => void handleConfirm()}
          disabled={confirming}
        >
          {confirming ? (busyLabel ?? `${confirmLabel}…`) : confirmLabel}
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
