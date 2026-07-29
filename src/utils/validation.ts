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

  return {
    instagram: typeof raw.instagram === "string" ? raw.instagram : undefined,
    facebook: typeof raw.facebook === "string" ? raw.facebook : undefined,
    linkedin: typeof raw.linkedin === "string" ? raw.linkedin : undefined,
    blog: normalizeBlogData(raw.blog),
  };
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
