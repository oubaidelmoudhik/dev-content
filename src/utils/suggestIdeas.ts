import type {
  IdeaSuggestion,
  Language,
  SuggestIdeasResponse,
} from "@/types";

const TIMEOUT_MS = 30_000; // web search + LLM; generous but not hanging

const WEBHOOK_URL_BASE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL_BASE ?? "";
const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "";
const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_N8N_WEBHOOK_SECRET ?? "";

const DEFAULT_COUNT = 5;

/**
 * Resolve the /suggest-ideas endpoint.
 * Prefers NEXT_PUBLIC_N8N_WEBHOOK_URL_BASE; otherwise derives the base from
 * the generate webhook URL the same way saveRound derives /log-final, e.g.
 *   https://host/webhook/generate-content  ->  https://host/webhook/suggest-ideas
 * Returns "" when no base can be determined.
 */
function deriveSuggestIdeasUrl(): string {
  const base = WEBHOOK_URL_BASE.trim() || WEBHOOK_URL.trim();
  if (!base) return "";
  const trimmed = base.replace(/\/+$/, "");
  const lastSlash = trimmed.lastIndexOf("/");
  const host = lastSlash <= 0 ? trimmed : trimmed.slice(0, lastSlash);
  return `${host}/suggest-ideas`;
}

/**
 * Best-effort POST to the /suggest-ideas endpoint. Never throws — always
 * resolves to a normalized SuggestIdeasResponse so the caller can show
 * lightweight, non-blocking feedback.
 */
export async function fetchIdeaSuggestions(
  language: Language,
  count = DEFAULT_COUNT,
): Promise<SuggestIdeasResponse> {
  const url = deriveSuggestIdeasUrl();
  if (!url) {
    return { success: false, error: "Suggestions webhook is not configured." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(WEBHOOK_SECRET ? { "X-Webhook-Secret": WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ language, count }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Request failed with status ${response.status}.`,
      };
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      return {
        success: false,
        error: "The server returned an invalid response.",
      };
    }

    return parseSuggestIdeasResponse(body);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (controller.signal.aborted) {
      return { success: false, error: "Request timed out." };
    }
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "A network error occurred.",
    };
  }
}

/**
 * Defensively validate that a raw /suggest-ideas response matches the expected
 * shape. Returns a normalized SuggestIdeasResponse — never throws. Malformed
 * idea entries are dropped; a response with no usable ideas is a failure.
 */
function parseSuggestIdeasResponse(body: unknown): SuggestIdeasResponse {
  if (body === null || typeof body !== "object") {
    return { success: false, error: "Response was not a valid JSON object" };
  }

  const raw = body as Record<string, unknown>;

  if (raw.success === true && Array.isArray(raw.ideas)) {
    const ideas: IdeaSuggestion[] = raw.ideas
      .filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object",
      )
      .map((item) => ({
        topic: typeof item.topic === "string" ? item.topic : "",
        idea: typeof item.idea === "string" ? item.idea : "",
      }))
      .filter(
        (item): item is IdeaSuggestion =>
          item.topic.trim() !== "" && item.idea.trim() !== "",
      );

    if (ideas.length > 0) {
      return { success: true, ideas };
    }
  }

  return {
    success: false,
    error:
      typeof raw.error === "string"
        ? raw.error
        : "The server returned an unexpected response format",
  };
}
