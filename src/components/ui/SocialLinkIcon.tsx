"use client";

import { detectSocialPlatform, SOCIAL_PLATFORM_LABEL, type SocialPlatform } from "@/lib/social";

const PLATFORM_COLOR: Record<SocialPlatform, string> = {
  facebook: "#1877F2",
  instagram: "#E1306C",
  youtube: "#FF0000",
  x: "#000000",
  tiktok: "#000000",
  other: "#52525b",
};

function PlatformGlyph({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M23 12s0-3.4-.44-5.02a2.87 2.87 0 0 0-2.02-2.03C18.94 4.5 12 4.5 12 4.5s-6.94 0-8.54.45a2.87 2.87 0 0 0-2.02 2.03C1 8.6 1 12 1 12s0 3.4.44 5.02a2.87 2.87 0 0 0 2.02 2.03c1.6.45 8.54.45 8.54.45s6.94 0 8.54-.45a2.87 2.87 0 0 0 2.02-2.03C23 15.4 23 12 23 12Z" />
          <path d="M9.8 8.6v6.8l6-3.4-6-3.4Z" fill="#fff" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M18.3 2.5h3.2l-7 8 8.2 11h-6.4l-5-6.6-5.8 6.6H2.3l7.5-8.6L2 2.5h6.5l4.5 6 5.3-6Zm-1.1 17.2h1.8L7.3 4.2H5.4l11.8 15.5Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M16.6 2h-3.2v13.7a2.7 2.7 0 1 1-2.1-2.64V9.8a6 6 0 1 0 5.3 5.96V8.2a7.6 7.6 0 0 0 4.4 1.4V6.4a4.4 4.4 0 0 1-4.4-4.4Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1" />
          <path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" />
        </svg>
      );
  }
}

export function SocialLinkIcon({ url }: { url: string }) {
  const platform = detectSocialPlatform(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={SOCIAL_PLATFORM_LABEL[platform]}
      aria-label={SOCIAL_PLATFORM_LABEL[platform]}
      className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
      style={{ backgroundColor: PLATFORM_COLOR[platform] }}
      onClick={(e) => e.stopPropagation()}
    >
      <PlatformGlyph platform={platform} />
    </a>
  );
}
