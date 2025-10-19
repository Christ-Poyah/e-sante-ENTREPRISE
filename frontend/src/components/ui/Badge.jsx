import React from 'react';
import { X } from 'lucide-react';

const Badge = ({
  children,
  variant = 'primary',
  onRemove,
  className = ''
}) => {
  const baseClasses = 'rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium transition-colors duration-200';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-blue-500 bg-white text-blue-500 hover:bg-blue-50'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (onRemove) {
    return (
      <div className={`${classes} flex items-center group cursor-pointer`}>
        <span className="flex-1">{children}</span>
        <button
          onClick={onRemove}
          className="hidden group-hover:block ml-2 text-current hover:text-red-300 transition-colors duration-200"
          aria-label="Remove"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;
