"use client";

import { useState, useCallback, useEffect } from "react";
import { Check, Copy, Instagram, Facebook, Linkedin } from "lucide-react";
import type {
  Platform,
  RegisterValueGetter,
} from "@/types";

interface Props {
  platform: Platform;
  text: string | undefined;
  recommendedLength: string;
  registerValueGetter: RegisterValueGetter;
}

const platformConfig: Record<
  Platform,
  { label: string; icon: typeof Instagram; brandColor: string; maxRecommended: number }
> = {
  instagram: {
    label: "Instagram",
    icon: Instagram,
    brandColor: "from-pink-500 to-rose-500",
    maxRecommended: 150,
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    brandColor: "from-blue-600 to-blue-700",
    maxRecommended: 250,
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    brandColor: "from-blue-500 to-blue-600",
    maxRecommended: 300,
  },
};

function getLengthLabel(wordCount: number, maxRecommended: number) {
  if (wordCount === 0) return null;
  if (wordCount > maxRecommended * 1.5) {
    return { label: "Long", color: "text-amber-500", dot: "bg-amber-500" };
  }
  if (wordCount > maxRecommended) {
    return { label: "Slightly long", color: "text-amber-400", dot: "bg-amber-400" };
  }
  return { label: "Good length", color: "text-emerald-500", dot: "bg-emerald-500" };
}

export default function SocialPostCard({
  platform,
  text,
  recommendedLength,
  registerValueGetter,
}: Props) {
  const config = platformConfig[platform];
  const Icon = config.icon;
  const [copied, setCopied] = useState(false);
  const [editedText, setEditedText] = useState(text ?? "");
  const isMissing = !text;

  // Expose the current text to "Save this round". Only registered when the
  // card actually rendered (not missing), so failed platforms are excluded.
  useEffect(() => {
    if (isMissing) return;
    const getter = () => editedText;
    registerValueGetter(platform, getter);
    return () => registerValueGetter(platform, null);
  }, [isMissing, platform, registerValueGetter, editedText]);

  const wordCount = editedText.trim()
    ? editedText.trim().split(/\s+/).length
    : 0;
  const charCount = editedText.length;
  const lengthInfo = getLengthLabel(wordCount, config.maxRecommended);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently fail, the user can still
      // manually select and copy the text from the textarea.
    }
  }, [editedText]);

  return (
    <div
      className={`bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-200 ${
        isMissing ? "opacity-70" : ""
      }`}
    >
      {/* Header with platform color stripe */}
      <div className={`h-2 bg-gradient-to-r ${config.brandColor}`} />

      <div className="p-6">
        {/* Platform header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.brandColor} text-white flex items-center justify-center`}
            >
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800">{config.label}</h3>
              <p className="text-xs text-slate-400">{recommendedLength}</p>
            </div>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            disabled={isMissing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-white/60 border border-white/80 text-slate-600 hover:scale-[1.02] active:scale-[0.98]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? (
              <>
                <Check size={16} /> Copied!
              </>
            ) : (
              <>
                <Copy size={16} /> Copy
              </>
            )}
          </button>
        </div>

        {/* Content */}
        {isMissing ? (
          <div className="bg-white/30 border border-white/40 rounded-2xl p-6 text-center">
            <p className="text-slate-400 font-bold">
              This one didn&apos;t generate — try regenerating
            </p>
          </div>
        ) : (
          <>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full bg-white/60 border border-white/80 shadow-inner rounded-2xl p-4 focus:bg-white focus:border-blue-400 focus:outline-none text-slate-700 resize-none text-sm leading-relaxed transition-all duration-200"
              rows={6}
            />

            {/* Stats row */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{wordCount} words</span>
                <span>{charCount} chars</span>
              </div>
              {lengthInfo && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${lengthInfo.dot}`}
                  />
                  <span className={`text-xs font-bold ${lengthInfo.color}`}>
                    {lengthInfo.label}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
