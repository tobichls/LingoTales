import { useEffect, useState } from 'react'
import MultiStepForm from './components/MultiStepForm'

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
  }

  const next = (event) => {
    const selectedOption = event.target.innerText
    console.log(selectedOption)

    setPanels(previousPanels => [...previousPanels, {
      "scene": message,
      "option1": options[0],
      "option2": options[1],
      "option3": options[2],
      "userChoice": selectedOption
    }])

    const data = {
      ...contextualData,
      "storyElements": panels,
    }

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

  return (
    <>
    {formSubmitted ? <section>
      <h2 id="main_text">{message}</h2>
      <div id="selection_div">

        {options.map((option,i) => {
          return (
            <button key={i} className="option" onClick={next}>
              {option}
            </button>
            )
        })}
      </div>
    </section>
    : <MultiStepForm handleFormSubmittedState={handleFormSubmittedState} />}

  </>
  )
}

export default App
