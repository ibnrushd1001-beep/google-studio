import React, { useState, useRef } from 'react';
import {
  VoiceOption,
  EmotionCategory,
  EmotionIntensity,
  EgyptianDialect,
  VoiceCustomization,
  DialogueLine,
} from '../types';
import { DIALOGUE_PRESETS } from '../data';
import { InlineTagsBar } from './InlineTagsBar';
import { generateDramaticInstruction } from '../utils/dramaticVoice';
import { getCachedAudio, saveCachedAudio } from '../utils/audioCache';
import {
  Users,
  Plus,
  Trash2,
  Copy,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Volume2,
  Layers,
  ChevronDown,
  Square,
  Zap,
} from 'lucide-react';

interface DialogueScriptEditorProps {
  voices: VoiceOption[];
  emotionCategories: EmotionCategory[];
  currentDialect: EgyptianDialect;
  onDialectChange: (dialect: EgyptianDialect) => void;
}

export const DialogueScriptEditor: React.FC<DialogueScriptEditorProps> = ({
  voices,
  emotionCategories,
  currentDialect,
  onDialectChange,
}) => {
  // Initialize with the first dialogue preset
  const defaultPreset = DIALOGUE_PRESETS[0];

  const createInitialLines = (): DialogueLine[] => {
    const speaker1Voice = voices[0] || { id: 'egyptian_girl_clip', baseVoice: 'Zephyr', name: 'Nada', arabicName: 'ندى (10-12 سنة)', gender: 'female' };
    const speaker2Voice = voices[1] || voices[0] || { id: 'egyptian_boy_clip', baseVoice: 'Puck', name: 'Adham', arabicName: 'أدهم (10-12 سنة)', gender: 'male' };

    return defaultPreset.lines.map((l, index) => {
      const v = l.speakerRole === 'speaker1' ? speaker1Voice : speaker2Voice;
      return {
        id: `line_${Date.now()}_${index}`,
        speakerVoiceId: v.id,
        speakerName: v.name,
        speakerArabicName: v.arabicName,
        baseVoice: v.baseVoice,
        gender: v.gender,
        emotionId: l.emotionId,
        emotionIntensity: l.emotionIntensity,
        text: l.text,
        status: 'idle',
      };
    });
  };

  const [lines, setLines] = useState<DialogueLine[]>(createInitialLines);
  const [sceneTitle, setSceneTitle] = useState<string>(defaultPreset.arabicTitle);
  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);
  const [generatingProgress, setGeneratingProgress] = useState<string>('');
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [mergedDuration, setMergedDuration] = useState<number>(0);
  const [isPlayingScene, setIsPlayingScene] = useState<boolean>(false);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const sceneAudioRef = useRef<HTMLAudioElement | null>(null);
  const singleAudioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Load a preset script
  const handleLoadPreset = (presetId: string) => {
    const preset = DIALOGUE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSceneTitle(preset.arabicTitle);
    const speaker1Voice = voices[0];
    const speaker2Voice = voices[1] || voices[0];

    const newLines: DialogueLine[] = preset.lines.map((l, idx) => {
      const v = l.speakerRole === 'speaker1' ? speaker1Voice : speaker2Voice;
      return {
        id: `line_${Date.now()}_${idx}`,
        speakerVoiceId: v.id,
        speakerName: v.name,
        speakerArabicName: v.arabicName,
        baseVoice: v.baseVoice,
        gender: v.gender,
        emotionId: l.emotionId,
        emotionIntensity: l.emotionIntensity,
        text: l.text,
        status: 'idle',
      };
    });

    setLines(newLines);
    setMergedAudioUrl(null);
  };

  // Add line
  const handleAddLine = () => {
    // Pick the alternative speaker from the last line
    const lastLine = lines[lines.length - 1];
    let nextVoice = voices[0];
    if (lastLine && voices.length > 1) {
      const other = voices.find((v) => v.id !== lastLine.speakerVoiceId);
      if (other) nextVoice = other;
    }

    const newLine: DialogueLine = {
      id: `line_${Date.now()}`,
      speakerVoiceId: nextVoice.id,
      speakerName: nextVoice.name,
      speakerArabicName: nextVoice.arabicName,
      baseVoice: nextVoice.baseVoice,
      gender: nextVoice.gender,
      emotionId: 'casual_conversation',
      emotionIntensity: 'medium',
      text: '',
      status: 'idle',
    };

    setLines((prev) => [...prev, newLine]);
  };

  // Delete line
  const handleDeleteLine = (id: string) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  // Duplicate line
  const handleDuplicateLine = (index: number) => {
    const target = lines[index];
    if (!target) return;
    const duplicated: DialogueLine = {
      ...target,
      id: `line_${Date.now()}`,
      audioBase64: undefined,
      audioUrl: undefined,
      status: 'idle',
    };
    const next = [...lines];
    next.splice(index + 1, 0, duplicated);
    setLines(next);
  };

  // Move line
  const handleMoveLine = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lines.length) return;
    const copy = [...lines];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setLines(copy);
  };

  // Update line speaker
  const handleUpdateSpeaker = (lineId: string, voiceId: string) => {
    const v = voices.find((item) => item.id === voiceId);
    if (!v) return;
    setLines((prev) =>
      prev.map((l) =>
        l.id === lineId
          ? {
              ...l,
              speakerVoiceId: v.id,
              speakerName: v.name,
              speakerArabicName: v.arabicName,
              baseVoice: v.baseVoice,
              gender: v.gender,
              status: 'idle',
              audioUrl: undefined,
              audioBase64: undefined,
            }
          : l
      )
    );
  };

  // Update line emotion
  const handleUpdateEmotion = (
    lineId: string,
    emotionId: string,
    intensity: EmotionIntensity = 'medium'
  ) => {
    setLines((prev) =>
      prev.map((l) =>
        l.id === lineId
          ? {
              ...l,
              emotionId,
              emotionIntensity: intensity,
              status: 'idle',
              audioUrl: undefined,
              audioBase64: undefined,
            }
          : l
      )
    );
  };

  // Update line text
  const handleUpdateText = (lineId: string, text: string) => {
    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, text } : l))
    );
  };

  // Insert tag into line
  const handleInsertTagToLine = (lineId: string, tag: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.id === lineId ? { ...l, text: `${l.text} ${tag} `.trim() } : l
      )
    );
  };

  // Generate a single line
  const handleGenerateSingleLine = async (lineId: string) => {
    const line = lines.find((l) => l.id === lineId);
    if (!line || !line.text.trim()) return;

    setLines((prev) =>
      prev.map((l) =>
        l.id === lineId ? { ...l, status: 'generating', errorMessage: undefined } : l
      )
    );

    try {
      const selectedVoice =
        voices.find((v) => v.id === line.speakerVoiceId) || voices[0];
      const selectedEmotion =
        emotionCategories.find((e) => e.id === line.emotionId) ||
        emotionCategories[0];
      const emotionLevel =
        selectedEmotion.levels[line.emotionIntensity] ||
        selectedEmotion.levels.medium;

      const customization: VoiceCustomization = {
        gender: selectedVoice.gender,
        exactAge: selectedVoice.exactAge || selectedVoice.customization?.exactAge,
        age: selectedVoice.customization?.age || 'youth_18_35',
        dialect: currentDialect,
        pitch: selectedVoice.customization?.pitch || 'medium',
        pace: selectedVoice.customization?.pace || 'balanced',
        timbre: selectedVoice.customization?.timbre || 'bright',
        resonance: selectedVoice.customization?.resonance,
        texture: selectedVoice.customization?.texture,
        reverbEnvironment:
          selectedVoice.customization?.reverbEnvironment || 'dry_studio',
        reverbLevel:
          selectedVoice.customization?.reverbLevel !== undefined
            ? selectedVoice.customization.reverbLevel
            : 0,
        isCasualConversation:
          line.emotionId === 'casual_conversation' ||
          selectedVoice.customization?.isCasualConversation ||
          false,
      };

      const voiceInstruction = generateDramaticInstruction(customization);

      // Check cache first!
      const cached = getCachedAudio(
        line.text.trim(),
        selectedVoice.baseVoice,
        line.emotionId,
        line.emotionIntensity,
        currentDialect,
        voiceInstruction
      );

      if (cached) {
        const blob = new Blob(
          [Uint8Array.from(atob(cached.audioBase64), (c) => c.charCodeAt(0))],
          { type: 'audio/wav' }
        );
        const url = URL.createObjectURL(blob);
        setLines((prev) =>
          prev.map((l) =>
            l.id === lineId
              ? {
                  ...l,
                  audioBase64: cached.audioBase64,
                  audioUrl: url,
                  durationSec: cached.durationSec,
                  status: 'completed',
                }
              : l
          )
        );
        return;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: line.text,
          voice: selectedVoice.baseVoice,
          style: emotionLevel.promptPrefix,
          voiceInstruction,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429 || err?.isQuota) {
          throw new Error('تم بلوغ الحد المؤقت للنموذج (Error 429). يمكنك الاستماع بالصوت المحلي الفوري.');
        }
        throw new Error(err.error || 'فشل توليد صوت هذه الجملة.');
      }

      const data = await response.json();
      saveCachedAudio(
        line.text.trim(),
        selectedVoice.baseVoice,
        line.emotionId,
        line.emotionIntensity,
        currentDialect,
        data.audioBase64,
        data.durationSec || 0,
        voiceInstruction
      );

      const blob = new Blob(
        [
          Uint8Array.from(atob(data.audioBase64), (c) =>
            c.charCodeAt(0)
          ),
        ],
        { type: 'audio/wav' }
      );
      const url = URL.createObjectURL(blob);

      setLines((prev) =>
        prev.map((l) =>
          l.id === lineId
            ? {
                ...l,
                audioBase64: data.audioBase64,
                audioUrl: url,
                durationSec: data.durationSec,
                status: 'completed',
              }
            : l
        )
      );
    } catch (err: any) {
      setLines((prev) =>
        prev.map((l) =>
          l.id === lineId
            ? {
                ...l,
                status: 'error',
                errorMessage: err.message || 'حدث خطأ غير متوقع.',
              }
            : l
        )
      );
    }
  };

  // Generate All Lines & Merge Scene
  const handleGenerateAllAndMerge = async () => {
    setIsGeneratingAll(true);
    setGlobalError(null);
    setMergedAudioUrl(null);

    try {
      const generatedAudioList: { lineId: string; audioBase64: string }[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.text.trim()) continue;

        // 1. If line already has audio, reuse it to preserve quota!
        if (line.audioBase64 && line.audioUrl) {
          generatedAudioList.push({ lineId: line.id, audioBase64: line.audioBase64 });
          continue;
        }

        const selectedVoice =
          voices.find((v) => v.id === line.speakerVoiceId) || voices[0];
        const selectedEmotion =
          emotionCategories.find((e) => e.id === line.emotionId) ||
          emotionCategories[0];
        const emotionLevel =
          selectedEmotion.levels[line.emotionIntensity] ||
          selectedEmotion.levels.medium;

        const customization: VoiceCustomization = {
          gender: selectedVoice.gender,
          exactAge: selectedVoice.exactAge || selectedVoice.customization?.exactAge,
          age: selectedVoice.customization?.age || 'youth_18_35',
          dialect: currentDialect,
          pitch: selectedVoice.customization?.pitch || 'medium',
          pace: selectedVoice.customization?.pace || 'balanced',
          timbre: selectedVoice.customization?.timbre || 'bright',
          isCasualConversation:
            line.emotionId === 'casual_conversation' ||
            selectedVoice.customization?.isCasualConversation ||
            false,
        };

        const voiceInstruction = generateDramaticInstruction(customization);

        // 2. Check client audio cache
        const cached = getCachedAudio(
          line.text.trim(),
          selectedVoice.baseVoice,
          line.emotionId,
          line.emotionIntensity,
          currentDialect,
          voiceInstruction
        );

        if (cached) {
          const blob = new Blob(
            [Uint8Array.from(atob(cached.audioBase64), (c) => c.charCodeAt(0))],
            { type: 'audio/wav' }
          );
          const url = URL.createObjectURL(blob);
          generatedAudioList.push({ lineId: line.id, audioBase64: cached.audioBase64 });
          setLines((prev) =>
            prev.map((l) =>
              l.id === line.id
                ? {
                    ...l,
                    audioBase64: cached.audioBase64,
                    audioUrl: url,
                    durationSec: cached.durationSec,
                    status: 'completed',
                  }
                : l
            )
          );
          continue;
        }

        // Small pause between live API calls to preserve rate limit quota
        if (generatedAudioList.length > 0) {
          await new Promise((r) => setTimeout(r, 1200));
        }

        setGeneratingProgress(
          `جاري توليد الجملة (${i + 1} من ${lines.length}): "${line.speakerArabicName.split('(')[0]}"`
        );

        // Update line status to generating
        setLines((prev) =>
          prev.map((l) => (l.id === line.id ? { ...l, status: 'generating' } : l))
        );

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: line.text,
            voice: selectedVoice.baseVoice,
            style: emotionLevel.promptPrefix,
            voiceInstruction,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const isQuota = response.status === 429 || err?.isQuota;

          setLines((prev) =>
            prev.map((l) =>
              l.id === line.id
                ? {
                    ...l,
                    status: 'error',
                    errorMessage: isQuota
                      ? 'تم بلوغ الحد المؤقت للنموذج'
                      : err.error || 'فشل توليد الصوت',
                  }
                : l
            )
          );

          if (isQuota) {
            // If quota reached, do NOT crash the entire batch; merge what was generated if any!
            if (generatedAudioList.length > 0) {
              setGlobalError(
                `تم بلوغ الحد المجاني المؤقت لنموذج الصوت (Error 429). تم حفظ ${generatedAudioList.length} جمل سابقة بنجاح.`
              );
              break;
            } else {
              throw new Error(
                'تم بلوغ الحد المجاني المؤقت لنموذج الصوت (Error 429). تجنباً للانتظار العالق، يمكنك تجربة الاستماع عبر زر صوت المتصفح المحلي لكل جملة.'
              );
            }
          } else {
            throw new Error(`خطأ في الجملة رقم ${i + 1}: ${err.error || 'فشل توليد الصوت'}`);
          }
        }

        const data = await response.json();
        saveCachedAudio(
          line.text.trim(),
          selectedVoice.baseVoice,
          line.emotionId,
          line.emotionIntensity,
          currentDialect,
          data.audioBase64,
          data.durationSec || 0,
          voiceInstruction
        );

        const blob = new Blob(
          [
            Uint8Array.from(atob(data.audioBase64), (c) =>
              c.charCodeAt(0)
            ),
          ],
          { type: 'audio/wav' }
        );
        const url = URL.createObjectURL(blob);

        generatedAudioList.push({ lineId: line.id, audioBase64: data.audioBase64 });

        setLines((prev) =>
          prev.map((l) =>
            l.id === line.id
              ? {
                  ...l,
                  audioBase64: data.audioBase64,
                  audioUrl: url,
                  durationSec: data.durationSec,
                  status: 'completed',
                }
              : l
          )
        );
      }

      // Now call merge endpoint with natural 450ms inter-speaker pauses
      setGeneratingProgress('جاري دمج المشهد الصوتي بالكامل مع فترات التردد الطبيعية...');

      const mergeRes = await fetch('/api/merge-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: generatedAudioList,
          pauseMs: 450,
        }),
      });

      if (!mergeRes.ok) {
        throw new Error('فشل دمج ملفات الحوار الصوتي.');
      }

      const mergeData = await mergeRes.json();
      const mergedBlob = new Blob(
        [
          Uint8Array.from(atob(mergeData.audioBase64), (c) =>
            c.charCodeAt(0)
          ),
        ],
        { type: 'audio/wav' }
      );
      const mergedUrl = URL.createObjectURL(mergedBlob);

      setMergedAudioUrl(mergedUrl);
      setMergedDuration(mergeData.durationSec || 0);
    } catch (err: any) {
      setGlobalError(err.message || 'حدث خطأ أثناء معالجة المشهد.');
    } finally {
      setIsGeneratingAll(false);
      setGeneratingProgress('');
    }
  };

  const togglePlayMerged = () => {
    const audio = sceneAudioRef.current;
    if (!audio) return;
    if (isPlayingScene) {
      audio.pause();
      setIsPlayingScene(false);
    } else {
      audio.play();
      setIsPlayingScene(true);
    }
  };

  const togglePlaySingleLine = (lineId: string) => {
    const audio = singleAudioRefs.current[lineId];
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      // Pause any scene playing
      if (sceneAudioRef.current) {
        sceneAudioRef.current.pause();
        setIsPlayingScene(false);
      }
      audio.play();
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Top Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#F9F8F5] border border-[#E8E6DF] rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C86446]/10 border border-[#C86446]/20 flex items-center justify-center text-[#C86446]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1F1E1B] flex items-center gap-2">
              <span>نمط الحوار والمشهد الدرامي (Multi-Character Script)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C86446]/10 text-[#C86446]">
                تبديل يدوي كامل
              </span>
            </h2>
            <p className="text-xs text-[#736E62]">
              اكتب سيناريو متعدد الأدوار، وبدّل الشخصيات والنبرات والمشاعر لكل جملة بحرية تامة
            </p>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#5A5852] whitespace-nowrap">
            مشهد جاهز:
          </label>
          <select
            onChange={(e) => handleLoadPreset(e.target.value)}
            className="text-xs p-2 bg-white border border-[#DCD9D0] rounded-xl text-[#1F1E1B] focus:outline-none focus:border-[#C86446] cursor-pointer shadow-2xs"
            defaultValue={defaultPreset.id}
          >
            {DIALOGUE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.arabicTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Merged Scene Audio Player (if generated) */}
      {mergedAudioUrl && (
        <div className="p-4 bg-[#FAF7F2] border-2 border-[#C86446]/40 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayMerged}
              className="w-12 h-12 rounded-2xl bg-[#C86446] hover:bg-[#B5573B] text-white flex items-center justify-center shadow-sm cursor-pointer transition-all active:scale-95"
            >
              {isPlayingScene ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 mr-0.5" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1F1E1B]">
                  المشهد الدرامي المدمج جاهز بالكامل
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {mergedDuration} ثانية
                </span>
              </div>
              <p className="text-xs text-[#736E62]">
                تم دمج جميع الأدوار مع فترات التنفس والسكتات التلقائية بين المتحدثين
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mergedAudioUrl}
              download={`${sceneTitle.replace(/\s+/g, '_')}.wav`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1F1E1B] hover:bg-[#33312B] rounded-xl transition-all shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#C86446]" />
              <span>تحميل المشهد كاملاً (WAV)</span>
            </a>
          </div>

          <audio
            ref={sceneAudioRef}
            src={mergedAudioUrl}
            onEnded={() => setIsPlayingScene(false)}
            className="hidden"
          />
        </div>
      )}

      {/* Generating Progress or Error */}
      {isGeneratingAll && (
        <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD6A5] rounded-xl text-xs text-[#8A5100] flex items-center gap-2">
          <Clock className="w-4 h-4 animate-spin text-[#C86446]" />
          <span>{generatingProgress}</span>
        </div>
      )}

      {globalError && (
        <div className="p-3.5 bg-[#FDF2F0] border border-[#F5C2BA] rounded-xl text-xs text-[#B3261E] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Script Lines List */}
      <div className="space-y-3">
        {lines.map((line, index) => {
          const currentVoice =
            voices.find((v) => v.id === line.speakerVoiceId) || voices[0];
          const currentEmotion =
            emotionCategories.find((e) => e.id === line.emotionId) ||
            emotionCategories[0];

          return (
            <div
              key={line.id}
              className={`p-4 bg-white border-2 rounded-2xl transition-all shadow-2xs ${
                line.status === 'completed'
                  ? 'border-[#E2DFD7] hover:border-[#C86446]/30'
                  : 'border-[#E8E6DF]'
              }`}
            >
              {/* Line Bar: Number, Manual Speaker Switch, Manual Emotion Switch, Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F0EEE8]">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Line Number Badge */}
                  <span className="w-6 h-6 rounded-lg bg-[#FAF8F5] border border-[#E8E6DF] flex items-center justify-center text-xs font-bold text-[#8C887B]">
                    {index + 1}
                  </span>

                  {/* Manual Character/Speaker Selector */}
                  <div className="flex items-center gap-1.5 bg-[#F7F6F2] p-1 rounded-xl border border-[#E8E6DF]">
                    <span className="text-[11px] font-semibold text-[#5A5852] px-1">
                      المتحدث:
                    </span>
                    <select
                      value={line.speakerVoiceId}
                      onChange={(e) =>
                        handleUpdateSpeaker(line.id, e.target.value)
                      }
                      className="text-xs py-1 px-2 bg-white border border-[#DCD9D0] rounded-lg text-[#1F1E1B] font-bold focus:outline-none focus:border-[#C86446] cursor-pointer"
                    >
                      {voices.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.arabicName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manual Emotion Selector */}
                  <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#EFECE6]">
                    <span className="text-[11px] font-semibold text-[#5A5852] px-1">
                      النبرة والشعور:
                    </span>
                    <select
                      value={line.emotionId}
                      onChange={(e) =>
                        handleUpdateEmotion(
                          line.id,
                          e.target.value,
                          line.emotionIntensity
                        )
                      }
                      className="text-xs py-1 px-2 bg-white border border-[#DCD9D0] rounded-lg text-[#1F1E1B] focus:outline-none focus:border-[#C86446] cursor-pointer"
                    >
                      {emotionCategories.map((ec) => (
                        <option key={ec.id} value={ec.id}>
                          {ec.arabicLabel}
                        </option>
                      ))}
                    </select>

                    {/* Intensity Dropdown */}
                    <select
                      value={line.emotionIntensity}
                      onChange={(e) =>
                        handleUpdateEmotion(
                          line.id,
                          line.emotionId,
                          e.target.value as EmotionIntensity
                        )
                      }
                      className="text-xs py-1 px-1.5 bg-white border border-[#DCD9D0] rounded-lg text-[#5A5852] focus:outline-none focus:border-[#C86446] cursor-pointer"
                    >
                      <option value="low">خفيف</option>
                      <option value="medium">متوسط</option>
                      <option value="high">قوي</option>
                    </select>
                  </div>
                </div>

                {/* Line Operations */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveLine(index, 'up')}
                    disabled={index === 0}
                    title="تحريك لأعلى"
                    className="p-1 text-[#8C887B] hover:text-[#1F1E1B] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLine(index, 'down')}
                    disabled={index === lines.length - 1}
                    title="تحريك لأسفل"
                    className="p-1 text-[#8C887B] hover:text-[#1F1E1B] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateLine(index)}
                    title="تكرار الجملة"
                    className="p-1 text-[#8C887B] hover:text-[#1F1E1B] cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteLine(line.id)}
                    disabled={lines.length <= 1}
                    title="حذف الجملة"
                    className="p-1 text-[#8C887B] hover:text-[#B3261E] disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* In-line Tags Bar */}
              <InlineTagsBar
                onInsertTag={(tag) => handleInsertTagToLine(line.id, tag)}
                disabled={line.status === 'generating'}
              />

              {/* Text Input Area */}
              <textarea
                value={line.text}
                onChange={(e) => handleUpdateText(line.id, e.target.value)}
                rows={2}
                placeholder={`نص كلام ${currentVoice.arabicName.split('(')[0]}...`}
                className="w-full p-2.5 text-sm bg-white border border-[#DCD9D0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C86446]/40 focus:border-[#C86446] transition-all resize-none shadow-2xs"
              />

              {/* Individual Line Actions & Audio Status */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EEE8]">
                <div className="flex items-center gap-2">
                  {line.status === 'completed' && line.audioUrl && (
                    <div className="flex items-center gap-2 bg-[#F9F8F5] px-2.5 py-1 rounded-lg border border-[#E8E6DF]">
                      <button
                        type="button"
                        onClick={() => togglePlaySingleLine(line.id)}
                        className="w-6 h-6 rounded-md bg-[#C86446] text-white flex items-center justify-center hover:bg-[#B5573B] transition-colors cursor-pointer"
                        title="استماع لهذه الجملة فقط"
                      >
                        <Play className="w-3 h-3 mr-0.5" />
                      </button>
                      <span className="text-[11px] font-semibold text-[#1F1E1B]">
                        {line.durationSec} ثانية
                      </span>
                      <audio
                        ref={(el) => {
                          singleAudioRefs.current[line.id] = el;
                        }}
                        src={line.audioUrl}
                        className="hidden"
                      />
                    </div>
                  )}

                  {line.status === 'error' && (
                    <span className="text-[11px] text-[#B3261E]">
                      {line.errorMessage || 'خطأ في التوليد'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateSingleLine(line.id)}
                    disabled={line.status === 'generating' || !line.text.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#5A5852] hover:text-[#C86446] bg-[#F7F6F2] hover:bg-[#F3EFEB] border border-[#DCD9D0] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {line.status === 'generating' ? (
                      <>
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>جاري التوليد...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#C86446]" />
                        <span>توليد بالذكاء الاصطناعي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Global Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddLine}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#1F1E1B] bg-white border-2 border-dashed border-[#DCD9D0] hover:border-[#C86446] hover:text-[#C86446] transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة جملة جديدة للحوار</span>
        </button>

        <button
          type="button"
          onClick={handleGenerateAllAndMerge}
          disabled={isGeneratingAll || lines.some((l) => !l.text.trim())}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#C86446] hover:bg-[#B5573B] active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingAll ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>جاري توليد ودمج المشهد بالكامل...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>توليد المشهد الدرامي كاملاً ومدمجاً</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
