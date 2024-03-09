import os
import openai


client = None
sys_msg = ""

def init(system_message, backend = "claude"):
    sys_msg = system_message
    if backend == "gpt":
        file = open("gpt-key.txt", "r")
        api_key = file.read()
        file.close()
        openai.api_key = api_key

    else:
        file = open("claude-key.txt", "r")
        api_key = file.read()
        file.close()

        client = anthropic.Anthropic(api_key=api_key)   


# takes messages in the format {"role": role, "content": message}
def send_message(messages):
    if not (client == None):
        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=2000,
            temperature=0.0,
            system=SYS,
            messages=messages,
        )

        return response.content
    else:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
            )

            # Get the generated text 
            return response.choices[0].message.content   
        # defaults to os.environ.get("ANTHROPIC_API_KEY")