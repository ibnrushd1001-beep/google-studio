import React from 'react';
import { VocalAnalysisResult } from '../types';
import {
  Sparkles,
  Activity,
  CheckCircle2,
  AlertCircle,
  Volume2,
  RefreshCw,
  X,
  ShieldCheck,
  TrendingUp,
  Waves,
  Feather,
} from 'lucide-react';

interface VocalAnalysisPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  analysis: VocalAnalysisResult | null;
  errorMessage: string | null;
  onReanalyze: () => void;
  isRtl: boolean;
}

export const VocalAnalysisPopover: React.FC<VocalAnalysisPopoverProps> = ({
  isOpen,
  onClose,
  isLoading,
  analysis,
  errorMessage,
  onReanalyze,
  isRtl,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="mt-3 p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#6B705C]/30 shadow-xl space-y-4 animate-fade-in relative z-20 text-[#343230]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#6B705C]/15 text-[#6B705C] flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-[#6B705C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-[#343230]">
                {isRtl ? 'تحليل الخصائص الصوتية المتقدم (Gemini Audio)' : 'AI Vocal Characteristics Analysis'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {isRtl ? 'فحص حنجري مباشر' : 'Acoustic AI'}
              </span>
            </div>
            <p className="text-[11px] text-[#7D786E]">
              {isRtl
                ? 'فحص الاتساق الشعوري، استقرار النغمة، نقاء المخارج، والتشريح المزماري'
                : 'Auditory inspection of emotional consistency, pitch stability, and diction'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg text-[#7D786E] hover:text-[#343230] hover:bg-[#FAF8F5] flex items-center justify-center transition-colors cursor-pointer"
          title={isRtl ? 'إغلاق' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-3 border-[#6B705C]/20 border-t-[#6B705C] animate-spin" />
            <Sparkles className="w-5 h-5 text-[#C86446] absolute inset-0 m-auto animate-pulse" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#343230]">
              {isRtl
                ? 'جارٍ الاستماع والتحليل الطيفي لترددات التسجيل الصوتي...'
                : 'Listening & analyzing acoustic spectral features with Gemini...'}
            </p>
            <p className="text-[11px] text-[#7D786E] mt-0.5">
              {isRtl ? 'فحص ثبات التردد ونقاء النبرة والاتساق الدرامي' : 'Evaluating pitch stability and enunciation purity'}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">{isRtl ? 'تعذر إتمام التحليل الصوتي' : 'Vocal analysis failed'}</p>
            <p className="text-[11px] mt-0.5 text-red-700">{errorMessage}</p>
            <button
              type="button"
              onClick={onReanalyze}
              className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-900 font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isRtl ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {!isLoading && analysis && (
        <div className="space-y-4">
          {/* Overall Verdict & Big Score */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FAF8F5] via-white to-emerald-50/50 border border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B604C]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isRtl ? 'الحكم الصوتي والإخراجي العام:' : 'Overall Vocal Verdict:'}</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-[#343230] leading-snug">
                {analysis.overallVerdict}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[#DCD7CC] shadow-2xs">
              <span className="text-xs font-bold text-[#7D786E]">
                {isRtl ? 'الدرجة الكلية:' : 'Score:'}
              </span>
              <span className="text-lg font-black text-emerald-700 font-mono">
                {analysis.overallScore}%
              </span>
            </div>
          </div>

          {/* 3 Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Emotional Consistency */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#43413E] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C86446]" />
                  <span>{isRtl ? 'الاتساق الشعوري' : 'Emotional Consistency'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#C86446]">
                  {analysis.emotionalConsistency.score}%
                </span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C86446] h-full rounded-full transition-all"
                  style={{ width: `${analysis.emotionalConsistency.score}%` }}
                />
              </div>
              <div className="text-[10px] font-bold text-[#C86446]">
                {analysis.emotionalConsistency.arabicLabel}
              </div>
              <p className="text-[10px] text-[#7D786E] leading-relaxed line-clamp-3">
                {analysis.emotionalConsistency.feedback}
              </p>
            </div>

            {/* 2. Pitch Stability */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#43413E] flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-[#5A6E82]" />
                  <span>{isRtl ? 'استقرار النغمة' : 'Pitch Stability'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#5A6E82]">
                  {analysis.pitchStability.score}%
                </span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#5A6E82] h-full rounded-full transition-all"
                  style={{ width: `${analysis.pitchStability.score}%` }}
                />
              </div>
              <div className="text-[10px] font-bold text-[#5A6E82]">
                {analysis.pitchStability.arabicLabel}
              </div>
              <p className="text-[10px] text-[#7D786E] leading-relaxed line-clamp-3">
                {analysis.pitchStability.feedback}
              </p>
            </div>

            {/* 3. Clarity & Diction */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#43413E] flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isRtl ? 'نقاء المخارج' : 'Clarity & Diction'}</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {analysis.clarityAndDiction.score}%
                </span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${analysis.clarityAndDiction.score}%` }}
                />
              </div>
              <div className="text-[10px] font-bold text-emerald-700">
                {analysis.clarityAndDiction.arabicLabel}
              </div>
              <p className="text-[10px] text-[#7D786E] leading-relaxed line-clamp-3">
                {analysis.clarityAndDiction.feedback}
              </p>
            </div>
          </div>

          {/* Vocal Anatomy Breakdown */}
          {analysis.vocalAnatomy && (
            <div className="p-3 rounded-xl bg-[#FCFBF9] border border-[#E5E1D8] space-y-2">
              <span className="text-[11px] font-bold text-[#55524E] flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-[#6B705C]" />
                <span>{isRtl ? 'التشريح الصوتي للحنجرة والأحبال المستخلصة:' : 'Vocal Anatomy & Resonance:'}</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                <div className="bg-white p-2 rounded-lg border border-[#EDE9E1]">
                  <span className="text-[#7D786E] block mb-0.5">{isRtl ? 'موضع الحنجرة:' : 'Larynx Position:'}</span>
                  <span className="font-bold text-[#343230]">{analysis.vocalAnatomy.larynxPosition}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#EDE9E1]">
                  <span className="text-[#7D786E] block mb-0.5">{isRtl ? 'توتر الأحبال:' : 'Cord Tension:'}</span>
                  <span className="font-bold text-[#343230]">{analysis.vocalAnatomy.cordTension}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-[#EDE9E1]">
                  <span className="text-[#7D786E] block mb-0.5">{isRtl ? 'الرنين التجويفي:' : 'Resonance:'}</span>
                  <span className="font-bold text-[#343230]">{analysis.vocalAnatomy.resonanceChamber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Director Notes */}
          {analysis.directorNotes && analysis.directorNotes.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{isRtl ? 'ملاحظات وتوجيهات المخرج الدرامية:' : 'Director Notes & Feedback:'}</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 leading-relaxed pr-1">
                {analysis.directorNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer with Refresh */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D8] text-xs">
            <span className="text-[10px] text-[#7D786E]">
              {isRtl ? 'تم الفحص بنموذج الذكاء الاصطناعي السمعي المتعدد الوسائط' : 'Analyzed via Gemini Audio Model'}
            </span>

            <button
              type="button"
              onClick={onReanalyze}
              className="px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F0EEE8] border border-[#DCD7CC] text-[#43413E] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#6B705C]" />
              <span>{isRtl ? 'إعادة الفحص' : 'Re-analyze'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
