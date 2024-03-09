import json
import tiktoken

TOKENLIMIT = 4000
ENCODING = tiktoken.encoding_for_model("gpt-3.5-turbo-1106")

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
    
    # make API call

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
    if (response_dict.scene == None 
        or response_dict.choice1 == None 
        or response_dict.choice2 == None
        or response_dict.choice3 == None):
        # send error message
        print("Error 1: GPT-3 response is invalid")

    # send response elements back to user
