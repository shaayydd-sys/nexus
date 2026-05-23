export type DeviceTier = "high" | "medium" | "low";
export type DeviceTierOverride = "auto" | DeviceTier;

const DEVICE_TIER_KEY = "device-tier";
const DEVICE_TIER_OVERRIDE_KEY = "device-tier-override";

function isDeviceTier(value: string | null): value is DeviceTier {
  return value === "high" || value === "medium" || value === "low";
}

function canUseMatchMedia(query: string) {
  return typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}

function getTierOverride(): DeviceTierOverride {
  try {
    const value = window.localStorage.getItem(DEVICE_TIER_OVERRIDE_KEY);
    return isDeviceTier(value) ? value : "auto";
  } catch {
    return "auto";
  }
}

function cacheTier(tier: DeviceTier) {
  try {
    window.sessionStorage.setItem(DEVICE_TIER_KEY, tier);
  } catch {
    // Storage can fail in private or embedded contexts; detection still works uncached.
  }
}

function readCachedTier(): DeviceTier | null {
  try {
    const value = window.sessionStorage.getItem(DEVICE_TIER_KEY);
    return isDeviceTier(value) ? value : null;
  } catch {
    return null;
  }
}

function isMobileLike(userAgent: string) {
  return canUseMatchMedia("(max-width: 768px)")
    || (/Android|iPhone|iPad|iPod/i.test(userAgent) && canUseMatchMedia("(pointer: coarse)"));
}

function hasWeakWebGL() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

  if (!gl) return true;

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const hasFloatTextures = Boolean(gl.getExtension("OES_texture_float"));
  const loseContext = gl.getExtension("WEBGL_lose_context");

  loseContext?.loseContext();
  canvas.width = 0;
  canvas.height = 0;

  return typeof maxTextureSize !== "number" || maxTextureSize < 8192 || !hasFloatTextures;
}

export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined" || typeof document === "undefined") return "high";

  const override = getTierOverride();
  if (override !== "auto") return override;

  const cached = readCachedTier();
  if (cached) return cached;

  const userAgent = window.navigator.userAgent;
  const navigatorWithMemory = window.navigator as Navigator & { deviceMemory?: number };

  let tier: DeviceTier = "high";

  if (canUseMatchMedia("(prefers-reduced-motion: reduce)")) {
    tier = "low";
  } else if (typeof window.navigator.hardwareConcurrency === "number" && window.navigator.hardwareConcurrency < 4) {
    tier = "low";
  } else if (typeof navigatorWithMemory.deviceMemory === "number" && navigatorWithMemory.deviceMemory < 4) {
    tier = "low";
  } else if (hasWeakWebGL()) {
    tier = "low";
  } else if (isMobileLike(userAgent)) {
    tier = "medium";
  }

  cacheTier(tier);
  return tier;
}
