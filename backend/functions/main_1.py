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
    chat_id : str  = event.params.get("chatId")

    # Create a new response message document
    response_ref = db.collection("chats").document(chat_id).collection("messages").document()
    response_ref.set({
        "content"      : f'Received message from {username}: "{content}"',
        "role"         : "assistant",
        "username"     : "Copilot",
        "created_at"   : firestore.SERVER_TIMESTAMP,
        "is_streaming" : True
    })