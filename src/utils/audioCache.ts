/**
 * Client-side caching mechanism for generated TTS audio
 * Prevents redundant API calls and preserves quota when replaying or re-testing identical speech prompts.
 */

export interface CachedSpeechItem {
  key: string;
  audioBase64: string;
  durationSec: number;
  voice: string;
  text: string;
  timestamp: number;
}

const MEMORY_CACHE = new Map<string, CachedSpeechItem>();
const CACHE_PREFIX = 'tts_cache_';
const MAX_CACHE_ENTRIES = 20; // Keep local storage bounded

function generateCacheKey(
  text: string,
  voice: string,
  emotionId: string,
  intensity: string,
  dialect: string,
  instruction = ''
): string {
  const normText = text.trim().replace(/\s+/g, ' ');
  const rawKey = `${voice}_${emotionId}_${intensity}_${dialect}_${instruction}_${normText}`;
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < rawKey.length; i++) {
    hash = (hash << 5) - hash + rawKey.charCodeAt(i);
    hash |= 0;
  }
  return `${CACHE_PREFIX}${Math.abs(hash).toString(36)}`;
}

export function getCachedAudio(
  text: string,
  voice: string,
  emotionId: string,
  intensity: string,
  dialect: string,
  instruction = ''
): CachedSpeechItem | null {
  const key = generateCacheKey(text, voice, emotionId, intensity, dialect, instruction);

  // 1. Check in-memory map
  if (MEMORY_CACHE.has(key)) {
    return MEMORY_CACHE.get(key) || null;
  }

  // 2. Check sessionStorage
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const item: CachedSpeechItem = JSON.parse(raw);
      MEMORY_CACHE.set(key, item);
      return item;
    }
  } catch (_e) {
    // sessionStorage might be disabled or full
  }

  return null;
}

export function saveCachedAudio(
  text: string,
  voice: string,
  emotionId: string,
  intensity: string,
  dialect: string,
  audioBase64: string,
  durationSec: number,
  instruction = ''
): void {
  const key = generateCacheKey(text, voice, emotionId, intensity, dialect, instruction);
  const item: CachedSpeechItem = {
    key,
    audioBase64,
    durationSec,
    voice,
    text: text.trim(),
    timestamp: Date.now(),
  };

  MEMORY_CACHE.set(key, item);

  try {
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch (_e) {
    // Evict oldest entries if storage is full
    try {
      const allKeys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          allKeys.push(k);
        }
      }
      if (allKeys.length > MAX_CACHE_ENTRIES) {
        // Remove half of the oldest entries
        for (let i = 0; i < Math.floor(allKeys.length / 2); i++) {
          sessionStorage.removeItem(allKeys[i]);
        }
        sessionStorage.setItem(key, JSON.stringify(item));
      }
    } catch {
      // Ignore storage errors gracefully
    }
  }
}
