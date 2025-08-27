import React from 'react';

const StepCard = ({ step, icon, title, description, className = '' }) => {
  return (
    <div className={`relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 ${className}`}>
      {/* Step Number */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-adra-green rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-sm">{step}</span>
      </div>

      {/* Icon */}
      <div className="mb-4 pt-2">
        <div className="w-10 h-10 bg-adra-green bg-opacity-10 rounded-lg flex items-center justify-center">
          {icon || (
            <svg className="w-5 h-5 text-adra-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold text-adra-text mb-2">
        {title}
      </h4>

      {/* Description */}
      <p className="text-sm text-adra-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default StepCard;
