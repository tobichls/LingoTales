import { useState } from "react";

const NameInput = ({ nextStep, name, handleNameChange, prevStep }) => {
  const [currentName, setCurrentName] = useState(name)

  const handleChange = (event) => {
    const newValue = event.target.value;
    setCurrentName(newValue);
    handleNameChange(newValue);
  };

  return (
    <div className="form-step">
      <h2>What's your name?</h2>
        <input
          id="nameInput"
          type="text"
          value={currentName}
          onChange={handleChange}
        />
      <div className="options-container">
        <button onClick={prevStep}>Previous</button>
        <button onClick={nextStep}>Next</button>
      </div>
    </div>
  );
};

export default NameInput;
