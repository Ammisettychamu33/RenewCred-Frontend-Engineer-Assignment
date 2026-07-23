import React, { useEffect, useRef, useCallback } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Accessible confirmation dialog.
 *
 * Enhancements over the original:
 *  - role="dialog" + aria-modal + aria-labelledby + aria-describedby
 *  - Escape key closes the modal
 *  - Focus is trapped inside the dialog while it is open
 *  - Cancel button receives initial focus for safe keyboard operation
 */
const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  isDanger = true,
}) => {
  const cancelRef  = useRef(null);
  const confirmRef = useRef(null);
  const dialogId   = useRef(`confirm-modal-${Math.random().toString(36).slice(2)}`).current;

  // ── Escape key handler ─────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      // Focus trap — cycle focus between Cancel and Confirm
      if (e.key === 'Tab') {
        const focusable = [cancelRef.current, confirmRef.current].filter(Boolean);
        if (!focusable.length) return;

        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onCancel]
  );

  // ── Attach/detach listeners & set initial focus ─────────────
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    // Move focus into the dialog; prefer the Cancel button (safer default)
    cancelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-desc`}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 transform transition-all"
        onClick={(e) => e.stopPropagation()} // prevent backdrop click from bubbling
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-3 rounded-xl ${isDanger ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}
            aria-hidden="true"
          >
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3
              id={`${dialogId}-title`}
              className="text-lg font-semibold text-slate-900"
            >
              {title}
            </h3>
            <p
              id={`${dialogId}-desc`}
              className="text-sm text-slate-500"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-400'
                : 'bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-400'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
