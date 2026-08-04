export type Platform = "instagram" | "facebook" | "linkedin";

export type ContentPlatform = Platform | "blog";

export type Language = "en" | "fr";

export type AppView = "input" | "loading" | "results" | "error";

export const ALL_PLATFORMS: ContentPlatform[] = [
  "instagram",
  "facebook",
  "linkedin",
  "blog",
];

export const PLATFORM_LABELS: Record<ContentPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  blog: "Blog",
};

export interface GenerateOptions {
  language: Language;
  platforms: ContentPlatform[];
}

export interface BlogData {
  title?: string;
  meta?: string;
  body?: string;
}

export interface ContentData {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  blog?: BlogData;
}

/** One platform's content for the /log-final feedback endpoint. */
export interface SaveRoundItem {
  platform: ContentPlatform;
  content: string;
}

/** Payload sent to the /log-final feedback endpoint. */
export interface SaveRoundPayload {
  core_idea: string;
  language: Language;
  items: SaveRoundItem[];
}

/** Result shape returned by the /log-final endpoint. */
export interface SaveRoundResponse {
  success: boolean;
  error?: string;
}

/** One AI-suggested content idea returned by the /suggest-ideas endpoint. */
export interface IdeaSuggestion {
  topic: string;
  idea: string;
}

/** Result shape returned by the /suggest-ideas endpoint. */
export type SuggestIdeasResponse =
  | { success: true; ideas: IdeaSuggestion[] }
  | { success: false; error?: string };

/** Reads a card's current (possibly edited) content on demand. */
export type CardValueGetter = () => string | BlogData;

/**
 * Registers/unregisters a value getter with the results view so the
 * "Save this round" button can collect the live text from rendered cards.
 */
export type RegisterValueGetter = (
  platform: ContentPlatform,
  getter: CardValueGetter | null,
) => void;

export interface ApiSuccessResponse {
  success: true;
  data: ContentData;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface GenerateError {
  type: "network" | "timeout" | "http" | "malformed" | "server";
  message: string;
  status?: number;
}

export interface AppState {
  view: AppView;
  idea: string;
  result: ContentData | null;
  error: GenerateError | null;
  lastSuccessfulResult: ContentData | null;
  language: Language;
  platforms: ContentPlatform[];
}

export type AppAction =
  | {
      type: "SUBMIT_IDEA";
      idea: string;
      language: Language;
      platforms: ContentPlatform[];
    }
  | { type: "GENERATION_SUCCESS"; data: ContentData }
  | { type: "GENERATION_ERROR"; error: GenerateError }
  | { type: "RETRY" }
  | {
      type: "REGENERATE";
      idea: string;
      language: Language;
      platforms: ContentPlatform[];
    }
  | { type: "NEW_IDEA" };
