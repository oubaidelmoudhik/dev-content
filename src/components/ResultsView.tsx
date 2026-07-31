"use client";

import { RefreshCw, ArrowLeft } from "lucide-react";
import SocialPostCard from "./SocialPostCard";
import BlogPostCard from "./BlogPostCard";
import {
  ALL_PLATFORMS,
  type ContentData,
  type Platform,
} from "@/types";

interface Props {
  data: ContentData;
  idea: string;
  onRegenerate: () => void;
  onNewIdea: () => void;
  isRegenerating: boolean;
}

const RECOMMENDED_LENGTH: Record<Platform, string> = {
  instagram: "Under ~150 words",
  facebook: "Under ~250 words",
  linkedin: "150–300 words",
};

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
          <div className="flex gap-3 flex-shrink-0">
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
              onClick={onNewIdea}
              disabled={isRegenerating}
              className="flex items-center gap-2 bg-white/60 border border-white/80 text-slate-700 font-bold px-6 py-2.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} />
              New idea
            </button>
          </div>
        </div>
      </div>

      {/* Cards grid — only render platforms present in the response data */}
      <div className={gridClass}>
        {requestedPlatforms.map((platform) => {
          if (platform === "blog") {
            return <BlogPostCard key="blog" blog={data.blog} />;
          }
          return (
            <SocialPostCard
              key={platform}
              platform={platform}
              text={data[platform]}
              recommendedLength={RECOMMENDED_LENGTH[platform]}
            />
          );
        })}
      </div>
    </div>
  );
}
