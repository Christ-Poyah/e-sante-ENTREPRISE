import React from 'react';
import SectionTitle from './SectionTitle';

const Section = ({
  title,
  titleSize = 'lg',
  children,
  className = ''
}) => {
  return (
    <div className={`p-3 sm:p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start">
        <div className="w-full sm:w-1/6 sm:pr-4 mb-2 sm:mb-0">
          <SectionTitle size={titleSize}>{title}</SectionTitle>
        </div>
        <div className="w-full sm:w-5/6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Section;
