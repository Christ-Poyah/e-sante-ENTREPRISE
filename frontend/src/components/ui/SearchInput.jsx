import React from 'react';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}) => {
  const classes = `w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ${className}`;

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={classes}
    />
  );
};

export default SearchInput;
