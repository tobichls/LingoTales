import os
import openai
import anthropic


def log(message):
    file = open("log.txt")
    file.write("\n" + message)
    file.close()


def init(system_message, backend = "claude"):
    sys_msg = system_message
    if backend == "gpt":
        file = open("gpt-key.txt", "r")
        api_key = file.read()
        file.close()
        openai.api_key = api_key
        return None

    else:
        file = open("claude-key.txt", "r")
        api_key = file.read()
        file.close()

        client = anthropic.Anthropic(api_key=api_key)   
        return client


# takes messages in the format {"role": role, "content": message}
def send_message(client, message, sys_msg=""):
    if not (client == None):
        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=2000,
            temperature=0.0,
            system=sys_msg,
            messages=[{"role": "user", "content": message}],
        )

        log(response.content[0].text)
        return response.content[0].text
    else:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
            )

            # Get the generated text 
        log(response.choices[0].message.content)
        return response.choices[0].message.content  