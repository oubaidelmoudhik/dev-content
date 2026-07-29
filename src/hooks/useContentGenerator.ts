"use client";

import { useCallback, useReducer, useRef } from "react";
import type { ContentData, GenerateError, AppState, AppAction } from "@/types";
import { parseApiResponse } from "@/utils/validation";

const TIMEOUT_MS = 90_000; // 90 seconds

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "";
const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_N8N_WEBHOOK_SECRET ?? "";

const initialState: AppState = {
  view: "input",
  idea: "",
  result: null,
  error: null,
  lastSuccessfulResult: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SUBMIT_IDEA":
      return {
        ...state,
        view: "loading",
        idea: action.idea,
        result: null,
        error: null,
      };
    case "GENERATION_SUCCESS":
      return {
        ...state,
        view: "results",
        result: action.data,
        error: null,
        lastSuccessfulResult: action.data,
      };
    case "GENERATION_ERROR":
      return {
        ...state,
        view: "error",
        error: action.error,
      };
    case "RETRY":
      return {
        ...state,
        view: "loading",
        error: null,
        result: null,
      };
    case "REGENERATE":
      return {
        ...state,
        view: "loading",
        result: null,
        error: null,
      };
    case "NEW_IDEA":
      return { ...initialState, lastSuccessfulResult: state.lastSuccessfulResult };
    default:
      return state;
  }
}

export function useContentGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (idea: string, isRegenerate = false) => {
      dispatch({ type: isRegenerate ? "REGENERATE" : "SUBMIT_IDEA", idea });

      // Cancel any in-flight request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        // CORS failure will surface as a network TypeError here.
        // If the n8n webhook responds but lacks Access-Control-Allow-Origin
        // headers matching this app's domain, the browser will reject it
        // as a CORS error and land in this catch block.
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(WEBHOOK_SECRET ? { "X-Webhook-Secret": WEBHOOK_SECRET } : {}),
          },
          body: JSON.stringify({ core_idea: idea }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let body: unknown;
        try {
          body = await response.json();
        } catch {
          dispatch({
            type: "GENERATION_ERROR",
            error: {
              type: "malformed",
              message: `The server returned invalid JSON (status ${response.status}). Please try again.`,
              status: response.status,
            },
          });
          return;
        }

        const parsed = parseApiResponse(body);

        if (!parsed.success) {
          dispatch({
            type: "GENERATION_ERROR",
            error: {
              type: "server",
              message: parsed.error,
              status: response.status,
            },
          });
          return;
        }

        dispatch({ type: "GENERATION_SUCCESS", data: parsed.data });
      } catch (err: unknown) {
        clearTimeout(timeoutId);

        if (controller.signal.aborted) {
          dispatch({
            type: "GENERATION_ERROR",
            error: {
              type: "timeout",
              message:
                "This is taking much longer than usual — the backend may be down. Try again in a moment.",
            },
          });
          return;
        }

        // Network error (DNS failure, connection refused, CORS, etc.)
        dispatch({
          type: "GENERATION_ERROR",
          error: {
            type: "network",
            message:
              err instanceof Error
                ? err.message
                : "A network error occurred. Please check your connection and try again.",
          },
        });
      }
    },
    [],
  );

  const submitIdea = useCallback(
    (idea: string) => generate(idea, false),
    [generate],
  );

  const regenerate = useCallback(
    () => state.idea && generate(state.idea, true),
    [generate, state.idea],
  );

  const retry = useCallback(
    () => state.idea && generate(state.idea, false),
    [generate, state.idea],
  );

  const newIdea = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    dispatch({ type: "NEW_IDEA" });
  }, []);

  return { state, submitIdea, regenerate, retry, newIdea };
}
