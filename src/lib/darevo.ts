export const CATEGORIES = [
  "fitness",
  "study",
  "coding",
  "gaming",
  "creative",
  "business",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PROOF_TYPES = [
  "checkin",
  "number",
  "text",
  "photo",
  "video",
  "screenshot",
  "link",
] as const;
export type ProofType = (typeof PROOF_TYPES)[number];

export type Visibility = "public" | "private";

/** Central scoring rules — used by the database triggers and mirrored here for display. */
export const SCORING = {
  pointsPerProof: 10,
  completionBonus: 50,
} as const;

export const MEDIA_PROOF_TYPES: ProofType[] = ["photo", "screenshot", "video"];

export const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"];
export const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"];

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const MAX_VIDEO_SECONDS = 60;

export function maxBytesFor(type: ProofType) {
  return type === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

export function allowedMimeFor(type: ProofType) {
  return type === "video" ? VIDEO_MIME : IMAGE_MIME;
}

export function formatBytes(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

export function isValidUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const USERNAME_RE = /^[a-zA-Z0-9._-]{3,20}$/;

export function normalizeUsername(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 20);
}

export function challengeUrl(id: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/challenge/${id}`;
}

export function inviteUrl(token: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/invite/${token}`;
}

export function progressPercent(progress: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((progress / target) * 100));
}

export function isEnded(deadline: string | null) {
  return !!deadline && new Date(deadline).getTime() < Date.now();
}

export function initialsOf(name: string | null | undefined, fallback = "D") {
  const source = (name ?? "").trim();
  if (!source) return fallback;
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}
