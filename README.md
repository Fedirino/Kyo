# Winston

Voice-first personal organizer and AI companion. (Formerly "Kyo" — renamed for easier voice/wake-word recognition.)

## Useful core

Winston can save tasks, notes, and reminders locally without an API key. Try:

- `Remind me Friday at 7 AM to review the strawberry order for PDP`
- `Save this idea under Clip Forge: automate title variants`
- `What do I need to do today?`
- `Show my PDP reminders`
- `Mark the strawberry review complete`

Use the Today and Inbox buttons to edit, complete, reopen, delete, or restore saved items. Items persist in this browser.

## Secure cloud setup

AI chat and ElevenLabs speech can run through an authenticated Firebase Function so provider keys never reach the browser. Add these as GitHub repository **Actions secrets**:

- `OPENROUTER_API_KEY` — the OpenRouter provider key
- `ELEVENLABS_API_KEY` — the ElevenLabs provider key
- `WINSTON_ALLOWED_EMAIL` — the exact Google email allowed to use the proxy

Enable the Google provider in Firebase Authentication, then manually rerun **Deploy to Firebase Hosting on merge**. The workflow copies the values into Google Secret Manager and deploys Hosting plus Functions. If any runtime secret is missing, it safely deploys Hosting only and leaves the legacy local-key fallback available.

## Development

Serve the repository as a static site. Run the core behavior tests with:

```powershell
npm.cmd test
```
