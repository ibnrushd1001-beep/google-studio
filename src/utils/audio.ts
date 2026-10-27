import { ReverbEnvironment, GeneratedSpeech } from '../types';
import { REVERB_ENVIRONMENTS } from './dramaticVoice';

/**
 * Audio helpers for Text-to-Speech playback, download, waveform synthesis,
 * and high-fidelity Web Audio acoustic reverb processing.
 */

export function base64ToBlob(base64: string, mimeType = 'audio/wav'): Blob {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export interface AudioFilenameOptions {
  isReverbEnabled?: boolean;
  reverbEnvironment?: ReverbEnvironment;
  reverbLevel?: number;
  extension?: string;
}

/**
 * Generates an informative, structured, human-readable filename in Arabic/English
 * that clearly indicates all voice selections, dialect, dramatic delivery style, emotion, intensity, and acoustic environment.
 * Example in Arabic:
 * صوت_مريم_لهجة_مصرية_قاهرية_تمثيل_مسرحي_درامي_مندهش_متوسط_استوديو_معزول_يا_فتاح_يا_20261027_1435.wav
 */
export function generateDescriptiveAudioFilename(
  speech: Partial<GeneratedSpeech> & {
    voice?: string;
    voiceDisplayName?: string;
    dialectLabel?: string;
    styleLabel?: string;
    deliveryStyleLabel?: string;
    emotionLabel?: string;
    intensityLabel?: string;
    pitchLabel?: string;
    paceLabel?: string;
    text?: string;
    createdAt?: number;
    reverbEnvironment?: ReverbEnvironment;
    reverbLevel?: number;
  },
  options?: AudioFilenameOptions
): string {
  // Cleans string to be valid filename across all OSes (Windows, Mac, Linux, Android)
  const sanitize = (val?: string, maxLen = 30): string => {
    if (!val) return '';
    return val
      .replace(/[\(\)\[\]\{\}«»""''،,.:;!؟?\/\\|*<>~`#@$%^&+=]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .slice(0, maxLen);
  };

  const parts: string[] = [];

  // 1. Voice name (e.g. صوت_مريم_شابة or Voice_Mariam)
  const voiceRaw = speech.voiceDisplayName || speech.voice || 'صوت';
  const cleanVoice = sanitize(voiceRaw.split('(')[0].trim(), 22) || 'صوت';
  parts.push(
    cleanVoice.startsWith('صوت') || cleanVoice.startsWith('Voice')
      ? cleanVoice
      : `صوت_${cleanVoice}`
  );

  // 2. Dialect (e.g. لهجة_مصرية_قاهرية or لهجة_إسكندرانية)
  if (speech.dialectLabel) {
    const cleanDialect = sanitize(speech.dialectLabel, 22);
    if (cleanDialect) {
      parts.push(cleanDialect.includes('لهجة') ? cleanDialect : `لهجة_${cleanDialect}`);
    }
  }

  // 3. Delivery Style / Performance (e.g. تمثيل_مسرحي_درامي or حوار_عفوي or دبلجة_كرتون)
  if (speech.deliveryStyleLabel) {
    const cleanDelivery = sanitize(speech.deliveryStyleLabel, 24);
    if (cleanDelivery) parts.push(cleanDelivery);
  }

  // 4. Emotion & Intensity (e.g. مندهش_متوسط or حماسي_عالي)
  if (speech.emotionLabel) {
    const cleanEmotion = sanitize(speech.emotionLabel, 16);
    const cleanIntensity = speech.intensityLabel ? sanitize(speech.intensityLabel, 12) : '';
    parts.push(cleanIntensity ? `${cleanEmotion}_${cleanIntensity}` : cleanEmotion);
  } else if (speech.styleLabel) {
    const cleanStyle = sanitize(speech.styleLabel, 25);
    if (cleanStyle) parts.push(cleanStyle);
  }

  // 5. Pitch or Pace if non-default
  if (speech.pitchLabel && !speech.pitchLabel.includes('متوسط') && !speech.pitchLabel.includes('Medium')) {
    const cleanPitch = sanitize(speech.pitchLabel, 15);
    if (cleanPitch) parts.push(cleanPitch);
  }

  // 6. Acoustic Reverb Environment
  const isRev =
    options?.isReverbEnabled ??
    Boolean(speech.reverbEnvironment && speech.reverbEnvironment !== 'dry_studio' && (speech.reverbLevel ?? 0) > 0);
  const envKey = options?.reverbEnvironment || speech.reverbEnvironment || 'dry_studio';
  const level = options?.reverbLevel ?? speech.reverbLevel ?? 0;

  if (isRev && envKey !== 'dry_studio' && level > 0) {
    const envObj = REVERB_ENVIRONMENTS[envKey];
    const envName = envObj ? sanitize(envObj.arabicLabel.split('(')[0].trim(), 15) : envKey;
    parts.push(`صدى_${envName}_${level}pct`);
  } else {
    parts.push('استوديو_معزول');
  }

  // 7. Script text excerpt (first 3 words, max 22 chars)
  if (speech.text) {
    const words = speech.text
      .replace(/[\(\)\[\]\{\}«»""''،,.:;!؟?\/\\|*<>~`#@$%^&+=]/g, ' ')
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join('_');
    const cleanSnippet = sanitize(words, 22);
    if (cleanSnippet) parts.push(cleanSnippet);
  }

  // 8. Timestamp (YYYYMMDD_HHmm)
  const d = speech.createdAt ? new Date(speech.createdAt) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  parts.push(`${year}${month}${day}_${hours}${mins}`);

  const ext = options?.extension || 'wav';
  return `${parts.filter(Boolean).join('_')}.${ext}`;
}

export function downloadAudioFile(base64: string, filename = 'speech.wav') {
  const blob = base64ToBlob(base64, 'audio/wav');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function downloadBlobFile(blob: Blob, filename = 'speech.wav') {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Generate visual waveform bars representation
 */
export function generateWaveformPattern(count = 42, seed = 12): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    // Generate organic-looking speech pattern (higher in middle, varied speech cadence)
    const norm = i / count;
    const envelope = Math.sin(norm * Math.PI);
    const noise = Math.abs(Math.sin((i + 1) * seed * 1.7) * 0.4 + Math.cos(i * 0.8) * 0.3);
    const height = Math.max(0.15, Math.min(1.0, envelope * (0.4 + noise * 0.6)));
    bars.push(height);
  }
  return bars;
}

/**
 * Format duration in seconds to M:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Synthesize a natural stereo impulse response for Web Audio ConvolverNode
 */
export function createReverbImpulseBuffer(
  ctx: BaseAudioContext,
  duration = 2.0,
  decay = 2.0
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(128, Math.floor(sampleRate * duration));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const norm = i / length;
    const envelope = Math.pow(1 - norm, decay);

    // Early reflections cluster for room boundary realism
    const earlyTime = i / sampleRate;
    const isEarly = earlyTime < 0.06;
    const earlyBounce = isEarly ? (Math.random() * 2 - 1) * 0.6 : 0;

    // Diffuse reverberation tail
    const diffuseL = (Math.random() * 2 - 1) * envelope;
    const diffuseR = (Math.random() * 2 - 1) * envelope;

    left[i] = diffuseL + earlyBounce * envelope;
    right[i] = diffuseR + earlyBounce * envelope;
  }
  return impulse;
}

/**
 * Convert standard AudioBuffer to 16-bit PCM WAV Blob
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Interleave audio channels
  let offset = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Process audio with real-time acoustic convolution reverb via OfflineAudioContext
 */
export async function applyReverbToAudioBlob(
  blob: Blob,
  env: ReverbEnvironment,
  level: number
): Promise<Blob> {
  if (env === 'dry_studio' || level <= 0) {
    return blob;
  }

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return blob;

    const tempCtx = new AudioContextClass();
    const decodedBuffer = await tempCtx.decodeAudioData(arrayBuffer);
    await tempCtx.close();

    const envInfo = REVERB_ENVIRONMENTS[env] || REVERB_ENVIRONMENTS.small_room;
    const duration = decodedBuffer.duration + envInfo.impulseDuration;
    const sampleRate = decodedBuffer.sampleRate;

    const offlineCtx = new OfflineAudioContext(
      2,
      Math.ceil(sampleRate * duration),
      sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = decodedBuffer;

    const convolver = offlineCtx.createConvolver();
    convolver.buffer = createReverbImpulseBuffer(
      offlineCtx,
      envInfo.impulseDuration,
      envInfo.impulseDecay
    );

    const wetGain = offlineCtx.createGain();
    const dryGain = offlineCtx.createGain();

    // Scale wet mix according to level (0% -> 0, 100% -> 0.85)
    const wetVal = (level / 100) * 0.85;
    const dryVal = Math.max(0.25, 1 - (level / 100) * 0.45);

    wetGain.gain.value = wetVal;
    dryGain.gain.value = dryVal;

    // Connect audio signal paths
    source.connect(dryGain);
    dryGain.connect(offlineCtx.destination);

    source.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(offlineCtx.destination);

    source.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWav(renderedBuffer);
  } catch (err) {
    console.warn('Reverb offline processing fallback:', err);
    return blob;
  }
}

/**
 * Play a fast, pleasant acoustic test audition tone in browser Web Audio
 * so users can hear the acoustic response of the chosen room environment and level immediately.
 */
let previewAudioContext: AudioContext | null = null;

export function playReverbPreviewTone(env: ReverbEnvironment, level: number): void {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!previewAudioContext || previewAudioContext.state === 'closed') {
      previewAudioContext = new AudioContextClass();
    }
    const ctx = previewAudioContext;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const envInfo = REVERB_ENVIRONMENTS[env] || REVERB_ENVIRONMENTS.dry_studio;
    const now = ctx.currentTime;

    // Output destination gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.28;
    masterGain.connect(ctx.destination);

    // Convolver & wet/dry nodes
    const convolver = ctx.createConvolver();
    const isDry = env === 'dry_studio' || level <= 0;
    if (!isDry) {
      convolver.buffer = createReverbImpulseBuffer(
        ctx,
        envInfo.impulseDuration,
        envInfo.impulseDecay
      );
    }

    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();

    const wetVal = isDry ? 0 : (level / 100) * 0.9;
    const dryVal = isDry ? 1.0 : Math.max(0.2, 1 - (level / 100) * 0.4);

    dryGain.gain.value = dryVal;
    wetGain.gain.value = wetVal;

    dryGain.connect(masterGain);
    convolver.connect(wetGain);
    wetGain.connect(masterGain);

    // Warm Egyptian-scale micro-melody chords (D4 - F#4 - A4 - D5)
    const notes = [
      { freq: 293.66, delay: 0.0, dur: 0.35 }, // D4
      { freq: 369.99, delay: 0.16, dur: 0.35 }, // F#4
      { freq: 440.00, delay: 0.32, dur: 0.4 }, // A4
      { freq: 587.33, delay: 0.48, dur: 0.65 }, // D5
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      // Formant filtering for warm human-like acoustic timbre
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
      filter.Q.value = 2.0;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.delay);

      const startTime = now + note.delay;
      const endTime = startTime + note.dur;

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc.connect(filter);
      filter.connect(noteGain);

      noteGain.connect(dryGain);
      if (!isDry) {
        noteGain.connect(convolver);
      }

      osc.start(startTime);
      osc.stop(endTime + 0.05);
    });
  } catch (e) {
    console.warn('Could not play reverb audition sound:', e);
  }
}
