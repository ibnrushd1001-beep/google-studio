import React, { useState } from 'react';
import { DRAMATIC_TAGS } from '../data';
import { DramaticTag } from '../types';
import {
  VolumeX,
  Smile,
  Wind,
  Pause,
  Sparkles,
  Laugh,
  HelpCircle,
  HeartCrack,
  Zap,
  ShieldAlert,
  Tag,
  ShieldCheck,
  Check,
  Layers,
  Sparkle,
  ChevronUp,
  X,
  Clock,
} from 'lucide-react';

interface InlineTagsBarProps {
  onInsertTag: (tagText: string) => void;
  disabled?: boolean;
  onClose?: () => void;
}

export const InlineTagsBar: React.FC<InlineTagsBarProps> = ({
  onInsertTag,
  disabled = false,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'pause' | 'breathing' | 'pacing' | 'gesture' | 'emotion'
  >('all');
  const [lastInsertedTag, setLastInsertedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    onInsertTag(tag);
    setLastInsertedTag(tag);
    setTimeout(() => {
      setLastInsertedTag((prev) => (prev === tag ? null : prev));
    }, 1500);
  };

  const renderIcon = (iconName: string, className: string = 'w-4 h-4 shrink-0') => {
    switch (iconName) {
      case 'VolumeX':
        return <VolumeX className={className} />;
      case 'Smile':
        return <Smile className={className} />;
      case 'Wind':
        return <Wind className={className} />;
      case 'Pause':
        return <Pause className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Laugh':
        return <Laugh className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      case 'HeartCrack':
        return <HeartCrack className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      default:
        return <Tag className={className} />;
    }
  };

  const pauseTags = DRAMATIC_TAGS.filter((t) => t.category === 'pause');
  const breathingTags = DRAMATIC_TAGS.filter((t) => t.category === 'breathing');
  const pacingTags = DRAMATIC_TAGS.filter((t) => t.category === 'pacing');
  const gestureTags = DRAMATIC_TAGS.filter(
    (t) => t.category === 'gesture' || t.category === 'sound'
  );
  const emotionTags = DRAMATIC_TAGS.filter((t) => t.category === 'emotion');

  return (
    <div className="w-full bg-[#FAF8F5] border-2 border-[#DCD7CC] hover:border-[#6B705C]/40 rounded-2xl p-4 sm:p-5 mb-4 shadow-sm space-y-4 transition-all">
      {/* Header with Title and Internal Close/Hide Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E5E1D8] pb-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C86446]/15 text-[#C86446] flex items-center justify-center shrink-0 shadow-2xs">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-[#343230]">
                توجيهات تمثيلية موضعية وفواصل (انقر للإدراج في موضع المؤشر بالنص)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#C86446]/10 text-[#C86446] font-bold border border-[#C86446]/20">
                {DRAMATIC_TAGS.length} توجيهاً درامياً
              </span>
            </div>
            <p className="text-xs text-[#7D786E] mt-0.5 leading-relaxed">
              فواصل، سكتات، تنهيدات، وإيماءات تُنفذ فوراً في موضع الكلمة المحدد دون أن يقرأ الصوت نص الأقواس
            </p>
          </div>
        </div>

        {/* Right side controls: Reassurance badge + Internal Close/Hide Button */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300/80 text-[11px] font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>نقاء كامل: لا تخرج هذه الأصوات إلا إذا أدرجت الوسم بيدك</span>
          </div>

          {onClose && (
            <button
              type="button"
              id="internal-hide-directives-btn"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD7CC] hover:border-[#C86446] text-[#7D786E] hover:text-[#C86446] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="إخفاء لوحة التوجيهات التمثيلية"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>إخفاء التوجيهات</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search/Categories */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
          {/* Tab: All */}
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#43413E] text-white shadow-xs'
                : 'bg-white text-[#5F5C56] border border-[#DCD7CC] hover:bg-[#F4F1EA]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>عرض الكل ({DRAMATIC_TAGS.length})</span>
          </button>

          {/* Tab: Pauses */}
          <button
            type="button"
            onClick={() => setActiveFilter('pause')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'pause'
                ? 'bg-[#6B705C] text-white shadow-xs'
                : 'bg-white text-[#5F5C56] border border-[#DCD7CC] hover:bg-[#F4F1EA]'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            <span>وقفات وسكتات ({pauseTags.length})</span>
          </button>

          {/* Tab: Breathing */}
          <button
            type="button"
            onClick={() => setActiveFilter('breathing')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'breathing'
                ? 'bg-[#0077B6] text-white shadow-xs'
                : 'bg-white text-[#5F5C56] border border-[#DCD7CC] hover:bg-[#F4F1EA]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>تنفس وأنفاس ({breathingTags.length})</span>
          </button>

          {/* Tab: Pacing */}
          <button
            type="button"
            onClick={() => setActiveFilter('pacing')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'pacing'
                ? 'bg-[#BC6C25] text-white shadow-xs'
                : 'bg-white text-[#5F5C56] border border-[#DCD7CC] hover:bg-[#F4F1EA]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>إيقاع وتوقيت ({pacingTags.length})</span>
          </button>

          {/* Tab: Gestures */}
          <button
            type="button"
            onClick={() => setActiveFilter('gesture')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'gesture'
                ? 'bg-[#C86446] text-white shadow-xs'
                : 'bg-white text-[#5F5C56] border border-[#DCD7CC] hover:bg-[#F4F1EA]'
            }`}
          >
            <Sparkle className="w-3.5 h-3.5" />
            <span>إيماءات وأصوات ({gestureTags.length})</span>
          </button>

          {/* Tab: Emotions */}
          <button
            type="button"
            onClick={() => setActiveFilter('emotion')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'emotion'
                ? 'bg-[#6B705C] text-white shadow-xs'
                : 'bg-white text-[#5F5C56] border border-[#DCD7CC] hover:bg-[#F4F1EA]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>نبرات شعورية ({emotionTags.length})</span>
          </button>
        </div>

        {lastInsertedTag && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-xl animate-fade-in shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-700" />
            <span>تم إدراج {lastInsertedTag} في النص بنجاح!</span>
          </div>
        )}
      </div>

      {/* Tags Render Section */}
      {activeFilter === 'all' ? (
        <div className="space-y-4 pt-1">
          {/* Section 1: Pauses and Silences */}
          <div className="bg-[#FAF8F5] border border-[#E5E1D8] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#43413E] flex items-center gap-1.5">
                <Pause className="w-4 h-4 text-[#6B705C]" />
                <span>وقفات وسكتات تمثيلية وفواصل صمت ({pauseTags.length})</span>
              </span>
              <span className="text-[10px] font-bold text-[#6B705C] bg-[#6B705C]/10 px-2 py-0.5 rounded-md">
                فواصل صمت
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {pauseTags.map((t) => (
                <TagCard
                  key={t.id}
                  tag={t}
                  disabled={disabled}
                  isJustInserted={lastInsertedTag === t.tag}
                  onInsert={handleTagClick}
                  renderIcon={renderIcon}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Breathing & Respiration */}
          <div className="bg-sky-50/50 border border-sky-200/80 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-600" />
                <span>تنفس، تنهيدات وأنفاس حسية ({breathingTags.length})</span>
              </span>
              <span className="text-[10px] font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-md">
                أنفاس وتنهيد
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {breathingTags.map((t) => (
                <TagCard
                  key={t.id}
                  tag={t}
                  disabled={disabled}
                  isJustInserted={lastInsertedTag === t.tag}
                  onInsert={handleTagClick}
                  renderIcon={renderIcon}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Pacing & Rhythm */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>إيقاع وسرعة الكلام والتوقيت ({pacingTags.length})</span>
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                سرعة وإيقاع
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {pacingTags.map((t) => (
                <TagCard
                  key={t.id}
                  tag={t}
                  disabled={disabled}
                  isJustInserted={lastInsertedTag === t.tag}
                  onInsert={handleTagClick}
                  renderIcon={renderIcon}
                />
              ))}
            </div>
          </div>

          {/* Section 4: Gestures & Special Sounds */}
          <div className="bg-orange-50/40 border border-orange-200/80 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-orange-950 flex items-center gap-1.5">
                <Sparkle className="w-4 h-4 text-[#C86446]" />
                <span>إيماءات صوتية (ضحكات، همس، بكاء) ({gestureTags.length})</span>
              </span>
              <span className="text-[10px] font-bold text-[#C86446] bg-orange-100/70 px-2 py-0.5 rounded-md">
                إيماءات يدوية
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {gestureTags.map((t) => (
                <TagCard
                  key={t.id}
                  tag={t}
                  disabled={disabled}
                  isJustInserted={lastInsertedTag === t.tag}
                  onInsert={handleTagClick}
                  renderIcon={renderIcon}
                />
              ))}
            </div>
          </div>

          {/* Section 5: In-line Emotional Inflections */}
          <div className="bg-[#FAF8F5] border border-[#E5E1D8] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#43413E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6B705C]" />
                <span>نبرات وتلوين شعوري موضعي لكلمات محددة ({emotionTags.length})</span>
              </span>
              <span className="text-[10px] font-bold text-[#6B705C] bg-[#6B705C]/10 px-2 py-0.5 rounded-md">
                نبرات موضعية
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {emotionTags.map((t) => (
                <TagCard
                  key={t.id}
                  tag={t}
                  disabled={disabled}
                  isJustInserted={lastInsertedTag === t.tag}
                  onInsert={handleTagClick}
                  renderIcon={renderIcon}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Filtered Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
          {(activeFilter === 'pause'
            ? pauseTags
            : activeFilter === 'breathing'
            ? breathingTags
            : activeFilter === 'pacing'
            ? pacingTags
            : activeFilter === 'gesture'
            ? gestureTags
            : emotionTags
          ).map((t) => (
            <TagCard
              key={t.id}
              tag={t}
              disabled={disabled}
              isJustInserted={lastInsertedTag === t.tag}
              onInsert={handleTagClick}
              renderIcon={renderIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TagCardProps {
  tag: DramaticTag;
  disabled?: boolean;
  isJustInserted: boolean;
  onInsert: (tagText: string) => void;
  renderIcon: (iconName: string, className?: string) => React.ReactNode;
}

const TagCard: React.FC<TagCardProps> = ({
  tag,
  disabled,
  isJustInserted,
  onInsert,
  renderIcon,
}) => {
  const isPause = tag.category === 'pause';
  const isBreathing = tag.category === 'breathing';
  const isPacing = tag.category === 'pacing';
  const isGesture = tag.category === 'gesture' || tag.category === 'sound';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onInsert(tag.tag)}
      title={`${tag.arabicLabel}: ${tag.description}`}
      className={`group relative text-start p-2.5 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs active:scale-98 flex flex-col justify-between gap-1.5 ${
        isJustInserted
          ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-500/30'
          : isPause
          ? 'bg-white hover:bg-[#F3EFEB] border-[#DCD7CC] hover:border-[#6B705C] text-[#343230]'
          : isBreathing
          ? 'bg-white hover:bg-sky-50 border-sky-200/80 hover:border-sky-400 text-sky-950'
          : isPacing
          ? 'bg-white hover:bg-amber-50/80 border-amber-200/80 hover:border-amber-400 text-amber-950'
          : isGesture
          ? 'bg-white hover:bg-orange-50/80 border-orange-200/80 hover:border-orange-400 text-orange-950'
          : 'bg-white hover:bg-[#F3EFEB] border-[#DCD7CC] hover:border-[#6B705C] text-[#343230]'
      }`}
    >
      <div className="flex items-center justify-between w-full gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`${
              isBreathing
                ? 'text-sky-600'
                : isPacing
                ? 'text-amber-600'
                : isGesture
                ? 'text-[#C86446]'
                : 'text-[#6B705C]'
            } group-hover:scale-110 transition-transform shrink-0`}
          >
            {renderIcon(tag.iconName, 'w-4 h-4 shrink-0')}
          </span>
          <span className="font-bold text-xs leading-tight truncate text-[#2B2927]">
            {tag.arabicLabel}
          </span>
        </div>
        <code
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded dir-ltr font-semibold shrink-0 ${
            isBreathing
              ? 'bg-sky-100 text-sky-900 border border-sky-200'
              : isPacing
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : isGesture
              ? 'bg-orange-100 text-orange-900 border border-orange-200'
              : 'bg-[#EDE9E1] text-[#6B705C] border border-[#DCD7CC]'
          }`}
        >
          {tag.tag}
        </code>
      </div>

      <p className="text-[11px] text-[#7D786E] line-clamp-2 leading-snug">
        {tag.description}
      </p>

      {isJustInserted && (
        <span className="absolute -top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
          تم الإدراج ✓
        </span>
      )}
    </button>
  );
};
