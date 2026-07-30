// Fetches a signed ElevenLabs conversation URL from the backend (src/haxkday/api/routes/voice.py).
// Keeps the ElevenLabs API key server-side; the browser only ever sees the short-lived signed URL.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export class VoiceSessionError extends Error {}

export async function getSignedConversationUrl(): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/voice/session`);

  if (!response.ok) {
    const detail = await response.text();
    throw new VoiceSessionError(`Could not start voice session (${response.status}): ${detail}`);
  }

  const data = await response.json();
  return data.signed_url;
}
