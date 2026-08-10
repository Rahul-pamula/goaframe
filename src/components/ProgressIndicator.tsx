import React from 'react';

interface ProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressIndicator: React.FC<ProgressProps> = ({ currentStep, totalSteps = 4 }) => {
  return (
    <span className="text-label-caps" style={{color: 'var(--primary)', marginBottom: 'var(--spacing-sm)', display: 'block'}}>
      STEP {currentStep} OF {totalSteps}
    </span>
  );
};
