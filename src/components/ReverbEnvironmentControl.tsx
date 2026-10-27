import React, { useState } from 'react';
import {
  Volume2,
  Waves,
  Sparkles,
  Building2,
  Home,
  Theater,
  Radio,
  Sliders,
} from 'lucide-react';
import { ReverbEnvironment } from '../types';
import {
  REVERB_ENVIRONMENTS,
  REVERB_ENVIRONMENTS_LIST,
  REVERB_LEVEL_PRESETS,
} from '../utils/dramaticVoice';
import { playReverbPreviewTone } from '../utils/audio';

interface ReverbEnvironmentControlProps {
  reverbEnvironment: ReverbEnvironment;
  reverbLevel: number;
  onSelectEnvironment: (env: ReverbEnvironment) => void;
  onChangeLevel: (level: number) => void;
  isRtl?: boolean;
  customTitle?: string;
  customSubtitle?: string;
}

export const ReverbEnvironmentControl: React.FC<ReverbEnvironmentControlProps> = ({
  reverbEnvironment,
  reverbLevel,
  onSelectEnvironment,
  onChangeLevel,
  isRtl = true,
  customTitle,
  customSubtitle,
}) => {
  const [isPlayingAudition, setIsPlayingAudition] = useState<boolean>(false);

  const activeEnvInfo =
    REVERB_ENVIRONMENTS[reverbEnvironment] || REVERB_ENVIRONMENTS.dry_studio;

  const handleAudition = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlayingAudition(true);
    playReverbPreviewTone(reverbEnvironment, reverbLevel);
    setTimeout(() => {
      setIsPlayingAudition(false);
    }, Math.max(1200, (activeEnvInfo.impulseDuration || 1) * 1000 + 400));
  };

  const getEnvIcon = (id: ReverbEnvironment) => {
    switch (id) {
      case 'dry_studio':
        return <Radio className="w-4 h-4 text-emerald-600" />;
      case 'small_room':
        return <Home className="w-4 h-4 text-amber-600" />;
      case 'grand_theater':
        return <Theater className="w-4 h-4 text-[#C86446]" />;
      case 'vast_space':
        return <Building2 className="w-4 h-4 text-purple-600" />;
      default:
        return <Waves className="w-4 h-4 text-[#6B705C]" />;
    }
  };

  return (
    <div
      id="reverb-acoustic-environment-section"
      className="bg-white rounded-2xl border border-[#E5E1D8] p-4 sm:p-5 shadow-2xs space-y-4"
    >
      {/* Header with Title and Audition Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EEE8]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5A6E82]/15 text-[#5A6E82] flex items-center justify-center shrink-0">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-[#343230]">
                {customTitle || (isRtl ? 'صدى الصوت والبيئة الصوتية المحيطة' : 'Reverb & Acoustic Environment')}
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#5A6E82]/10 text-[#5A6E82] border border-[#5A6E82]/20">
                {isRtl ? activeEnvInfo.arabicLabel.split('(')[0].trim() : activeEnvInfo.label.split('(')[0].trim()}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {reverbLevel === 0
                  ? (isRtl ? 'صوت جاف معزول' : 'Dry 0%')
                  : `${reverbLevel}% ${isRtl ? 'ارتداد' : 'Wet'}`}
              </span>
            </div>
            <p className="text-[11px] text-[#7D786E] mt-0.5">
              {customSubtitle ||
                (isRtl
                  ? 'تحكم منفصل ومباشر في محاكاة صدى المكان وحجم الغرفة أو المسرح وانعكاسات الحوائط'
                  : 'Direct control over physical room acoustic reflections, room size, and reverb decay')}
            </p>
          </div>
        </div>

        {/* Live Audio Audition Button */}
        <button
          type="button"
          onClick={handleAudition}
          className={`self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
            isPlayingAudition
              ? 'bg-[#5A6E82] text-white shadow-md'
              : 'bg-[#FAF8F5] border border-[#DCD7CC] hover:bg-[#EDE9E1] text-[#43413E]'
          }`}
          title={isRtl ? 'استمع لمحاكاة صوتية فورية لصدى البيئة المختارة' : 'Audition room reverb'}
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudition ? 'animate-pulse text-amber-300' : 'text-[#5A6E82]'}`} />
          <span>{isPlayingAudition ? (isRtl ? 'جاري محاكاة الصدى...' : 'Auditioning...') : (isRtl ? 'استمع لصدى البيئة 🔊' : 'Audition Reverb')}</span>
        </button>
      </div>

      {/* 4 Environment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {REVERB_ENVIRONMENTS_LIST.map((env) => {
          const isSelected = reverbEnvironment === env.id;
          return (
            <button
              key={env.id}
              type="button"
              onClick={() => {
                onSelectEnvironment(env.id);
                if (env.id === 'dry_studio') {
                  onChangeLevel(0);
                } else if (reverbLevel === 0) {
                  onChangeLevel(env.defaultLevel);
                }
              }}
              className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-[#5A6E82]/10 border-[#5A6E82] shadow-xs ring-1 ring-[#5A6E82]/30'
                  : 'bg-white border-[#E5E1D8] hover:border-[#DCD7CC] hover:bg-[#FAF8F5]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#343230]">
                    {getEnvIcon(env.id)}
                    <span className="truncate">
                      {isRtl ? env.arabicLabel.split('(')[0].trim() : env.label.split('(')[0].trim()}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#5A6E82] shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-[#7D786E] leading-relaxed line-clamp-2">
                  {isRtl ? env.arabicDescription : env.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#F0EEE8] flex items-center justify-between text-[10px] text-[#7D786E]">
                <span>{isRtl ? env.arabicRoomSizeLabel : env.roomSizeLabel}</span>
                <span className="font-semibold text-[#5A6E82]">
                  {env.defaultLevel === 0 ? '0%' : `${env.defaultLevel}%`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reverb Level Slider & Preset Buttons */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#5A6E82]" />
            <label className="text-xs font-bold text-[#43413E]">
              {isRtl ? 'مستوى قوة وتلاشي صدى الصوت (Reverb Intensity):' : 'Reverb Intensity & Decay:'}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#5A6E82] px-2.5 py-0.5 rounded-lg bg-white border border-[#DCD7CC] shadow-2xs">
              {reverbLevel}%
            </span>
            <span className="text-[11px] text-[#7D786E]">
              {reverbLevel === 0
                ? (isRtl ? 'جاف تماماً بدون ارتداد' : 'Dry - Zero reverb')
                : reverbLevel < 35
                ? (isRtl ? 'ارتداد طبيعي خفيف' : 'Subtle near-field')
                : reverbLevel < 70
                ? (isRtl ? 'صدى مسرحي متوسط' : 'Medium theatrical')
                : (isRtl ? 'صدى سينمائي عميق' : 'Deep cinematic wetness')}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={reverbLevel}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChangeLevel(val);
            if (val > 0 && reverbEnvironment === 'dry_studio') {
              onSelectEnvironment('small_room');
            }
          }}
          className="w-full accent-[#5A6E82] cursor-pointer"
        />

        {/* Quick Level Preset Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
          <span className="text-[10px] text-[#7D786E] font-medium">
            {isRtl ? 'مستويات سريعة:' : 'Quick Presets:'}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {REVERB_LEVEL_PRESETS.map((pst) => {
              const isMatch = reverbLevel === pst.level;
              return (
                <button
                  key={pst.level}
                  type="button"
                  onClick={() => {
                    onChangeLevel(pst.level);
                    if (pst.level === 0) {
                      onSelectEnvironment('dry_studio');
                    } else if (reverbEnvironment === 'dry_studio') {
                      onSelectEnvironment('small_room');
                    }
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    isMatch
                      ? 'bg-[#5A6E82] text-white shadow-2xs'
                      : 'bg-white border border-[#DCD7CC] text-[#7D786E] hover:bg-[#EDE9E1]'
                  }`}
                >
                  {isRtl ? pst.arabicLabel : pst.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
