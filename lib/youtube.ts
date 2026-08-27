/**
 * Utility functions for YouTube URL normalization, extraction, and player embedding.
 */

/**
 * Robustly extracts an 11-character YouTube Video ID from any standard YouTube URL format or raw ID.
 * Supports:
 * - https://youtu.be/VIDEO_ID
 * - https://youtu.be/VIDEO_ID?si=PARAM
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&si=PARAM
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Raw 11-character video ID
 */
export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Raw 11-char video ID format check (alphanumeric, -, _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. URL parsing attempt
  try {
    const urlString = trimmed.match(/^https?:\/\//i) ? trimmed : `https://${trimmed}`;
    const url = new URL(urlString);
    const host = url.hostname.toLowerCase();

    // youtu.be/VIDEO_ID
    if (host === "youtu.be" || host.endsWith(".youtu.be")) {
      const pathname = url.pathname.replace(/^\/+/, "");
      const videoId = pathname.split("/")[0];
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }

    // youtube.com / m.youtube.com / youtube-nocookie.com
    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      // /watch?v=VIDEO_ID
      if (url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return videoId;
        }
      }

      // /embed/VIDEO_ID or /shorts/VIDEO_ID or /v/VIDEO_ID
      const match = url.pathname.match(/^\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch {
    // Fall back to regex if URL construction fails
  }

  // 3. Fallback Regex
  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

/**
 * Returns clean 16:9 embeddable YouTube URL for iframe src.
 */
export function getYouTubeEmbedUrl(input: string | null | undefined): string | null {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Returns true if the input string is a valid YouTube URL or raw YouTube video ID.
 */
export function isYouTubeUrl(input: string | null | undefined): boolean {
  return extractYouTubeVideoId(input) !== null;
}
