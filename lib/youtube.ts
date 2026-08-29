/**
 * Comprehensive utility functions for YouTube URL normalization, extraction,
 * thumbnail resolution, and responsive player embedding using youtube-nocookie.com.
 */

/**
 * Robustly extracts an 11-character YouTube Video ID from any standard YouTube URL format,
 * share link, embedded iframe, or raw ID.
 *
 * Supported formats:
 * - https://youtu.be/VIDEO_ID
 * - https://youtu.be/VIDEO_ID?si=PARAM&t=10s
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&si=PARAM
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://youtube.com/live/VIDEO_ID?si=PARAM
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/e/VIDEO_ID
 * - <iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>
 * - Raw 11-character video ID (e.g., "fvSM3UWwZTQ")
 */
export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Raw 11-character video ID format check (alphanumeric, -, _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. If an iframe HTML snippet was pasted, extract the src URL first
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const targetString = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;

  // 3. Structured URL parsing attempt
  try {
    const urlString = targetString.match(/^https?:\/\//i) ? targetString : `https://${targetString}`;
    const url = new URL(urlString);
    const host = url.hostname.toLowerCase();

    // youtu.be/VIDEO_ID
    if (host === "youtu.be" || host.endsWith(".youtu.be")) {
      const pathname = url.pathname.replace(/^\/+/, "");
      const firstSegment = pathname.split("/")[0];
      if (firstSegment && /^[a-zA-Z0-9_-]{11}$/.test(firstSegment)) {
        return firstSegment;
      }
    }

    // youtube.com / m.youtube.com / music.youtube.com / youtube-nocookie.com
    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      // /watch?v=VIDEO_ID or /watch/VIDEO_ID
      const vParam = url.searchParams.get("v");
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }

      // /embed/VIDEO_ID, /shorts/VIDEO_ID, /live/VIDEO_ID, /v/VIDEO_ID, /e/VIDEO_ID
      const pathMatch = url.pathname.match(/^\/(?:embed|shorts|live|v|e|watch)\/([a-zA-Z0-9_-]{11})/i);
      if (pathMatch && pathMatch[1]) {
        return pathMatch[1];
      }

      // Any first valid 11-char path segment
      const pathSegments = url.pathname.split("/").filter(Boolean);
      for (const segment of pathSegments) {
        if (/^[a-zA-Z0-9_-]{11}$/.test(segment) && !["watch", "embed", "shorts", "live", "v", "e"].includes(segment.toLowerCase())) {
          return segment;
        }
      }
    }
  } catch {
    // Fall through to regex if URL construction fails
  }

  // 4. Comprehensive Fallback Regex
  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:(?:v|e(?:mbed)?|shorts|live)\/|(?:watch\/?\?(?:.*&)?v=)|(?:watch\/))|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = targetString.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Returns privacy-enhanced canonical 16:9 embeddable YouTube URL for iframe src.
 * Uses https://www.youtube-nocookie.com/embed/{videoId}
 * Automatically strips all share tracking parameters (?si=..., &utm_source=...).
 */
export function getYouTubeEmbedUrl(input: string | null | undefined): string | null {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/**
 * Returns a high-quality YouTube thumbnail URL derived deterministically from the video ID.
 */
export function getYouTubeThumbnailUrl(
  input: string | null | undefined,
  quality: "maxres" | "hq" | "default" = "hq"
): string | null {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;
  if (quality === "maxres") return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  if (quality === "default") return `https://img.youtube.com/vi/${videoId}/default.jpg`;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Returns true if the input string is a valid YouTube URL or raw YouTube video ID.
 */
export function isYouTubeUrl(input: string | null | undefined): boolean {
  return extractYouTubeVideoId(input) !== null;
}
