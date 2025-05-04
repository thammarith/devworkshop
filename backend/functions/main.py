import os
import logging
from firebase_admin import initialize_app, firestore
from firebase_functions.firestore_fn import (
    on_document_created,
    Event,
    DocumentSnapshot,
)

# Initialize Firebase app
app = initialize_app()
db  = firestore.client()

print("Firebase app initialized")

# ==================================================================================

from src.genai import generate_response
from src.service import (
    format_message_context,
    is_copilot_command,
    extract_query,
    get_previous_messages,
    create_response_message,
    create_update_callback,
    finalize_response
)

region = os.getenv("REGION", "asia-southeast1")
print(f"Function configured for region: {region}")

# ==================================================================================

@on_document_created(document="chats/{chatId}/messages/{messageId}", region=region)
def copilot_messages(event: Event[DocumentSnapshot]) -> None:
    """Firebase function triggered when a new message is created."""
    print(f"Function triggered for document: {event.data.reference.path}")

    new_data: dict = event.data.to_dict()
    username: str  = new_data.get("username", "")
    content : str  = new_data.get("content", "")

    # Check if the message starts with "@copilot"
    if not is_copilot_command(content):
        # print("Not a copilot command, ignoring message")
        return

    # Extract the query
    query = extract_query(content)

    # Get chat ID and message ID from the path
    chat_id    = event.params.get("chatId")
    message_id = event.params.get("messageId")

    is_error: bool = False
    final_response: str = ""
    response_ref = db.collection("chats").document(chat_id).collection("messages").document()
    try:
        # Get previous messages and format them
        previous_messages = get_previous_messages(chat_id, message_id)

        # Create a new response message document
        create_response_message(response_ref, chat_id)

        # Get callback for streaming updates
        update_callback = create_update_callback(response_ref)

        # Generate response using Gemini with streaming callback and conversation history
        message_context   = format_message_context(previous_messages)
        prompt = f"{message_context}\n\n I'm {username}. {query}"
        print(f"Prompt: {prompt}")

        final_response = generate_response(
            prompt=prompt,
            stream_callback=update_callback,
        )

    except Exception as e:
        final_response = f"Error generating response: {e}"
        print(e)
        is_error = True

    # Mark streaming as complete
    finalize_response(response_ref, final_response, is_error)

