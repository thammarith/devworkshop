import os
from firebase_admin import initialize_app

region = os.getenv("REGION", "asia-southeast1")

# ======================================

app = initialize_app()

