import logging
from firebase_admin import firestore
from typing import List, Dict, Any, Callable
from google.cloud.firestore_v1.field_path import FieldPath
from google.cloud.firestore_v1.base_query import FieldFilter


# Initialize Firestore client
db = firestore.client()

def is_copilot_command(content: str) -> bool:
    """Check if a message is a copilot command."""
    print(f"Message content: {content[:100]}...")
    result = "@copilot" in content
    print(f"Is copilot command: {result}")
    return result


def extract_query(content: str) -> str:
    """Extract the query part from a copilot command."""

    query = content.replace("@copilot", "").strip()
    print(f"Extracted query: {query[:100]}...")
    return query


def get_previous_messages(chat_id: str, current_message_id: str, limit: int = 100) -> List[Dict[str, Any]]:
    """
    Retrieve previous messages from the chat history.

    Args:
        chat_id: ID of the chat
        current_message_id: ID of the current message to exclude
        limit: Maximum number of messages to retrieve

    Returns:
        List of message dictionaries in chronological order
    """
    print(f"Retrieving previous messages for chat {chat_id}, excluding message {current_message_id}")
    messages_ref = db.collection("chats").document(chat_id).collection("messages")

    try:

        # Query messages before the current one, ordered by creation time, limited
        previous_messages = messages_ref.order_by(
            "created_at", direction=firestore.Query.DESCENDING
        ).limit(limit).get()

        messages = [msg.to_dict() for msg in reversed(list(previous_messages)[1:])]
        print(f"Retrieved {len(messages)} previous messages")
        print(f"Messages: {[msg.get('content', '')[:100] for msg in messages]}...")
        return messages

    except Exception as e:
        print(f"Error retrieving previous messages: {e}")
        return []


def format_message_history(messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Format message history into the structure expected by Gemini.

    Args:
        messages: List of raw message dictionaries from Firestore

    Returns:
        List of formatted message dictionaries
    """
    if not messages: return []

    print(f"Formatting {len(messages)} messages for Gemini")
    formatted_history = []

    # fix: history must start with a user turn. (gemini requirements)
    if messages[0].get("role") != "user":
        formatted_history.append({
            "role"   : "user",
            "content": "[sender:User] "
        })

    for msg in messages:
        role     = msg.get("role", "user")
        content  = msg.get("content", "")
        username = msg.get("username", "User")

        formatted_content = f"[sender:{username}] {content}"

        formatted_history.append({
            "role"   : role,
            "content": formatted_content
        })
    print(f"Formatted {len(formatted_history)} messages")
    return formatted_history


def create_response_message(response_ref, chat_id: str) -> firestore.DocumentReference:
    """
    Create a new response message document in Firestore.

    Args:
        response_ref: Reference to the response document
        chat_id: ID of the chat

    Returns:
        Reference to the created document
    """
    print(f"Creating response message for chat {chat_id}")
    response_ref.set({
        "content"      : "Thinking...",
        "role"         : "assistant",
        "username"     : "Copilot",
        "created_at"   : firestore.SERVER_TIMESTAMP,
        "is_streaming" : True
    })
    print(f"Created response message with ID: {response_ref.id}")


def create_update_callback(response_ref: firestore.DocumentReference) -> Callable[[str], None]:
    """
    Create a callback function for updating response content.

    Args:
        response_ref: Reference to the response document

    Returns:
        Callback function that updates the document with streaming content
    """
    print(f"Creating update callback for response {response_ref.id}")

    def update_response(current_content: str):
        print(f"Updating response {response_ref.id} with content length: {len(current_content)}")
        response_ref.update({
            "content": current_content,
            "updated_at": firestore.SERVER_TIMESTAMP
        })

    return update_response


def finalize_response(response_ref: firestore.DocumentReference, final_content: str, is_error: bool) -> None:
    """
    Mark a response as complete when streaming is finished.

    Args:
        response_ref: Reference to the response document
        final_content: Final response content
    """
    print(f"Finalizing response {response_ref.id} with content length: {len(final_content)}")
    payload = {
        "content"      : final_content,
        "role"         : "assistant",
        "username"     : "Copilot",
        "updated_at"   : firestore.SERVER_TIMESTAMP,
        "is_streaming" : False,
    }

    if is_error:
        payload["created_at"] = firestore.SERVER_TIMESTAMP
        response_ref.set(payload)
    else:
        response_ref.update(payload)

    print(f"Response {response_ref.id} finalized successfully")
