import React, { useEffect, useRef, useState } from 'react';
import { GeneratedSpeech, ReverbEnvironment, VocalAnalysisResult } from '../types';
import {
  Play,
  Pause,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Check,
  FastForward,
  Waves,
  Radio,
  Home,
  Theater,
  Sparkles,
  Sliders,
  Activity,
} from 'lucide-react';
import { VocalAnalysisPopover } from './VocalAnalysisPopover';
import {
  downloadAudioFile,
  downloadBlobFile,
  formatTime,
  generateWaveformPattern,
  base64ToBlob,
  applyReverbToAudioBlob,
  generateDescriptiveAudioFilename,
} from '../utils/audio';
import {
  REVERB_ENVIRONMENTS,
  REVERB_ENVIRONMENTS_LIST,
  REVERB_LEVEL_PRESETS,
} from '../utils/dramaticVoice';

interface AudioPlayerCardProps {
  speech: GeneratedSpeech;
  isRtl: boolean;
}

export const AudioPlayerCard: React.FC<AudioPlayerCardProps> = ({ speech, isRtl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(speech.durationSec || 0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [waveform] = useState(() => generateWaveformPattern(48, speech.text.length));

  // Reverb simulation state
  const initialEnv: ReverbEnvironment = speech.reverbEnvironment || 'dry_studio';
  const initialLevel: number =
    speech.reverbLevel !== undefined
      ? speech.reverbLevel
      : initialEnv === 'dry_studio'
      ? 0
      : REVERB_ENVIRONMENTS[initialEnv]?.defaultLevel || 35;

  const [activeEnv, setActiveEnv] = useState<ReverbEnvironment>(initialEnv);
  const [activeLevel, setActiveLevel] = useState<number>(initialLevel);
  const [isReverbEnabled, setIsReverbEnabled] = useState<boolean>(
    initialEnv !== 'dry_studio' && initialLevel > 0
  );
  const [effectiveAudioUrl, setEffectiveAudioUrl] = useState<string>(speech.audioUrl);
  const [processedReverbBlob, setProcessedReverbBlob] = useState<Blob | null>(null);
  const [isProcessingReverb, setIsProcessingReverb] = useState<boolean>(false);
  const [showReverbLab, setShowReverbLab] = useState<boolean>(false);

  // Vocal Analysis Popover State
  const [isAnalysisOpen, setIsAnalysisOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VocalAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [lastAnalyzedId, setLastAnalyzedId] = useState<string | null>(null);

  // Sync state whenever new speech is generated
  useEffect(() => {
    const nextEnv: ReverbEnvironment = speech.reverbEnvironment || 'dry_studio';
    const nextLevel: number =
      speech.reverbLevel !== undefined
        ? speech.reverbLevel
        : nextEnv === 'dry_studio'
        ? 0
        : REVERB_ENVIRONMENTS[nextEnv]?.defaultLevel || 35;

    setActiveEnv(nextEnv);
    setActiveLevel(nextLevel);
    const hasReverb = nextEnv !== 'dry_studio' && nextLevel > 0;
    setIsReverbEnabled(hasReverb);

    // Reset playback
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(speech.durationSec || 0);

    // Close analysis popover for newly generated speech unless same id
    if (lastAnalyzedId !== speech.id) {
      setIsAnalysisOpen(false);
      setAnalysisResult(null);
      setAnalysisError(null);
    }

    if (!hasReverb) {
      setEffectiveAudioUrl(speech.audioUrl);
      setProcessedReverbBlob(null);
    } else {
      // Process reverb immediately
      setIsProcessingReverb(true);
      const rawBlob = base64ToBlob(speech.audioBase64, 'audio/wav');
      applyReverbToAudioBlob(rawBlob, nextEnv, nextLevel)
        .then((reverbBlob) => {
          setProcessedReverbBlob(reverbBlob);
          const revUrl = URL.createObjectURL(reverbBlob);
          setEffectiveAudioUrl(revUrl);
        })
        .catch(() => {
          setEffectiveAudioUrl(speech.audioUrl);
        })
        .finally(() => {
          setIsProcessingReverb(false);
        });
    }
  }, [speech.id, speech.audioUrl, speech.reverbEnvironment, speech.reverbLevel]);

  // Perform vocal analysis via Gemini multimodal audio model
  const fetchVocalAnalysis = async () => {
    if (!speech.audioBase64) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/voice/analyze-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBase64: speech.audioBase64,
          mimeType: 'audio/wav',
          text: speech.text,
          voice: speech.voiceDisplayName || speech.voice,
          emotion: speech.emotionLabel || speech.styleLabel || '',
          intensity: speech.intensityLabel || '',
          deliveryStyle: speech.deliveryStyleLabel || speech.deliveryStyle || '',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze vocal audio.');
      }

      setAnalysisResult(data.analysis);
      setLastAnalyzedId(speech.id);
    } catch (err: any) {
      console.error('Vocal analysis error:', err);
      setAnalysisError(err?.message || (isRtl ? 'تعذر تحليل خصائص الصوت حالياً.' : 'Failed to analyze voice characteristics.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleVocalAnalysis = () => {
    if (isAnalysisOpen) {
      setIsAnalysisOpen(false);
      return;
    }
    setIsAnalysisOpen(true);
    if (!analysisResult || lastAnalyzedId !== speech.id) {
      fetchVocalAnalysis();
    }
  };

  // Handle re-processing when user changes reverb parameters live in the player
  const recomputeReverb = async (env: ReverbEnvironment, level: number, enabled: boolean) => {
    if (!enabled || env === 'dry_studio' || level <= 0) {
      setEffectiveAudioUrl(speech.audioUrl);
      setProcessedReverbBlob(null);
      return;
    }

    setIsProcessingReverb(true);
    try {
      const rawBlob = base64ToBlob(speech.audioBase64, 'audio/wav');
      const revBlob = await applyReverbToAudioBlob(rawBlob, env, level);
      setProcessedReverbBlob(revBlob);
      const revUrl = URL.createObjectURL(revBlob);
      setEffectiveAudioUrl(revUrl);

      // Preserve current playback time if playing
      if (audioRef.current) {
        audioRef.current.src = revUrl;
        audioRef.current.currentTime = currentTime;
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Live reverb calculation error:', e);
      setEffectiveAudioUrl(speech.audioUrl);
    } finally {
      setIsProcessingReverb(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleSpeedCycle = () => {
    // 4 higher speeds above 1x: 1.25x (Lv1), 1.5x (Lv2), 1.75x (Lv3), 2.0x (Lv4 highest)
    const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(speech.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const descriptiveFilename = generateDescriptiveAudioFilename(speech, {
    isReverbEnabled,
    reverbEnvironment: activeEnv,
    reverbLevel: activeLevel,
  });

  const handleDownload = () => {
    if (isReverbEnabled && processedReverbBlob) {
      downloadBlobFile(processedReverbBlob, descriptiveFilename);
    } else {
      downloadAudioFile(speech.audioBase64, descriptiveFilename);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-3xl border border-[#E5E1D8] bg-white p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
      {/* Decorative Natural Ambient Circle */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#CB997E]/10 rounded-full -mr-16 -mt-16 pointer-events-none" />

      <audio
        ref={audioRef}
        src={effectiveAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      {/* Spoken Text & Metadata Display */}
      <div className="space-y-3 relative">
        <div className="flex items-center justify-between text-xs text-[#A5A58D] font-medium flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 font-bold text-[#B07D62] bg-[#CB997E]/20 px-3 py-1 rounded-md text-xs">
              {speech.voiceDisplayName || speech.voice}
            </span>

            {speech.dialectLabel && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EDE9E1] text-[#6B705C]">
                {speech.dialectLabel}
              </span>
            )}

            {speech.styleLabel && (
              <span className="text-[#7D786E] font-medium text-xs">• {speech.styleLabel}</span>
            )}

            {/* Recording Environment Badge */}
            {activeEnv === 'dry_studio' || !isReverbEnabled ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#6B705C]/15 text-[#5B604C] font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3" />
                <span>{isRtl ? 'استوديو مغلق معزول (جاف)' : 'Closed Studio (Dry)'}</span>
              </span>
            ) : activeEnv === 'small_room' ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 font-semibold flex items-center gap-1 shadow-2xs">
                <Home className="w-3 h-3" />
                <span>
                  {isRtl ? `غرفة صغيرة (صدى ${activeLevel}%)` : `Small Room (${activeLevel}%)`}
                </span>
              </span>
            ) : activeEnv === 'grand_theater' ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200/80 font-semibold flex items-center gap-1 shadow-2xs">
                <Theater className="w-3 h-3" />
                <span>
                  {isRtl ? `مسرح كبير (صدى ${activeLevel}%)` : `Grand Theater (${activeLevel}%)`}
                </span>
              </span>
            ) : (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200/80 font-semibold flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>
                  {isRtl ? `فضاء سينمائي (صدى ${activeLevel}%)` : `Vast Space (${activeLevel}%)`}
                </span>
              </span>
            )}

            {isProcessingReverb && (
              <span className="text-[10px] text-[#BC6C25] font-bold animate-pulse">
                {isRtl ? 'جارٍ تطبيق الصدى...' : 'Processing Reverb...'}
              </span>
            )}
          </div>

          <span className="font-semibold text-[#7D786E]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <blockquote
          className="text-xl sm:text-2xl lg:text-3xl font-serif-display italic text-[#4A4A4A] leading-relaxed"
          dir={isRtl ? 'rtl' : 'auto'}
        >
          "{speech.text}"
        </blockquote>
      </div>

      {/* Waveform Visualizer */}
      <div
        className="relative h-16 bg-[#EDE9E1]/80 rounded-2xl p-3 flex items-end justify-between gap-1 cursor-pointer overflow-hidden border border-[#DCD7CC]"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetTime = ratio * duration;
          if (audioRef.current) {
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
          }
        }}
      >
        {waveform.map((val, idx) => {
          const barPercent = (idx / waveform.length) * 100;
          const isPassed = barPercent <= progressPercent;
          return (
            <div
              key={idx}
              className={`w-full rounded-full transition-all duration-75 ${
                isPassed ? 'bg-[#6B705C]' : 'bg-[#A5A58D]/40'
              }`}
              style={{
                height: `${Math.max(14, val * 100)}%`,
                transform: isPlaying && isPassed ? 'scaleY(1.06)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Scrubbing Bar */}
      <div className="relative">
        <input
          id="audio-scrub-slider"
          type="range"
          min="0"
          max={duration || 100}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-[#DCD7CC] rounded-lg appearance-none cursor-pointer accent-[#6B705C]"
          aria-label="Audio scrubber"
        />
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            id="play-pause-btn"
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#6B705C] hover:bg-[#5B604C] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white stroke-white" />
            ) : (
              <Play className="w-5 h-5 fill-white stroke-white translate-x-0.5" />
            )}
          </button>

          {/* Replay 0s */}
          <button
            id="replay-btn"
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }}
            className="w-9 h-9 rounded-full border border-[#DCD7CC] hover:bg-[#EDE9E1] text-[#43413E] flex items-center justify-center transition-colors cursor-pointer"
            title={isRtl ? 'إعادة من البداية' : 'Replay from start'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Toggle */}
          <button
            id="playback-speed-btn"
            type="button"
            onClick={handleSpeedCycle}
            className="px-3 h-9 rounded-full border border-[#DCD7CC] hover:bg-[#EDE9E1] text-[#43413E] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title={isRtl ? 'سرعة التشغيل' : 'Playback speed'}
          >
            <FastForward className="w-3.5 h-3.5 text-[#A5A58D]" />
            <span>{playbackRate}x</span>
          </button>

          {/* Mute Toggle */}
          <button
            id="mute-btn"
            type="button"
            onClick={toggleMute}
            className="w-9 h-9 rounded-full border border-[#DCD7CC] hover:bg-[#EDE9E1] text-[#43413E] flex items-center justify-center transition-colors cursor-pointer"
            title={isMuted ? 'إلغاء الكتم' : 'كتم'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#B07D62]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#6B705C]" />
            )}
          </button>

          {/* Reverb Toggle / Quick Switcher Button */}
          <button
            type="button"
            onClick={() => setShowReverbLab(!showReverbLab)}
            className={`px-3 h-9 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showReverbLab
                ? 'bg-[#6B705C] text-white border-[#6B705C]'
                : isReverbEnabled
                ? 'bg-[#6B705C]/10 text-[#6B705C] border-[#6B705C]/40'
                : 'border-[#DCD7CC] text-[#7D786E] hover:bg-[#EDE9E1]'
            }`}
            title={isRtl ? 'التحكم في صدى الصوت وبيئة التسجيل' : 'Reverb & Acoustics Lab'}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{isRtl ? 'صدى الصوت (Reverb)' : 'Reverb'}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-black/10">
              {isReverbEnabled ? `${activeLevel}%` : 'Dry'}
            </span>
          </button>
        </div>

        {/* Action Buttons: Vocal Analysis, Copy & Download */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Vocal Analysis Trigger Button */}
          <button
            id="vocal-analysis-btn"
            type="button"
            onClick={handleToggleVocalAnalysis}
            className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isAnalysisOpen
                ? 'bg-[#C86446] text-white border-[#C86446] ring-2 ring-[#C86446]/25'
                : 'bg-white hover:bg-[#FAF8F5] border-[#C86446]/40 hover:border-[#C86446] text-[#C86446]'
            }`}
            title={isRtl ? 'تحليل الخصائص الصوتية ونقاء النبرة بذكاء Gemini' : 'AI Vocal Characteristics Analysis with Gemini'}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تحليل خصائص الصوت ✨' : 'Vocal Analysis ✨'}</span>
            {isAnalyzing && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            id="copy-text-btn"
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full border border-[#DCD7CC] hover:bg-[#EDE9E1] text-[#43413E] text-xs font-semibold transition-colors cursor-pointer"
            title={isRtl ? 'نسخ النص' : 'Copy text'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#6B705C]" />
                <span className="text-[#6B705C]">{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#A5A58D]" />
                <span>{isRtl ? 'نسخ النص' : 'Copy'}</span>
              </>
            )}
          </button>

          <div className="flex flex-col items-end gap-1">
            <button
              id="download-wav-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-[#6B705C] hover:bg-[#5B604C] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title={
                isRtl
                  ? `حفظ بصيغة WAV باسم يوضح الصوت والأداء:\n${descriptiveFilename}`
                  : `Save WAV with voice & performance details:\n${descriptiveFilename}`
              }
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isReverbEnabled
                  ? isRtl ? `تحميل WAV (${activeLevel}% صدى)` : `Download WAV (${activeLevel}%)`
                  : isRtl ? 'تحميل WAV' : 'Download WAV'}
              </span>
            </button>
            <span
              className="text-[10px] text-[#A5A58D] font-mono max-w-[200px] sm:max-w-[320px] truncate select-all"
              title={descriptiveFilename}
              dir="ltr"
            >
              📄 {descriptiveFilename}
            </span>
          </div>
        </div>
      </div>

      {/* Vocal Analysis Popover (التحليل الصوتي المتقدم مع نموذج Gemini) */}
      <VocalAnalysisPopover
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        isLoading={isAnalyzing}
        analysis={analysisResult}
        errorMessage={analysisError}
        onReanalyze={fetchVocalAnalysis}
        isRtl={isRtl}
      />

      {/* Expandable Live Acoustic Reverb Tray */}
      {showReverbLab && (
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-3 pt-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#6B705C]" />
              <span className="font-bold text-xs text-[#43413E]">
                {isRtl
                  ? 'محاكاة بيئة التسجيل وصدى الصوت (Reverb Environment Simulator)'
                  : 'Reverb Recording Environment Simulator'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Reverb ON / OFF */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !isReverbEnabled;
                  setIsReverbEnabled(nextState);
                  recomputeReverb(activeEnv, activeLevel, nextState);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isReverbEnabled
                    ? 'bg-[#6B705C] text-white shadow-2xs'
                    : 'bg-white border border-[#DCD7CC] text-[#7D786E]'
                }`}
              >
                {isReverbEnabled
                  ? isRtl ? '✓ الصدى مُفعل' : 'Reverb Active'
                  : isRtl ? 'تفعيل الصدى' : 'Enable Reverb'}
              </button>
            </div>
          </div>

          {/* Quick Environment Buttons in Player */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {REVERB_ENVIRONMENTS_LIST.map((env) => {
              const isMatch = activeEnv === env.id;
              const IconComp =
                env.id === 'dry_studio'
                  ? Radio
                  : env.id === 'small_room'
                  ? Home
                  : env.id === 'grand_theater'
                  ? Theater
                  : Sparkles;

              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => {
                    setActiveEnv(env.id);
                    const newLevel = env.id === 'dry_studio' ? 0 : (activeLevel === 0 ? env.defaultLevel : activeLevel);
                    setActiveLevel(newLevel);
                    const shouldEnable = env.id !== 'dry_studio';
                    setIsReverbEnabled(shouldEnable);
                    recomputeReverb(env.id, newLevel, shouldEnable);
                  }}
                  className={`p-2 rounded-xl border text-start transition-all cursor-pointer ${
                    isMatch
                      ? 'border-[#6B705C] bg-[#6B705C]/15 text-[#5B604C] font-bold ring-1 ring-[#6B705C]/30'
                      : 'border-[#E5E1D8] bg-white text-[#7D786E] hover:bg-[#EDE9E1]/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <IconComp className="w-3.5 h-3.5 text-[#6B705C]" />
                    <span className="truncate">
                      {isRtl ? env.arabicLabel.split('(')[0] : env.label.split('(')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reverb Slider in Player */}
          <div className="space-y-1.5 pt-1 border-t border-[#EDE9E1]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#7D786E] font-medium">
                {isRtl ? 'مستوى الارتداد والصدى (Wet Level):' : 'Reverb Wet Intensity:'}
              </span>
              <span className="font-bold text-[#6B705C] font-mono">{activeLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={activeLevel}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setActiveLevel(val);
                const nextEnv = val === 0 ? 'dry_studio' : (activeEnv === 'dry_studio' ? 'small_room' : activeEnv);
                if (nextEnv !== activeEnv) setActiveEnv(nextEnv);
                const shouldEnable = val > 0;
                setIsReverbEnabled(shouldEnable);
                recomputeReverb(nextEnv, val, shouldEnable);
              }}
              className="w-full h-1.5 bg-[#DCD7CC] rounded-lg appearance-none cursor-pointer accent-[#6B705C]"
              aria-label="Reverb intensity"
            />
          </div>
        </div>
      )}
    </div>
  );
};
