from flask import Flask, jsonify, request
import flask
import anthropic
import re
from flask_cors import CORS
import json
import tiktoken

import api


TOKENLIMIT = 4000
ENCODING = tiktoken.encoding_for_model("gpt-3.5-turbo-1106")

SYS = ""


# file = open("key.txt", "r")
# api_key = file.read()
# file.close()

# client = anthropic.Anthropic(
#     # defaults to os.environ.get("ANTHROPIC_API_KEY")
#     api_key=api_key,
# )


# function to join the story element objects into a prompt
def join_story_elements(story_elements):

    prompt = "This is an interactive story where the user's character name is: BALDWIN"
    for i,element in enumerate(story_elements):
        prompt += '\n'
        if i==0:
            prompt += "The story starts with: "
        else:
            prompt += "The next scene:"

        prompt += element["scene"] + '\n'
        prompt += "The user has chosen to:" + element["userChoice"] + '\n'
    prompt += "ChatGPT, please generate the next scene in the story in no more than one paragraph and generate 3 options for the user to choose to continue the story."
    prompt += '\n'+"When you respond, please format it in: javascript object notation (json) containing scene, option 1, option 2, option 3."
    # for testing
    return prompt

# function to receive story elements
def receive_story_elements(story_elements):

    # story_elements = json.loads(story_elements)

    prompt = join_story_elements(story_elements)

    while (check_prompt_tokens(prompt) == False):
        story_elements = story_elements[1:]
        prompt = join_story_elements(story_elements)

    # make gpt call
    
    response = api.send_message(client, prompt)
    responseObject = json.loads(response)
    return responseObject["scene"], responseObject["option1"], responseObject["option2"], responseObject["option3"]



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

    # check if response is valid
<<<<<<< Updated upstream
    if (response_dict.scene == None
        or response_dict.choice1 == None
        or response_dict.choice2 == None
        or response_dict.choice3 == None):
=======
    if (response_dict['scene'] == None 
        or response_dict['option1'] == None 
        or response_dict['option2'] == None
        or response_dict['option3'] == None):
>>>>>>> Stashed changes
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

client = api.init("")


# takes user action updates state and gets next question from llm
@app.route("/action", methods=['POST'])
def user_action():
    if request.method == 'POST':
        data = request.get_json()

        scene, opt1, opt2, opt3 = receive_story_elements(data["panels"])

        response = flask.jsonify({"scene": scene, "option1:": opt1, "option2": opt2, "option3": opt3})

        # response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200


if __name__ == '__main__':
    app.run(debug=True)
