import os
from google import genai
from typing import Callable, Optional, List, Dict, Any

SYSTEM_PROMPT = """
You are a helpful facilitator for a chat group application. Your name is "copilot".
Your role is to engage in a conversation with the users and provide answers based on the conversation history.
You should maintain a friendly and professional tone, and ensure that your responses are clear and concise.

This is a chat group application. You'll be given a conversation history from multiple users as well as copilots.
For example, the conversation history will be formatted as follows:
<conversation>
    <userA> message </userA>
    <userB> message </userB>
    <copilot> message </copilot>
    <userC> message </userC>
</conversation>

You should be able to provide answers and participate in a conversation:
- describing who said what
- proactively engaging in the conversation
- summarizing what happened
- etc.

When responding, you just need to write your message. Do not include the <copilot> </copilot> tags.
This is a simple chat messaging. You don't need to write messages in a markdown format.
"""


class Message:
    """Simple message class for conversation history"""
    def __init__(self, role: str, content: str):
        self.role = role
        self.content = content

def generate_response(prompt: str,
                      stream_callback: Optional[Callable[[str], None]] = None,
                      history: Optional[List[Dict[str, Any]]] = None) -> str:
    """
    Generate a response using Google's Generative AI (Gemini) with chat functionality

    Args:
        prompt: The user's query
        stream_callback: Optional callback function to handle streaming updates
        history: Optional conversation history as a list of message dictionaries

    Returns:
        The generated response as a string
    """
    print(f"Generating response for prompt: {prompt[:50]}...")

    api_key = os.environ.get("GEMINI_API_KEY")
    model_id = os.environ.get("GEMINI_MODEL_ID", "gemini-2.0-flash")

    print(f"Using model: {model_id}")

    if not api_key:
        print("GEMINI_API_KEY not set in environment variables")
        return "Error: GEMINI_API_KEY not set in environment variables"

    client = genai.Client(api_key=api_key)

    # Format history for Gemini if provided
    formatted_history = []
    if history:
        print(f"Formatting {len(history)} messages in conversation history")
        for message in history:
            role = "model" if message.get("role") == "assistant" else "user"
            formatted_history.append(
                genai.types.Content(
                    role=role,
                    parts=[genai.types.Part.from_text(text=message.get("content", ""))]
                )
            )

    # Create chat model
    print("Creating chat model with history")
    chat = client.chats.create(
        model=model_id,
        history=formatted_history,
        config={"system_instruction": SYSTEM_PROMPT},
    )

    # Send the current message
    response_content = ""
    try:
        # For streaming response
        if stream_callback:
            print("Starting streaming response")
            response_iterator = chat.send_message_stream(prompt)
            chunk_count = 0
            for chunk in response_iterator:
                if chunk.text:
                    chunk_count += 1
                    response_content += chunk.text
                    print(f"Received chunk {chunk_count}: {len(chunk.text)} chars")
                    stream_callback(response_content)
            print(f"Completed streaming response with {chunk_count} chunks")
        else:
            # For non-streaming response
            print("Sending non-streaming message")
            response = chat.send_message(prompt)
            response_content = response.text
            print(f"Received complete response: {len(response_content)} chars")
    except Exception as e:
        print(f"Error generating response: {str(e)}", exc_info=True)
        error_message = f"Error generating response: {str(e)}"
        if stream_callback:
            stream_callback(error_message)
        return error_message

    return response_content
