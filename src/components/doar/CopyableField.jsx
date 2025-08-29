import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyableField = ({ 
  label, 
  value, 
  variant = 'default',
  icon: Icon,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'p-3';
      case 'large':
        return 'p-5';
      default:
        return 'p-4';
    }
  };

  return (
    <div className={`bg-gray-50 rounded-lg ${getVariantStyles()} ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-gray-600" />}
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono break-all">
          {value}
        </code>
        
        <button
          onClick={handleCopy}
          className={`
            px-3 py-2 rounded transition-all duration-200 flex items-center gap-1 text-sm font-medium
            ${copied 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
          title={copied ? 'Copiado!' : 'Copiar'}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CopyableField;
