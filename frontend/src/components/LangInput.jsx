import { useState } from "react";

const LangInput = ({ nextStep, language, handleOptionSelect }) => {
  const [currentLang, setCurrentLang] = useState(language)

  const handleChange = (event) => {
    const newValue = event.target.value;
    setCurrentLang(newValue);
    handleOptionSelect(newValue);
  };

  return (
    <div className="form-step">
      <h2>Which language do you want to learn?</h2>
        <input
          id="nameInput"
          type="text"
          value={currentLang}
          onChange={handleChange}
        />
      <div className="options-container">
        <button onClick={nextStep}>Next</button>
      </div>
    </div>
  );
};

export default LangInput;
