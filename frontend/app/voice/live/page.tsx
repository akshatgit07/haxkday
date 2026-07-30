"use client";

import { ConversationProvider } from "@elevenlabs/react";

import LiveCompanion from "@/components/voice-live/LiveCompanion";

export default function VoiceLivePage() {
  return (
    <ConversationProvider>
      <LiveCompanion />
    </ConversationProvider>
  );
}
