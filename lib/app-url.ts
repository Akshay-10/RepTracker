const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function normalizeOrigin(value: string | undefined) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return "";
  }
}

function isLocalOrigin(origin: string) {
  try {
    return LOCAL_HOSTS.has(new URL(origin).hostname);
  } catch {
    return false;
  }
}

export function getBrowserAppOrigin() {
  const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);

  if (typeof window === "undefined") {
    return configuredOrigin;
  }

  const currentOrigin = window.location.origin;

  if (!configuredOrigin) {
    return currentOrigin;
  }

  const configuredIsLocal = isLocalOrigin(configuredOrigin);
  const currentIsLocal = isLocalOrigin(currentOrigin);

  if (configuredIsLocal && !currentIsLocal) {
    return currentOrigin;
  }

  return configuredOrigin;
}

export function getAuthCallbackUrl(nextPath: string) {
  const origin = getBrowserAppOrigin();
  const safeNext =
    nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/dashboard";
  const url = new URL("/auth/callback", origin || "http://localhost:3000");
  url.searchParams.set("next", safeNext);
  return url.toString();
}
