"use client";

import { useRef, useState } from "react";
import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
import type { IdeaSuggestion, Language } from "@/types";
import { fetchIdeaSuggestions } from "@/utils/suggestIdeas";

type SuggestionStatus = "idle" | "loading" | "success" | "error";

interface Props {
  language: Language;
  onSelect: (idea: string) => void;
}

const ERROR_MESSAGE =
  "Couldn't fetch suggestions — write your own idea below.";

export default function IdeaSuggestions({ language, onSelect }: Props) {
  const [status, setStatus] = useState<SuggestionStatus>("idle");
  const [ideas, setIdeas] = useState<IdeaSuggestion[]>([]);
  const requestIdRef = useRef(0);

  const loadSuggestions = async () => {
    const requestId = ++requestIdRef.current;
    const requestedLanguage = language;

    setStatus("loading");

    const result = await fetchIdeaSuggestions(requestedLanguage);

    // A newer request superseded this one — discard the stale result.
    if (requestId !== requestIdRef.current) return;

    // The user switched languages mid-flight — don't show results in the
    // language they were browsing before. Return to idle so they can retry.
    if (requestedLanguage !== language) {
      setStatus("idle");
      return;
    }

    if (result.success) {
      setIdeas(result.ideas);
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="mt-6" aria-live="polite">
      {/* Trigger / success header */}
      {status === "success" ? (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Suggested ideas
          </span>
          <button
            type="button"
            onClick={loadSuggestions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-slate-600 bg-white/60 border border-white/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <RefreshCw size={13} />
            Get new ideas
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={loadSuggestions}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm text-slate-600 bg-white/60 border border-white/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Lightbulb size={16} />
          )}
          {status === "loading" ? "Finding ideas..." : "Not sure what to write? Get ideas"}
        </button>
      )}

      {/* Contained loading hint — the textarea stays usable */}
      {status === "loading" && (
        <p className="mt-3 text-sm text-slate-500 font-medium">
          Pulling together a few ideas for you…
        </p>
      )}

      {/* Non-blocking failure — manual typing is unaffected */}
      {status === "error" && (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-sm text-slate-500 font-medium">{ERROR_MESSAGE}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-xs font-bold text-blue-600 hover:text-purple-600 underline underline-offset-2 transition-colors duration-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* Pickable idea cards */}
      {status === "success" && ideas.length > 0 && (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {ideas.map((suggestion, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => onSelect(suggestion.idea)}
                className="w-full text-left bg-white/60 border border-white/80 rounded-2xl p-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span className="block text-sm font-bold text-slate-700 mb-1">
                  {suggestion.topic}
                </span>
                <span className="block text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {suggestion.idea}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
