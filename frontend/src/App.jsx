import React, { useEffect, useState } from 'react'
import MultiStepForm from './components/MultiStepForm'
import AnimatedButton from './components/AnimatedButton'
import Header from "./components/Header"

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
  const [ options, setOptions ] = useState([])
  const [ message, setMessage ]  = useState("")
  const [ nextPanels, setNextPanels] = useState([])
  const [ panels, setPanels ] = useState([])
  const [ formSubmitted, setFormSubmitted ] = useState(false)
  const [ contextualData, setContextualData ] = useState(null)

  // store submitted data for use in prompts and begin the story
  const handleFormSubmittedState = (data) => {
    setFormSubmitted(true)
    setContextualData({
      name: data.name,
      language: data.language,
      genre: data.genre,
      theme: data.theme,
    } )
    chosenLanguage = data.language

    fetch('http://127.0.0.1:5000/start', {
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
          setMessage(responseJson.scene)
          setOptions([responseJson.option1, responseJson.option2, responseJson.option3])

          var text_data = {...data, "panels": [responseJson]}

          fetch('http://127.0.0.1:5000/action', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(text_data)
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
      })
      .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
      });

  }


  // when the user chooses a story option,
  // send the entire context and story so far to the LLM
  const next = (event) => {
    const selectedOption = event.target.id
    const selectedText = event.target.innerHTML
    // add current panel to stored panels
    const newPanels = [...panels, {
      "scene": nextPanels[selectedOption].scene,
      "option1": nextPanels[selectedOption].option1,
      "option2": nextPanels[selectedOption].option2,
      "option3": nextPanels[selectedOption].option3,
      "userChoice": selectedText
    }]

    setMessage(nextPanels[selectedOption].scene)
    setOptions([nextPanels[selectedOption].option1, nextPanels[selectedOption].option2, nextPanels[selectedOption].option3])
    setPanels(newPanels)

    const data = {
      ...contextualData,
      "panels": newPanels,
    }

    // call backend API
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



  // when data is returned, update the state and UI
  const update = (data) => {
    console.log("update: ")
    console.log(data)
    setNextPanels(data.scenes)
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

  var hovering = false
  var timeout_id = null


  return (
    <>
      <Header></Header>
      {formSubmitted ? (
        <section className='main-section'>
          <h2 id="main_text">{message}</h2>
          <div id="selection_div">
            {options.length === 0 ? (
               <div className="loading-indicator">Loading...</div>
             ) : (
              options.map((option, i) => {

                return (
                  <button
                    className={`custom-animated-button`}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      // toggleAnim(i, option);
                    }}
                    id={i}
                    key={i}
                    onClick={next}
                  >
                    {option}
                  </button>
                );

              })
            )}
          </div>
        </section>
      ) : (
        <MultiStepForm handleFormSubmittedState={handleFormSubmittedState} />
      )}
    </>
  );

}
export default App
