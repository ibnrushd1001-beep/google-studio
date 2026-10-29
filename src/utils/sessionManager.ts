import {
  VoiceName,
  EgyptianDialect,
  EmotionIntensity,
  ReverbEnvironment,
  DramaticDeliveryStyle,
  GeneratedSpeech,
  VoiceCustomization,
} from '../types';

export const SESSION_STORAGE_KEY = 'tts_last_session_state';

export interface SavedSpeechData {
  id: string;
  text: string;
  voice: VoiceName;
  voiceDisplayName?: string;
  styleLabel?: string;
  dialectLabel?: string;
  reverbEnvironment?: ReverbEnvironment;
  reverbLevel?: number;
  audioBase64?: string;
  durationSec?: number;
  createdAt?: number;
  deliveryStyle?: DramaticDeliveryStyle;
  deliveryStyleLabel?: string;
  emotionId?: string;
  emotionLabel?: string;
  intensity?: EmotionIntensity;
  intensityLabel?: string;
  pitchLabel?: string;
  paceLabel?: string;
}

export interface LastSessionState {
  text: string;
  selectedVoiceId: string;
  currentDialect: EgyptianDialect;
  deliveryStyle: DramaticDeliveryStyle;
  selectedEmotionId: string;
  selectedIntensity: EmotionIntensity;
  selectedReverbEnv: ReverbEnvironment;
  selectedReverbLevel: number;
  activeMode: 'solo' | 'compare' | 'batch';
  isRtl: boolean;
  isDirectivesOpen?: boolean;
  isVoiceMenuOpen?: boolean;
  isStyleMenuOpen?: boolean;
  lastSpeech?: SavedSpeechData | null;
  savedAt: number;
}

/**
 * Loads the previous session configuration from localStorage.
 */
export function loadLastSession(): Partial<LastSessionState> | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.warn('Could not read last session from localStorage:', err);
    return null;
  }
}

/**
 * Saves current session configuration to localStorage.
 * Handles storage quota limits gracefully by shedding raw audio bytes if needed
 * while always guaranteeing that all user settings & text are preserved.
 */
export function saveLastSession(state: LastSessionState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(SESSION_STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('LocalStorage save failed, attempting quota-safe fallback:', err);
    try {
      // Fallback: strip big audio payload and re-save user configuration
      const fallbackState: LastSessionState = {
        ...state,
        lastSpeech: state.lastSpeech
          ? {
              ...state.lastSpeech,
              audioBase64: undefined, // Strip large base64 payload to fit storage
            }
          : null,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallbackState));
    } catch (fallbackErr) {
      console.warn('Failed to save even stripped session settings:', fallbackErr);
    }
  }
}

/**
 * Clears the saved session from localStorage.
 */
export function clearLastSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear last session from localStorage:', err);
  }
}

/**
 * Check if a valid last session exists in storage.
 */
export function hasLastSession(): boolean {
  try {
    return Boolean(localStorage.getItem(SESSION_STORAGE_KEY));
  } catch {
    return false;
  }
}
