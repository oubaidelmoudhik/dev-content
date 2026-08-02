import type { SaveRoundPayload, SaveRoundResponse } from "@/types";

const TIMEOUT_MS = 15_000; // logging is best-effort — don't let it hang

const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_N8N_WEBHOOK_SECRET ?? "";

/**
 * Derive the /log-final endpoint from the generate webhook URL, e.g.
 *   https://host/webhook/generate-content  ->  https://host/webhook/log-final
 * No extra env vars needed — the same base and secret are reused.
 */
function deriveLogFinalUrl(generateUrl: string): string {
  const trimmed = generateUrl.replace(/\/+$/, "");
  const lastSlash = trimmed.lastIndexOf("/");
  if (lastSlash <= 0) return `${trimmed}/log-final`;
  return `${trimmed.slice(0, lastSlash)}/log-final`;
}

/**
 * Best-effort POST of the saved content round to the /log-final endpoint.
 * Never throws — always resolves to a { success, error? } result so the
 * caller can show lightweight, non-blocking feedback.
 */
export async function saveRound(
  payload: SaveRoundPayload,
): Promise<SaveRoundResponse> {
  const generateUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "";
  if (!generateUrl) {
    return { success: false, error: "Webhook URL is not configured." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(deriveLogFinalUrl(generateUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(WEBHOOK_SECRET ? { "X-Webhook-Secret": WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
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
      return { success: false, error: "The server returned an invalid response." };
    }

    if (
      body !== null &&
      typeof body === "object" &&
      (body as Record<string, unknown>).success === true
    ) {
      return { success: true };
    }

    const error =
      body !== null &&
      typeof body === "object" &&
      typeof (body as Record<string, unknown>).error === "string"
        ? ((body as Record<string, unknown>).error as string)
        : "The server returned an unexpected response.";
    return { success: false, error };
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
