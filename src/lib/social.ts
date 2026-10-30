export type SocialPlatform = "facebook" | "instagram" | "youtube" | "x" | "tiktok" | "other";

export function detectSocialPlatform(url: string): SocialPlatform {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "other";
  }

  if (host.includes("facebook.com") || host === "fb.com" || host === "fb.watch") return "facebook";
  if (host.includes("instagram.com")) return "instagram";
  if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
  if (host.includes("twitter.com") || host === "x.com") return "x";
  if (host.includes("tiktok.com")) return "tiktok";
  return "other";
}

export const SOCIAL_PLATFORM_LABEL: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X (Twitter)",
  tiktok: "TikTok",
  other: "Link externo",
};
