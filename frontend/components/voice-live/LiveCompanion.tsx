"use client";

import { useCallback, useState } from "react";
import { useConversation } from "@elevenlabs/react";

import InvestmentMemoCard from "@/components/InvestmentMemoCard";
import { getSignedConversationUrl, VoiceSessionError } from "@/lib/voiceSession";
import type { InvestmentMemo, ScenarioResult } from "@/lib/types";

import ScenarioResultCard from "./ScenarioResultCard";

interface ToolActivity {
  toolName: string;
  status: "calling" | "done" | "error";
}

const TOOL_LABELS: Record<string, string> = {
  analyze_company: "Analyzing",
  model_scenario: "Modeling scenario",
};

export default function LiveCompanion() {
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<ToolActivity | null>(null);
  const [memo, setMemo] = useState<InvestmentMemo | null>(null);
  const [scenario, setScenario] = useState<{ result: ScenarioResult; summary: string } | null>(null);

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
          setScenario({ result: parsed.result as ScenarioResult, summary: parsed.summary as string });
          setMemo(null);
        }
      } catch {
        // full_tool_result wasn't JSON we recognize — leave the companion
        // display as-is rather than crashing on unexpected tool output.
      }
    },
  });

  const connected = conversation.status === "connected";

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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Morgan AI — Live</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Talk to your analyst. Charts and filings sync here as they're mentioned.
        </p>
      </div>

      {!connected ? (
        <button
          onClick={startCall}
          className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Start conversation
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-sm dark:border-neutral-800 ${
              conversation.isSpeaking ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${conversation.isSpeaking ? "bg-emerald-500" : "bg-neutral-400"}`}
            />
            {conversation.isSpeaking ? "Speaking" : "Listening"}
          </span>
          <button
            onClick={endCall}
            className="rounded-lg border border-neutral-300 px-4 py-1.5 text-sm dark:border-neutral-700"
          >
            End call
          </button>
        </div>
      )}

      {error && (
        <p className="w-full max-w-lg rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
          {error}
        </p>
      )}

      {activity && activity.status === "calling" && (
        <p className="text-sm text-neutral-500">
          {TOOL_LABELS[activity.toolName] ?? activity.toolName}…
        </p>
      )}
      {activity && activity.status === "error" && (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {TOOL_LABELS[activity.toolName] ?? activity.toolName} failed.
        </p>
      )}

      {memo && <InvestmentMemoCard memo={memo} />}
      {scenario && <ScenarioResultCard result={scenario.result} summary={scenario.summary} />}
    </main>
  );
}
