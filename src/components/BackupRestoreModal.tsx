import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  X,
  Database,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Trash2,
  HardDrive,
  Copy,
  Info,
} from 'lucide-react';
import { CustomVoicePreset, VoiceOption, EgyptianDialect, EmotionIntensity } from '../types';
import { VOICES } from '../data';

export interface StudioBackupData {
  app: string;
  backupVersion: number;
  exportedAt: string;
  exportedDateFormatted?: string;
  data: {
    customVoices: CustomVoicePreset[];
    deletedVoiceIds: string[];
    settings?: {
      selectedVoiceId?: string;
      currentDialect?: EgyptianDialect;
      selectedEmotionId?: string;
      selectedEmotionIntensity?: EmotionIntensity;
      text?: string;
    };
  };
  summary?: {
    customVoicesCount: number;
    deletedVoicesCount: number;
  };
}

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
  customVoices: CustomVoicePreset[];
  deletedVoiceIds: string[];
  currentDialect: EgyptianDialect;
  selectedVoiceId: string;
  selectedEmotionId: string;
  selectedEmotionIntensity: EmotionIntensity;
  currentText: string;
  onRestoreBackup: (backup: StudioBackupData, mode: 'merge' | 'replace') => void;
  onRestoreDeletedVoice: (voiceId: string) => void;
  onRestoreAllDeletedVoices: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  isRtl,
  customVoices,
  deletedVoiceIds,
  currentDialect,
  selectedVoiceId,
  selectedEmotionId,
  selectedEmotionIntensity,
  currentText,
  onRestoreBackup,
  onRestoreDeletedVoice,
  onRestoreAllDeletedVoices,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'deleted'>('export');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Import state
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [parsedBackup, setParsedBackup] = useState<StudioBackupData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // List of built-in voices that are currently marked as deleted
  const deletedBuiltInVoices = VOICES.filter((v) => deletedVoiceIds.includes(v.id));

  // Handle Export to JSON file download outside the browser
  const handleExportBackup = () => {
    setIsExporting(true);
    setExportSuccessMessage(null);

    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const backupPayload: StudioBackupData = {
        app: 'Egyptian Dramatic Voice Studio',
        backupVersion: 1,
        exportedAt: now.toISOString(),
        exportedDateFormatted: now.toLocaleString('ar-EG', {
          dateStyle: 'full',
          timeStyle: 'medium',
        }),
        data: {
          customVoices,
          deletedVoiceIds,
          settings: {
            selectedVoiceId,
            currentDialect,
            selectedEmotionId,
            selectedEmotionIntensity,
            text: currentText,
          },
        },
        summary: {
          customVoicesCount: customVoices.length,
          deletedVoicesCount: deletedVoiceIds.length,
        },
      };

      const jsonString = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `egyptian_tts_backup_${dateStr}_${now.getHours()}${now.getMinutes()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setExportSuccessMessage(
        isRtl
          ? `✓ تم تحميل ملف النسخة الاحتياطية بنجاح على جهازك خارج المتصفح! (${customVoices.length} أصوات مخصصة، ${deletedVoiceIds.length} تفضيلات استبعاد)`
          : `✓ Backup JSON exported successfully to your local machine!`
      );
    } catch (err: any) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file drop / select for Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processJsonFile(file);
  };

  const processJsonFile = (file: File) => {
    setImportError(null);
    setImportSuccess(null);
    setImportedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Flexible validation: either standard StudioBackupData or legacy format
        let normalizedBackup: StudioBackupData;

        if (parsed.data && Array.isArray(parsed.data.customVoices)) {
          normalizedBackup = parsed as StudioBackupData;
        } else if (Array.isArray(parsed)) {
          // If the user uploaded a raw array of CustomVoicePresets
          normalizedBackup = {
            app: 'Egyptian Dramatic Voice Studio',
            backupVersion: 1,
            exportedAt: new Date().toISOString(),
            data: {
              customVoices: parsed,
              deletedVoiceIds: [],
            },
            summary: {
              customVoicesCount: parsed.length,
              deletedVoicesCount: 0,
            },
          };
        } else if (parsed.customVoices && Array.isArray(parsed.customVoices)) {
          normalizedBackup = {
            app: 'Egyptian Dramatic Voice Studio',
            backupVersion: 1,
            exportedAt: parsed.exportedAt || new Date().toISOString(),
            data: {
              customVoices: parsed.customVoices,
              deletedVoiceIds: parsed.deletedVoiceIds || [],
              settings: parsed.settings,
            },
            summary: {
              customVoicesCount: parsed.customVoices.length,
              deletedVoicesCount: (parsed.deletedVoiceIds || []).length,
            },
          };
        } else {
          throw new Error(
            isRtl
              ? 'تنسيق الملف غير صالح. يرجى اختيار ملف نسخة احتياطية بصيغة JSON صالح.'
              : 'Invalid backup file structure.'
          );
        }

        setParsedBackup(normalizedBackup);
      } catch (err: any) {
        console.error('Error parsing backup file:', err);
        setImportError(
          isRtl
            ? `فشل قراءة الملف: ${err.message || 'الملف ليس بتنسيق JSON صحيح'}`
            : `Failed to read file: ${err.message}`
        );
        setParsedBackup(null);
      }
    };

    reader.onerror = () => {
      setImportError(isRtl ? 'حدث خطأ أثناء قراءة الملف.' : 'Error reading file.');
    };

    reader.readAsText(file);
  };

  const handleApplyRestore = (mode: 'merge' | 'replace') => {
    if (!parsedBackup) return;
    try {
      onRestoreBackup(parsedBackup, mode);
      const voiceCount = parsedBackup.data.customVoices.length;
      setImportSuccess(
        isRtl
          ? `✓ تم بنجاح استيراد ${voiceCount} صوت مخصص وتحديث الإعدادات بنمط (${mode === 'merge' ? 'الدمج' : 'الاستبدال الكامل'})!`
          : `✓ Successfully restored ${voiceCount} voices and settings!`
      );
      setParsedBackup(null);
      setImportedFile(null);
    } catch (err: any) {
      setImportError(isRtl ? `خطأ أثناء الاستعادة: ${err.message}` : `Restore error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#DCD7CC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5E1D8] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6B705C] text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#343230] flex items-center gap-2">
                <span>{isRtl ? 'حفظ واستيراد الأصوات خارج المتصفح' : 'External Voices & Settings Backup'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B705C]/15 text-[#5B604C] font-semibold">
                  JSON Offline Backup
                </span>
              </h2>
              <p className="text-xs text-[#7D786E] mt-0.5">
                {isRtl
                  ? 'حفظ الأصوات والإعدادات كملف خارجي على جهازك لاسترجاعها بعد تنظيف المتصفح أو تغيير النظام'
                  : 'Export & Import voices as offline JSON files safely stored outside your browser'}
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

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E1D8] bg-[#FAF8F5]/60 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
              activeTab === 'export'
                ? 'bg-white border-[#E5E1D8] text-[#C86446] shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isRtl ? 'حفظ وتصدير خارجي (Download)' : 'Export Backup'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
              activeTab === 'import'
                ? 'bg-white border-[#E5E1D8] text-[#0077B6] shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استيراد واستعادة (Restore)' : 'Import Backup'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deleted')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
              activeTab === 'deleted'
                ? 'bg-white border-[#E5E1D8] text-red-600 shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isRtl
                ? `الأصوات المحذوفة (${deletedVoiceIds.length})`
                : `Deleted Voices (${deletedVoiceIds.length})`}
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#C86446]/10 text-[#C86446]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#343230]">
                      {isRtl
                        ? 'حماية تامة من مسح بيانات المتصفح وتغيير الأجهزة'
                        : 'Safe offline storage independent of browser cache'}
                    </h3>
                    <p className="text-xs text-[#7D786E] leading-relaxed">
                      {isRtl
                        ? 'ملف النسخة الاحتياطية يحتوي على كافة الأصوات التي قمت بتصميمها، الأصوات المستنسخة من ملفات صوتية، تفضيلات استبعاد الممثلين، وإعدادات الطبقة والإلقاء. يتم تنزيله كملف JSON مستقل على جهازك أو وسيط تخزين خارجي.'
                        : 'The backup includes all custom voices, cloned vocal tract profiles, deleted actors preferences, and tone settings.'}
                    </p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E5E1D8]/70">
                  <div className="p-3 rounded-xl bg-white border border-[#E5E1D8] text-center">
                    <span className="text-[10px] text-[#7D786E] block font-medium">
                      {isRtl ? 'الأصوات المخصصة والمستنسخة' : 'Custom Voices'}
                    </span>
                    <span className="text-lg font-bold text-[#C86446]">{customVoices.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E1D8] text-center">
                    <span className="text-[10px] text-[#7D786E] block font-medium">
                      {isRtl ? 'الأصوات المستبعدة/المحذوفة' : 'Deleted Voices'}
                    </span>
                    <span className="text-lg font-bold text-[#7D786E]">{deletedVoiceIds.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E1D8] text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#7D786E] block font-medium">
                      {isRtl ? 'اللهجة والنبرة الحالية' : 'Current Preset'}
                    </span>
                    <span className="text-xs font-bold text-[#6B705C] truncate block mt-1">
                      {currentDialect === 'alex' ? 'إسكندراني' : 'قاهري'} • {selectedEmotionId}
                    </span>
                  </div>
                </div>
              </div>

              {exportSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-[#6B705C] text-white text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{exportSuccessMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#C86446] to-[#B05336] hover:from-[#B05336] hover:to-[#9E452B] text-white text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.99] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isRtl
                      ? 'تنزيل وحفظ ملف النسخة الاحتياطية الآن (.JSON)'
                      : 'Download & Save Backup File (.JSON)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-2">
                <h3 className="text-sm font-bold text-[#343230] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#0077B6]" />
                  <span>{isRtl ? 'استعادة الأصوات والإعدادات من ملف خارجي' : 'Restore from External File'}</span>
                </h3>
                <p className="text-xs text-[#7D786E] leading-relaxed">
                  {isRtl
                    ? 'اختر ملف النسخة الاحتياطية (.json) الذي قمت بحفظه سابقاً من جهازك لاستعادة أصواتك وإعداداتك بالكامل فوراً.'
                    : 'Select your exported JSON backup file to restore your customized voices and configurations instantly.'}
                </p>
              </div>

              {/* File Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) processJsonFile(file);
                }}
                className="p-6 rounded-2xl border-2 border-dashed border-[#DCD7CC] hover:border-[#0077B6] bg-white text-center cursor-pointer transition-all hover:bg-[#FAF8F5] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0077B6]/10 text-[#0077B6] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                  <FileJson className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#343230]">
                  {importedFile
                    ? `الملف المختار: ${importedFile.name}`
                    : isRtl
                    ? 'اضغط لاختيار ملف النسخة الاحتياطية (JSON) أو اسحبه إلى هنا'
                    : 'Click to select backup file or drag & drop here'}
                </p>
                <p className="text-[11px] text-[#7D786E] mt-1">صيغة الملف المدعومة: .json</p>
              </div>

              {importError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-3.5 rounded-xl bg-[#6B705C] text-white text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}

              {/* Parsed File Preview & Confirmation */}
              {parsedBackup && (
                <div className="p-4 rounded-2xl bg-white border border-[#0077B6]/30 shadow-xs space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0077B6] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isRtl ? 'تم التحقق من النسخة الاحتياطية بنجاح' : 'Backup Verified'}
                    </span>
                    <span className="text-[10px] text-[#7D786E]">
                      {parsedBackup.exportedDateFormatted || parsedBackup.exportedAt}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
                      <span className="text-[10px] text-[#7D786E] block">الأصوات المخصصة المكتشفة:</span>
                      <span className="font-bold text-[#343230] text-sm">
                        {parsedBackup.data.customVoices.length} صوت
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
                      <span className="text-[10px] text-[#7D786E] block">الأصوات المستبعدة:</span>
                      <span className="font-bold text-[#343230] text-sm">
                        {parsedBackup.data.deletedVoiceIds?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* List of custom voices in backup */}
                  {parsedBackup.data.customVoices.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
                      <span className="text-[10px] font-bold text-[#7D786E] block">قائمة الأصوات:</span>
                      {parsedBackup.data.customVoices.map((v) => (
                        <div
                          key={v.id}
                          className="text-[11px] font-medium text-[#43413E] flex items-center justify-between"
                        >
                          <span>• {v.arabicName || v.name}</span>
                          <span className="text-[9px] text-[#7D786E]">
                            {v.gender === 'male' ? 'ذكر' : 'أنثى'} • {v.exactAge || 10} سنة
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyRestore('merge')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#0077B6] hover:bg-[#006499] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      {isRtl ? 'دمج مع الأصوات الحالية (Merge)' : 'Merge with Existing'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyRestore('replace')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#343230] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      {isRtl ? 'استبدال كامل ومطابقة (Replace All)' : 'Replace All'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DELETED VOICES MANAGEMENT */}
          {activeTab === 'deleted' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#343230] flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>{isRtl ? 'إدارة واستعادة الممثلين المحذوفين' : 'Deleted Actors Management'}</span>
                  </h3>
                  {deletedVoiceIds.length > 0 && (
                    <button
                      type="button"
                      onClick={onRestoreAllDeletedVoices}
                      className="text-xs font-bold text-[#6B705C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'استعادة جميع الأصوات المحذوفة' : 'Restore All'}</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#7D786E] leading-relaxed">
                  {isRtl
                    ? 'أي صوت شخصية أو ممثل افتراضي تم حذفه لن يظهر في استوديو الأداء الصوتي. يمكنك مراجعته أو استعادته من هنا في أي وقت.'
                    : 'Any default voice you deleted will not appear in the voice selector. You can restore them here.'}
                </p>
              </div>

              {deletedVoiceIds.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#7D786E] bg-white rounded-2xl border border-[#E5E1D8]">
                  <CheckCircle2 className="w-8 h-8 text-[#6B705C] mx-auto mb-2 opacity-50" />
                  <span>
                    {isRtl
                      ? 'لا توجد أصوات محذوفة حالياً. جميع الممثلين والأصوات متاحة وتعمل في الاستوديو.'
                      : 'No voices currently deleted. All voices are active.'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {deletedVoiceIds.map((id) => {
                    const voice = VOICES.find((v) => v.id === id);
                    const name = voice?.arabicName || voice?.name || id;
                    return (
                      <div
                        key={id}
                        className="p-3 rounded-xl bg-white border border-[#E5E1D8] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs border border-red-200">
                            <Trash2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#343230]">{name}</h4>
                            <p className="text-[10px] text-[#7D786E]">{voice?.character || 'صوت محذوف'}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRestoreDeletedVoice(id)}
                          className="px-3 py-1.5 rounded-lg border border-[#6B705C]/30 bg-[#6B705C]/10 hover:bg-[#6B705C] hover:text-white text-[#5B604C] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isRtl ? 'استعادة' : 'Restore'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E1D8] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-[11px] text-[#7D786E]">
            {isRtl ? 'نسخ احتياطي محلي 100% دون أي تبعيات خارجية' : '100% Client-side local backup'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#EDE9E1] hover:bg-[#DCD7CC] text-[#343230] text-xs font-bold transition-colors cursor-pointer"
          >
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
