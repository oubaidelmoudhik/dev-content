"use client";

import { useState, useCallback } from "react";
import { Check, Copy, FileText } from "lucide-react";
import type { BlogData } from "@/types";

interface FieldCopyState {
  title: boolean;
  meta: boolean;
  body: boolean;
}

interface Props {
  blog: BlogData | undefined;
}

export default function BlogPostCard({ blog }: Props) {
  const [title, setTitle] = useState(blog?.title ?? "");
  const [meta, setMeta] = useState(blog?.meta ?? "");
  const [body, setBody] = useState(blog?.body ?? "");
  const [copied, setCopied] = useState<FieldCopyState>({
    title: false,
    meta: false,
    body: false,
  });

  const isMissing = !blog || (!blog.title && !blog.meta && !blog.body);

  const handleCopy = useCallback(async (field: keyof FieldCopyState, value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied((prev) => ({ ...prev, [field]: true }));
      setTimeout(
        () => setCopied((prev) => ({ ...prev, [field]: false })),
        2000,
      );
    } catch {
      // Clipboard API not available
    }
  }, []);

  const wordCount = (text: string) =>
    text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-200">
      {/* Header stripe */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

      <div className="p-6">
        {/* Card header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800">Blog post</h3>
            <p className="text-xs text-slate-400">Title, meta &amp; body</p>
          </div>
        </div>

        {isMissing ? (
          <div className="bg-white/30 border border-white/40 rounded-2xl p-6 text-center">
            <p className="text-slate-400 font-bold">
              This one didn&apos;t generate — try regenerating
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Title field */}
            <Field
              label="Title"
              value={title}
              onChange={setTitle}
              rows={2}
              wordCount={wordCount(title)}
              copied={copied.title}
              onCopy={() => handleCopy("title", title)}
            />

            {/* Meta description field */}
            <Field
              label="Meta description"
              value={meta}
              onChange={setMeta}
              rows={2}
              wordCount={wordCount(meta)}
              copied={copied.meta}
              onCopy={() => handleCopy("meta", meta)}
            />

            {/* Body field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Body
                </label>
                <button
                  onClick={() => handleCopy("body", body)}
                  disabled={!body}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                    copied.body
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white/60 border border-white/80 text-slate-500 hover:scale-[1.02] active:scale-[0.98]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {copied.body ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white/60 border border-white/80 shadow-inner rounded-2xl p-4 focus:bg-white focus:border-blue-400 focus:outline-none text-slate-700 resize-none text-sm leading-relaxed transition-all duration-200 font-mono"
                rows={12}
              />
              <div className="text-xs text-slate-400 mt-1">
                {wordCount(body)} words
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Small helper — a labeled, editable field with copy */
function Field({
  label,
  value,
  onChange,
  rows,
  wordCount,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
  wordCount: number;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        <button
          onClick={onCopy}
          disabled={!value}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 ${
            copied
              ? "bg-emerald-100 text-emerald-700"
              : "bg-white/60 border border-white/80 text-slate-500 hover:scale-[1.02] active:scale-[0.98]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {copied ? (
            <>
              <Check size={14} /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Copy
            </>
          )}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/60 border border-white/80 shadow-inner rounded-2xl p-4 focus:bg-white focus:border-blue-400 focus:outline-none text-slate-700 resize-none text-sm leading-relaxed transition-all duration-200"
        rows={rows}
      />
      <div className="text-xs text-slate-400 mt-1">{wordCount} words</div>
    </div>
  );
}
