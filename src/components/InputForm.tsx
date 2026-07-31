"use client";

import { useState, type FormEvent } from "react";
import {
  Sparkles,
  Instagram,
  Facebook,
  Linkedin,
  FileText,
} from "lucide-react";
import {
  ALL_PLATFORMS,
  PLATFORM_LABELS,
  type ContentPlatform,
  type GenerateOptions,
  type Language,
} from "@/types";

interface Props {
  onSubmit: (idea: string, options: GenerateOptions) => void;
  isLoading: boolean;
  initialValue?: string;
}

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

const PLATFORM_ICONS: Record<ContentPlatform, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  blog: FileText,
};

export default function InputForm({ onSubmit, isLoading, initialValue }: Props) {
  const [text, setText] = useState(initialValue ?? "");
  const [language, setLanguage] = useState<Language>("en");
  const [platforms, setPlatforms] = useState<ContentPlatform[]>(ALL_PLATFORMS);
  const isDisabled =
    isLoading || text.trim().length === 0 || platforms.length === 0;

  const togglePlatform = (platform: ContentPlatform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    onSubmit(text.trim(), { language, platforms });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Glass card wrapping the form */}
      <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-[2rem] shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              What do you want to post about?
            </h2>
            <p className="text-sm text-slate-500">
              One idea → content for Instagram, Facebook, LinkedIn &amp; the blog
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Textarea — hollow input per Liquid Glass spec */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's the content idea? (e.g. 'our client just launched a site with a 40% faster load time')"
            rows={4}
            className="w-full bg-white/60 border border-white/80 shadow-inner rounded-2xl p-6 focus:bg-white focus:border-blue-400 focus:outline-none font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal resize-none transition-all duration-200"
            disabled={isLoading}
          />

          {/* Language toggle */}
          <div className="mt-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Language
            </span>
            <div className="flex bg-white/60 border border-white/80 rounded-2xl p-1 mt-2 w-fit">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-200 disabled:cursor-not-allowed ${
                    language === option.value
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform selection */}
          <div className="mt-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Platforms
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALL_PLATFORMS.map((platform) => {
                const Icon = PLATFORM_ICONS[platform];
                const isSelected = platforms.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    disabled={isLoading}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-200 disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-white/60 border border-white/80 text-slate-600 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    <Icon size={16} />
                    {PLATFORM_LABELS[platform]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Word count + submit */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-slate-400 font-medium">
              {text.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              type="submit"
              disabled={isDisabled}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Generating..." : "Generate content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
