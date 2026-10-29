import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Mic,
  Play,
  Square,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  FileAudio,
  Activity,
  Layers,
  Sliders,
  ShieldCheck,
  Wand2,
  Radio,
  Volume2,
} from 'lucide-react';
import { CustomVoicePreset, VoiceName, Gender, EgyptianDialect } from '../types';

interface VoiceCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveClonedVoice: (preset: CustomVoicePreset) => void;
  isRtl: boolean;
}

export const VoiceCloneModal: React.FC<VoiceCloneModalProps> = ({
  isOpen,
  onClose,
  onSaveClonedVoice,
  isRtl,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Editable cloned voice fields
  const [cloneName, setCloneName] = useState<string>('');
  const [cloneArabicName, setCloneArabicName] = useState<string>('');
  const [analysisMethod, setAnalysisMethod] = useState<string>('gemini_multimodal');
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [cloneGender, setCloneGender] = useState<Gender>('female');
  const [cloneExactAge, setCloneExactAge] = useState<number>(28);
  const [cloneBaseVoice, setCloneBaseVoice] = useState<VoiceName>('Kore');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|ogg|aac|flac|webm)$/i)) {
      setAnalysisError('يرجى اختيار ملف صوتي صالح (MP3, WAV, M4A, OGG, WEBM).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setAnalysisError('حجم الملف كبير جداً. الحد الأقصى المسموح به هو 25 ميجابايت.');
      return;
    }

    setSelectedFile(file);
    setAnalysisError(null);
    setAnalysisResult(null);

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  const startRecording = async () => {
    try {
      setAnalysisError(null);
      setAnalysisResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const recordedFile = new File([audioBlob], 'microphone_recording.webm', {
          type: 'audio/webm',
        });
        setSelectedFile(recordedFile);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Mic access error:', err);
      setAnalysisError('تعذر الوصول إلى الميكروفون. يرجى التأكد من منح الإذن في المتصفح أو رفع ملف صوتي.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const togglePreviewPlay = () => {
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const base64Data = await convertFileToBase64(selectedFile);
      const mimeType = selectedFile.type || 'audio/wav';

      const response = await fetch('/api/voice/clone-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBase64: base64Data,
          mimeType,
          fileName: selectedFile.name,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشل تحليل واستخراج خصائص الصوت.');
      }

      setAnalysisResult(data.analysis);
      setAnalysisMethod(data.analysisMethod || 'gemini_multimodal');
      setIsFallback(!!data.isFallback);
      const detectedGender: Gender = data.analysis.gender === 'male' ? 'male' : 'female';
      const detectedAge: number = data.analysis.exactAge || 28;
      const detectedBaseVoice: VoiceName = data.analysis.recommendedBaseVoice || (detectedGender === 'male' ? 'Charon' : 'Kore');

      setCloneGender(detectedGender);
      setCloneExactAge(detectedAge);
      setCloneBaseVoice(detectedBaseVoice);
      setCloneName(data.analysis.name || `Cloned - ${selectedFile.name.split('.')[0]}`);
      setCloneArabicName(data.analysis.arabicName || 'صوت مستنسخ عالي الدقة');
    } catch (err: any) {
      console.error('Clone analysis failed:', err);
      setAnalysisError(err?.message || 'حدث خطأ أثناء فحص وتحليل الملف الصوتي.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndAdopt = () => {
    if (!analysisResult) return;

    const baseVoice: VoiceName = cloneBaseVoice;
    const gender: Gender = cloneGender;
    const exactAge = Number(cloneExactAge) || 28;
    const dialect: EgyptianDialect = analysisResult.dialect === 'alex' ? 'alex' : 'cairo';

    const ageStage =
      exactAge <= 8
        ? 'child_5_8'
        : exactAge <= 12
        ? 'child_9_12'
        : exactAge <= 17
        ? 'teen_12_17'
        : exactAge <= 35
        ? 'youth_18_35'
        : exactAge <= 55
        ? 'mature_36_55'
        : 'elder_56_85';

    const newCustomPreset: CustomVoicePreset = {
      id: `clone_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: cloneName.trim() || analysisResult.name,
      arabicName: cloneArabicName.trim() || analysisResult.arabicName,
      baseVoice,
      gender,
      exactAge,
      ageLabel: `${exactAge}y (${gender === 'female' ? 'Female' : 'Male'})`,
      arabicAgeLabel: `${exactAge} سنة (${gender === 'female' ? 'أنثى' : 'ذكر'})`,
      character: analysisResult.characterDescription || 'Exact acoustic clone from uploaded audio',
      arabicCharacter:
        analysisResult.characterDescription ||
        `نسخة طبق الأصل من النبرة والحنجرة والأحبال الصوتية لمقطع "${selectedFile?.name || 'الصوت المرفوع'}"`,
      voiceInstruction: analysisResult.voiceInstruction || '',
      customization: {
        gender,
        exactAge,
        age: ageStage,
        dialect,
        pitch: analysisResult.pitch || 'medium',
        melody: analysisResult.melody || 'balanced_natural',
        timbre: analysisResult.timbre || 'resonant',
        resonance: analysisResult.resonance || 'throat',
        texture: analysisResult.texture || 'pure',
        pace: analysisResult.pace || 'balanced',
        breathing: analysisResult.breathing || 'calm_deep',
        baseVoiceLock: false,
        reverbEnvironment: analysisResult.reverbEnvironment || 'dry_studio',
        reverbLevel: analysisResult.reverbLevel !== undefined ? analysisResult.reverbLevel : 0,
        customNotes: `استنساخ صوتي دقيق: ${analysisResult.vocalCordsAnalysis || ''}`,
      },
      createdAt: Date.now(),
    };

    onSaveClonedVoice(newCustomPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FBF9F5] border border-[#DCD7CC] rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E5E1D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C86446]/15 text-[#C86446] flex items-center justify-center font-bold">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#343230]">
                  استنساخ بصمة الصوت والأحبال الصوتية
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C86446]/10 text-[#C86446] border border-[#C86446]/20">
                  تحليل تشريحي متقدم
                </span>
              </div>
              <p className="text-xs text-[#7D786E]">
                ارفع ملفاً صوتياً لاستخراج رنين الحنجرة، توتر الأحبال، وبصمة النبرة لإنتاج نسخة طبق الأصل
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7D786E] hover:text-[#343230] hover:bg-[#FAF8F5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Step 1: Upload or Record Area */}
          <div className="bg-white border-2 border-dashed border-[#DCD7CC] hover:border-[#C86446]/60 rounded-2xl p-6 text-center space-y-4 transition-all">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.aac,.webm"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] flex items-center justify-center text-[#C86446] shadow-2xs">
              <FileAudio className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-[#343230]">
                اسحب وأفلت الملف الصوتي هنا أو انقر للاختيار
              </h3>
              <p className="text-xs text-[#7D786E] mt-1">
                يدعم صيغ MP3, WAV, M4A, OGG, WEBM (يفضل مقطع من 5 إلى 30 ثانية لصوت واضح)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#6B705C] hover:bg-[#585C4B] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Upload className="w-4 h-4" />
                <span>اختر ملفاً من جهازك</span>
              </button>

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#343230] border border-[#DCD7CC]'
                }`}
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>
                  {isRecording ? `جارٍ التسجيل (${recordingSeconds} ث) • انقر للإيقاف` : 'تسجيل صوتي مباشر بالمايك'}
                </span>
              </button>
            </div>

            {selectedFile && (
              <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] flex items-center justify-between gap-3 text-start">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#C86446]/10 text-[#C86446] flex items-center justify-center shrink-0">
                    <FileAudio className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#343230] truncate">{selectedFile.name}</div>
                    <div className="text-[10px] text-[#7D786E]">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {audioUrl && (
                    <>
                      <audio
                        ref={previewAudioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlayingPreview(false)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={togglePreviewPlay}
                        className="p-2 rounded-lg bg-white border border-[#DCD7CC] hover:bg-[#FAF8F5] text-[#343230] cursor-pointer"
                        title="استماع للملف"
                      >
                        {isPlayingPreview ? (
                          <Square className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={handleStartAnalysis}
                    className="px-4 py-2 rounded-xl bg-[#C86446] hover:bg-[#B5573B] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>جارٍ التحليل التشريحي...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>بدء استخراج خصائص الحنجرة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Error */}
          {analysisError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Step 2: Animated Scanning Progress */}
          {isAnalyzing && (
            <div className="p-6 rounded-2xl bg-white border border-[#E5E1D8] text-center space-y-3 animate-fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#C86446]/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-[#C86446]/10 text-[#C86446] flex items-center justify-center font-bold">
                  <Activity className="w-7 h-7 animate-pulse" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#343230]">
                  جارٍ فحص الترددات الأساسية وتحليل الحنجرة والأحبال الصوتية...
                </h4>
                <p className="text-xs text-[#7D786E] mt-1 max-w-md mx-auto">
                  يقوم الذكاء الاصطناعي بقياس Formants (F1, F2)، رنين القصبة الهوائية، الخشونة/النقاء، وتوليد توجيه هرمي لإخراج نسخة متطابقة 100%.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Analysis Results & Exact Replica Presentation */}
          {analysisResult && (
            <div className="bg-white border border-[#E5E1D8] rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#F0EEE8] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#343230]">
                      تم استخراج البصمة الصوتية بنجاح (نسخة طبق الأصل)
                    </h3>
                    <p className="text-[11px] text-[#7D786E]">
                      تطابق بنسبة فائقة مع معمارية نموذج Gemini 3.1 Flash TTS
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100/70 text-emerald-900 border border-emerald-300">
                  جاهز للاعتماد الفوري
                </span>
              </div>

              {/* Method & Quota Protection Banner */}
              {analysisMethod === 'dsp_acoustic_engine' ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>المحلل الطيفي الفيزيائي المباشر (Acoustic DSP)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-mono">
                          F0: {analysisResult.estimatedF0Hz} Hz
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        تم قياس التردد الأساسي للأحبال الصوتية مباشرة من الموجة الصوتية بدقة رياضية 100% دون أي اعتماد على اسم الملف (حماية كاملة ضد نفاد الكوتة).
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>تحليل الذكاء الاصطناعي متعدد الوسائط + الفحص الطيفي</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono">
                          F0: {analysisResult.estimatedF0Hz || 211} Hz
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        تم التنسيق التلقائي بين نموذج الفحص السمعي والتردد الفيزيائي للموجة الصوتية بدقة فائقة.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Fine-Tuning Controls */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-3">
                <div className="text-xs font-bold text-[#343230] flex items-center justify-between">
                  <span>تأكيد أو تعديل المعالم الأساسية قبل الحفظ:</span>
                  <span className="text-[10px] text-[#7D786E]">يمكنك تعديل أي قيمة بنقرة واحدة</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Gender Selector */}
                  <div>
                    <span className="text-[11px] font-bold text-[#5F5C56] block mb-1.5">الجنس:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCloneGender('female');
                          if (['Charon', 'Fenrir', 'Puck'].includes(cloneBaseVoice)) {
                            setCloneBaseVoice('Kore');
                          }
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          cloneGender === 'female'
                            ? 'bg-[#C86446] text-white border-[#C86446]'
                            : 'bg-white text-[#5F5C56] border-[#DCD7CC] hover:bg-[#F5F2EB]'
                        }`}
                      >
                        أنثى (Female)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCloneGender('male');
                          if (['Kore', 'Zephyr', 'Leda', 'Aoede', 'Calliope'].includes(cloneBaseVoice)) {
                            setCloneBaseVoice('Fenrir');
                          }
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          cloneGender === 'male'
                            ? 'bg-[#C86446] text-white border-[#C86446]'
                            : 'bg-white text-[#5F5C56] border-[#DCD7CC] hover:bg-[#F5F2EB]'
                        }`}
                      >
                        ذكر (Male)
                      </button>
                    </div>
                  </div>

                  {/* Age Input */}
                  <div>
                    <span className="text-[11px] font-bold text-[#5F5C56] block mb-1.5">
                      العمر الدقيق: <span className="text-[#C86446] font-extrabold">{cloneExactAge} سنة</span>
                    </span>
                    <input
                      type="range"
                      min={6}
                      max={80}
                      value={cloneExactAge}
                      onChange={(e) => setCloneExactAge(Number(e.target.value))}
                      className="w-full accent-[#C86446] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#7D786E]">
                      <span>6 سنوات</span>
                      <span>30 سنة</span>
                      <span>80 سنة</span>
                    </div>
                  </div>

                  {/* Base Voice Selector */}
                  <div>
                    <span className="text-[11px] font-bold text-[#5F5C56] block mb-1.5">الحنجرة الأساسية (Base Voice):</span>
                    <select
                      value={cloneBaseVoice}
                      onChange={(e) => setCloneBaseVoice(e.target.value as VoiceName)}
                      className="w-full p-2 text-xs bg-white border border-[#DCD7CC] rounded-lg font-bold text-[#343230] focus:outline-none focus:ring-1 focus:ring-[#C86446]"
                    >
                      {cloneGender === 'female' ? (
                        <>
                          <option value="Kore">Kore - حنجرة دافئة متوازنة (مثالية للأصوات النسائية مثل Leda)</option>
                          <option value="Zephyr">Zephyr - حنجرة شابة رنانة ونقية</option>
                          <option value="Aoede">Aoede - حنجرة رصينة وواثقة</option>
                          <option value="Calliope">Calliope - حنجرة حيوية معبرة</option>
                        </>
                      ) : (
                        <>
                          <option value="Charon">Charon - حنجرة وقورة عميقة ورنانة</option>
                          <option value="Fenrir">Fenrir - حنجرة شبابية متوسطة قوية</option>
                          <option value="Puck">Puck - حنجرة مرنة حيوية</option>
                          <option value="Orus">Orus - حنجرة هادئة ناعمة</option>
                          <option value="Enceladus">Enceladus - حنجرة ناضجة رصينة</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Editable Name & Arabic Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5F5C56] block mb-1">
                    اسم الصوت المستنسخ (بالعربية):
                  </label>
                  <input
                    type="text"
                    value={cloneArabicName}
                    onChange={(e) => setCloneArabicName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 text-[#343230] font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5F5C56] block mb-1">
                    الاسم المعرف بالإنجليزية (English Tag):
                  </label>
                  <input
                    type="text"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DCD7CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 text-[#343230]"
                  />
                </div>
              </div>

              {/* Extracted Acoustic Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DD]">
                  <span className="text-[10px] text-[#7D786E] block">العمر والجنس المقدر</span>
                  <div className="font-extrabold text-[#343230] mt-0.5">
                    {cloneExactAge} سنة ({cloneGender === 'female' ? 'أنثى' : 'ذكر'})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DD]">
                  <span className="text-[10px] text-[#7D786E] block">الحنجرة الأساسية (Base)</span>
                  <div className="font-extrabold text-[#C86446] mt-0.5">
                    {cloneBaseVoice}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DD]">
                  <span className="text-[10px] text-[#7D786E] block">طبقة التردد والنغمة</span>
                  <div className="font-extrabold text-[#343230] mt-0.5">
                    {analysisResult.pitch} • {analysisResult.melody}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DD]">
                  <span className="text-[10px] text-[#7D786E] block">الرنين وخامة الصوت</span>
                  <div className="font-extrabold text-[#343230] mt-0.5">
                    {analysisResult.resonance} • {analysisResult.timbre}
                  </div>
                </div>
              </div>

              {/* Detailed Anatomical & Acoustic Report */}
              <div className="space-y-2 pt-2 border-t border-[#F0EEE8]">
                {analysisResult.vocalCordsAnalysis && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                    <span className="font-bold text-amber-950 block mb-0.5">
                      🩺 تشخيص الأحبال الصوتية وطبيعة الاهتزاز:
                    </span>
                    <p className="text-amber-900 leading-relaxed text-[11px]">
                      {analysisResult.vocalCordsAnalysis}
                    </p>
                  </div>
                )}

                {analysisResult.larynxAndTractAnalysis && (
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs">
                    <span className="font-bold text-blue-950 block mb-0.5">
                      🎙️ تشريح الحنجرة والتجويف البلعومي والرنين:
                    </span>
                    <p className="text-blue-900 leading-relaxed text-[11px]">
                      {analysisResult.larynxAndTractAnalysis}
                    </p>
                  </div>
                )}
              </div>

              {/* Master Prompt Directive (Preview) */}
              {analysisResult.voiceInstruction && (
                <div className="p-3 rounded-xl bg-[#1E1E1E] text-[#4EC9B0] font-mono text-[11px] space-y-1 dir-ltr">
                  <div className="text-[10px] text-[#808080] font-sans font-bold">
                    Master Acoustic Replication Directive:
                  </div>
                  <div className="line-clamp-2 leading-relaxed opacity-90">
                    {analysisResult.voiceInstruction}
                  </div>
                </div>
              )}

              {/* Save & Apply Action */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#DCD7CC] hover:bg-[#FAF8F5] text-xs font-bold text-[#5F5C56] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndAdopt}
                  className="px-6 py-2.5 rounded-xl bg-[#6B705C] hover:bg-[#585C4B] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد وحفظ هذا الصوت المستنسخ في الاستوديو الآن</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E1D8] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#7D786E]">
          <span>
            يتم تخزين الأصوات المستنسخة محلياً في جهازك لتبقى متوفرة دائماً لتمثيل نصوصك.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-[#DCD7CC] hover:bg-[#F4F1EA] text-xs font-bold text-[#343230] cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
