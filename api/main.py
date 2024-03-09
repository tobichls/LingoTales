from flask import Flask, jsonify, request
import flask
import anthropic
import re
from flask_cors import CORS

file = open("key.txt", "r")
api_key = file.read()
file.close()

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key=api_key,
)

FIRST_MSG = 'You stand before a mansion gate will you {"options":["Gehen Sie durch das Tor", "Gehen Sie nach links", "Gehen Sie nach rechts"]}'

SYS = """
You are a language learning assistant that is going to help teach users German through a text based story game.
For each room/location in the game a few of the words in the description of the room should be changed to the target language.
Each room should have options that lead to different rooms, each option should be in german and should appear in the text as json e.g. {"options":["Geh in die Küche", "Geh in die Lounge", "Geh zurück zur Tür"]}

The first prompt for the user will be: You stand before a mansion gate will you {'options':['Gehen Sie durch das Tor', 'Gehen Sie nach links', 'Gehen Sie nach rechts']}

You should continue the story to the next set of options using mostly english with some german
"""

current_message = "You stand before a mansion gate will you"
current_options = ["Geh in die Küche", "Geh in die Lounge", "Geh zurück zur Tür"]


MESSAGES = [{"role": "assistant", "content": FIRST_MSG}]

# takes a string and extracts json options
def update_state(string):
    print(string)
    # update options
    start_index = string.find('[')
    end_index = string.find(']')

    section = string[start_index+1:end_index].replace('"', '')
    options = section.split(",")

    current_options = options

    # update message
    msg_end = string.find("{")
    current_message = string[:msg_end]

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
    MESSAGES.append({"role": "user", "content": message}) 
    MESSAGES.append(response)
    return response.content





app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = False

CORS(app)


# example get request
@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify({'message': 'Hello, World!'})


#example post request
@app.route('/register', methods=['POST'])
def register_user():
    if request.method == 'POST':
        data = request.get_json()  # Assuming JSON data is sent

        username = data.get('username')
        password = data.get('password')

        # In a real application, store this data securely in a database 
        # after proper validation.

        return jsonify({'message': 'User registration successful!'}), 200
    else:
        return jsonify({'error': 'Method not allowed'}), 405 




# takes user action updates state and gets next question from llm
@app.route("/action", methods=['POST'])
def user_action():
    if request.method == 'POST':
        data = request.get_json()

        print(data)

        choise = data.get("option")

        print("got option: " + choise)

        print(choise)

        response = message_claude(choise)

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


if __name__ == '__main__':
    app.run(debug=True) 