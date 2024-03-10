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

  // const start = (data) => {
  //   fetch('http://127.0.0.1:5000/start', {
  //         method: 'POST',
  //         mode: 'cors',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(data)
  //     })
  //     .then(response => {
  //         if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //         }
  //         return response.json();
  //     })
  //     .then(responseJson => {
  //         setMessage(responseJson.scene)
  //         setOptions(responseJson.option1, responseJson.option2, responseJson.option3)
  //     })
  //     .catch(error => {
  //         console.error('There has been a problem with your fetch operation:', error);
  //     });
  // }


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
          // setPanels([responseJson])



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





  const next = (event) => {
    const selectedOption = event.target.id
    console.log(selectedOption)
    const selectedText = event.target.innerHTML




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


    // const newPanels = [...panels, {
    //   "scene": message,
    //   "option1": options[0],
    //   "option2": options[1],
    //   "option3": options[2],
    //   "userChoice": selectedOption
    // }]

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
    // setMessage(data.scene)
    // setOptions([data.option1, data.option2, data.option3])
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



  // const toggleAnim = (i, option) => {

  //   var btn = document.getElementById(String(i))
  //   if(btn){
  //     btn.classList.toggle("hover-color-shift")
  //   }

  //   if(!hovering){
  //     timeout_id = setTimeout(() => {
  //       translateAndSpeak(option)
  //     }, 3000);
  //     hovering = true
  //   }else{
  //     hovering = false
  //     clearTimeout(timeout_id);
  //     timeout_id = null;
  //   }


  // }

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
                // return AnimatedButton(option, () => {}, next, i, "blue", "red")

                return (
                  <button
                    className={`custom-animated-button`}
                    style={{ backgroundColor: "blue"}}
                    // onMouseDown={handleMouseEnter(option, i)}
                    // onMouseUp={handleMouseLeave(i)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      // toggleAnim(i, option);
                    }}
                    id={i}
                    onClick={next}
                  >
                    {option}
                  </button>
                );


                // (
                //   <button
                //     key={i}
                //     className="option"
                //     onClick={next}
                //     id={i}
                //     onMouseEnter={() => translateAndSpeak(option)}
                //   >
                //     {option}handleButtonClick
                //   </button>
                // )


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
