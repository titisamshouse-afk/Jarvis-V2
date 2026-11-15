# JARVIS Ultimate

A responsive personal AI dashboard with a Node/Express backend, OpenAI chat, browser speech recognition and speech synthesis, local conversation memory, quick commands, and system status.

## Deploy on Render
1. Create a Render Web Service from this repository.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add secret environment variable `OPENAI_API_KEY` in Render. Never put this key in frontend code.
5. Optional: set `OPENAI_MODEL` (default: `gpt-4o-mini`).

## Features
- Responsive blue holographic dashboard
- Secure server-side AI requests
- Voice input (browser speech recognition support required)
- Spoken answers using browser speech synthesis
- Local conversation history in the current browser
- Quick prompts and service status

Conversation history is stored in the browser's local storage on that device. It is not cloud-synced or encrypted. This initial version does not provide accounts or multi-device sync.
