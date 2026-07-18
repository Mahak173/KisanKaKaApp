// Dev-only logging for API responses (Shopify + Firestore).
// Logs are stripped in production builds via the __DEV__ guard.
// Set VERBOSE to true to dump full response bodies (can be very large).
const VERBOSE = false;

type ApiName = "shopify" | "firestore";

const time = () => new Date().toISOString().slice(11, 23);

export const logApiResponse = (
  api: ApiName,
  endpoint: string,
  info: {
    startedAt: number;
    status?: number;
    summary?: string;
    body?: unknown;
  },
) => {
  if (!__DEV__) return;

  const ms = Date.now() - info.startedAt;
  const status = info.status !== undefined ? ` ${info.status}` : "";
  const summary = info.summary ? ` — ${info.summary}` : "";

  console.log(`[${time()}] [${api}] ${endpoint} →${status} ${ms}ms${summary}`);

  if (VERBOSE && info.body !== undefined) {
    console.log(JSON.stringify(info.body, null, 2));
  }
};

export const logApiError = (api: ApiName, endpoint: string, error: unknown) => {
  if (!__DEV__) return;
  console.log(`[${time()}] [${api}] ${endpoint} → ERROR`, error);
};
