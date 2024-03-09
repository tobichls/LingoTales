const FormStep = ({ nextStep, handleOptionSelect, selectedOption, options, disabledOptions, question, prevStep }) => {

  const handleClick = (option) => {
    handleOptionSelect(option);
    nextStep();
  };

  return (
    <div className="form-step">
      <h2>{question}</h2>
      <ul>
        {options.map((option) => (
          <li key={option}>
            <button
              onClick={() => handleClick(option)}
              disabled={disabledOptions.includes(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormStep;
