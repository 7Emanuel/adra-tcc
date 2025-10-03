import React, { useEffect, useRef } from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, primaryAction, secondaryAction }) => {
  const modalRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus on title when modal opens
      titleRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 z-10 flex flex-col max-h-[85vh]"
      >
        {/* Title */}
        <h2 
          ref={titleRef}
          id="modal-title"
          className="text-2xl font-bold text-gray-900 mb-4 focus:outline-none"
          tabIndex={-1}
        >
          {title}
        </h2>
        
        {/* Content */}
        <div className="mb-6 text-gray-600 flex-1 overflow-y-auto">
          {children}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          {secondaryAction && (
            <Button
              variant="secondary"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              className="order-2 sm:order-1"
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant="primary"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="order-1 sm:order-2"
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
