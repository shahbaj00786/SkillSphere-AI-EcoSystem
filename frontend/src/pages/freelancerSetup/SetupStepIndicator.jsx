const SetupStepIndicator = ({ step, steps }) => {
  return (
    <div className="setup-step-indicator">
      {steps.map((label, index) => {
        const number = index + 1;
        const active = step === number;
        const done = step > number;

        return (
          <div className="setup-step" key={number}>
            <div
              className={`setup-step-number ${
                done ? 'done' : active ? 'active' : ''
              }`}
            >
              {done ? '✓' : number}
            </div>

            <p className={active ? 'active' : ''}>
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SetupStepIndicator;