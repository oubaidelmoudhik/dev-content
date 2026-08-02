"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  RefreshCw,
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import SocialPostCard from "./SocialPostCard";
import BlogPostCard from "./BlogPostCard";
import {
  ALL_PLATFORMS,
  type BlogData,
  type CardValueGetter,
  type ContentData,
  type ContentPlatform,
  type Language,
  type Platform,
  type RegisterValueGetter,
  type SaveRoundItem,
} from "@/types";
import { saveRound } from "@/utils/saveRound";

interface Props {
  data: ContentData;
  idea: string;
  language: Language;
  onRegenerate: () => void;
  onNewIdea: () => void;
  isRegenerating: boolean;
}

const RECOMMENDED_LENGTH: Record<Platform, string> = {
  instagram: "Under ~150 words",
  facebook: "Under ~250 words",
  linkedin: "150–300 words",
};

const SAVE_FEEDBACK_MS = {
  saved: 3000,
  error: 4500,
} as const;

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Presence check, not value check: a key can exist in `data` while its
 * value is null/undefined (generation was attempted and failed). Only
 * platforms present as keys were requested and should render.
 */
function isPresent(data: ContentData, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(data, key);
}

export default function ResultsView({
  data,
  idea,
  language,
  onRegenerate,
  onNewIdea,
  isRegenerating,
}: Props) {
  const requestedPlatforms = ALL_PLATFORMS.filter((platform) =>
    isPresent(data, platform),
  );

  // A single card looks better centered in one column than stranded in
  // half of a two-column grid.
  const gridClass =
    requestedPlatforms.length === 1
      ? "grid grid-cols-1 gap-6 max-w-xl mx-auto"
      : "grid grid-cols-1 md:grid-cols-2 gap-6";

  // Cards register getters that read their *current* edited text on demand.
  // Keeping them in a ref means typing in a card never re-renders this view.
  const gettersRef = useRef<
    Partial<Record<ContentPlatform, CardValueGetter>>
  >({});

  const registerValueGetter = useCallback<RegisterValueGetter>(
    (platform, getter) => {
      if (getter) {
        gettersRef.current[platform] = getter;
      } else {
        delete gettersRef.current[platform];
      }
    },
    [],
  );

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleFeedbackClear = useCallback((ms: number) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = setTimeout(() => {
      setSaveState("idle");
      feedbackTimerRef.current = null;
    }, ms);
  }, []);

  // Clear any pending feedback timer on unmount
  useEffect(
    () => () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (saveState === "saving") return;

    // Only include platforms currently rendered as a successful card — cards
    // that failed to generate never register a getter, so they're skipped.
    const items: SaveRoundItem[] = [];
    for (const platform of requestedPlatforms) {
      const getter = gettersRef.current[platform];
      if (!getter) continue;
      if (platform === "blog") {
        // Backend stores content in a single text column — send the blog as a
        // JSON string, not a raw object.
        items.push({ platform, content: JSON.stringify(getter() as BlogData) });
      } else {
        items.push({ platform, content: getter() as string });
      }
    }

    if (items.length === 0) {
      setSaveState("error");
      scheduleFeedbackClear(SAVE_FEEDBACK_MS.error);
      return;
    }

    setSaveState("saving");
    const result = await saveRound({ core_idea: idea, language, items });

    setSaveState(result.success ? "saved" : "error");
    scheduleFeedbackClear(
      result.success ? SAVE_FEEDBACK_MS.saved : SAVE_FEEDBACK_MS.error,
    );
  }, [saveState, requestedPlatforms, idea, language, scheduleFeedbackClear]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-6 rounded-[2rem] shadow-2xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-800 truncate">
              {idea}
            </h2>
            <p className="text-sm text-slate-400">
              Edit any card below, then copy to your platform.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-2.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={18}
                  className={isRegenerating ? "animate-spin" : ""}
                />
                {isRegenerating ? "Regenerating..." : "Regenerate all"}
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saveState === "saving" || requestedPlatforms.length === 0
                }
                className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/80 text-emerald-700 font-bold px-6 py-2.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveState === "saving" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saveState === "saving" ? "Saving..." : "Save this round"}
              </button>
              <button
                onClick={onNewIdea}
                disabled={isRegenerating}
                className="flex items-center gap-2 bg-white/60 border border-white/80 text-slate-700 font-bold px-6 py-2.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                New idea
              </button>
            </div>
            {saveState === "saved" && (
              <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Check size={14} /> Saved this round
              </p>
            )}
            {saveState === "error" && (
              <p className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <AlertCircle size={14} /> Couldn&apos;t save — you can keep using
                the results normally
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cards grid — only render platforms present in the response data */}
      <div className={gridClass}>
        {requestedPlatforms.map((platform) => {
          if (platform === "blog") {
            return (
              <BlogPostCard
                key="blog"
                blog={data.blog}
                registerValueGetter={registerValueGetter}
              />
            );
          }
          return (
            <SocialPostCard
              key={platform}
              platform={platform}
              text={data[platform]}
              recommendedLength={RECOMMENDED_LENGTH[platform]}
              registerValueGetter={registerValueGetter}
            />
          );
        })}
      </div>
    </div>
  );
}
