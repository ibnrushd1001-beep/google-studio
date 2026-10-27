import React, { useState } from 'react';
import {
  VoiceOption,
  VoiceCategory,
  CustomVoicePreset,
  VoiceCustomization,
  VoiceName,
  EgyptianDialect,
} from '../types';
import { VOICES } from '../data';
import {
  Check,
  Mic,
  Plus,
  Sparkles,
  Sliders,
  Trash2,
  Smile,
  ShieldCheck,
  Compass,
  Volume2,
  X,
  Wand2,
  HardDrive,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { CustomVoiceModal } from './CustomVoiceModal';
import { DIALECT_SUB_STYLES } from '../utils/dramaticVoice';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoiceOption: (voice: VoiceOption) => void;
  customVoices: CustomVoicePreset[];
  voiceCustomizations?: Record<string, Partial<VoiceOption>>;
  deletedVoiceIds?: string[];
  onSaveCustomVoice: (voice: CustomVoicePreset) => void;
  onDeleteVoice: (id: string) => void;
  currentDialect: EgyptianDialect;
  onSelectDialect: (dialect: EgyptianDialect) => void;
  isRtl: boolean;
  onOpenCloneModal?: () => void;
  onOpenBackupModal?: () => void;
  onOpenGuideModal?: () => void;
}

