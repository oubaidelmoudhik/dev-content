"use client";

import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-[2rem] shadow-2xl text-center">
        {/* Spinner */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-6">
          <Loader2 size={28} className="animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-800 mb-3">
          Generating your content...
        </h2>

        {/* Reassuring copy sets time expectations */}
        <p className="text-slate-600 max-w-md mx-auto">
          Generating for Instagram, Facebook, LinkedIn and the blog — this
          usually takes 15–30 seconds.
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {["Instagram", "Facebook", "LinkedIn", "Blog"].map((platform, i) => (
            <div
              key={platform}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"
                style={{ animationDelay: `${i * 300}ms` }}
              />
              <span className="text-xs text-slate-400 font-medium hidden sm:block">
                {platform}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
