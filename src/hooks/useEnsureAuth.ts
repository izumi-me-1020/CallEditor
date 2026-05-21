import { useCallback } from "react";
import { useAuthStore } from "@/stores/auth";
import { CobaltApiError, getSession } from "@/utils/cobalt-api";
import { runTurnstile } from "@/utils/turnstile";

// -- Constants ----------------------------------------------------------------

const REFRESH_BUFFER_SEC = 300;
// -- Module state -------------------------------------------------------------

let inFlight: Promise<string> | null = null;

// -- Functions ----------------------------------------------------------------

function isJwtFresh(expiresAt: number | null, nowSec: number = Date.now() / 1000): boolean {
  if (expiresAt === null) return false;
  return expiresAt - REFRESH_BUFFER_SEC > nowSec;
}

async function fetchFreshJwt(sitekey: string): Promise<string> {
  const turnstileToken = await runTurnstile(sitekey);
  const { jwt, expiresAt } = await getSession(turnstileToken);
  useAuthStore.getState().setJwt(jwt, expiresAt);
  return jwt;
}

function readSitekey(): string {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITEKEY;
  if (!sitekey) throw new CobaltApiError("turnstile_unconfigured", 0);
  return sitekey;
}

function useEnsureAuth(): () => Promise<string> {
  return useCallback(async () => {
    const sitekey = readSitekey();
    const { jwt, expiresAt } = useAuthStore.getState();
    if (jwt && isJwtFresh(expiresAt)) return jwt;

    if (inFlight) return inFlight;

    inFlight = fetchFreshJwt(sitekey).finally(() => {
      inFlight = null;
    });
    return inFlight;
  }, []);
}

// -- Exports ------------------------------------------------------------------

export { useEnsureAuth, isJwtFresh };
