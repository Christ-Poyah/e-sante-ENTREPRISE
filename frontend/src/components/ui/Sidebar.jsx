import React from 'react';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-blue-900">E-SANTE</h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div
            className={`flex items-center gap-3 p-4 bg-blue-50 border-l-4 border-blue-600 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-semibold text-blue-900">Consultation</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
