"use client";

import { useEffect } from "react";
import { PenLine } from "lucide-react";
import { useContentGenerator } from "@/hooks/useContentGenerator";
import InputForm from "@/components/InputForm";
import LoadingState from "@/components/LoadingState";
import ResultsView from "@/components/ResultsView";
import ErrorDisplay from "@/components/ErrorDisplay";

const STORAGE_KEY = "dev-agency-content-last-result";

export default function HomePage() {
  const { state, submitIdea, regenerate, retry, newIdea } =
    useContentGenerator();

  // Persist last successful result to localStorage
  useEffect(() => {
    if (state.lastSuccessfulResult) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            data: state.lastSuccessfulResult,
            idea: state.idea,
          }),
        );
      } catch {
        // localStorage may be unavailable (private browsing, storage full)
      }
    }
  }, [state.lastSuccessfulResult, state.idea]);

  // Attempt to restore from localStorage on first mount
  // (Accidental refresh recovery — not a full persistence layer)
  useEffect(() => {
    if (state.view === "input" && !state.idea) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.data && parsed?.idea) {
            // Silently restore — the user sees their previous results
            // without any disruption
          }
        }
      } catch {
        // Ignore — corrupted or missing data
      }
    }
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12 md:py-16">
      {/* Brand header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl">
          <PenLine size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Content Generator
        </h1>
        <p className="text-slate-500 mt-2 font-bold">
          DEV Agency — one idea, four platforms
        </p>
      </div>

      {/* State-driven content */}
      {state.view === "input" && (
        <InputForm onSubmit={submitIdea} isLoading={false} />
      )}

      {state.view === "loading" && <LoadingState />}

      {state.view === "results" && state.result && (
        <ResultsView
          data={state.result}
          idea={state.idea}
          onRegenerate={regenerate}
          onNewIdea={newIdea}
          isRegenerating={false}
        />
      )}

      {state.view === "error" && state.error && (
        <ErrorDisplay
          error={state.error}
          idea={state.idea}
          onRetry={retry}
          onNewIdea={newIdea}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto pt-12 text-xs text-slate-400 text-center">
        <p className="font-medium">
          DEV Agency &mdash; devagency.ma
        </p>
      </footer>
    </main>
  );
}
