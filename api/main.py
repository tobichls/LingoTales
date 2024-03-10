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

# file = open("key.txt", "r")
# api_key = file.read()
# file.close()

# client = anthropic.Anthropic(
#     # defaults to os.environ.get("ANTHROPIC_API_KEY")
#     api_key=api_key,
# )


# function to join the story element objects into a prompt
def join_story_elements(story_elements):
    print(story_elements)

    if len(story_elements) == 1:
        prompt = "The story starts with: " + story_elements[0]["scene"] + "\n"
        prompt += "The options are: option1 - " + story_elements[0]["option1"] + " option2 - " + story_elements[0]["option2"] + " option3 - " + story_elements[0]["option3"] + "."
        return prompt

    prompt = ""
    for i,element in enumerate(story_elements):
        prompt += '\n'
        if i==0:
            prompt += "The story starts with: "
        else:
            prompt += "The next scene:"

        prompt += element["scene"] + '\n'
        prompt += "The user has chosen to:" + element["userChoice"] + '\n'

    return prompt

# function to create the system prompt
def join_data(language, name, beginner, genre, theme):

    sys = "This is an interactive story where the user's character name is: " + name + '\n'
    sys += "The user is a beginner." + '\n'
    sys += "As users progress through the story, the app adapts the language to the user's chosen target language, creating a contextualized learning experience." + '\n'
    sys += "Given the story so far, and three options to continue, you must generate a scene and a further three options to continue for each option."
    sys += "The scenes must be given in English and ONLY the options must be given in "  + language + '\n'
    # sys += 'Give the scenes in the format {"scene": "the description of the scene and story", "option1": "the first options", "option2": "the second option", "option3": "the third option"}\n'

    sys += """
    The three scenes should be given in the following format:
 
        {"scene": "the description of the scene and the story",
        "option1": "the first action the user can take",
        "option2: "the second available action",
        "option3: "the third action"}

    ]}
    """

    return sys

# function to receive story elements
def get_next_scene(story_elements, language, name, beginner, genre, theme):

    # story_elements = json.loads(story_elements)

    prompt = join_story_elements(story_elements)
    sys = join_data(language, name, beginner, genre, theme)

    while (check_prompt_tokens(prompt) == False):
        story_elements = story_elements[1:]
        prompt = join_story_elements(story_elements)

    # make gpt call

    print(prompt)
    response = api.send_message(client, prompt, sys_msg=sys, force_json = True, response_start = 'Sure here is your list of three json scenes:', json_start = '{"scenes":[')
    print("\n\n\n", response)
    responseObject = json.loads(response)
    return responseObject["scene"], responseObject["option1"], responseObject["option2"], responseObject["option3"]


def get_next_scenes(story_elements, language, name, beginner, genre, theme):
    prompt = join_story_elements(story_elements)
    sys = join_data(language, name, beginner, genre, theme)

    while (check_prompt_tokens(prompt) == False):
        story_elements = story_elements[1:]
        prompt = join_story_elements(story_elements)


    response = api.send_message(client, prompt, sys_msg=sys, force_json = True, response_start = 'Sure here is your list of three json scenes:', json_start = '{"scenes":[')
    responseObject = json.loads(response)

    return responseObject["scenes"]


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
    if (response_dict['scene'] == None 
        or response_dict['option1'] == None 
        or response_dict['option2'] == None
        or response_dict['option3'] == None):
        # send error message
        print("Error 1: GPT-3 response is invalid")
    else:
        return response_dict


def setup_prompt(language, name, beginner, genre, theme):
    # prompt = (
    #     "You are an interactive story teller and language learning assistant.\n"
    #     "The goal is to help the user learn the language " + language + " through an interactive text based story.\n"
    #     "The theme for the story is " + theme + ", the story should have " + language + " words in the theme scattered in the mostly english story as these are the words the user wishes to learn.\n"

    # )

    prompt = (
        "You are an interactive story teller and language learning assistant.\n"
        "The goal is to help the user learn the language " + language + " through an interactive text based story.\n"
        "The theme for the story is " + theme + ", the story should have " + language + " words from the category " + theme + "in the options as these are the words the user wishes to learn.\n"
        "All of the scenes MUST be in english with NO translations and ONLY the values of each option should be in "+ language+".\n"
        " scene, option1, option2 and option3 MUST ALLWAYS be in english."
    )

    prompt += """
    Scenes should be created in the following format:
 
        {"scene": "the description of the scene and the story",
        "option1": "the first action the user can take",
        "option2: "the second available action",
        "option3: "the third action"}

    ]}
    """

    msg = "Create the starting scene for the story"
    response = api.send_message(client, msg, sys_msg = prompt, force_json=True, response_start="Sure here is the starting scene for the story in json:\n", json_start = "{")
    responseObject = json.loads(response)
    return responseObject


app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = False

CORS(app)

client = api.init("")


@app.route("/start", methods=["POST"])
def start():
    if request.method == "POST":
        data = request.get_json()
        print(data)
        responseObject = setup_prompt(data["language"], data["name"], "beginner", data["genre"], data["theme"])
        response = flask.jsonify(responseObject)
        return response, 200



# takes user action updates state and gets next question from llm
@app.route("/action", methods=['POST'])
def user_action():
    if request.method == 'POST':
        data = request.get_json()

        print(data)


        scenes = get_next_scenes(data["panels"], data["language"], data["name"], "beginner", data["genre"], data["theme"])

        response = flask.jsonify({"scenes": scenes})

        # response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200


if __name__ == '__main__':
    app.run(debug=True)
