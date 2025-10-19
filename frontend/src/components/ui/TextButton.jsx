import React from 'react';

const TextButton = ({
  onClick,
  children,
  className = ''
}) => {
  const classes = `w-full py-2 text-center text-sm sm:text-base text-blue-500 hover:text-blue-700 transition-colors duration-200 cursor-pointer ${className}`;

  return (
    <button
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
};

export default TextButton;
