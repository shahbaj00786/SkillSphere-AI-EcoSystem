import React from 'react';

const StepIndicator = ({ step }) => {
  const steps = [
    'Project Details',
    'Budget & Timeline',
    'Milestones',
  ];

  return (
    <div className="step-indicator">
      {steps.map((label, index) => {
        const number = index + 1;
        const active = step === number;
        const done = step > number;

        return (
          <div
            className="step-item"
            key={number}
          >
            <div
              className={`step-circle ${
                done
                  ? 'done'
                  : active
                  ? 'active'
                  : ''
              }`}
            >
              {done ? '✓' : number}
            </div>

            <p
              className={`step-label ${
                active ? 'active' : ''
              }`}
            >
              {label}
            </p>

            {index < 2 && (
              <div
                className={`step-line ${
                  done ? 'done' : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;