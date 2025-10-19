import React from 'react';

const ListItem = ({
  children,
  hover = true,
  className = ''
}) => {
  const hoverClass = hover ? 'hover:bg-gray-100' : '';
  const classes = `p-2 sm:p-3 bg-gray-50 rounded-lg ${hoverClass} transition-colors duration-200 ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default ListItem;
