import React from 'react';
import { Sparkles, Radio, Volume2, HardDrive, HelpCircle, Edit3, RotateCcw } from 'lucide-react';

interface HeaderProps {
  isRtl: boolean;
  onToggleRtl: () => void;
  onOpenBackupModal?: () => void;
  onOpenGuideModal?: () => void;
  onOpenTitlesModal?: () => void;
  onResetSession?: () => void;
  hasSavedSession?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isRtl,
  onToggleRtl,
  onOpenBackupModal,
  onOpenGuideModal,
  onOpenTitlesModal,
  onResetSession,
  hasSavedSession,
}) => {
  return (
    <header className="border-b border-[#DCD7CC] bg-[#F7F5F0]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6B705C] flex items-center justify-center text-white shadow-sm">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#3F3F3F] tracking-tight">
                {isRtl ? 'تحويل النص إلى كلام' : 'Text to Speech'}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#6B705C]/15 text-[#6B705C] border border-[#6B705C]/25">
                <Sparkles className="w-3 h-3" />
                gemini-3.1-flash-tts-preview
              </span>
            </div>
            <p className="text-xs text-[#A5A58D] font-medium">
              {isRtl ? 'توليد صوتي عالي الدقة للهجات واللغات' : 'Expressive neural speech synthesis'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenGuideModal && (
            <button
              id="header-guide-btn"
              onClick={onOpenGuideModal}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#BC6C25]/40 bg-[#BC6C25]/10 hover:bg-[#BC6C25]/20 text-[#BC6C25] transition-colors cursor-pointer"
              title={isRtl ? 'مرشد الحناجر وهندسة الصوت والأحبال' : 'Vocal Guide'}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRtl ? 'دليل الحناجر والأحبال' : 'Guide'}</span>
            </button>
          )}

          {onOpenBackupModal && (
            <button
              id="header-backup-btn"
              onClick={onOpenBackupModal}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#0077B6]/30 bg-[#0077B6]/10 hover:bg-[#0077B6]/20 text-[#0077B6] transition-colors cursor-pointer"
              title={isRtl ? 'حفظ واستيراد الأصوات خارج المتصفح' : 'Backup & Restore'}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRtl ? 'حفظ واستيراد خارجي' : 'Backup'}</span>
            </button>
          )}

          {onOpenTitlesModal && (
            <button
              id="header-titles-btn"
              onClick={onOpenTitlesModal}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#6B705C]/40 bg-[#6B705C]/10 hover:bg-[#6B705C]/20 text-[#6B705C] transition-colors cursor-pointer"
              title={isRtl ? 'تعديل وتخصيص عناوين كل الأقسام' : 'Edit Section Titles'}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRtl ? 'تعديل عناوين الأقسام' : 'Titles'}</span>
            </button>
          )}

          {onResetSession && hasSavedSession && (
            <button
              id="header-reset-session-btn"
              onClick={onResetSession}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#DCD7CC] bg-white/80 hover:bg-[#FAF8F5] text-[#5C584E] transition-colors cursor-pointer"
              title={isRtl ? 'إعادة ضبط الجلسة للافتراضي وبدء جلسة جديدة' : 'Reset session to default settings'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8C887B]" />
              <span className="hidden md:inline">{isRtl ? 'جلسة جديدة' : 'New Session'}</span>
            </button>
          )}

          <button
            id="toggle-direction-btn"
            onClick={onToggleRtl}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#DCD7CC] bg-white/70 hover:bg-[#EDE9E1] text-[#43413E] transition-colors cursor-pointer"
            title="تبديل اتجاه الكتابة"
          >
            <Radio className="w-3.5 h-3.5 text-[#6B705C]" />
            <span>{isRtl ? 'English / LTR' : 'عربي / RTL'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
