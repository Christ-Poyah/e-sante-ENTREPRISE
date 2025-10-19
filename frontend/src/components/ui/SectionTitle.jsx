import React from 'react';

const SectionTitle = ({
  children,
  size = 'lg',
  className = ''
}) => {
  const sizeClasses = {
    xl: 'text-xl sm:text-2xl md:text-3xl',
    lg: 'text-lg sm:text-xl',
    md: 'text-base sm:text-lg',
    sm: 'text-sm sm:text-base'
  };

  const classes = `${sizeClasses[size]} font-bold text-black ${className}`;

  return (
    <h2 className={classes}>
      {children}
    </h2>
  );
};

export default SectionTitle;
