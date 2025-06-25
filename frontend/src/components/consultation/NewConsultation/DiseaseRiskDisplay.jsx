import React from 'react';

const DiseaseRiskDisplay = ({
  diseases,
  sortRisks = true,
  minWidth = "200px",
  maxWidth = "300px",
  colors = {
    bar: "blue-500",
    background: "gray-200",
    text: "gray-700",
    percentage: "blue-600"
  }
}) => {
  const displayDiseases = sortRisks 
    ? [...diseases].sort((a, b) => b.percentage - a.percentage)
    : diseases;

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4">
        {displayDiseases.map((disease, index) => (
          <div 
            key={disease.id || index} 
            className="flex-grow"
            style={{ minWidth, maxWidth }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium text-${colors.text}`}>
                {disease.name}
              </span>
              <span className={`text-sm font-medium text-${colors.percentage}`}>
                {disease.percentage}%
              </span>
            </div>
            <div className={`relative w-full h-2 bg-${colors.background} rounded`}>
              <div
                className={`absolute top-0 left-0 h-full bg-${colors.bar} rounded`}
                style={{ width: `${disease.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseRiskDisplay;