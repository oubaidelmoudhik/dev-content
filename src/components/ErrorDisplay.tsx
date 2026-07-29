"use client";

import { AlertCircle, Clock, WifiOff, Server, FileWarning } from "lucide-react";
import type { GenerateError } from "@/types";

interface Props {
  error: GenerateError;
  idea: string;
  onRetry: () => void;
  onNewIdea: () => void;
}

const errorConfig: Record<
  GenerateError["type"],
  { icon: typeof AlertCircle; title: string; color: string }
> = {
  network: {
    icon: WifiOff,
    title: "Connection error",
    color: "from-red-500 to-orange-600",
  },
  timeout: {
    icon: Clock,
    title: "Request timed out",
    color: "from-amber-500 to-orange-600",
  },
  http: {
    icon: Server,
    title: "Server error",
    color: "from-red-500 to-rose-600",
  },
  malformed: {
    icon: FileWarning,
    title: "Unexpected response",
    color: "from-amber-500 to-red-600",
  },
  server: {
    icon: AlertCircle,
    title: "Generation failed",
    color: "from-red-500 to-rose-600",
  },
};

export default function ErrorDisplay({ error, idea, onRetry, onNewIdea }: Props) {
  const config = errorConfig[error.type];
  const Icon = config.icon;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-[2rem] shadow-2xl">
        {/* Error icon */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} text-white flex items-center justify-center mx-auto mb-6`}
        >
          <Icon size={28} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-800 text-center mb-2">
          {config.title}
        </h2>

        {/* Message */}
        <p className="text-slate-600 text-center mb-6">{error.message}</p>

        {/* Status code hint */}
        {error.status && (
          <p className="text-sm text-slate-400 text-center mb-6">
            HTTP {error.status}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Try again
          </button>
          <button
            onClick={onNewIdea}
            className="bg-white/60 border border-white/80 text-slate-700 font-bold px-8 py-3 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Start over
          </button>
        </div>

        {/* Preserved idea reminder */}
        <p className="text-xs text-slate-400 text-center mt-6">
          Your idea is still saved — it won&apos;t be lost when you retry.
        </p>
      </div>
    </div>
  );
}
