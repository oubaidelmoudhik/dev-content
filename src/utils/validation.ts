import type { ApiResponse, ContentData, BlogData } from "@/types";

/**
 * Defensively validate that a raw API response matches the expected shape.
 * Returns a normalized ApiResponse — never throws.
 */
export function parseApiResponse(body: unknown): ApiResponse {
  if (body === null || typeof body !== "object") {
    return { success: false, error: "Response was not a valid JSON object" };
  }

  const raw = body as Record<string, unknown>;

  if (raw.success === true) {
    return {
      success: true,
      data: normalizeContentData(raw.data),
    };
  }

  return {
    success: false,
    error:
      typeof raw.error === "string"
        ? raw.error
        : "The server returned an unexpected response format",
  };
}

function normalizeContentData(data: unknown): ContentData {
  if (!data || typeof data !== "object") {
    return {};
  }

  const raw = data as Record<string, unknown>;
  const result: ContentData = {};

  // Preserve key presence: a key present in the raw response (even if null
  // or malformed) is included — a key that is absent entirely is omitted.
  // ResultsView uses this to distinguish "wasn't requested" from "failed".
  if (raw.instagram !== undefined) {
    result.instagram =
      typeof raw.instagram === "string" ? raw.instagram : undefined;
  }
  if (raw.facebook !== undefined) {
    result.facebook = typeof raw.facebook === "string" ? raw.facebook : undefined;
  }
  if (raw.linkedin !== undefined) {
    result.linkedin = typeof raw.linkedin === "string" ? raw.linkedin : undefined;
  }
  if (raw.blog !== undefined) {
    result.blog = normalizeBlogData(raw.blog);
  }

  return result;
}

function normalizeBlogData(blog: unknown): BlogData | undefined {
  if (!blog || typeof blog !== "object") {
    return undefined;
  }

  const raw = blog as Record<string, unknown>;

  return {
    title: typeof raw.title === "string" ? raw.title : undefined,
    meta: typeof raw.meta === "string" ? raw.meta : undefined,
    body: typeof raw.body === "string" ? raw.body : undefined,
  };
}
