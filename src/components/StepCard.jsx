import React from 'react';

const StepCard = ({ step, icon, title, description, className = '', onClick }) => {
  return (
    <div
      className={`relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-green-200' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Step Number */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-sm">{step}</span>
      </div>

      {/* Icon */}
      <div className="mb-4 pt-2">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          {icon || (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default StepCard;
