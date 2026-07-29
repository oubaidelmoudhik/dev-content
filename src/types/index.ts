export type Platform = "instagram" | "facebook" | "linkedin";

export type AppView = "input" | "loading" | "results" | "error";

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
}

export type AppAction =
  | { type: "SUBMIT_IDEA"; idea: string }
  | { type: "GENERATION_SUCCESS"; data: ContentData }
  | { type: "GENERATION_ERROR"; error: GenerateError }
  | { type: "RETRY" }
  | { type: "REGENERATE" }
  | { type: "NEW_IDEA" };
