import React, { useState, useRef, useEffect } from 'react';
import {
  VoiceOption,
  DramaticDeliveryStyle,
  EmotionIntensity,
  EgyptianDialect,
  BatchScriptItem,
  GeneratedSpeech,
} from '../types';
import { EMOTIONS } from '../emotions';
import {
  sanitizeGeminiVoice,
  buildDramaticPrompt,
  getEmotionLevel,
  PACE_OPTIONS,
} from '../utils/dramaticVoice';
import { base64ToBlob, generateDescriptiveAudioFilename } from '../utils/audio';
import { DRAMATIC_STYLES } from './StyleSelector';
import {
  ListOrdered,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Plus,
  Sparkles,
  Loader2,
  Volume2,
  Sliders,
  Layers,
  FileText,
  Clock,
  ArrowDown,
  Check,
} from 'lucide-react';

interface BatchWorkspaceProps {
  voices: VoiceOption[];
  currentDialect: EgyptianDialect;
  isRtl: boolean;
  defaultVoice: VoiceOption;
  defaultDeliveryStyle: DramaticDeliveryStyle;
  defaultEmotionId: string;
  defaultIntensity: EmotionIntensity;
}

export const BatchWorkspace: React.FC<BatchWorkspaceProps> = ({
  voices,
  currentDialect,
  isRtl,
  defaultVoice,
  defaultDeliveryStyle,
  defaultEmotionId,
  defaultIntensity,
}) => {
  // Input raw paste text
  const [rawText, setRawText] = useState<string>(
    isRtl
      ? `أهلاً بكم في استوديو التمثيل الصوتي الذكي!\nكيف استطعت تحقيق هذا الإنجاز العظيم في وقت قياسي؟\nاحذر، فالطريق مليء بالمفاجآت غير المتوقعة!`
      : `Welcome to the intelligent voice acting studio!\nHow did you accomplish this incredible milestone in record time?\nBeware, the journey ahead is packed with unexpected twists!`
  );

  const [delimiterMode, setDelimiterMode] = useState<'newline' | 'paragraph' | 'custom'>('newline');
  const [customDelimiter, setCustomDelimiter] = useState<string>('---');

  // Queue state
  const [queue, setQueue] = useState<BatchScriptItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Batch shared options
  const [batchVoiceId, setBatchVoiceId] = useState<string>(defaultVoice.id);
  const [batchDeliveryStyle, setBatchDeliveryStyle] = useState<DramaticDeliveryStyle>(defaultDeliveryStyle);
  const [batchEmotionId, setBatchEmotionId] = useState<string>(defaultEmotionId);
  const [batchIntensity, setBatchIntensity] = useState<EmotionIntensity>(defaultIntensity);

  // References for queue execution control
  const shouldStopRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const queueRef = useRef<BatchScriptItem[]>(queue);
  queueRef.current = queue;

  // Sync pause ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Parse raw text into queue items
  const handleParseScripts = () => {
    let chunks: string[] = [];
    if (delimiterMode === 'newline') {
      chunks = rawText.split('\n');
    } else if (delimiterMode === 'paragraph') {
      chunks = rawText.split(/\n\s*\n/);
    } else {
      chunks = rawText.split(customDelimiter);
    }

    const filtered = chunks
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (filtered.length === 0) return;

    const newItems: BatchScriptItem[] = filtered.map((text, idx) => ({
      id: `batch-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      text,
      status: 'idle',
      voiceId: batchVoiceId,
      deliveryStyle: batchDeliveryStyle,
      emotionId: batchEmotionId,
      intensity: batchIntensity,
    }));

    setQueue(newItems);
  };

  // Add single script manually
  const handleAddSingleScript = () => {
    const newItem: BatchScriptItem[] = [
      ...queue,
      {
        id: `batch-${Date.now()}-${queue.length}`,
        text: isRtl ? 'جملة تمثيلية جديدة...' : 'New script line...',
        status: 'idle',
        voiceId: batchVoiceId,
        deliveryStyle: batchDeliveryStyle,
        emotionId: batchEmotionId,
        intensity: batchIntensity,
      },
    ];
    setQueue(newItem);
  };

  // Delete item from queue
  const handleDeleteItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Update item text
  const handleUpdateItemText = (id: string, text: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  // Single synthesis function
  const synthesizeItem = async (item: BatchScriptItem): Promise<BatchScriptItem> => {
    const selectedVoice = voices.find((v) => v.id === (item.voiceId || batchVoiceId)) || defaultVoice;
    const voiceStyle = item.deliveryStyle || batchDeliveryStyle;
    const emotionId = item.emotionId || batchEmotionId;
    const intensity = item.intensity || batchIntensity;

    const activeEmotion = EMOTIONS.find((e) => e.id === emotionId) || EMOTIONS[0];
    const activeLevel = getEmotionLevel(activeEmotion, intensity);

    const dramaticInstruction = buildDramaticPrompt({
      voiceOption: selectedVoice,
      deliveryStyle: voiceStyle,
      emotionCategory: activeEmotion,
      emotionLevel: activeLevel,
      currentDialect,
      scriptText: item.text,
      customization: selectedVoice.customization,
    });

    const safeVoice = sanitizeGeminiVoice(selectedVoice.baseVoice);

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: item.text.trim(),
        voice: safeVoice,
        voiceInstruction: dramaticInstruction,
        style: '',
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    let data: any = null;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textResp = await response.text();
      throw new Error(`Server returned unexpected response: ${textResp.slice(0, 80)}`);
    }

    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status})`);
    }

    const audioBlob = base64ToBlob(data.audioBase64, 'audio/wav');
    const audioUrl = URL.createObjectURL(audioBlob);

    const speech: GeneratedSpeech = {
      id: item.id,
      text: data.text || item.text,
      voice: safeVoice,
      voiceDisplayName: isRtl ? selectedVoice.arabicName : selectedVoice.name,
      styleLabel: isRtl ? activeEmotion.arabicShortLabel : activeEmotion.label,
      dialectLabel: currentDialect,
      audioBase64: data.audioBase64,
      audioUrl,
      durationSec: data.durationSec || 0,
      createdAt: Date.now(),
      deliveryStyle: voiceStyle,
      deliveryStyleLabel: voiceStyle,
      emotionId,
      emotionLabel: activeEmotion.label,
      intensity,
      intensityLabel: activeLevel.label,
    };

    return {
      ...item,
      status: 'completed',
      audioBase64: data.audioBase64,
      audioUrl,
      speech,
      durationSec: data.durationSec || 0,
      error: undefined,
    };
  };

  // Process entire queue sequentially
  const handleStartQueue = async () => {
    if (isProcessing) return;
    shouldStopRef.current = false;
    setIsProcessing(true);
    setIsPaused(false);

    const currentItems = [...queueRef.current];

    for (let i = 0; i < currentItems.length; i++) {
      if (shouldStopRef.current) break;

      // Check pause
      while (isPausedRef.current && !shouldStopRef.current) {
        await new Promise((r) => setTimeout(r, 300));
      }

      if (shouldStopRef.current) break;

      const item = currentItems[i];
      // Skip completed unless re-triggered
      if (item.status === 'completed' && item.audioUrl) {
        continue;
      }

      setActiveItemIndex(i);

      // Mark as generating
      setQueue((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'generating' } : it))
      );

      try {
        const completedItem = await synthesizeItem(item);
        currentItems[i] = completedItem;
        setQueue((prev) =>
          prev.map((it, idx) => (idx === i ? completedItem : it))
        );
      } catch (err: any) {
        console.error(`Batch item ${i} failed:`, err);
        const failedItem: BatchScriptItem = {
          ...item,
          status: 'error',
          error: err?.message || 'Synthesis failed',
        };
        currentItems[i] = failedItem;
        setQueue((prev) =>
          prev.map((it, idx) => (idx === i ? failedItem : it))
        );
      }

      // Small pacing buffer between calls (400ms) to avoid local rate spikes
      await new Promise((r) => setTimeout(r, 400));
    }

    setActiveItemIndex(null);
    setIsProcessing(false);
  };

  const handlePauseQueue = () => {
    setIsPaused(true);
  };

  const handleResumeQueue = () => {
    setIsPaused(false);
  };

  const handleStopQueue = () => {
    shouldStopRef.current = true;
    setIsProcessing(false);
    setIsPaused(false);
    setActiveItemIndex(null);
  };

  // Download single audio item
  const handleDownloadItem = (item: BatchScriptItem) => {
    if (!item.audioUrl && !item.audioBase64) return;
    const selectedVoice = voices.find((v) => v.id === (item.voiceId || batchVoiceId)) || defaultVoice;
    const styleObj = DRAMATIC_STYLES.find((s) => s.id === (item.deliveryStyle || batchDeliveryStyle));
    const activeEmotion = EMOTIONS.find((e) => e.id === (item.emotionId || batchEmotionId)) || EMOTIONS[0];
    const activeIntensity = item.intensity || batchIntensity;
    const activeLevel = getEmotionLevel(activeEmotion, activeIntensity);

    const speechObj: GeneratedSpeech = item.speech || {
      id: item.id,
      text: item.text,
      voice: selectedVoice.baseVoice,
      voiceDisplayName: isRtl ? selectedVoice.arabicName : selectedVoice.name,
      styleLabel: isRtl ? activeEmotion.arabicShortLabel : activeEmotion.label,
      emotionLabel: isRtl ? activeEmotion.arabicShortLabel : activeEmotion.label,
      intensityLabel: isRtl ? activeLevel.arabicLabel : activeLevel.label,
      deliveryStyle: item.deliveryStyle || batchDeliveryStyle,
      deliveryStyleLabel: isRtl ? styleObj?.arabicName : styleObj?.name,
      dialectLabel: currentDialect,
      audioBase64: item.audioBase64 || '',
      audioUrl: item.audioUrl || '',
      durationSec: item.durationSec || 0,
      createdAt: Date.now(),
    };

    const filename = generateDescriptiveAudioFilename(speechObj);

    const a = document.createElement('a');
    a.href = item.audioUrl || `data:audio/wav;base64,${item.audioBase64}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download all completed items
  const handleDownloadAll = async () => {
    const completedItems = queue.filter((item) => item.status === 'completed' && item.audioUrl);
    for (let i = 0; i < completedItems.length; i++) {
      handleDownloadItem(completedItems[i]);
      await new Promise((r) => setTimeout(r, 300));
    }
  };

  // Progress metrics
  const totalCount = queue.length;
  const completedCount = queue.filter((it) => it.status === 'completed').length;
  const failedCount = queue.filter((it) => it.status === 'error').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 1. Header Banner & Mode Explanation */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#5A6E82] text-white shadow-xs shrink-0">
              <ListOrdered className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#343230]">
                  {isRtl ? 'نمط توليد الدفعات المتعددة (Batch Queue Studio)' : 'Batch Script Queue Studio'}
                </h2>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#5A6E82] text-white uppercase">
                  {isRtl ? 'قائمة متتالية' : 'Sequential Queue'}
                </span>
              </div>
              <p className="text-xs text-[#7D786E] mt-0.5">
                {isRtl
                  ? 'الصق قائمة نصوص متعددة لتوليد ملفات صوتية منفصلة تلقائياً في طابور متتابع، مع شريط تقدم إجمالي وتشغيل وتحميل مباشر.'
                  : 'Paste multiple scripts to automatically synthesize audio files sequentially in a queue with progress tracking and batch export.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSingleScript}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F0EEE8] border border-[#DCD7CC] text-xs font-bold text-[#43413E] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#5A6E82]" />
            <span>{isRtl ? '+ إضافة سطر يدوياً' : '+ Add Script Line'}</span>
          </button>
        </div>

        {/* 2. Text Input & Delimiter Options */}
        <div className="space-y-2.5 pt-2 border-t border-[#E5E1D8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#43413E] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#5A6E82]" />
              <span>{isRtl ? 'الصق قائمة النصوص هنا:' : 'Paste your scripts list here:'}</span>
            </label>

            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-[#7D786E] text-[11px] font-medium">
                {isRtl ? 'طريقة الفصل:' : 'Split by:'}
              </span>
              <button
                type="button"
                onClick={() => setDelimiterMode('newline')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  delimiterMode === 'newline'
                    ? 'bg-[#5A6E82] text-white'
                    : 'bg-[#FAF8F5] text-[#55524E] border border-[#DCD7CC]'
                }`}
              >
                {isRtl ? 'كل سطر نص منفصل' : 'Line by line'}
              </button>
              <button
                type="button"
                onClick={() => setDelimiterMode('paragraph')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  delimiterMode === 'paragraph'
                    ? 'bg-[#5A6E82] text-white'
                    : 'bg-[#FAF8F5] text-[#55524E] border border-[#DCD7CC]'
                }`}
              >
                {isRtl ? 'فقرات تفصلها أسطر فارغة' : 'Blank line paragraphs'}
              </button>
              <button
                type="button"
                onClick={() => setDelimiterMode('custom')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  delimiterMode === 'custom'
                    ? 'bg-[#5A6E82] text-white'
                    : 'bg-[#FAF8F5] text-[#55524E] border border-[#DCD7CC]'
                }`}
              >
                {isRtl ? 'فاصل مخصص' : 'Custom separator'}
              </button>
            </div>
          </div>

          {delimiterMode === 'custom' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7D786E]">{isRtl ? 'الرمز الفاصل:' : 'Delimiter:'}</span>
              <input
                type="text"
                value={customDelimiter}
                onChange={(e) => setCustomDelimiter(e.target.value)}
                className="w-24 px-2 py-1 bg-white border border-[#DCD7CC] rounded-lg text-xs text-center font-mono"
              />
            </div>
          )}

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={4}
            placeholder={
              isRtl
                ? 'الصق النصوص هنا، كل جملة في سطر منفصل...'
                : 'Paste scripts here, one per line...'
            }
            className="w-full p-3.5 bg-[#FAF8F5] border border-[#DCD7CC] rounded-2xl text-xs sm:text-sm text-[#343230] focus:bg-white focus:border-[#5A6E82] focus:outline-none resize-y leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-[#7D786E]">
              {isRtl
                ? `💡 اضغط الزر بالأسفل لتعبئة طابور التوليد (${rawText.split('\n').filter((l) => l.trim()).length} سطر متوقع)`
                : `💡 Click below to load scripts into queue (${rawText.split('\n').filter((l) => l.trim()).length} lines detected)`}
            </span>

            <button
              type="button"
              onClick={handleParseScripts}
              className="px-4 py-2 rounded-xl bg-[#5A6E82] hover:bg-[#48596B] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
            >
              <ArrowDown className="w-4 h-4" />
              <span>{isRtl ? 'تعبئة طابور التوليد من النص' : 'Load into Queue'}</span>
            </button>
          </div>
        </div>

        {/* 3. Global Batch Settings (Voice & Performance Presets) */}
        <div className="pt-3 border-t border-[#E5E1D8] space-y-2">
          <label className="text-xs font-bold text-[#43413E] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#5A6E82]" />
            <span>{isRtl ? 'إعدادات الصوت والتمثيل لجميع عناصر الدفعة:' : 'Batch Audio & Acting Preset:'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {/* Voice Selection */}
            <div>
              <span className="text-[10px] font-bold text-[#7D786E] block mb-1">
                {isRtl ? 'الصوت المعتمد:' : 'Voice:'}
              </span>
              <select
                value={batchVoiceId}
                onChange={(e) => setBatchVoiceId(e.target.value)}
                className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl text-[#343230] font-semibold"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {isRtl ? v.arabicName : v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Style */}
            <div>
              <span className="text-[10px] font-bold text-[#7D786E] block mb-1">
                {isRtl ? 'النمط التمثيلي:' : 'Acting Style:'}
              </span>
              <select
                value={batchDeliveryStyle}
                onChange={(e) => setBatchDeliveryStyle(e.target.value as DramaticDeliveryStyle)}
                className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl text-[#343230] font-semibold"
              >
                {DRAMATIC_STYLES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {isRtl ? st.arabicName : st.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Emotion */}
            <div>
              <span className="text-[10px] font-bold text-[#7D786E] block mb-1">
                {isRtl ? 'النبرة الشعورية:' : 'Emotion:'}
              </span>
              <select
                value={batchEmotionId}
                onChange={(e) => setBatchEmotionId(e.target.value)}
                className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl text-[#343230] font-semibold"
              >
                {EMOTIONS.map((em) => (
                  <option key={em.id} value={em.id}>
                    {isRtl ? em.arabicShortLabel : em.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Intensity */}
            <div>
              <span className="text-[10px] font-bold text-[#7D786E] block mb-1">
                {isRtl ? 'شدة النبرة (4 مستويات):' : 'Intensity:'}
              </span>
              <select
                value={batchIntensity}
                onChange={(e) => setBatchIntensity(e.target.value as EmotionIntensity)}
                className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl text-[#343230] font-semibold"
              >
                <option value="low">{isRtl ? 'المستوى 1: هادئ' : 'Level 1: Low'}</option>
                <option value="medium">{isRtl ? 'المستوى 2: معتدل' : 'Level 2: Medium'}</option>
                <option value="high">{isRtl ? 'المستوى 3: قوي ومتصاعد' : 'Level 3: High'}</option>
                <option value="extreme">{isRtl ? 'المستوى 4: أقصى ذروة حادة' : 'Level 4: Extreme Peak'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Batch Progress Bar & Control Center */}
      {queue.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E5E1D8] p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#343230]">
                  {isRtl ? 'التقدم الإجمالي للدفعة:' : 'Overall Batch Progress:'}
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-[#5A6E82]/10 text-[#5A6E82]">
                  {completedCount} / {totalCount} ({progressPercent}%)
                </span>
              </div>
              <div className="text-[11px] text-[#7D786E] mt-0.5">
                {failedCount > 0 && (
                  <span className="text-red-600 font-bold ml-1">
                    {isRtl ? `(تعذر توليد ${failedCount})` : `(${failedCount} failed)`}
                  </span>
                )}
                {isProcessing && activeItemIndex !== null && (
                  <span className="text-[#C86446] font-bold">
                    {isRtl
                      ? `جارٍ توليد العنصر ${activeItemIndex + 1} من ${totalCount}...`
                      : `Synthesizing item ${activeItemIndex + 1} of ${totalCount}...`}
                  </span>
                )}
                {!isProcessing && completedCount === totalCount && totalCount > 0 && (
                  <span className="text-emerald-700 font-bold">
                    {isRtl ? '✓ اكتمل توليد جميع الملفات الصوتية بنجاح!' : '✓ All audio files completed!'}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {!isProcessing ? (
                <button
                  type="button"
                  onClick={handleStartQueue}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C86446] to-[#B5573B] hover:from-[#B5573B] hover:to-[#A04A30] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {completedCount > 0 && completedCount < totalCount
                      ? isRtl
                        ? 'متابعة توليد المتبقي'
                        : 'Continue Queue'
                      : isRtl
                      ? 'بدء توليد الدفعة'
                      : 'Start Batch Generation'}
                  </span>
                </button>
              ) : (
                <>
                  {!isPaused ? (
                    <button
                      type="button"
                      onClick={handlePauseQueue}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Pause className="w-4 h-4" />
                      <span>{isRtl ? 'إيقاف مؤقت' : 'Pause'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResumeQueue}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isRtl ? 'استئناف' : 'Resume'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleStopQueue}
                    className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{isRtl ? 'إلغاء' : 'Stop'}</span>
                  </button>
                </>
              )}

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-98"
                  title={isRtl ? 'تحميل جميع المقاطع المكتملة كملفات منفصلة' : 'Download all completed files'}
                >
                  <Download className="w-4 h-4" />
                  <span>{isRtl ? `تحميل الكل (${completedCount})` : `Download All (${completedCount})`}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setQueue([])}
                disabled={isProcessing}
                className="p-2 rounded-xl text-[#7D786E] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                title={isRtl ? 'تفريغ القائمة' : 'Clear queue'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-[#EDE9E1] h-3 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#5A6E82] via-[#C86446] to-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 5. Queue Items List */}
      {queue.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#7D786E] px-1 font-semibold">
            <span>{isRtl ? `عناصر الطابور (${queue.length}):` : `Queue Items (${queue.length}):`}</span>
            <span>{isRtl ? 'انقر على النص لتعديله قبل التوليد' : 'Click text to edit before generation'}</span>
          </div>

          <div className="space-y-2.5">
            {queue.map((item, index) => {
              const isCurrent = activeItemIndex === index;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-4 transition-all shadow-xs ${
                    isCurrent
                      ? 'border-[#C86446] ring-2 ring-[#C86446]/25 bg-amber-50/20'
                      : item.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : item.status === 'error'
                      ? 'border-red-200 bg-red-50/20'
                      : 'border-[#E5E1D8]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Index & Status Badge */}
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#EDE9E1] text-[#43413E] text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      {item.status === 'idle' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9E1] text-[#7D786E]">
                          {isRtl ? 'قيد الانتظار' : 'Pending'}
                        </span>
                      )}

                      {item.status === 'generating' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1 animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>{isRtl ? 'جارٍ التوليد...' : 'Synthesizing...'}</span>
                        </span>
                      )}

                      {item.status === 'completed' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>
                            {isRtl ? 'مكتمل' : 'Completed'}{' '}
                            {item.durationSec ? `(${item.durationSec.toFixed(1)}s)` : ''}
                          </span>
                        </span>
                      )}

                      {item.status === 'error' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>{isRtl ? 'فشل' : 'Failed'}</span>
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {item.status === 'completed' && item.audioUrl && (
                        <button
                          type="button"
                          onClick={() => handleDownloadItem(item)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD7CC] hover:border-[#6B705C] text-[#343230] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          title={isRtl ? 'تحميل الملف الصوتي باسم وصفي' : 'Download audio file'}
                        >
                          <Download className="w-3.5 h-3.5 text-[#6B705C]" />
                          <span>{isRtl ? 'تحميل' : 'Download'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={isProcessing && isCurrent}
                        className="p-1.5 text-[#7D786E] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={isRtl ? 'حذف من الطابور' : 'Remove from queue'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Text Input/Display */}
                  <div className="mt-2.5">
                    <textarea
                      value={item.text}
                      onChange={(e) => handleUpdateItemText(item.id, e.target.value)}
                      disabled={isProcessing && isCurrent}
                      rows={2}
                      className="w-full text-xs sm:text-sm p-2.5 bg-[#FAF8F5] border border-[#E5E1D8] focus:border-[#5A6E82] focus:bg-white rounded-xl text-[#343230] focus:outline-none leading-relaxed resize-y font-sans"
                    />
                  </div>

                  {/* Audio Player if completed */}
                  {item.status === 'completed' && item.audioUrl && (
                    <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center gap-3">
                      <audio
                        src={item.audioUrl}
                        controls
                        className="w-full h-8 accent-[#C86446]"
                      />
                    </div>
                  )}

                  {/* Error display if failed */}
                  {item.status === 'error' && item.error && (
                    <div className="mt-2 text-[11px] text-red-700 bg-red-50 p-2 rounded-xl border border-red-200">
                      {item.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
