from flask import Flask, jsonify
import anthropic
import re

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key="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",
)

first_message = 'You stand before a mansion gate will you {"options":["Gehen Sie durch das Tor", "Gehen Sie nach links", "Gehen Sie nach rechts"]}'

SYS = """
You are a language learning assistant that is going to help teach users German through a text based story game.
For each room/location in the game a few of the words in the description of the room should be changed to the target language.
Each room should have options that lead to different rooms, each option should be in german and should appear in the text as json e.g. {"options":["Geh in die Küche", "Geh in die Lounge", "Geh zurück zur Tür"]}

The first prompt for the user will be: You stand before a mansion gate will you {'options':['Gehen Sie durch das Tor', 'Gehen Sie nach links', 'Gehen Sie nach rechts']}

You should continue the story to the next set of options using mostly english with some german
"""

current_message = "You stand before a mansion gate will you"
current_options = ["Geh in die Küche", "Geh in die Lounge", "Geh zurück zur Tür"]


MESSAGES = [{"role": "assistant", "content": first_message}]

# takes a string and extracts json options
def update_state(string):
    # update options
    start_index = string.find('[')
    end_index = string.find(']')

    section = string[start_index+1:end_index].replace('"', '')
    options = section.split(",")

    current_options = options

    # update message
    msg_end = string.find("{")
    current_message = string[:msg_end]


def select_option(option):
    sentance = re.sub(r'\{.*?\}', '', current_message) 
    sentance += option
    return sentance



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



@app.route("/action", methods=['POST'])
def user_action():
    if request.method == 'POST':
        data = request.get_json()

        choise = data.get("choise")

        response = message_claude(choise)

        update_state(response)

        return jsonify({"message": current_message, "options": current_options}), 200




@app.route("/start", methods=['GET'])
def start():
    return jsonify({"message": current_message, "options": current_options})








if __name__ == '__main__':
    app.run(debug=True) 