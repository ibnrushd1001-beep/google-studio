import React, { useState } from 'react';
import {
  VoiceOption,
  EmotionCategory,
  EmotionIntensity,
  EgyptianDialect,
  VoiceCustomization,
} from '../types';
import { VOICES } from '../data';
import { EMOTION_CATEGORIES } from '../data';
import { InlineTagsBar } from './InlineTagsBar';
import { generateDramaticInstruction } from '../utils/dramaticVoice';
import {
  Columns,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  ArrowLeftRight,
  User,
  Volume2,
  Sliders,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface ComparisonWorkspaceProps {
  voices: VoiceOption[];
  emotionCategories: EmotionCategory[];
  currentDialect: EgyptianDialect;
  onDialectChange: (dialect: EgyptianDialect) => void;
  initialText: string;
}

interface SlotState {
  text: string;
  voiceId: string;
  dialect: EgyptianDialect;
  emotionId: string;
  emotionIntensity: EmotionIntensity;
  audioBase64?: string;
  audioUrl?: string;
  durationSec?: number;
  isGenerating?: boolean;
  isPlaying?: boolean;
  errorMessage?: string;
}

export const ComparisonWorkspace: React.FC<ComparisonWorkspaceProps> = ({
  voices,
  emotionCategories,
  currentDialect,
  onDialectChange,
  initialText,
}) => {
  // Slot A
  const [slotA, setSlotA] = useState<SlotState>({
    text: initialText,
    voiceId: voices[0]?.id || 'egyptian_girl_clip',
    dialect: currentDialect,
    emotionId: 'joy',
    emotionIntensity: 'medium',
  });

  // Slot B (Additional editable pane as requested)
  const [slotB, setSlotB] = useState<SlotState>({
    text: initialText,
    voiceId: voices[1]?.id || voices[0]?.id || 'egyptian_boy_clip',
    dialect: currentDialect,
    emotionId: 'casual_conversation',
    emotionIntensity: 'medium',
  });

  // Audio elements ref
  const audioRefA = React.useRef<HTMLAudioElement | null>(null);
  const audioRefB = React.useRef<HTMLAudioElement | null>(null);

  // Sync initial dialect
  React.useEffect(() => {
    setSlotA((prev) => ({ ...prev, dialect: currentDialect }));
    setSlotB((prev) => ({ ...prev, dialect: currentDialect }));
  }, [currentDialect]);

  const handleInsertTag = (slot: 'A' | 'B', tag: string) => {
    if (slot === 'A') {
      setSlotA((prev) => ({ ...prev, text: `${prev.text} ${tag} `.trim() }));
    } else {
      setSlotB((prev) => ({ ...prev, text: `${prev.text} ${tag} `.trim() }));
    }
  };

  const copyAToB = () => {
    setSlotB((prev) => ({ ...prev, text: slotA.text }));
  };

  const generateSlot = async (slotKey: 'A' | 'B') => {
    const slot = slotKey === 'A' ? slotA : slotB;
    const setSlot = slotKey === 'A' ? setSlotA : setSlotB;

    if (!slot.text.trim()) return;

    setSlot((prev) => ({
      ...prev,
      isGenerating: true,
      errorMessage: undefined,
    }));

    try {
      const selectedVoice =
        voices.find((v) => v.id === slot.voiceId) || voices[0];
      const selectedEmotion =
        emotionCategories.find((e) => e.id === slot.emotionId) ||
        emotionCategories[0];
      const emotionLevel =
        selectedEmotion.levels[slot.emotionIntensity] ||
        selectedEmotion.levels.medium;

      const customization: VoiceCustomization = {
        gender: selectedVoice.gender,
        exactAge: selectedVoice.exactAge || selectedVoice.customization?.exactAge,
        age: selectedVoice.customization?.age || 'youth_18_35',
        dialect: slot.dialect,
        pitch: selectedVoice.customization?.pitch || 'medium',
        pace: selectedVoice.customization?.pace || 'balanced',
        timbre: selectedVoice.customization?.timbre || 'bright',
        isCasualConversation:
          slot.emotionId === 'casual_conversation' ||
          selectedVoice.customization?.isCasualConversation ||
          false,
      };

      const voiceInstruction = generateDramaticInstruction(customization);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: slot.text,
          voice: selectedVoice.baseVoice,
          style: emotionLevel.promptPrefix,
          voiceInstruction,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'فشل توليد الأداء الصوتي.');
      }

      const data = await response.json();
      const blob = new Blob(
        [
          Uint8Array.from(atob(data.audioBase64), (c) =>
            c.charCodeAt(0)
          ),
        ],
        { type: 'audio/wav' }
      );
      const url = URL.createObjectURL(blob);

      setSlot((prev) => ({
        ...prev,
        audioBase64: data.audioBase64,
        audioUrl: url,
        durationSec: data.durationSec,
        isGenerating: false,
      }));
    } catch (err: any) {
      setSlot((prev) => ({
        ...prev,
        isGenerating: false,
        errorMessage: err.message || 'حدث خطأ غير متوقع أثناء المعالجة.',
      }));
    }
  };

  const generateBoth = async () => {
    await Promise.all([generateSlot('A'), generateSlot('B')]);
  };

  const togglePlay = (slotKey: 'A' | 'B') => {
    const isA = slotKey === 'A';
    const audio = isA ? audioRefA.current : audioRefB.current;
    const otherAudio = isA ? audioRefB.current : audioRefA.current;
    const slot = isA ? slotA : slotB;
    const setSlot = isA ? setSlotA : setSlotB;
    const setOtherSlot = isA ? setSlotB : setSlotA;

    if (!audio) return;

    if (otherAudio) {
      otherAudio.pause();
      otherAudio.currentTime = 0;
      setOtherSlot((prev) => ({ ...prev, isPlaying: false }));
    }

    if (slot.isPlaying) {
      audio.pause();
      setSlot((prev) => ({ ...prev, isPlaying: false }));
    } else {
      audio.play();
      setSlot((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const renderSlotCard = (slotKey: 'A' | 'B', slot: SlotState, setSlot: React.Dispatch<React.SetStateAction<SlotState>>) => {
    const isA = slotKey === 'A';
    const activeVoice = voices.find((v) => v.id === slot.voiceId) || voices[0];
    const activeEmotion =
      emotionCategories.find((e) => e.id === slot.emotionId) ||
      emotionCategories[0];

    return (
      <div
        className={`flex flex-col bg-white border-2 rounded-2xl p-5 shadow-xs transition-all ${
          isA
            ? 'border-[#C86446]/30 hover:border-[#C86446]/50'
            : 'border-[#5A6E82]/30 hover:border-[#5A6E82]/50'
        }`}
        dir="rtl"
      >
        {/* Slot Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E6DF]">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                isA ? 'bg-[#C86446]' : 'bg-[#5A6E82]'
              }`}
            >
              {isA ? 'أ' : 'ب'}
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1F1E1B]">
                {isA ? 'النسخة الأولى (أ)' : 'النسخة الثانية (ب) - خانة مقارنة حرة'}
              </h3>
              <p className="text-[11px] text-[#736E62]">
                {isA
                  ? 'الأداء المرجعي الأساسي'
                  : 'خانة مستقلة لكتابة نص بديل أو تجربة نبرة مختلفة'}
              </p>
            </div>
          </div>

          {!isA && (
            <button
              type="button"
              onClick={copyAToB}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#5A5852] hover:text-[#1F1E1B] bg-[#F7F6F2] hover:bg-[#ECE9E2] border border-[#DCD9D0] rounded-lg transition-colors cursor-pointer"
              title="نسخ النص المكتوب في النسخة (أ) إلى هنا"
            >
              <Copy className="w-3 h-3" />
              <span>نسخ نص (أ)</span>
            </button>
          )}
        </div>

        {/* Character & Emotion Quick Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EFECE6]">
          {/* Voice Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5A5852] mb-1">
              الشخصية الصوتية:
            </label>
            <select
              value={slot.voiceId}
              onChange={(e) =>
                setSlot((prev) => ({ ...prev, voiceId: e.target.value }))
              }
              className="w-full text-xs p-1.5 bg-white border border-[#DCD9D0] rounded-lg text-[#1F1E1B] focus:outline-none focus:border-[#C86446]"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.arabicName}
                </option>
              ))}
            </select>
          </div>

          {/* Dialect Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5A5852] mb-1">
              اللهجة:
            </label>
            <select
              value={slot.dialect}
              onChange={(e) =>
                setSlot((prev) => ({
                  ...prev,
                  dialect: e.target.value as EgyptianDialect,
                }))
              }
              className="w-full text-xs p-1.5 bg-white border border-[#DCD9D0] rounded-lg text-[#1F1E1B] focus:outline-none focus:border-[#C86446]"
            >
              <option value="cairo">قاهرية أصيلة</option>
              <option value="alex">إسكندرانية ساحلية</option>
            </select>
          </div>

          {/* Emotion Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5A5852] mb-1">
              الشعور والنبرة:
            </label>
            <select
              value={slot.emotionId}
              onChange={(e) =>
                setSlot((prev) => ({ ...prev, emotionId: e.target.value }))
              }
              className="w-full text-xs p-1.5 bg-white border border-[#DCD9D0] rounded-lg text-[#1F1E1B] focus:outline-none focus:border-[#C86446]"
            >
              {emotionCategories.map((ec) => (
                <option key={ec.id} value={ec.id}>
                  {ec.arabicLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* In-line Tags Bar */}
        <InlineTagsBar
          onInsertTag={(tag) => handleInsertTag(slotKey, tag)}
          disabled={slot.isGenerating}
        />

        {/* Text Area (Editable input field as requested) */}
        <div className="mb-3 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#5A5852]">
              نص الأداء ({isA ? 'النسخة أ' : 'النسخة ب'}):
            </span>
            <span className="text-[11px] text-[#8C887B]">
              {slot.text.length} حرف
            </span>
          </div>
          <textarea
            value={slot.text}
            onChange={(e) =>
              setSlot((prev) => ({ ...prev, text: e.target.value }))
            }
            rows={4}
            placeholder={
              isA
                ? 'اكتب النص المراد تمثيله في النسخة (أ)...'
                : 'اكتب نصاً بديلاً أو نفس النص بنبرة وتوجيهات مختلفة للمقارنة...'
            }
            className="w-full p-3 text-sm bg-white border border-[#DCD9D0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C86446]/40 focus:border-[#C86446] transition-all resize-none shadow-2xs"
          />
        </div>

        {/* Error message */}
        {slot.errorMessage && (
          <div className="p-2.5 mb-3 bg-[#FDF2F0] border border-[#F5C2BA] rounded-xl text-xs text-[#B3261E] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{slot.errorMessage}</span>
          </div>
        )}

        {/* Audio Player & Generate Button */}
        <div className="pt-2 border-t border-[#E8E6DF] flex flex-col gap-2">
          {slot.audioUrl && (
            <div className="flex items-center justify-between p-2 bg-[#F7F6F2] rounded-xl border border-[#E8E6DF]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePlay(slotKey)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white cursor-pointer transition-all ${
                    isA ? 'bg-[#C86446] hover:bg-[#B5573B]' : 'bg-[#5A6E82] hover:bg-[#49596B]'
                  }`}
                >
                  {slot.isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 mr-0.5" />
                  )}
                </button>
                <div className="text-xs">
                  <span className="font-semibold text-[#1F1E1B]">
                    {slot.durationSec} ثانية
                  </span>
                  <span className="text-[#8C887B] mr-2">
                    {activeVoice.arabicName.split('(')[0]}
                  </span>
                </div>
              </div>

              <a
                href={slot.audioUrl}
                download={`مقارنة_أداء_${slotKey}_صوت_${activeVoice.arabicName.split('(')[0].trim().replace(/\s+/g, '_')}_${slot.dialect === 'alex' ? 'إسكندراني' : 'قاهري'}_${activeEmotion?.arabicShortLabel || slot.emotionId}_${slot.emotionIntensity}.wav`}
                className="p-1.5 text-[#6B665A] hover:text-[#1F1E1B] hover:bg-white rounded-lg transition-colors cursor-pointer"
                title={`تحميل أداء ${slotKey} (${activeVoice.arabicName.split('(')[0]})`}
              >
                <Download className="w-4 h-4" />
              </a>

              <audio
                ref={isA ? audioRefA : audioRefB}
                src={slot.audioUrl}
                onEnded={() =>
                  setSlot((prev) => ({ ...prev, isPlaying: false }))
                }
                className="hidden"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => generateSlot(slotKey)}
            disabled={slot.isGenerating || !slot.text.trim()}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isA
                ? 'bg-[#C86446] hover:bg-[#B5573B]'
                : 'bg-[#5A6E82] hover:bg-[#49596B]'
            }`}
          >
            {slot.isGenerating ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>جاري توليد النسخة ({slotKey})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>توليد النسخة ({slotKey})</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Top Banner with Synchronized Generate Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#F9F8F5] border border-[#E8E6DF] rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5A6E82]/10 border border-[#5A6E82]/20 flex items-center justify-center text-[#5A6E82]">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1F1E1B] flex items-center gap-2">
              <span>أداة المقارنة المزدوجة (A/B Performance Comparison)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#5A6E82]/10 text-[#5A6E82]">
                شاشتان متزامنتان
              </span>
            </h2>
            <p className="text-xs text-[#736E62]">
              قارن بين نسختين مختلفتين من النص أو الشخصية أو النبرة لتحديد الخيار الأفضل لإخراجك
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={generateBoth}
          disabled={
            slotA.isGenerating ||
            slotB.isGenerating ||
            !slotA.text.trim() ||
            !slotB.text.trim()
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1F1E1B] hover:bg-[#33312B] transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeftRight className="w-4 h-4 text-[#C86446]" />
          <span>توليد النسختين معاً في وقت واحد</span>
        </button>
      </div>

      {/* Grid: Slot A on Left, Slot B on Right (or stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSlotCard('A', slotA, setSlotA)}
        {renderSlotCard('B', slotB, setSlotB)}
      </div>
    </div>
  );
};
