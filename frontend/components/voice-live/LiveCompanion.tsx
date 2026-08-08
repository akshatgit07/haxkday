"use client";

import { useCallback, useState } from "react";
import { useConversation } from "@elevenlabs/react";

import { getSignedConversationUrl, VoiceSessionError } from "@/lib/voiceSession";
import type { InvestmentMemo, ScenarioInputs, ScenarioResult } from "@/lib/types";
import { caprasimo, figtree } from "@/lib/fonts";
import "@/styles/organic-theme.css";

import LiveMemoCard from "./LiveMemoCard";
import ScenarioResultCard from "./ScenarioResultCard";

interface ToolActivity {
  toolName: string;
  status: "calling" | "done" | "error";
}

interface ScenarioState {
  result: ScenarioResult;
  inputs: ScenarioInputs | null;
  summary: string;
}

const TOOL_LABELS: Record<string, string> = {
  analyze_company: "Analyzing",
  model_scenario: "Modeling scenario",
};

const NEUTRAL_700 = "var(--color-neutral-700, #6b6560)";
const ACCENT_700 = "var(--color-accent-700, #8a4b25)";

function MicIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth="2.2" />
      <path d="M5 11a7 7 0 0 0 14 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function LiveCompanion() {
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<ToolActivity | null>(null);
  const [memo, setMemo] = useState<InvestmentMemo | null>(null);
  const [scenario, setScenario] = useState<ScenarioState | null>(null);

  const conversation = useConversation({
    onError: (err) => setError(typeof err === "string" ? err : "Connection error"),
    onAgentToolRequest: (req) => {
      setActivity({ toolName: req.tool_name, status: "calling" });
    },
    onAgentToolResponse: (res) => {
      setActivity({ toolName: res.tool_name, status: res.is_error ? "error" : "done" });

      const fullResult = "full_tool_result" in res ? res.full_tool_result : undefined;
      if (!fullResult || res.is_error) return;

      try {
        const parsed = JSON.parse(fullResult);
        if (res.tool_name === "analyze_company" && parsed.memo) {
          setMemo(parsed.memo as InvestmentMemo);
          setScenario(null);
        } else if (res.tool_name === "model_scenario" && parsed.result) {
          setScenario({
            result: parsed.result as ScenarioResult,
            inputs: (parsed.inputs as ScenarioInputs) ?? null,
            summary: parsed.summary as string,
          });
          setMemo(null);
        }
      } catch {
        // full_tool_result wasn't JSON we recognize — leave the companion
        // display as-is rather than crashing on unexpected tool output.
      }
    },
  });

  const connected = conversation.status === "connected";
  const speaking = conversation.isSpeaking;

  const startCall = useCallback(async () => {
    setError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const signedUrl = await getSignedConversationUrl();
      conversation.startSession({ signedUrl, connectionType: "websocket" });
    } catch (err) {
      setError(err instanceof VoiceSessionError ? err.message : "Microphone access is required to start a call.");
    }
  }, [conversation]);

  const endCall = useCallback(() => {
    conversation.endSession();
    setActivity(null);
  }, [conversation]);

  return (
    <div
      className={`organic-theme ${caprasimo.variable} ${figtree.variable}`}
      style={{ minHeight: "100vh", background: "var(--color-bg)" }}
    >
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "56px 20px 90px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 30, color: "var(--color-text)", margin: 0 }}>
            Morgan AI — Live
          </h1>
          <p className="text-muted" style={{ marginTop: 8, fontSize: 14 }}>
            Talk to your analyst. Numbers, citations, and the math sync here as Morgan answers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div
            onClick={connected ? undefined : startCall}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: connected ? "default" : "pointer",
              animation: connected
                ? speaking
                  ? "orbBreathe 1.4s ease-in-out infinite"
                  : "orbPulseRing 1.6s ease-out infinite"
                : "none",
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: ACCENT_700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MicIcon />
            </div>
          </div>

          {!connected ? (
            <button onClick={startCall} className="btn btn-primary">
              Start conversation
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                className="btn btn-secondary"
                style={{ cursor: "default", color: speaking ? ACCENT_700 : NEUTRAL_700 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: speaking ? ACCENT_700 : "var(--color-neutral-400, #c0b6a5)",
                  }}
                />
                {speaking ? "Speaking" : "Listening"}
              </span>
              <button onClick={endCall} className="btn btn-secondary">
                End call
              </button>
            </div>
          )}
        </div>

        {error && (
          <p
            style={{
              width: "100%",
              maxWidth: 560,
              borderRadius: 12,
              border: "1px solid var(--color-accent-300, #ffc6a5)",
              background: "var(--color-accent-100, #fff2eb)",
              color: ACCENT_700,
              padding: "10px 14px",
              fontSize: 13.5,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        {activity && activity.status === "calling" && (
          <p style={{ fontSize: 13.5, color: NEUTRAL_700, margin: 0 }}>
            {TOOL_LABELS[activity.toolName] ?? activity.toolName}…
          </p>
        )}
        {activity && activity.status === "error" && (
          <p style={{ fontSize: 13.5, color: ACCENT_700, margin: 0 }}>
            {TOOL_LABELS[activity.toolName] ?? activity.toolName} failed.
          </p>
        )}

        {memo && <LiveMemoCard memo={memo} />}
        {scenario && <ScenarioResultCard result={scenario.result} inputs={scenario.inputs} summary={scenario.summary} />}
      </main>
    </div>
  );
}
