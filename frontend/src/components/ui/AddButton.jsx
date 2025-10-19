import React from 'react';
import { Plus } from 'lucide-react';

const AddButton = ({
  onClick,
  ariaLabel = 'Add',
  className = ''
}) => {
  const classes = `bg-blue-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer ${className}`;

  return (
    <button
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      <Plus size={20} className="sm:w-6 sm:h-6" />
    </button>
  );
};

export default AddButton;
