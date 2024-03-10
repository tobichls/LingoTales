# LingoTales 📖

Introducing **LingoTales:** where immersive storytelling meets language learning. Our app revolutionizes the way users learn languages by blending an interactive text-based adventure with context-driven language learning. 

Say goodbye to mundane textbooks and rote memorization. Join us in reshaping language education with LingoTales!

<br>

## Why Language Learning Matters
"**England has a language education crisis**: fewer people are studying languages at school and university language programmes are closing." 

<br> - Becky Muradás-Taylor, *"Undergraduate language programmes in England: A widening participation crisis"*

[Read more about Becky's insights](https://journals.sagepub.com/doi/10.1177/14740222231156812)

<br>

## What is LingoTales?
LingoTales is aa web application designed to facilitate language learning through intuitive, context-driven methods, offering a refreshing alternative to the rote memorization commonly found in mainstream language learning apps.

Through LingoTales, users engage with interactive "stories" where they wield control over the storyline's progression. By selecting from a variety of choices presented in their preferred language, learners immerse themselves in a captivating learning experience, tailored to their individual linguistic goals.

<br>

## Features
### User influences story direction.
Users are given multiple choices to choose how the story progresses after each scene.
### Intuition based learning
Users utilize the context of the story to organically learn what their choices mean instead of being explicitly taught definitions.
### Supports any language
Generative AI enables a huge variety of different languages as opposed to mainstream language apps offering at most a handful.
### A story for everyone
Users choose the genre they love for the story.
### Practice specific vocabulary
An category of vocabulary can be frequently and seamlessly weaved into the story.
### No story will ever be the same.
Generative AI allows for cascading plotlines. *After just 15 user interactions, there are more than 14 million unique storyline combinations.*
### Audio Integration
Listen to real-time translations of interaction options for those who need a helping hand.

<br>
 
# Demonstration
[![Demo Video](https://img.youtube.com/vi/Bn8cCXKAIgA/0.jpg)](https://youtu.be/Bn8cCXKAIgA)

Feel free to look around our prototype demonstration website: [demonstration website](http://109.152.136.83)

<br>

## Technologies Used

| Technology Used               | Purpose                           |
|-------------------------------|-----------------------------------|
| `Claude LLM`                  | Generating story panels           |
| `Python` & `Flask`            | Backend server handling           |
| `Google Cloud Translation API`| Language translation              |
| `React.js`                    | Frontend web interface            |
| `SpeechSynthesis Web API`     | Text-to-speech                   |

<br>

## Code Structure

The web interface is built with React for a smooth user experience. `App.jsx` is the main hub where top level data is stored for use in API calls. The `MultiStepForm` component collects user data for setting up the story. Responses from the backend are stored in state and displayed. `frontend/index.html`: This HTML file is the main page of the frontend application.

`api/api.py`: This Python file contains the init function which sets up the API key for either the GPT or Claude backend.

`api/main.py`: This file manages backend activities of the web application such as GET, POST and calling the LLM APIs.

<br>

## Next Steps

- Wildcard choices - higher ability users are given the opportunity to input anything as a choice, dramatically altering the range of stories to be told.
- Speech input
- Accompanying media to the story (images, music etc...)
- Earn rewards for high competency in the stories
- Catering to all ability levels ranging from beginner to advanced.