type ExtendedCategory = 'all' | 'children' | 'adults' | 'alex' | 'nabd';

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoiceOption,
  customVoices,
  voiceCustomizations = {},
  deletedVoiceIds = [],
  onSaveCustomVoice,
  onDeleteVoice,
  currentDialect,
  onSelectDialect,
  isRtl,
  onOpenCloneModal,
  onOpenBackupModal,
  onOpenGuideModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<ExtendedCategory>('children');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<VoiceOption | CustomVoicePreset | null>(null);
  const [voiceToDelete, setVoiceToDelete] = useState<VoiceOption | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Convert custom presets into VoiceOption objects with exact age and persistence metadata
  // Filter out any custom presets that share the exact ID or name of a built-in voice to prevent duplicate cards
  const customVoiceOptions: VoiceOption[] = customVoices
    .filter((cv) => !VOICES.some((bv) => bv.id === cv.id || bv.arabicName === cv.arabicName))
    .map((cv) => {
      const age = cv.exactAge || cv.customization?.exactAge || 30;
      return {
        id: cv.id,
        name: cv.name,
        arabicName: cv.arabicName,
        baseVoice: cv.baseVoice,
        gender: cv.gender,
        category: age <= 14 ? 'child' : 'adult',
        ageGroup: age <= 14 ? 'child' : 'adult',
        exactAge: age,
        ageLabel: cv.ageLabel,
        arabicAgeLabel: cv.arabicAgeLabel,
        character: cv.character,
        arabicCharacter: cv.arabicCharacter,
        color: 'sage',
        avatarBg:
          cv.gender === 'female'
            ? 'bg-[#CB997E]/20 text-[#B07D62] border-[#CB997E]/40'
            : 'bg-[#6B705C]/15 text-[#6B705C] border-[#6B705C]/30',
        voiceInstruction: cv.voiceInstruction,
        isCustom: true,
        createdAt: cv.createdAt,
        customization: cv.customization,
      };
    });

  // Filter out any built-in voices marked as permanently deleted, and merge with in-place voiceCustomizations
  const activeBuiltInVoices = VOICES.filter((v) => !deletedVoiceIds.includes(v.id)).map((v) => {
    const custom = voiceCustomizations[v.id];
    if (!custom) return v;
    const mergedCustomization = {
      ...v.customization,
      ...custom.customization,
    };
    const isAlex =
      mergedCustomization.dialect === 'alex' ||
      (mergedCustomization.dialectSubStyle &&
        mergedCustomization.dialectSubStyle.startsWith('alex')) ||
      v.id.includes('alex');

    let arabicName = custom.arabicName || v.arabicName;
    let arabicCharacter = custom.arabicCharacter || v.arabicCharacter;
    if (isAlex) {
      arabicName = arabicName
        .replace(/قاهرية/g, 'إسكندرانية')
        .replace(/قاهري/g, 'إسكندراني')
        .replace(/القاهرة/g, 'الإسكندرية');
      arabicCharacter = arabicCharacter
        .replace(/قاهرية/g, 'إسكندرانية')
        .replace(/قاهري/g, 'إسكندراني')
        .replace(/القاهرة/g, 'الإسكندرية');
    }

    return {
      ...v,
      ...custom,
      arabicName,
      arabicCharacter,
      isModified: true,
      customization: mergedCustomization,
    };
  });

  const allVoices: VoiceOption[] = [...activeBuiltInVoices, ...customVoiceOptions];

  const filteredVoices = allVoices.filter((v) => {
    const age = v.exactAge || v.customization?.exactAge || (v.category === 'child' ? 10 : 30);
    const isAlex =
      v.customization?.dialect === 'alex' ||
      (v.customization?.dialectSubStyle && v.customization.dialectSubStyle.startsWith('alex')) ||
      v.id.includes('alex');
    const isVoiceNabd = v.id.startsWith('voice_nabd') || v.id.includes('nabd');

    if (activeCategory === 'nabd') {
      return isVoiceNabd;
    }
    if (activeCategory === 'children') {
      return !isVoiceNabd && (age <= 14 || v.category === 'child');
    }
    if (activeCategory === 'adults') {
      return !isVoiceNabd && (age > 14 || v.category === 'adult') && !isAlex;
    }
    if (activeCategory === 'alex') {
      return isAlex;
    }
    return true; // 'all'
  });

  const handleOpenNewModal = () => {
    setEditingVoice(null);
    setIsModalOpen(true);
  };

  const handleOpenCustomizeModal = (e: React.MouseEvent, voice: VoiceOption) => {
    e.stopPropagation();
    setEditingVoice(voice);
    setIsModalOpen(true);
  };

  const handleDeleteVoice = (e: React.MouseEvent, voice: VoiceOption) => {
    e.stopPropagation();
    setVoiceToDelete(voice);
  };

  const handleConfirmDelete = () => {
    if (!voiceToDelete) return;
    const deletedName = voiceToDelete.arabicName || voiceToDelete.name;
    onDeleteVoice(voiceToDelete.id);
    setToastMessage(
      isRtl ? `تم حذف الصوت «${deletedName}» نهائياً بنجاح` : `Voice "${deletedName}" permanently deleted`
    );
    setVoiceToDelete(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveCustomVoiceInternal = (preset: CustomVoicePreset) => {
    onSaveCustomVoice(preset);
    setIsModalOpen(false);

    setToastMessage(
      isRtl
        ? `تم تحديث وضبط صوت «${preset.arabicName || preset.name}» بنجاح!`
        : `Voice "${preset.name}" updated successfully!`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyToCurrent = (
    customization: VoiceCustomization,
    baseVoice: VoiceName,
    name: string,
    character?: string,
    arabicCharacter?: string
  ) => {
    const isAlex =
      customization.dialect === 'alex' ||
      (customization.dialectSubStyle && customization.dialectSubStyle.startsWith('alex'));
    const targetId = editingVoice
      ? editingVoice.id
      : `custom_voice_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    let finalArabicName = name || editingVoice?.arabicName || 'صوت مخصص';
    if (isAlex) {
      finalArabicName = finalArabicName
        .replace(/قاهرية/g, 'إسكندرانية')
        .replace(/قاهري/g, 'إسكندراني')
        .replace(/القاهرة/g, 'الإسكندرية');
    }
    const finalName = editingVoice?.name || name;

    const subStyleObj = DIALECT_SUB_STYLES.find(
      (s) => s.id === customization.dialectSubStyle
    );
    const subStyleLabel = subStyleObj
      ? isRtl
        ? subStyleObj.arabicLabel.split('(')[0].trim()
        : subStyleObj.label
      : isAlex
      ? isRtl
        ? 'لهجة إسكندرانية'
        : 'Alexandrian'
      : isRtl
      ? 'لهجة قاهرية'
      : 'Cairene';

    let finalArabicCharacter =
      arabicCharacter ||
      editingVoice?.arabicCharacter ||
      `صوت مخصص • ${customization.gender === 'male' ? 'ذكر' : 'أنثى'} • ${subStyleLabel} • حنجرة ${baseVoice}`;

    if (isAlex) {
      finalArabicCharacter = finalArabicCharacter
        .replace(/قاهرية/g, 'إسكندرانية')
        .replace(/قاهري/g, 'إسكندراني')
        .replace(/القاهرة/g, 'الإسكندرية');
    }

    const newPreset: CustomVoicePreset = {
      id: targetId,
      name: finalName,
      arabicName: finalArabicName,
      baseVoice,
      gender: customization.gender || editingVoice?.gender || 'female',
      exactAge: customization.exactAge || editingVoice?.exactAge || 10,
      ageLabel: `${customization.exactAge || editingVoice?.exactAge || 10}y`,
      arabicAgeLabel: `${customization.exactAge || editingVoice?.exactAge || 10} سنة`,
      character: character || editingVoice?.character || `${customization.pitch} pitch`,
      arabicCharacter: finalArabicCharacter,
      voiceInstruction: '',
      customization,
      createdAt:
        editingVoice && 'createdAt' in editingVoice && editingVoice.createdAt
          ? (editingVoice.createdAt as number)
          : Date.now(),
    };

    handleSaveCustomVoiceInternal(newPreset);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-[#6B705C] text-white text-xs font-bold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 bg-white/20 p-0.5 rounded-full" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="hover:opacity-70 cursor-pointer text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar: Title, Action Buttons (Backup, Clone, Add Custom) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl border border-[#E5E1D8]">
        <div>
          <label className="text-sm font-bold text-[#43413E] flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-[#6B705C]" />
            <span>{isRtl ? 'الأصوات التمثيلية المتاحة (قابلة للحذف والتخصيص بالكامل)' : 'Dramatic Acting Voices'}</span>
          </label>
          <p className="text-xs text-[#7D786E] mt-0.5">
            {isRtl
              ? 'أصوات تمثيلية مصرية حية فائقة النقاء. يمكنك حذف أي صوت شخصية أو ممثل نهائياً، واستيراد/تصدير الأصوات خارج المتصفح.'
              : 'Character acting voices with pitch, tone, pace, and permanent voice deletion/backup.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {onOpenBackupModal && (
            <button
              type="button"
              id="open-backup-modal-btn"
              onClick={onOpenBackupModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0077B6]/40 bg-white hover:bg-[#FAF8F5] text-[#0077B6] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              title={isRtl ? 'حفظ واستيراد الأصوات والإعدادات خارج المتصفح كملف JSON' : 'External JSON Backup & Restore'}
            >
              <HardDrive className="w-3.5 h-3.5 text-[#0077B6]" />
              <span>{isRtl ? 'حفظ واستيراد خارجي' : 'Backup & Restore'}</span>
              {deletedVoiceIds.length > 0 && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">
                  {deletedVoiceIds.length} محذوف
                </span>
              )}
            </button>
          )}

          {onOpenCloneModal && (
            <button
              type="button"
              id="clone-voice-btn"
              onClick={onOpenCloneModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#C86446]/40 bg-white hover:bg-[#FAF8F5] text-[#C86446] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              title={isRtl ? 'رفع ملف صوتي واستخراج رنين الحنجرة والأحبال الصوتية' : 'Clone voice from audio file'}
            >
              <Wand2 className="w-3.5 h-3.5 text-[#C86446]" />
              <span>{isRtl ? 'استنساخ من ملف صوتي' : 'Clone from Audio'}</span>
            </button>
          )}

          {onOpenGuideModal && (
            <button
              type="button"
              id="open-vocal-guide-btn"
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#BC6C25]/40 bg-white hover:bg-[#FAF8F5] text-[#BC6C25] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              title={isRtl ? 'دليل الحناجر والأحبال الصوتية وملمس الصوت (لاختيار سهل دون حيرة)' : 'Vocal Anatomy & Selection Guide'}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#BC6C25]" />
              <span>{isRtl ? 'مرشد الحناجر والأحبال 💡' : 'Vocal Guide'}</span>
            </button>
          )}

          <button
            type="button"
            id="add-custom-voice-btn"
            onClick={handleOpenNewModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#6B705C] bg-[#6B705C] hover:bg-[#5B604C] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة صوت مخصص' : 'Add Custom Voice'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E5E1D8] pb-2">
        <button
          type="button"
          onClick={() => setActiveCategory('children')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'children'
              ? 'bg-[#6B705C] text-white shadow-xs'
              : 'text-[#7D786E] hover:bg-[#EDE9E1] hover:text-[#43413E]'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>{isRtl ? 'حناجر أطفال ويافعين (10)' : 'Children Voices (10)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('adults')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'adults'
              ? 'bg-[#6B705C] text-white shadow-xs'
              : 'text-[#7D786E] hover:bg-[#EDE9E1] hover:text-[#43413E]'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{isRtl ? 'أصوات درامية وكبار (12)' : 'Adults & Drama (12)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('nabd')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'nabd'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-xs'
              : 'text-cyan-800 bg-cyan-50/70 border border-cyan-200 hover:bg-cyan-100/70'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span>{isRtl ? 'كرة طاقة الوعي: الكاشف (4)' : 'The Revealer Orb: Nabd (4)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('alex')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'alex'
              ? 'bg-[#0077B6] text-white shadow-xs'
              : 'text-[#7D786E] hover:bg-[#EDE9E1] hover:text-[#43413E]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{isRtl ? 'أصوات إسكندرانية ساحلية' : 'Alexandrian Voices'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#6B705C] text-white shadow-xs'
              : 'text-[#7D786E] hover:bg-[#EDE9E1] hover:text-[#43413E]'
          }`}
        >
          <span>{isRtl ? `كل الأصوات المتاحة (${allVoices.length})` : `All (${allVoices.length})`}</span>
        </button>
      </div>

      {/* Voices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredVoices.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          const isAlex =
            voice.customization?.dialect === 'alex' ||
            (voice.customization?.dialectSubStyle &&
              voice.customization.dialectSubStyle.startsWith('alex')) ||
            voice.id.includes('alex') ||
            (voice as any).dialect === 'alex';
          const isNabd = voice.id.startsWith('voice_nabd') || voice.id.includes('nabd');

          const displayName = isRtl
            ? isAlex
              ? (voice.arabicName || '')
                  .replace(/قاهرية/g, 'إسكندرانية')
                  .replace(/قاهري/g, 'إسكندراني')
                  .replace(/القاهرة/g, 'الإسكندرية')
              : voice.arabicName
            : voice.name;

          return (
            <div
              key={voice.id}
              id={`voice-card-${voice.id}`}
              onClick={() => onSelectVoiceOption(voice)}
              className={`group relative p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                isNabd
                  ? isSelected
                    ? 'bg-gradient-to-br from-cyan-50/90 to-white border-cyan-500 shadow-lg ring-2 ring-cyan-500/40'
                    : 'bg-gradient-to-br from-[#f0f9ff]/70 to-white border-cyan-200 hover:border-cyan-400 hover:shadow-md'
                  : isSelected
                  ? 'bg-white border-[#6B705C] shadow-md ring-2 ring-[#6B705C]/30'
                  : 'bg-white/90 border-[#E5E1D8] hover:border-[#DCD7CC] hover:bg-white hover:shadow-xs'
              }`}
            >
              {/* Top Row: Avatar + Name + Check + Delete Action */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {/* Distinctive Avatar Rendering */}
                  {isNabd ? (
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm border bg-gradient-to-tr from-cyan-500/25 via-sky-500/20 to-purple-600/30 text-cyan-600 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/30">
                        <Zap className="w-5 h-5 text-cyan-500 animate-pulse" />
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${voice.avatarBg}`}
                    >
                      {voice.name[0]}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-xs text-[#43413E] group-hover:text-[#2B2927] transition-colors">
                        {displayName}
                      </h3>

                      {isNabd && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 border border-cyan-400/40 font-bold flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-2.5 h-2.5 text-cyan-500" />
                          <span>{isRtl ? 'الكاشف • مكتب التحقيق العلمي' : 'The Revealer • Forensic Office'}</span>
                        </span>
                      )}

                      {voice.isModified && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#6B705C]/20 text-[#5B604C] font-bold">
                          {isRtl ? 'مُعدَّل' : 'Modified'}
                        </span>
                      )}

                      {voice.isCustom && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#6B705C]/15 text-[#5B604C] font-bold">
                          {isRtl ? 'صوت جديد' : 'New'}
                        </span>
                      )}

                      {voice.id === 'egyptian_girl_clip' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#CB997E]/20 text-[#B07D62] font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>{isRtl ? 'مطابق للتسجيل' : 'Audio Match'}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#7D786E] mt-0.5">
                      <span className="font-medium">
                        {isRtl ? voice.arabicAgeLabel : voice.ageLabel}
                      </span>
                      <span>•</span>
                      <span className="text-[#6B705C] font-semibold flex items-center gap-0.5">
                        <Volume2 className="w-3 h-3" />
                        <span>Gemini: {voice.baseVoice}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Top Status + Permanent Delete Action */}
                <div className="flex items-center gap-1.5">
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#6B705C] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  {/* Permanent Deletion Button for ANY voice/character */}
                  <button
                    type="button"
                    id={`delete-voice-btn-${voice.id}`}
                    onClick={(e) => handleDeleteVoice(e, voice)}
                    className="p-1.5 rounded-lg bg-white/90 border border-[#DCD7CC] hover:border-red-300 hover:bg-red-50 text-[#8C887B] hover:text-red-600 transition-all cursor-pointer shadow-2xs group/del"
                    title={
                      isRtl
                        ? `حذف صوت «${voice.arabicName || voice.name}» نهائياً`
                        : `Permanently delete voice ${voice.name}`
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Character Acting Description */}
              <p className="text-[11px] text-[#7D786E] leading-relaxed mt-2 line-clamp-2">
                {isRtl
                  ? isAlex
                    ? (voice.arabicCharacter || '')
                        .replace(/قاهرية/g, 'إسكندرانية')
                        .replace(/قاهري/g, 'إسكندراني')
                        .replace(/القاهرة/g, 'الإسكندرية')
                    : voice.arabicCharacter
                  : voice.character}
              </p>

              {/* Bottom Row: Dialect Badge + Direct Customize Button */}
              <div className="mt-3 pt-2.5 border-t border-[#EDE9E1] flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    isNabd
                      ? 'bg-cyan-500/10 text-cyan-700'
                      : isAlex
                      ? 'bg-[#0077B6]/15 text-[#0077B6]'
                      : 'bg-[#EDE9E1] text-[#7D786E]'
                  }`}
                >
                  <Compass className="w-2.5 h-2.5" />
                  <span>
                    {isNabd
                      ? isRtl
                        ? 'وعي وتحليل نفسي'
                        : 'Psychoanalyst'
                      : isAlex
                      ? isRtl
                        ? 'إسكندراني'
                        : 'Alex'
                      : isRtl
                      ? 'قاهري'
                      : 'Cairo'}
                  </span>
                </span>

                <button
                  type="button"
                  id={`customize-voice-${voice.id}`}
                  onClick={(e) => handleOpenCustomizeModal(e, voice)}
                  className="text-[11px] font-bold text-[#6B705C] hover:text-[#5B604C] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#6B705C]/10 transition-colors cursor-pointer"
                  title={isRtl ? 'تخصيص الطبقة والنبرة والإيقاع وطابع الخروج' : 'Tune pitch, tone, pace & timbre'}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تخصيص الصوت' : 'Customize'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice Customizer Modal */}
      <CustomVoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomVoiceInternal}
        onApplyToCurrent={handleApplyToCurrent}
        editingVoice={editingVoice}
        isRtl={isRtl}
      />

      {/* In-App Permanent Deletion Confirmation Modal */}
      {voiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-3xl border border-[#E5E1D8] shadow-2xl p-5 sm:p-6 max-w-md w-full space-y-4 animate-scale-in"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#343230]">
                  {isRtl ? 'تأكيد حذف صوت الممثل نهائياً' : 'Permanently Delete Actor Voice'}
                </h4>
                <p className="text-xs text-red-600 font-bold mt-0.5">
                  {isRtl ? voiceToDelete.arabicName : voiceToDelete.name}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7D786E]">{isRtl ? 'العمر والطبقة:' : 'Age & Pitch:'}</span>
                <span className="font-bold text-[#343230]">
                  {isRtl ? voiceToDelete.arabicAgeLabel : voiceToDelete.ageLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7D786E]">{isRtl ? 'المحاكاة/الدور:' : 'Character:'}</span>
                <span className="font-medium text-[#43413E] text-[11px] truncate max-w-[200px]">
                  {isRtl ? voiceToDelete.arabicCharacter : voiceToDelete.character}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#7D786E] leading-relaxed">
              {isRtl
                ? `هل أنت متأكد من رغبتك في حذف صوت «${voiceToDelete.arabicName || voiceToDelete.name}» نهائياً؟ سيتم استبعاده فوراً من قائمة الأصوات والمشاهد التمثيلية.`
                : `Are you sure you want to permanently delete this voice? It will be removed from all lists.`}
            </p>

            {!voiceToDelete.isCustom && (
              <div className="p-2.5 rounded-xl bg-[#6B705C]/10 border border-[#6B705C]/20 text-[11px] text-[#5B604C] leading-relaxed">
                {isRtl
                  ? '💡 ملاحظة: هذا صوت ممثل أساسي في الاستوديو. يمكنك استعادته في أي وقت لاحقاً من نافذة (حفظ واستيراد خارجي) ثم تبويب (الأصوات المحذوفة).'
                  : '💡 Note: You can restore deleted built-in actors anytime via External Backup & Restore.'}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EDE9E1]">
              <button
                type="button"
                onClick={() => setVoiceToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-[#DCD7CC] hover:bg-[#F7F5F0] text-xs font-bold text-[#7D786E] transition-all cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                id="confirm-delete-voice-btn"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'نعم، حذف نهائياً' : 'Delete Voice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
