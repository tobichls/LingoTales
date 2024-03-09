import { useState, useRef, useEffect } from 'react';
import NameInput from './NameInput';
import FormStep from "./FormStep"
import autoAnimate from '@formkit/auto-animate';
import LangInput from './LangInput';

const MultiStepForm = ({handleFormSubmittedState}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    language: '',
    level: '',
    genre: '',
    theme: '',
  });
  const parent = useRef(null)

  const nextStep = () => {
    console.log(formData)
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleOptionSelect = (step, option) => {
    setFormData({ ...formData, [step]: option });
  };

  const handleNameChange = (value) => {
    setFormData({ ...formData, name: value });
  };

  const handleSubmit = () => {
    console.log(formData)
    handleFormSubmittedState(formData)
  }


  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  return (
    <div ref={parent}>
      {currentStep === 1 && (
        <LangInput
          nextStep={nextStep}
          handleOptionSelect={(option) => handleOptionSelect('language', option)}
          language={formData.language}
        />
      )}
      {currentStep === 2 && (
        <FormStep
          nextStep={nextStep}
          prevStep={prevStep}
          question="What level are you?"
          options={["Beginner", "Intermediate", "Advanced"]}
          disabledOptions={["Intermediate", "Advanced"]}
          handleOptionSelect={(option) => handleOptionSelect('level', option)}
          selectedOption={formData.level}
        />
      )}
      {currentStep === 3 && (
        <NameInput
          nextStep={nextStep}
          prevStep={prevStep}
          handleNameChange={(option) => handleNameChange(option)}
          name={formData.name}
        />
      )}
      {currentStep === 4 && (
        <FormStep
          nextStep={nextStep}
          prevStep={prevStep}
          question="What kind of story?"
          options={["Mystery", "Romance", "Random"]}
          disabledOptions={[]}
          handleOptionSelect={(option) => handleOptionSelect('genre', option)}
          selectedOption={formData.genre}
        />
      )}
      {currentStep === 5 && (
        <FormStep
          nextStep={nextStep}
          prevStep={prevStep}
          question="What topic do you want to learn about?"
          options={["Home","Fruit","Random"]}
          disabledOptions={[]}
          handleOptionSelect={(option) => handleOptionSelect('theme', option)}
          selectedOption={formData.theme}
        />
      )}
      {currentStep === 6 && (
        <div>
          <h2>Thanks, {formData.name}! Ready?</h2>
          <button onClick={handleSubmit}>Start</button>
      </div>
      )}
    </div>
  );
};

export default MultiStepForm;
