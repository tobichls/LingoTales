import React, { useEffect, useState } from 'react'
import MultiStepForm from './components/MultiStepForm'

const api_key = "QUl6YVN5QnhWY1VrWEtuUW9VV0pvMlk1ancwVVAwdDNEaUw4VWFF"
function getAPIKey() {

  let decodedString = atob(api_key)

  return decodedString
}

var chosenLanguage = ""

const myVoices = {
  "german": 3,
  "french": 9,
  "spanish": 7,
  "italian": 12,
  "dutch": 15,
  "polish": 16,
  "portuguese": 17
}

function App() {
  const [ options, setOptions ] = useState(["climb the gate", "walk left", "go right"])
  const [ message, setMessage ]  = useState("You walk up to the gate of a large looming mansion you ")
  const [ panels, setPanels ] = useState([])
  const [ formSubmitted, setFormSubmitted ] = useState(false)
  const [ contextualData, setContextualData ] = useState(null)

  const handleFormSubmittedState = (data) => {
    setFormSubmitted(true)
    setContextualData({
      name: data.name,
      language: data.language,
      genre: data.genre,
      theme: data.theme,
    } )
    chosenLanguage = data.language
  }

  const next = (event) => {
    const selectedOption = event.target.innerText
    console.log(selectedOption)

    const newPanels = [...panels, {
      "scene": message,
      "option1": options[0],
      "option2": options[1],
      "option3": options[2],
      "userChoice": selectedOption
    }]

    setPanels(newPanels)

    const data = {
      ...contextualData,
      "panels": newPanels,
    }
    console.log(data)

    fetch('http://127.0.0.1:5000/action', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(responseJson => {
        update(responseJson);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
  }

  const update = (data) => {
    setMessage(data.scene)
    setOptions([data.option1, data.option2, data.option3])
  }

  // Initialize voices array
  let voices = [];

  // Populate voices array when voices are loaded
  voices = window.speechSynthesis.getVoices();
  console.log(voices)

  const translateAndSpeak = async (text, targetLanguage = 'en') => {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=`+ getAPIKey(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    });
  
    if (!response.ok) {
      throw new Error('API request failed');
    }
  
    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
  
    // // Speak the translated text
    const utterance = new SpeechSynthesisUtterance(translatedText);

    chosenLanguage = chosenLanguage.toLowerCase()

    if (chosenLanguage in myVoices) {
      utterance.voice = voices[myVoices[chosenLanguage]];
    } else {
      utterance.voice = voices[0];
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {formSubmitted ? <section>
        <h2 id="main_text">{message}</h2>
        <div id="selection_div">
          {options.map((option,i) => {
            return (
              <button 
                key={i} 
                className="option" 
                onClick={next}
                onMouseEnter={() => translateAndSpeak(option)}
              >
                {option}
              </button>
              )
          })}
        </div>
      </section>
      : <MultiStepForm handleFormSubmittedState={handleFormSubmittedState} />}
    </>
  );
}
export default App
