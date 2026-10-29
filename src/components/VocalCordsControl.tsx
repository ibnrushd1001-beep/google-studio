import React from 'react';
import {
  VoiceCustomization,
  VocalCordsTension,
  VocalCordTremor,
  StagingDistance,
  EmotionalArcConfig,
} from '../types';
import {
  VOCAL_CORDS_TENSION_OPTIONS,
  VOCAL_CORD_TREMOR_OPTIONS,
  STAGING_OPTIONS,
} from '../utils/dramaticVoice';
import { EMOTIONS } from '../emotions';
import {
  Activity,
  Mic,
  Waves,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Wind,
} from 'lucide-react';

interface VocalCordsControlProps {
  customization?: VoiceCustomization;
  onChange: (updated: Partial<VoiceCustomization>) => void;
  isRtl: boolean;
}

export const VocalCordsControl: React.FC<VocalCordsControlProps> = ({
  customization = {} as VoiceCustomization,
  onChange,
  isRtl,
}) => {
  const currentTension: VocalCordsTension = customization.vocalCordsTension || 'elastic_melodic';
  const currentTremor: VocalCordTremor = customization.vocalCordTremor || 'steady_pure';
  const currentStaging: StagingDistance = customization.stagingDistance || 'standard_studio';
  const emotionalArc: EmotionalArcConfig = customization.emotionalArc || {
    enabled: false,
    startEmotion: 'natural_neutral',
    targetEmotion: 'astonished',
    climaxPoint: 'final_third',
  };
  const smartHesitationBeats = Boolean(customization.smartHesitationBeats);

  return (
    <div className="bg-white rounded-3xl border-2 border-[#C86446]/30 p-5 sm:p-6 shadow-sm space-y-5">
      {/* 1. High-Visibility Badge & Notice (تنويه الأجزاء المخصصة للأحبال الصوتية) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#C86446]/10 via-[#FAF8F5] to-amber-500/10 border border-[#C86446]/30">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C86446] text-white shadow-xs shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-[#343230]">
                {isRtl ? 'تحكم ميكانيكا الأحبال الصوتية ورنين الحنجرة' : 'Vocal Cords & Glottal Dynamics'}
              </span>
              <span className="text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-[#C86446] text-white shadow-2xs">
                {isRtl ? 'مخصص للأحبال الصوتية 🫁' : 'Dedicated Vocal Cords Control'}
              </span>
            </div>
            <p className="text-xs text-[#7D786E] mt-0.5 leading-relaxed">
              {isRtl
                ? 'توجيه مباشر لانغلاق وانفتاح المزمار الحنجري، توتر ومرونة الأحبال، ورعشة التأثر الصوتي المجهرية.'
                : 'Direct control over glottal adduction, vocal fold elasticity, micro-tremor, and acoustic distance.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-white/80 px-2.5 py-1 rounded-xl border border-[#DCD7CC] text-[11px] font-bold text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isRtl ? 'نقاء صوتي متقدم' : 'Acoustic Precision'}</span>
        </div>
      </div>

      {/* 2. Vocal Cords Tension (توتر وانغلاق المزمار) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-[#343230] flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-[#C86446]" />
            <span>{isRtl ? 'توتر وانغلاق الأحبال الصوتية (Glottal Tension):' : 'Vocal Cords Tension:'}</span>
          </label>
          <span className="text-[11px] font-semibold text-[#7D786E]">
            {VOCAL_CORDS_TENSION_OPTIONS.find((t) => t.id === currentTension)?.arabicLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {VOCAL_CORDS_TENSION_OPTIONS.map((opt) => {
            const isSelected = currentTension === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ vocalCordsTension: opt.id })}
                className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-white to-[#FAF8F5] border-[#C86446] ring-2 ring-[#C86446]/25 shadow-xs'
                    : 'bg-[#FAF8F5]/60 hover:bg-white border-[#E5E1D8] text-[#55524E]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-bold text-xs ${
                      isSelected ? 'text-[#C86446]' : 'text-[#343230]'
                    }`}
                  >
                    {isRtl ? opt.arabicLabel : opt.label}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#C86446]" />
                  )}
                </div>
                <p className="text-[10px] text-[#7D786E] leading-relaxed line-clamp-2">
                  {isRtl ? opt.arabicDescription : opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Vocal Cord Micro-Tremor (رعشة واهتزاز الأحبال الصوتية) */}
      <div className="space-y-2.5 pt-2 border-t border-[#E5E1D8]/70">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-[#343230] flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-[#5A6E82]" />
            <span>{isRtl ? 'اهتزاز ورعشة الأحبال الصوتية (Micro-Tremor & Vibrato):' : 'Vocal Cord Tremor:'}</span>
          </label>
          <span className="text-[11px] font-semibold text-[#7D786E]">
            {VOCAL_CORD_TREMOR_OPTIONS.find((t) => t.id === currentTremor)?.arabicLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {VOCAL_CORD_TREMOR_OPTIONS.map((opt) => {
            const isSelected = currentTremor === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ vocalCordTremor: opt.id })}
                className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-white to-[#FAF8F5] border-[#5A6E82] ring-2 ring-[#5A6E82]/25 shadow-xs'
                    : 'bg-[#FAF8F5]/60 hover:bg-white border-[#E5E1D8] text-[#55524E]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-bold text-xs ${
                      isSelected ? 'text-[#5A6E82]' : 'text-[#343230]'
                    }`}
                  >
                    {isRtl ? opt.arabicLabel : opt.label}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#5A6E82]" />
                  )}
                </div>
                <p className="text-[10px] text-[#7D786E] leading-relaxed line-clamp-2">
                  {isRtl ? opt.arabicDescription : opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Acting Suggestions 1, 2, and 4 (المقترحات الدرامية المعتمدة: 1 و 2 و 4) */}
      <div className="pt-2 border-t border-[#E5E1D8]/70 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#6B705C] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تحسينات الأداء والتمثيل الدرامي (المقترحات 1 و 2 و 4):' : 'Advanced Dramatic Acting Enhancements:'}</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            {isRtl ? 'مُفعّل' : 'Active'}
          </span>
        </div>

        {/* Suggestion 4: Staging Proximity & Mic Distance (المسافة الصوتية وقرب الميكروفون) */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E1D8] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#43413E] flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#C86446]" />
              <span>{isRtl ? 'مقترح 4: المسافة الصوتية وقرب الميكروفون (Acoustic Staging):' : 'Suggestion 4: Acoustic Staging Proximity:'}</span>
            </label>
            <span className="text-[10px] font-semibold text-[#7D786E]">
              {STAGING_OPTIONS.find((s) => s.id === currentStaging)?.arabicLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {STAGING_OPTIONS.map((opt) => {
              const isSelected = currentStaging === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ stagingDistance: opt.id })}
                  className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#C86446] ring-2 ring-[#C86446]/20 shadow-2xs font-bold'
                      : 'bg-white/60 hover:bg-white border-[#E5E1D8] text-[#55524E]'
                  }`}
                >
                  <div className="text-xs text-[#343230] font-bold mb-0.5">
                    {isRtl ? opt.arabicLabel : opt.label}
                  </div>
                  <div className="text-[10px] text-[#7D786E] leading-tight">
                    {isRtl ? opt.arabicDescription : opt.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggestion 1: Dynamic Emotional Arc (التحول الشعوري التدريجي نحو الذروة) */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E1D8] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-[#43413E] flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-[#5A6E82]" />
              <span>{isRtl ? 'مقترح 1: القوس الشعوري الدرامي المتصاعد (Dynamic Emotional Arc):' : 'Suggestion 1: Dynamic Emotional Arc:'}</span>
            </label>

            <button
              type="button"
              onClick={() =>
                onChange({
                  emotionalArc: {
                    ...emotionalArc,
                    enabled: !emotionalArc.enabled,
                  },
                })
              }
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                emotionalArc.enabled
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-[#7D786E] border-[#DCD7CC] hover:bg-[#FAF8F5]'
              }`}
            >
              <span>{emotionalArc.enabled ? (isRtl ? '✓ قيد التفعيل' : 'Enabled') : (isRtl ? 'غير مفعّل' : 'Disabled')}</span>
            </button>
          </div>

          {emotionalArc.enabled && (
            <div className="p-3 bg-white rounded-xl border border-[#E5E1D8] space-y-2.5 animate-fade-in">
              <p className="text-[11px] text-[#7D786E] leading-relaxed">
                {isRtl
                  ? 'يبدأ الممثل الأداء بنبرة انطلاق تمهيدية، ثم يتصاعد تدريجياً لتبلغ ذروتها الانفعالية عند نقطة الذروة.'
                  : 'The actor begins with an opening emotional state and organically transitions into the climactic peak.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#55524E] block mb-1">
                    {isRtl ? 'نبرة البداية:' : 'Starting State:'}
                  </label>
                  <select
                    value={emotionalArc.startEmotion}
                    onChange={(e) =>
                      onChange({
                        emotionalArc: {
                          ...emotionalArc,
                          startEmotion: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs p-1.5 bg-[#FAF8F5] border border-[#DCD7CC] rounded-lg text-[#343230]"
                  >
                    {EMOTIONS.map((em) => (
                      <option key={em.id} value={em.id}>
                        {isRtl ? em.arabicShortLabel : em.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#55524E] block mb-1">
                    {isRtl ? 'نبرة الذروة المنشودة:' : 'Climax Emotion:'}
                  </label>
                  <select
                    value={emotionalArc.targetEmotion}
                    onChange={(e) =>
                      onChange({
                        emotionalArc: {
                          ...emotionalArc,
                          targetEmotion: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs p-1.5 bg-[#FAF8F5] border border-[#DCD7CC] rounded-lg text-[#343230]"
                  >
                    {EMOTIONS.map((em) => (
                      <option key={em.id} value={em.id}>
                        {isRtl ? em.arabicShortLabel : em.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#55524E] block mb-1">
                    {isRtl ? 'موضع بلوغ الذروة:' : 'Climax Timing:'}
                  </label>
                  <select
                    value={emotionalArc.climaxPoint}
                    onChange={(e) =>
                      onChange({
                        emotionalArc: {
                          ...emotionalArc,
                          climaxPoint: e.target.value as any,
                        },
                      })
                    }
                    className="w-full text-xs p-1.5 bg-[#FAF8F5] border border-[#DCD7CC] rounded-lg text-[#343230]"
                  >
                    <option value="final_sentence">
                      {isRtl ? 'الجملة الختامية فقط' : 'Final sentence'}
                    </option>
                    <option value="final_third">
                      {isRtl ? 'الثلث الأخير من النص' : 'Final third of script'}
                    </option>
                    <option value="mid_script">
                      {isRtl ? 'منتصف النص' : 'Midpoint of script'}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion 2: Natural Cognitive Hesitation Beats (سكتات التردد الطبيعية) */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
          <div className="flex items-center gap-2.5">
            <input
              id="hesitation-beats-toggle"
              type="checkbox"
              checked={smartHesitationBeats}
              onChange={(e) => onChange({ smartHesitationBeats: e.target.checked })}
              className="w-4 h-4 accent-[#C86446] rounded cursor-pointer"
            />
            <label htmlFor="hesitation-beats-toggle" className="text-xs text-[#343230] font-bold cursor-pointer">
              {isRtl
                ? 'مقترح 2: سكتات التردد الطبيعية والتنفس الذهني (Natural Cognitive Micro-Hesitations)'
                : 'Suggestion 2: Natural Cognitive Micro-Hesitation Beats'}
              <span className="block text-[10px] text-[#7D786E] font-normal mt-0.5">
                {isRtl
                  ? 'إدخال سكتات تفكير بشرية طبيعية تمنع السرد الآلي وتضفي حيرة ومصداقية عفوية'
                  : 'Injects authentic 250ms cognitive pauses before emotional key phrases to prevent robotic flow.'}
              </span>
            </label>
          </div>
          <span className="text-[10px] font-bold text-[#6B705C] bg-white px-2 py-0.5 rounded-md border border-[#DCD7CC] shrink-0">
            {smartHesitationBeats ? (isRtl ? 'مُفعّل' : 'Active') : (isRtl ? 'متوقف' : 'Off')}
          </span>
        </div>
      </div>
    </div>
  );
};
