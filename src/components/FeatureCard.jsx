import React from 'react';

const FeatureCard = ({ icon, title, description, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 ${className}`}>
      {/* Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          {icon || (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>

      {/* Description */}
      <div className="text-gray-600 space-y-3">
        {Array.isArray(description) ? (
          description.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
