import React, { useState } from 'react';
import {
  X,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Quote,
  Mic,
  Theater,
  Waves,
  Volume2,
  Sliders,
} from 'lucide-react';
import { StudioSectionTitles } from '../types';

export const DEFAULT_SECTION_TITLES: StudioSectionTitles = {
  script: {
    title: 'النص المطلوب تمثيله صوتياً:',
    subtitle: 'اكتب أو الصق النص هنا ليتم تمثيله بنقاء فائق وباللهجة والنبرة المختارة...',
  },
  voiceSelector: {
    title: 'اختيار صوت الشخصية والممثل',
    subtitle: 'أصوات تمثيلية مصرية حية فائقة النقاء (كبار، أطفال، طاقة الوعي نبض، وإسكندرانية)',
  },
  performanceStyle: {
    title: 'نمط الأداء والانفعال وشدة النبرة',
    subtitle: 'تلوين شعوري نقي 100% دون ضحك أو تنهيد تلقائي',
  },
  reverbEnvironment: {
    title: 'صدى الصوت والبيئة الصوتية المحيطة',
    subtitle: 'تحكم منفصل ومباشر في محاكاة صدى المكان وحجم الغرفة أو المسرح وانعكاسات الحوائط',
  },
  readyAndPillars: {
    title: 'جاهز لتوليد الأداء الصوتي الدرامي',
    subtitle: 'خلاصة عناصر التمثيل والحنجرة والبيئة الصوتية المعتمدة لتوليد الأداء مع Gemini 3.1 Flash',
  },
  audioPlayer: {
    title: 'التسجيل الصوتي الحالي',
    subtitle: 'مشغل ومعاين الأداء الصوتي فائق الدقة مع التحكم بالسرعة والتحميل',
  },
};

interface SectionTitlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: StudioSectionTitles;
  onSaveTitles: (newTitles: StudioSectionTitles) => void;
  isRtl?: boolean;
}

export const SectionTitlesModal: React.FC<SectionTitlesModalProps> = ({
  isOpen,
  onClose,
  titles,
  onSaveTitles,
  isRtl = true,
}) => {
  const [formData, setFormData] = useState<StudioSectionTitles>(titles);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if titles prop updates
  React.useEffect(() => {
    setFormData(titles);
  }, [titles]);

  if (!isOpen) return null;

  const handleFieldChange = (
    sectionKey: keyof StudioSectionTitles,
    field: 'title' | 'subtitle',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleResetToDefaults = () => {
    setFormData(DEFAULT_SECTION_TITLES);
  };

  const handleSave = () => {
    onSaveTitles(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const sectionsConfig: {
    key: keyof StudioSectionTitles;
    nameAr: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: 'script',
      nameAr: '1. قسم محرر النص الدرامي والتوجيهات',
      icon: <Quote className="w-4 h-4 text-[#C86446]" />,
      color: 'border-[#C86446]/30 bg-[#C86446]/5',
    },
    {
      key: 'voiceSelector',
      nameAr: '2. قسم اختيار صوت الشخصية والممثل',
      icon: <Mic className="w-4 h-4 text-[#6B705C]" />,
      color: 'border-[#6B705C]/30 bg-[#6B705C]/5',
    },
    {
      key: 'performanceStyle',
      nameAr: '3. قسم نمط الأداء والانفعال وشدة النبرة',
      icon: <Theater className="w-4 h-4 text-[#C86446]" />,
      color: 'border-[#C86446]/30 bg-[#C86446]/5',
    },
    {
      key: 'reverbEnvironment',
      nameAr: '4. قسم صدى الصوت والبيئة الصوتية المنفصلة',
      icon: <Waves className="w-4 h-4 text-[#5A6E82]" />,
      color: 'border-[#5A6E82]/30 bg-[#5A6E82]/5',
    },
    {
      key: 'readyAndPillars',
      nameAr: '5. قسم شريط التوليد وخلاصة أركان الأداء',
      icon: <Sparkles className="w-4 h-4 text-[#BC6C25]" />,
      color: 'border-[#BC6C25]/30 bg-[#BC6C25]/5',
    },
    {
      key: 'audioPlayer',
      nameAr: '6. قسم مشغل التسجيل الصوتي',
      icon: <Volume2 className="w-4 h-4 text-[#6B705C]" />,
      color: 'border-[#6B705C]/30 bg-[#6B705C]/5',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#DCD7CC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E1D8] bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6B705C] text-white flex items-center justify-center shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#343230] flex items-center gap-2">
                <span>{isRtl ? 'تعديل وتخصيص عناوين كل الأقسام' : 'Edit Studio Section Titles'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B705C]/15 text-[#6B705C] font-bold">
                  تخصيص كامل
                </span>
              </h2>
              <p className="text-xs text-[#7D786E] mt-0.5">
                {isRtl
                  ? 'يمكنك تعديل العنوان الرئيسي والفرعي لكل قسم في الاستوديو بما يناسب مشروعك'
                  : 'Customize section titles and subheadings to fit your workflow'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7D786E] hover:text-[#343230] hover:bg-[#EDE9E1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list of sections */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)]">
          {sectionsConfig.map((sec) => {
            const currentSec = formData[sec.key] || DEFAULT_SECTION_TITLES[sec.key];
            return (
              <div
                key={sec.key}
                className={`p-4 rounded-2xl border transition-all ${sec.color} space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#343230]">
                    {sec.icon}
                    <span>{sec.nameAr}</span>
                  </div>
                  <span className="text-[10px] text-[#7D786E] font-mono font-medium">
                    {sec.key}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#43413E] mb-1">
                      {isRtl ? 'العنوان الرئيسي للقسم:' : 'Main Section Title:'}
                    </label>
                    <input
                      type="text"
                      value={currentSec.title}
                      onChange={(e) => handleFieldChange(sec.key, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#DCD7CC] bg-white text-[#343230] focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 focus:border-[#6B705C] font-medium"
                      placeholder="اكتب العنوان..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#43413E] mb-1">
                      {isRtl ? 'الوصف التوضيحي الفرعي:' : 'Subtitle / Description:'}
                    </label>
                    <input
                      type="text"
                      value={currentSec.subtitle}
                      onChange={(e) => handleFieldChange(sec.key, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD7CC] bg-white text-[#5B604C] focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 focus:border-[#6B705C]"
                      placeholder="اكتب الوصف الفرعي..."
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-[#E5E1D8] bg-[#FAF8F5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCD7CC] bg-white hover:bg-[#EDE9E1] text-[#7D786E] text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استعادة العناوين الافتراضية' : 'Reset to Defaults'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-[#7D786E] hover:text-[#343230] hover:bg-[#EDE9E1] transition-colors cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#6B705C] hover:bg-[#5B604C] text-white active:scale-95'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isRtl ? 'تم الحفظ بنجاح!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isRtl ? 'حفظ وتطبيق العناوين' : 'Save Titles'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
