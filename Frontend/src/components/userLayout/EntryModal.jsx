import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const EntryModal = ({ title, description, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    modalRef.current?.querySelector('input, select, textarea')?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)',
        );
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="portal-modal-backdrop" onMouseDown={onClose}>
      <section
        className="portal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-modal-title"
        aria-describedby="portal-modal-description"
        ref={modalRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="portal-modal-heading">
          <div>
            <h2 id="portal-modal-title">{title}</h2>
            <p id="portal-modal-description">{description}</p>
          </div>
          <button className="portal-modal-close" type="button" onClick={onClose} aria-label="Close dialog">
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
};

export default EntryModal;
