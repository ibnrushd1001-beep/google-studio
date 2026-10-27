import React from 'react';
import {
  AgeCategory,
  PitchLevel,
  VocalTimbre,
  Gender,
  VoiceCustomization,
} from '../types';
import {
  AGE_STAGES,
  PITCH_OPTIONS,
  TIMBRE_OPTIONS,
  getStageFromAge,
} from '../utils/dramaticVoice';
import { User, Activity, Sliders, CheckCircle2 } from 'lucide-react';

interface AgeAndPitchControlProps {
  exactAge: number;
  pitch: PitchLevel;
  timbre?: VocalTimbre;
  gender: Gender;
  isRtl?: boolean;
  onUpdate: (updates: {
    exactAge?: number;
    age?: AgeCategory;
    pitch?: PitchLevel;
    timbre?: VocalTimbre;
  }) => void;
  onOpenAdvancedModal?: () => void;
}

export const AgeAndPitchControl: React.FC<AgeAndPitchControlProps> = ({
  exactAge,
  pitch,
  timbre = 'bright',
  gender,
  isRtl = true,
  onUpdate,
  onOpenAdvancedModal,
}) => {
  const currentStage = getStageFromAge(exactAge);

  const handleAgeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const stage = getStageFromAge(val);
      onUpdate({
        exactAge: val,
        age: stage.id,
      });
    }
  };

  const handleStageClick = (stageId: AgeCategory) => {
    const found = AGE_STAGES.find((s) => s.id === stageId);
    if (found) {
      // Intelligently suggest pitch only if transitioning to/from childhood
      let suggestedPitch = pitch;
      if (found.defaultAge <= 7) suggestedPitch = 'very_high';
      else if (found.defaultAge <= 11 && (pitch === 'deep' || pitch === 'very_deep'))
        suggestedPitch = 'high';
      else if (found.defaultAge >= 55 && (pitch === 'very_high' || pitch === 'high'))
        suggestedPitch = 'deep';

      onUpdate({
        exactAge: found.defaultAge,
        age: stageId,
        pitch: suggestedPitch,
      });
    }
  };

  const handlePitchClick = (p: PitchLevel) => {
    onUpdate({ pitch: p });
  };

  const handleTimbreClick = (t: VocalTimbre) => {
    onUpdate({ timbre: t });
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E5E1D8] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E1D8]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#6B705C]/15 text-[#5B604C] flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#43413E]">
                {isRtl ? 'تحديد العمر والطبقة الصوتية للشخصية' : 'Age & Vocal Pitch Selection'}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#6B705C]/15 text-[#5B604C]">
                <CheckCircle2 className="w-3 h-3" />
                {isRtl ? 'تطبيق فوري مباشر' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-[#7D786E]">
              {isRtl
                ? 'تحكّم مباشر في العمر الدقيق للشخصية والطبقة الترددية دون الحاجة لفتح نوافذ إضافية'
                : 'Direct in-place control of character age & vocal pitch without modal disruption'}
            </p>
          </div>
        </div>

        {onOpenAdvancedModal && (
          <button
            type="button"
            onClick={onOpenAdvancedModal}
            className="self-start sm:self-auto text-xs font-semibold text-[#6B705C] hover:text-[#5B604C] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{isRtl ? 'استوديو التخصيص الكامل ←' : 'Full Customizer →'}</span>
          </button>
        )}
      </div>

      {/* 1. Age Selection Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#43413E] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#6B705C]" />
            <span>{isRtl ? '1. المرحلة العمرية والعمر الدقيق:' : '1. Age Stage & Exact Age:'}</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#6B705C] text-white text-xs font-bold shadow-2xs">
              {isRtl ? `${exactAge} سنة` : `${exactAge} years`}
            </span>
            <span className="text-xs text-[#7D786E] font-medium">
              ({isRtl ? currentStage.arabicLabel : currentStage.label})
            </span>
          </div>
        </div>

        {/* 6 Age Stage Quick Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {AGE_STAGES.map((st) => {
            const isSelected = currentStage.id === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStageClick(st.id)}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#43413E] border-[#6B705C] ring-2 ring-[#6B705C]/30 shadow-xs'
                    : 'bg-white/60 text-[#7D786E] border-[#E5E1D8] hover:bg-white hover:border-[#DCD7CC]'
                }`}
              >
                <div className="text-[11px] font-bold truncate">
                  {isRtl ? st.arabicLabel : st.label}
                </div>
                <div className="text-[10px] text-[#A5A58D] mt-0.5">
                  {st.minAge}-{st.maxAge} {isRtl ? 'سنة' : 'y'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Direct Exact Age Number Input Box (خانة تحديد العمر الدقيق) */}
        <div className="bg-white border-2 border-[#6B705C]/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#6B705C]" />
            <div>
              <span className="text-xs font-bold text-[#43413E] block">
                {isRtl ? 'خانة تحديد العمر الدقيق للشخصية:' : 'Exact Age Input Box (Years):'}
              </span>
              <span className="text-[11px] text-[#7D786E]">
                {isRtl ? 'اكتب العمر المطلوب مباشرة أو استخدم زري (+ / -)' : 'Type age directly or click (+ / -)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="age-decrement-btn"
              onClick={() => {
                const newAge = Math.max(4, exactAge - 1);
                const stage = getStageFromAge(newAge);
                onUpdate({ exactAge: newAge, age: stage.id });
              }}
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#DCD7CC] hover:bg-[#EDE9E1] font-bold text-lg flex items-center justify-center text-[#43413E] cursor-pointer shadow-2xs transition-colors"
              title={isRtl ? 'إنقاص سنة' : '-1 year'}
            >
              -
            </button>

            <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border-2 border-[#6B705C]">
              <input
                type="number"
                id="exact-age-number-input"
                min={4}
                max={85}
                value={exactAge}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 4 && val <= 85) {
                    const stage = getStageFromAge(val);
                    onUpdate({ exactAge: val, age: stage.id });
                  }
                }}
                className="w-16 text-center font-extrabold text-base text-[#43413E] bg-transparent focus:outline-none"
              />
              <span className="text-xs font-bold text-[#6B705C]">
                {isRtl ? 'سنة' : 'yrs'}
              </span>
            </div>

            <button
              type="button"
              id="age-increment-btn"
              onClick={() => {
                const newAge = Math.min(85, exactAge + 1);
                const stage = getStageFromAge(newAge);
                onUpdate({ exactAge: newAge, age: stage.id });
              }}
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#DCD7CC] hover:bg-[#EDE9E1] font-bold text-lg flex items-center justify-center text-[#43413E] cursor-pointer shadow-2xs transition-colors"
              title={isRtl ? 'زيادة سنة' : '+1 year'}
            >
              +
            </button>
          </div>
        </div>

        {/* Exact Age Slider */}
        <div className="bg-white/80 border border-[#E5E1D8] rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7D786E]">
            <span>{isRtl ? '4 سنوات (طفل)' : '4y (Child)'}</span>
            <span className="font-semibold text-[#43413E]">
              {isRtl ? `العمر الحالي المختار: ${exactAge} سنة` : `Current Age: ${exactAge}y`}
            </span>
            <span>{isRtl ? '85 سنة (مسن)' : '85y (Elder)'}</span>
          </div>
          <input
            type="range"
            min={4}
            max={85}
            step={1}
            value={exactAge}
            onChange={handleAgeSliderChange}
            className="w-full accent-[#6B705C] cursor-pointer"
          />
        </div>
      </div>

      {/* 2. Pitch Selection Section */}
      <div className="space-y-2.5 pt-2 border-t border-[#E5E1D8]/60">
        <label className="text-xs font-bold text-[#43413E] flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#6B705C]" />
          <span>{isRtl ? '2. طبقة الصوت (التردد F0):' : '2. Vocal Pitch:'}</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PITCH_OPTIONS.map((opt) => {
            const isSelected = pitch === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handlePitchClick(opt.id)}
                className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#43413E] border-[#6B705C] ring-2 ring-[#6B705C]/30 shadow-xs'
                    : 'bg-white/60 text-[#7D786E] border-[#E5E1D8] hover:bg-white hover:border-[#DCD7CC]'
                }`}
              >
                <div className="text-xs font-bold text-[#43413E]">
                  {isRtl ? opt.arabicLabel : opt.label}
                </div>
                <div className="text-[10px] text-[#A5A58D] mt-0.5 line-clamp-1">
                  {isRtl ? opt.arabicDescription : opt.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
