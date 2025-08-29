import React from 'react';

const TermsCheckbox = ({ 
  checked, 
  onChange, 
  required = true,
  error,
  className = '',
  children 
}) => {
  const defaultText = (
    <>
      Confirmo que as informações são verdadeiras e que compreendo que haverá{' '}
      <strong>validação presencial/remota</strong> antes da entrega das doações.
    </>
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            required={required}
            className={`
              w-5 h-5 rounded border-2 text-green-600 focus:ring-2 focus:ring-green-600 focus:ring-opacity-50
              ${error ? 'border-red-500' : 'border-gray-300'}
              transition-colors duration-200
            `}
            aria-describedby={error ? "terms-error" : "terms-description"}
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
        
        <div className="text-sm">
          <label 
            htmlFor="terms-checkbox" 
            className="text-gray-700 leading-relaxed cursor-pointer"
          >
            {children || defaultText}
          </label>
          
          {required && (
            <span className="text-red-500 ml-1" aria-label="Campo obrigatório">
              *
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div 
        id="terms-description"
        className="text-xs text-gray-500 ml-8 leading-relaxed"
      >
        Ao aceitar, você concorda que nossa equipe poderá entrar em contato para 
        validar suas informações e coordenar a entrega das doações solicitadas.
      </div>

      {/* Error message */}
      {error && (
        <div 
          id="terms-error"
          className="text-sm text-red-600 ml-8"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default TermsCheckbox;
