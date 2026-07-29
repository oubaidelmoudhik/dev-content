"use client";

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export default function InputForm({ onSubmit, isLoading, initialValue }: Props) {
  const [text, setText] = useState(initialValue ?? "");
  const isDisabled = isLoading || text.trim().length === 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    onSubmit(text.trim());
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

          {/* Word count + submit */}
          <div className="flex items-center justify-between mt-4">
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
