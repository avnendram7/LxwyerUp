"""Stub for emergentintegrations.llm.chat — provides the LlmChat and UserMessage classes.

This is a local mock since the real emergentintegrations package is only available
on the Emergent cloud platform. The AI chat feature won't produce real LLM responses
when using this stub.
"""

import json


class UserMessage:
    """Represents a user message to send to the LLM."""
    def __init__(self, text: str = ""):
        self.text = text


class LlmChat:
    """Stub LLM chat client that returns a placeholder response."""

    def __init__(self, api_key=None, session_id=None, system_message=None):
        self.api_key = api_key
        self.session_id = session_id
        self.system_message = system_message

    def with_model(self, provider: str, model: str):
        self._provider = provider
        self._model = model
        return self

    async def send_message(self, message: UserMessage) -> str:
        """Return a placeholder JSON response matching the expected card format."""
        response = {
            "cards": [
                {
                    "type": "info",
                    "title": "Service Unavailable",
                    "content": "The AI chat service is not available in local development mode. Please deploy to the Emergent platform for full AI functionality."
                }
            ]
        }
        return json.dumps(response)
