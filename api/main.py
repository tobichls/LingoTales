from flask import Flask, jsonify, request
import flask
import anthropic
import re
from flask_cors import CORS
<<<<<<< HEAD
=======
import json
import tiktoken


TOKENLIMIT = 4000
ENCODING = tiktoken.encoding_for_model("gpt-3.5-turbo-1106")

SYS = ""

>>>>>>> 1cfdcfeb560ccc7cdab5e40b4d8e64f7794a4861

file = open("key.txt", "r")
api_key = file.read()
file.close()

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key=api_key,
)

<<<<<<< HEAD
FIRST_MSG = 'You stand before a mansion gate will you {"options":["Gehen Sie durch das Tor", "Gehen Sie nach links", "Gehen Sie nach rechts"]}'
=======
>>>>>>> 1cfdcfeb560ccc7cdab5e40b4d8e64f7794a4861

# function to join the story element objects into a prompt
def join_story_elements(story_elements):

    prompt = "This is an interactive story where the user's character name is: BALDWIN"
    for i,element in enumerate(story_elements):
        prompt += '\n'
        if i==0:
            prompt += "The story starts with: "
        else:
            prompt += "The next scene:"

        prompt += element.scene + '\n'
        prompt += "The user has chosen to:" + element.userChoice + '\n'
    prompt += "ChatGPT, please generate the next scene in the story in no more than one paragraph and generate 3 options for the user to choose to continue the story."
    prompt += '\n'+"When you respond, please format it in: javascript object notation (json) containing scene, option 1, option 2, option 3."
    # for testing
    print(prompt)
    return prompt

# function to receive story elements
def receive_story_elements(story_elements):
    story_elements = json.loads(story_elements)

    prompt = join_story_elements(story_elements)

    while (check_prompt_tokens(prompt) == False):
        story_elements = story_elements[1:]
        prompt = join_story_elements(story_elements)
    
    # make gpt call
    responseObject = message_claude(prompt)

    return responseObject.scene, responseObject.choice1, responseObject.choice2, responseObject.choice3


<<<<<<< HEAD
MESSAGES = [{"role": "assistant", "content": FIRST_MSG}]

# takes a string and extracts json options
def update_state(string):
    print(string)
    # update options
    start_index = string.find('[')
    end_index = string.find(']')
=======

# function to check token size of prompt
def check_prompt_tokens(prompt):
    #tokens = len(prompt.split()) # double check how to count tokens
    #tokens = tiktoken.count_tokens(prompt, ENCODING) 
    tokens = len(ENCODING.encode(prompt))
    if tokens > TOKENLIMIT:
        return False
    else:
        return True
    
# function to check gpt response
def check_gpt_response(gpt_response):
    response_dict = json.loads(gpt_response)
>>>>>>> 1cfdcfeb560ccc7cdab5e40b4d8e64f7794a4861

    # check if response is valid
    if (response_dict.scene == None 
        or response_dict.choice1 == None 
        or response_dict.choice2 == None
        or response_dict.choice3 == None):
        # send error message
        print("Error 1: GPT-3 response is invalid")
    else:
        return response_dict

    return current_message, current_options


# sends message to claude and updates messages
def message_claude(message):

    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=2000,
        temperature=0.0,
        system=SYS,
        messages=[
            {"role": "user", "content": message}
        ]
    )

    return response.content



app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = False

CORS(app)


# takes user action updates state and gets next question from llm
@app.route("/action", methods=['POST'])
def user_action():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        scene, opt1, opt2, opt3 = receive_story_elements(data.panels)

<<<<<<< HEAD
        print(data)

        choise = data.get("option")

        print("got option: " + choise)

        print(choise)
=======
        response = flask.jsonify({"scene": scene, "choice1:": opt1, "choice2": opt2, "choice3": opt3})
>>>>>>> 1cfdcfeb560ccc7cdab5e40b4d8e64f7794a4861

        # response.headers.add('Access-Control-Allow-Origin', '*')

<<<<<<< HEAD
        message, options = update_state(response[0].text)

        response = flask.jsonify({"message": message, "options": options})

        # response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200



# gets initial state
@app.route("/start", methods=['GET'])
def start():
    response = flask.jsonify({"message": current_message, "options": current_options})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    return response
=======
        return response, 200
>>>>>>> 1cfdcfeb560ccc7cdab5e40b4d8e64f7794a4861


if __name__ == '__main__':
    app.run(debug=True) 