import { useState, useRef, useEffect } from 'react';
import NameInput from './NameInput';
import FormStep from "./FormStep"
import autoAnimate from '@formkit/auto-animate';

const MultiStepForm = () => {
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

  const handleSubmit = async () => {
    console.log(formData)
    // try {
    //   const response = await fetch("", {
    //     method: "POST",
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    //   })

    //   if(response.ok) {

    //   } else {
    //     console.error("Error submitting form")
    //   }
    // } catch (error) {
    //   console.error("Error submitting form", error)
    // }
  }


  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  return (
    <div ref={parent}>
      {currentStep === 1 && (
        <FormStep
          nextStep={nextStep}
          question="What language are you learning?"
          options={["French", "German", "Spanish", "Russian"]}
          disabledOptions={[]}
          handleOptionSelect={(option) => handleOptionSelect('language', option)}
          selectedOption={formData.language}
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
          options={["Mystery", "Romance", "Surprise me"]}
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
