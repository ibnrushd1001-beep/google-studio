import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { StyleSelector } from './components/StyleSelector';
import { AudioPlayerCard } from './components/AudioPlayerCard';
import { CustomVoiceModal } from './components/CustomVoiceModal';
import { InlineTagsBar } from './components/InlineTagsBar';
import { ComparisonWorkspace } from './components/ComparisonWorkspace';
import { VoiceCloneModal } from './components/VoiceCloneModal';
import { BackupRestoreModal, StudioBackupData } from './components/BackupRestoreModal';
import { VocalGuideModal, VocalRecipe } from './components/VocalGuideModal';
import { ReverbEnvironmentControl } from './components/ReverbEnvironmentControl';
import { SectionTitlesModal, DEFAULT_SECTION_TITLES } from './components/SectionTitlesModal';
import { VocalCordsControl } from './components/VocalCordsControl';
import { BatchWorkspace } from './components/BatchWorkspace';
import {
  VoiceOption,
  GeneratedSpeech,
  CustomVoicePreset,
  EmotionIntensity,
  EgyptianDialect,
  VoiceCustomization,
  ReverbEnvironment,
  StudioSectionTitles,
  DramaticDeliveryStyle,
} from './types';
import { INITIAL_SENTENCE, VOICES, DRAMATIC_TAGS } from './data';
import { EMOTIONS } from './emotions';
import {
  sanitizeGeminiVoice,
  buildDramaticPrompt,
  DELIVERY_STYLE_DIRECTIVES,
  PITCH_OPTIONS,
  AGE_OPTIONS,
  PACE_OPTIONS,
  TIMBRE_OPTIONS,
  REVERB_ENVIRONMENTS,
} from './utils/dramaticVoice';
import { base64ToBlob } from './utils/audio';
import { getCachedAudio, saveCachedAudio } from './utils/audioCache';
import {
  loadLastSession,
  saveLastSession,
  clearLastSession,
  hasLastSession,
} from './utils/sessionManager';
import {
  Volume2,
  Loader2,
  AlertCircle,
  Sparkles,
  Quote,
  Trash2,
  Sliders,
  Compass,
  Layers,
  Clock,
  Zap,
  Mic,
  Columns,
  Edit3,
  ArrowRightLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Tag,
  Theater,
  Wand2,
  Check,
  HardDrive,
  HelpCircle,
  Waves,
  Lock,
  ListOrdered,
  Activity,
} from 'lucide-react';

export default function App() {
  const [initialSession] = useState(() => loadLastSession());

  const [customVoices, setCustomVoices] = useState<CustomVoicePreset[]>(() => {
    try {
      const saved = localStorage.getItem('tts_custom_voices_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedVoiceIds, setDeletedVoiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tts_deleted_voice_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [voiceCustomizations, setVoiceCustomizations] = useState<Record<string, Partial<VoiceOption>>>(() => {
    try {
      const saved = localStorage.getItem('tts_voice_customizations');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Filter out any built-in voices that were permanently deleted by the user, and merge with custom modifications
  const activeDefaultVoices = VOICES.filter((v) => !deletedVoiceIds.includes(v.id)).map((v) => {
    const custom = voiceCustomizations[v.id];
    const merged = custom
      ? {
          ...v,
          ...custom,
          isModified: true,
          customization: {
            ...v.customization,
            ...custom.customization,
          },
        }
      : v;
    return {
      ...merged,
      baseVoice: sanitizeGeminiVoice(merged.baseVoice),
    };
  });

  // Combine active default voices and custom voices into a single available list
  const allAvailableVoices: VoiceOption[] = [
    ...activeDefaultVoices,
    ...customVoices.map((preset) => {
      const age = preset.exactAge || preset.customization?.exactAge || 30;
      return {
        id: preset.id,
        name: preset.name,
        arabicName: preset.arabicName,
        baseVoice: sanitizeGeminiVoice(preset.baseVoice),
        gender: preset.gender,
        category: (age <= 14 ? 'child' : 'adult') as 'child' | 'adult',
        ageGroup: (age <= 14 ? 'child' : 'adult'),
        exactAge: age,
        ageLabel: preset.ageLabel,
        arabicAgeLabel: preset.arabicAgeLabel,
        character: preset.character,
        arabicCharacter: preset.arabicCharacter,
        color: 'sage' as const,
        avatarBg:
          preset.gender === 'female'
            ? 'bg-[#CB997E]/20 text-[#B07D62] border-[#CB997E]/40'
            : 'bg-[#6B705C]/15 text-[#6B705C] border-[#6B705C]/30',
        voiceInstruction: preset.voiceInstruction,
        customization: preset.customization,
        isCustom: true,
        createdAt: preset.createdAt,
      };
    }),
  ];

  const [activeMode, setActiveMode] = useState<'solo' | 'compare' | 'batch'>(() => {
    return initialSession?.activeMode || 'solo';
  });

  const [text, setText] = useState<string>(() => {
    if (initialSession && typeof initialSession.text === 'string') {
      return initialSession.text;
    }
    return INITIAL_SENTENCE;
  });

  const [selectedVoiceOption, setSelectedVoiceOption] = useState<VoiceOption>(() => {
    if (initialSession?.selectedVoiceId) {
      const matched = allAvailableVoices.find((v) => v.id === initialSession.selectedVoiceId);
      if (matched) return matched;
    }
    return (
      allAvailableVoices[0] || {
        ...VOICES[0],
        baseVoice: sanitizeGeminiVoice(VOICES[0].baseVoice),
      }
    );
  });

  const [currentDialect, setCurrentDialect] = useState<EgyptianDialect>(() => {
    if (initialSession?.currentDialect) {
      return initialSession.currentDialect;
    }
    return (
      (initialSession?.selectedVoiceId &&
        allAvailableVoices.find((v) => v.id === initialSession.selectedVoiceId)?.customization?.dialect) ||
      VOICES[0].customization?.dialect ||
      'cairo'
    );
  });

  const [deliveryStyle, setDeliveryStyle] = useState<DramaticDeliveryStyle>(() => {
    return initialSession?.deliveryStyle || 'theatrical_drama';
  });

  const [selectedEmotionId, setSelectedEmotionId] = useState<string>(() => {
    return initialSession?.selectedEmotionId || 'astonished';
  });

  const [selectedIntensity, setSelectedIntensity] = useState<EmotionIntensity>(() => {
    return initialSession?.selectedIntensity || 'medium';
  });

  const [selectedReverbEnv, setSelectedReverbEnv] = useState<ReverbEnvironment>(() => {
    if (initialSession?.selectedReverbEnv) {
      return initialSession.selectedReverbEnv;
    }
    return 'dry_studio';
  });

  const [selectedReverbLevel, setSelectedReverbLevel] = useState<number>(() => {
    if (typeof initialSession?.selectedReverbLevel === 'number') {
      return initialSession.selectedReverbLevel;
    }
    return 0;
  });

  const [isRtl, setIsRtl] = useState<boolean>(() => {
    return typeof initialSession?.isRtl === 'boolean' ? initialSession.isRtl : true;
  });

  const [isDirectivesOpen, setIsDirectivesOpen] = useState<boolean>(() => {
    return Boolean(initialSession?.isDirectivesOpen);
  });
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState<boolean>(() => {
    return Boolean(initialSession?.isVoiceMenuOpen);
  });
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState<boolean>(() => {
    return Boolean(initialSession?.isStyleMenuOpen);
  });

  const [currentSpeech, setCurrentSpeech] = useState<GeneratedSpeech | null>(() => {
    if (initialSession?.lastSpeech && initialSession.lastSpeech.audioBase64) {
      try {
        const audioBlob = base64ToBlob(initialSession.lastSpeech.audioBase64, 'audio/wav');
        const audioUrl = URL.createObjectURL(audioBlob);
        return {
          id: initialSession.lastSpeech.id || `restored-${Date.now()}`,
          text: initialSession.lastSpeech.text,
          voice: initialSession.lastSpeech.voice,
          voiceDisplayName: initialSession.lastSpeech.voiceDisplayName,
          styleLabel: initialSession.lastSpeech.styleLabel,
          dialectLabel: initialSession.lastSpeech.dialectLabel,
          reverbEnvironment: initialSession.lastSpeech.reverbEnvironment,
          reverbLevel: initialSession.lastSpeech.reverbLevel,
          audioBase64: initialSession.lastSpeech.audioBase64,
          audioUrl,
          durationSec: initialSession.lastSpeech.durationSec || 0,
          createdAt: initialSession.lastSpeech.createdAt || Date.now(),
          deliveryStyle: initialSession.lastSpeech.deliveryStyle,
          deliveryStyleLabel: initialSession.lastSpeech.deliveryStyleLabel,
          emotionId: initialSession.lastSpeech.emotionId,
          emotionLabel: initialSession.lastSpeech.emotionLabel,
          intensity: initialSession.lastSpeech.intensity,
          intensityLabel: initialSession.lastSpeech.intensityLabel,
          pitchLabel: initialSession.lastSpeech.pitchLabel,
          paceLabel: initialSession.lastSpeech.paceLabel,
        };
      } catch (err) {
        console.warn('Could not restore speech from previous session:', err);
      }
    }
    return null;
  });

  const [sessionRestoredNotice, setSessionRestoredNotice] = useState<boolean>(() => {
    return Boolean(
      initialSession &&
        (typeof initialSession.text === 'string' ||
          initialSession.selectedVoiceId ||
          initialSession.lastSpeech)
    );
  });

  const handleResetSession = () => {
    clearLastSession();
    setText(INITIAL_SENTENCE);
    const defaultVoice = allAvailableVoices[0] || {
      ...VOICES[0],
      baseVoice: sanitizeGeminiVoice(VOICES[0].baseVoice),
    };
    setSelectedVoiceOption(defaultVoice);
    setCurrentDialect(defaultVoice.customization?.dialect || 'cairo');
    setDeliveryStyle('theatrical_drama');
    setSelectedEmotionId('astonished');
    setSelectedIntensity('medium');
    setSelectedReverbEnv(defaultVoice.customization?.reverbEnvironment || 'dry_studio');
    setSelectedReverbLevel(defaultVoice.customization?.reverbLevel || 0);
    setActiveMode('solo');
    setCurrentSpeech(null);
    setSessionRestoredNotice(false);
  };

  const handleInsertTag = (tagText: string) => {
    const textarea = document.getElementById('tts-input-textarea') as HTMLTextAreaElement | null;
    if (textarea && typeof textarea.selectionStart === 'number') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const prefixSpace = before.length > 0 && !before.endsWith(' ') ? ' ' : '';
      const suffixSpace = after.length > 0 && !after.startsWith(' ') ? ' ' : ' ';
      const newText = `${before}${prefixSpace}${tagText}${suffixSpace}${after}`;
      setText(newText);
      setTimeout(() => {
        textarea.focus();
        const newPos = start + prefixSpace.length + tagText.length + suffixSpace.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 20);
    } else {
      setText((prev) => (prev ? `${prev} ${tagText} ` : `${tagText} `));
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);
  const [quotaType, setQuotaType] = useState<'daily' | 'rate_limit' | 'exhausted' | null>(null);
  const [consecutiveQuotaFailures, setConsecutiveQuotaFailures] = useState<number>(0);
  const [quotaCountdown, setQuotaCountdown] = useState<number | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);

  // Audio File Voice Clone Modal state
  const [isCloneModalOpen, setIsCloneModalOpen] = useState<boolean>(false);
  const [cloneSuccessNotice, setCloneSuccessNotice] = useState<string | null>(null);

  // External Backup & Restore Modal state (خارج المتصفح)
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  // Vocal Anatomy & Selection Guide Modal state (مرشد الحناجر والأحبال)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Section Titles Customization Modal state (تعديل عناوين كل الأقسام)
  const [isTitlesModalOpen, setIsTitlesModalOpen] = useState<boolean>(false);
  const [sectionTitles, setSectionTitles] = useState<StudioSectionTitles>(() => {
    try {
      const saved = localStorage.getItem('tts_custom_section_titles');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    return DEFAULT_SECTION_TITLES;
  });

  const handleSaveSectionTitles = (newTitles: StudioSectionTitles) => {
    setSectionTitles(newTitles);
    try {
      localStorage.setItem('tts_custom_section_titles', JSON.stringify(newTitles));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  };

  // Countdown timer for 429 rate limit reset
  useEffect(() => {
    if (quotaCountdown === null || quotaCountdown <= 0) return;
    const interval = setInterval(() => {
      setQuotaCountdown((prev) => {
        if (prev === null || prev <= 1) {
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quotaCountdown]);

  // Quick customizer modal trigger and target tab
  const [isQuickCustomizerOpen, setIsQuickCustomizerOpen] = useState<boolean>(false);
  const [quickCustomizerTab, setQuickCustomizerTab] = useState<'elements' | 'baseVoice' | 'preview'>('elements');

  const openCustomizerWithTab = (tab: 'elements' | 'baseVoice' | 'preview') => {
    setQuickCustomizerTab(tab);
    setIsQuickCustomizerOpen(true);
  };

  const activeEmotion =
    EMOTIONS.find((e) => e.id === selectedEmotionId) || EMOTIONS[0];
  const activeLevel = activeEmotion.levels[selectedIntensity] || activeEmotion.levels.medium;

  // Resolve current active dramatic acting element labels
  const activePitchInfo = PITCH_OPTIONS.find(
    (p) => p.id === (selectedVoiceOption.customization?.pitch || 'medium')
  );
  const activeAgeInfo = AGE_OPTIONS.find(
    (a) => a.id === (selectedVoiceOption.customization?.age || 'youth_18_30')
  );
  const activePaceInfo = PACE_OPTIONS.find(
    (pc) => pc.id === (selectedVoiceOption.customization?.pace || 'balanced')
  );
  const activeTimbreInfo = TIMBRE_OPTIONS.find(
    (t) => t.id === (selectedVoiceOption.customization?.timbre || 'bright')
  );

  const isSelectedAlex =
    currentDialect === 'alex' ||
    selectedVoiceOption.customization?.dialect === 'alex' ||
    (selectedVoiceOption.customization?.dialectSubStyle &&
      selectedVoiceOption.customization.dialectSubStyle.startsWith('alex')) ||
    selectedVoiceOption.id.includes('alex');

  const displayNameText = isRtl
    ? isSelectedAlex
      ? (selectedVoiceOption.arabicName || '')
          .replace(/قاهرية/g, 'إسكندرانية')
          .replace(/قاهري/g, 'إسكندراني')
          .replace(/القاهرة/g, 'الإسكندرية')
          .split('(')[0]
          .trim()
      : selectedVoiceOption.arabicName.split('(')[0].trim()
    : selectedVoiceOption.name.split('(')[0].trim();


  const handleSelectReverbEnv = (env: ReverbEnvironment) => {
    setSelectedReverbEnv(env);
    const newLevel = env === 'dry_studio' ? 0 : selectedReverbLevel === 0 ? 35 : selectedReverbLevel;
    setSelectedReverbLevel(newLevel);
    setSelectedVoiceOption((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        reverbEnvironment: env,
        reverbLevel: newLevel,
      },
    }));
  };

  const handleChangeReverbLevel = (level: number) => {
    setSelectedReverbLevel(level);
    setSelectedVoiceOption((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        reverbLevel: level,
      },
    }));
  };

  const handleSelectVoice = (voice: VoiceOption) => {
    setSelectedVoiceOption(voice);
    if (voice.customization?.dialect) {
      setCurrentDialect(voice.customization.dialect);
    }
    if (voice.customization?.reverbEnvironment) {
      setSelectedReverbEnv(voice.customization.reverbEnvironment);
    }
    if (voice.customization?.reverbLevel !== undefined) {
      setSelectedReverbLevel(voice.customization.reverbLevel);
    }
  };

  const handleSaveCustomVoice = (preset: CustomVoicePreset) => {
    const isBuiltIn = VOICES.some((v) => v.id === preset.id);

    const isAlexVoice =
      preset.customization?.dialect === 'alex' ||
      (preset.customization?.dialectSubStyle &&
        preset.customization.dialectSubStyle.startsWith('alex')) ||
      preset.id.includes('alex');

    let finalArName = preset.arabicName;
    let finalArChar = preset.arabicCharacter;

    if (isAlexVoice) {
      finalArName = (finalArName || '')
        .replace(/قاهرية/g, 'إسكندرانية')
        .replace(/قاهري/g, 'إسكندراني')
        .replace(/القاهرة/g, 'الإسكندرية');
      finalArChar = (finalArChar || '')
        .replace(/قاهرية/g, 'إسكندرانية')
        .replace(/قاهري/g, 'إسكندراني')
        .replace(/القاهرة/g, 'الإسكندرية');
    }

    if (isBuiltIn) {
      const baseV = VOICES.find((v) => v.id === preset.id)!;
      finalArName = finalArName || baseV.arabicName;
      finalArChar = finalArChar || baseV.arabicCharacter;
      if (isAlexVoice) {
        finalArName = finalArName
          .replace(/قاهرية/g, 'إسكندرانية')
          .replace(/قاهري/g, 'إسكندراني')
          .replace(/القاهرة/g, 'الإسكندرية');
        finalArChar = finalArChar
          .replace(/قاهرية/g, 'إسكندرانية')
          .replace(/قاهري/g, 'إسكندراني')
          .replace(/القاهرة/g, 'الإسكندرية');
      }

      setVoiceCustomizations((prev) => {
        const updated = {
          ...prev,
          [preset.id]: {
            name: preset.name || baseV.name,
            arabicName: finalArName,
            character: preset.character || baseV.character,
            arabicCharacter: finalArChar,
            exactAge: preset.exactAge,
            ageLabel: preset.ageLabel,
            arabicAgeLabel: preset.arabicAgeLabel,
            baseVoice: preset.baseVoice,
            gender: preset.gender,
            customization: preset.customization,
            isModified: true,
          },
        };
        try {
          localStorage.setItem('tts_voice_customizations', JSON.stringify(updated));
        } catch (err) {
          console.warn('Could not save voice customizations:', err);
        }
        return updated;
      });

      const updatedVoice: VoiceOption = {
        ...baseV,
        name: preset.name || baseV.name,
        arabicName: finalArName,
        character: preset.character || baseV.character,
        arabicCharacter: finalArChar,
        exactAge: preset.exactAge || preset.customization?.exactAge,
        ageLabel: preset.ageLabel,
        arabicAgeLabel: preset.arabicAgeLabel,
        baseVoice: preset.baseVoice,
        gender: preset.gender,
        customization: preset.customization,
        isModified: true,
      };
      setSelectedVoiceOption(updatedVoice);
    } else {
      const preparedPreset: CustomVoicePreset = {
        ...preset,
        arabicName: finalArName,
        arabicCharacter: finalArChar,
      };

      setCustomVoices((prev) => {
        const filtered = prev.filter((v) => v.id !== preset.id);
        const updated = [preparedPreset, ...filtered];
        try {
          localStorage.setItem('tts_custom_voices_list', JSON.stringify(updated));
        } catch (err) {
          console.warn('Could not save custom voices to localStorage:', err);
        }
        return updated;
      });

      const age = preparedPreset.exactAge || preparedPreset.customization?.exactAge || 30;
      setSelectedVoiceOption({
        id: preparedPreset.id,
        name: preparedPreset.name,
        arabicName: finalArName,
        baseVoice: preparedPreset.baseVoice,
        gender: preparedPreset.gender,
        category: age <= 14 ? 'child' : 'adult',
        ageGroup: age <= 14 ? 'child' : 'adult',
        exactAge: age,
        ageLabel: preparedPreset.ageLabel,
        arabicAgeLabel: preparedPreset.arabicAgeLabel,
        character: preparedPreset.character,
        arabicCharacter: finalArChar,
        color: 'sage',
        avatarBg:
          preparedPreset.gender === 'female'
            ? 'bg-[#CB997E]/20 text-[#B07D62] border-[#CB997E]/40'
            : 'bg-[#6B705C]/15 text-[#6B705C] border-[#6B705C]/30',
        voiceInstruction: preparedPreset.voiceInstruction,
        customization: preparedPreset.customization,
        isCustom: true,
        createdAt: preparedPreset.createdAt,
      });
    }

    if (preset.customization?.dialect) {
      setCurrentDialect(preset.customization.dialect);
    }
  };

  const handleApplyToCurrent = (customization: VoiceCustomization) => {
    if (customization.dialect) {
      setCurrentDialect(customization.dialect);
    }
    setSelectedVoiceOption((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        ...customization,
      },
    }));
  };

  const handleVocalCordsChange = (updated: Partial<VoiceCustomization>) => {
    setSelectedVoiceOption((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        ...updated,
      },
    }));
  };

  // Permanent deletion for ANY character or actor voice (built-in or custom)
  const handleDeleteVoice = (voiceId: string) => {
    const isCustom = customVoices.some((v) => v.id === voiceId);

    if (isCustom) {
      setCustomVoices((prev) => {
        const updated = prev.filter((v) => v.id !== voiceId);
        try {
          localStorage.setItem('tts_custom_voices_list', JSON.stringify(updated));
        } catch (err) {
          console.warn('Could not update custom voices in localStorage:', err);
        }
        return updated;
      });
    } else {
      // Mark built-in voice as permanently deleted
      setDeletedVoiceIds((prev) => {
        if (prev.includes(voiceId)) return prev;
        const updated = [...prev, voiceId];
        try {
          localStorage.setItem('tts_deleted_voice_ids', JSON.stringify(updated));
        } catch (err) {
          console.warn('Could not save deleted voice ids to localStorage:', err);
        }
        return updated;
      });
    }

    // If the currently selected voice is deleted, switch to the first remaining available voice
    if (selectedVoiceOption.id === voiceId) {
      const remaining = allAvailableVoices.filter((v) => v.id !== voiceId);
      if (remaining.length > 0) {
        setSelectedVoiceOption(remaining[0]);
        if (remaining[0].customization?.dialect) {
          setCurrentDialect(remaining[0].customization.dialect);
        }
      }
    }
  };

  const handleRestoreDeletedVoice = (voiceId: string) => {
    setDeletedVoiceIds((prev) => {
      const updated = prev.filter((id) => id !== voiceId);
      try {
        localStorage.setItem('tts_deleted_voice_ids', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not update deleted voices in localStorage:', err);
      }
      return updated;
    });
  };

  const handleRestoreAllDeletedVoices = () => {
    setDeletedVoiceIds([]);
    try {
      localStorage.removeItem('tts_deleted_voice_ids');
    } catch (err) {
      console.warn('Could not clear deleted voices in localStorage:', err);
    }
  };

  // Restore voices and settings imported from an external JSON file outside browser
  const handleRestoreBackup = (backup: StudioBackupData, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      const newCustom = backup.data.customVoices || [];
      const newDeleted = backup.data.deletedVoiceIds || [];
      setCustomVoices(newCustom);
      setDeletedVoiceIds(newDeleted);
      try {
        localStorage.setItem('tts_custom_voices_list', JSON.stringify(newCustom));
        localStorage.setItem('tts_deleted_voice_ids', JSON.stringify(newDeleted));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    } else {
      setCustomVoices((prev) => {
        const existingIds = new Set(prev.map((v) => v.id));
        const toAdd = (backup.data.customVoices || []).filter((v) => !existingIds.has(v.id));
        const merged = [...prev, ...toAdd];
        try {
          localStorage.setItem('tts_custom_voices_list', JSON.stringify(merged));
        } catch (err) {
          console.warn('LocalStorage error:', err);
        }
        return merged;
      });

      setDeletedVoiceIds((prev) => {
        const merged = Array.from(new Set([...prev, ...(backup.data.deletedVoiceIds || [])]));
        try {
          localStorage.setItem('tts_deleted_voice_ids', JSON.stringify(merged));
        } catch (err) {
          console.warn('LocalStorage error:', err);
        }
        return merged;
      });
    }

    if (backup.data.settings) {
      if (backup.data.settings.currentDialect) {
        setCurrentDialect(backup.data.settings.currentDialect);
      }
      if (backup.data.settings.selectedEmotionId) {
        setSelectedEmotionId(backup.data.settings.selectedEmotionId);
      }
      if (backup.data.settings.selectedEmotionIntensity) {
        setSelectedIntensity(backup.data.settings.selectedEmotionIntensity);
      }
      if (backup.data.settings.text) {
        setText(backup.data.settings.text);
      }
    }
  };

  const handleSaveClonedVoice = (preset: CustomVoicePreset) => {
    handleSaveCustomVoice(preset);
    setCloneSuccessNotice(
      isRtl
        ? `✓ تم بنجاح استنساخ صوت "${preset.arabicName}" واعتماده في الاستوديو!`
        : `✓ Cloned voice "${preset.name}" saved & activated!`
    );
    setTimeout(() => setCloneSuccessNotice(null), 5000);
  };

  const handleApplyVocalRecipe = (recipe: VocalRecipe) => {
    const cleanTitle = recipe.arabicTitle.replace(/^[\p{Extended_Pictographic}\s]+/u, '').trim();
    const recipePreset: CustomVoicePreset = {
      id: `recipe_${recipe.id}_${Date.now()}`,
      name: `${recipe.title}`,
      arabicName: `${cleanTitle} (وصفة جاهزة)`,
      baseVoice: recipe.bestBaseVoice,
      gender: recipe.gender,
      exactAge: recipe.exactAge,
      ageLabel: `${recipe.exactAge}y`,
      arabicAgeLabel: `${recipe.exactAge} سنة`,
      character: recipe.description,
      arabicCharacter: recipe.arabicDescription,
      voiceInstruction: '',
      customization: {
        gender: recipe.gender,
        exactAge: recipe.exactAge,
        age:
          recipe.exactAge <= 8
            ? 'child_5_8'
            : recipe.exactAge <= 12
            ? 'child_9_12'
            : recipe.exactAge <= 17
            ? 'teen_12_17'
            : recipe.exactAge <= 35
            ? 'youth_18_35'
            : recipe.exactAge <= 55
            ? 'mature_36_55'
            : 'elder_56_85',
        dialect: currentDialect,
        pitch: recipe.pitch,
        texture: recipe.texture,
        resonance: recipe.resonance,
        timbre: recipe.timbre,
        pace: recipe.pace,
        breathing: recipe.breathing,
        melody: recipe.melody,
        customNotes: recipe.whyThisWorks,
      },
      createdAt: Date.now(),
    };

    handleSaveCustomVoice(recipePreset);
    setCloneSuccessNotice(
      isRtl
        ? `✓ تم بنجاح تطبيق وصفة «${recipe.arabicTitle}» وحفظها كصوت مخصص وتفعيلها في الاستوديو!`
        : `✓ Applied recipe "${recipe.title}" as active custom voice!`
    );
    setTimeout(() => setCloneSuccessNotice(null), 5000);
  };

  const handleGenerateSpeech = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Assemble full dramatic acting instructions
      const effectiveCustomization: VoiceCustomization = {
        gender: selectedVoiceOption.gender,
        exactAge:
          selectedVoiceOption.exactAge ||
          selectedVoiceOption.customization?.exactAge,
        age: selectedVoiceOption.customization?.age || 'youth_18_35',
        dialect: currentDialect,
        dialectSubStyle: selectedVoiceOption.customization?.dialectSubStyle,
        pitch: selectedVoiceOption.customization?.pitch || 'medium',
        melody: selectedVoiceOption.customization?.melody,
        pace: selectedVoiceOption.customization?.pace || 'balanced',
        breathing: selectedVoiceOption.customization?.breathing,
        timbre: selectedVoiceOption.customization?.timbre || 'bright',
        resonance: selectedVoiceOption.customization?.resonance,
        texture: selectedVoiceOption.customization?.texture,
        reverbEnvironment:
          selectedReverbEnv ||
          selectedVoiceOption.customization?.reverbEnvironment ||
          'dry_studio',
        reverbLevel:
          selectedReverbLevel !== undefined
            ? selectedReverbLevel
            : (selectedVoiceOption.customization?.reverbLevel !== undefined
              ? selectedVoiceOption.customization.reverbLevel
              : 0),
        deliveryStyle: deliveryStyle,
        isCasualConversation:
          deliveryStyle === 'casual_talk' ||
          activeEmotion.id === 'casual_conversation' ||
          selectedVoiceOption.customization?.isCasualConversation ||
          false,
        isEnergyOrb:
          selectedVoiceOption.isEnergyOrb ||
          selectedVoiceOption.customization?.isEnergyOrb ||
          selectedVoiceOption.id.includes('nabd'),
        customNotes: selectedVoiceOption.customization?.customNotes,
        vocalCordsTension: selectedVoiceOption.customization?.vocalCordsTension,
        vocalCordTremor: selectedVoiceOption.customization?.vocalCordTremor,
        stagingDistance: selectedVoiceOption.customization?.stagingDistance,
        emotionalArc: selectedVoiceOption.customization?.emotionalArc,
        smartHesitationBeats: selectedVoiceOption.customization?.smartHesitationBeats,
      };

      const dramaticInstruction = buildDramaticPrompt(
        effectiveCustomization,
        activeLevel.promptPrefix,
        selectedVoiceOption.isCustom ? undefined : selectedVoiceOption.voiceInstruction,
        text.trim()
      );

      const safeVoice = sanitizeGeminiVoice(selectedVoiceOption.baseVoice);

      // Check client-side audio cache first
      const cached = getCachedAudio(
        text.trim(),
        safeVoice,
        selectedEmotionId,
        selectedIntensity,
        currentDialect,
        dramaticInstruction
      );

      const dialectLabel =
        currentDialect === 'alex'
          ? isRtl
            ? 'مصرية إسكندرانية'
            : 'Alexandrian'
          : isRtl
          ? 'مصرية قاهرية'
          : 'Cairene';

      const deliveryStyleInfo = DELIVERY_STYLE_DIRECTIVES[deliveryStyle];
      const deliveryStyleLabel = isRtl
        ? deliveryStyleInfo?.arabicName || 'تمثيل مسرحي'
        : deliveryStyleInfo?.name || 'Theatrical Drama';
      const emotionLabel = isRtl ? activeEmotion.arabicShortLabel : activeEmotion.label;
      const intensityLabel = isRtl ? activeLevel.arabicLabel : activeLevel.label;
      const pitchLabel = isRtl ? activePitchInfo?.arabicLabel : activePitchInfo?.label;
      const paceLabel = isRtl ? activePaceInfo?.arabicLabel : activePaceInfo?.label;

      if (cached) {
        setCacheNotice(
          isRtl
            ? '⚡ تم التحميل الفوري من الذاكرة المحلية (بدون استهلاك كوتا)'
            : '⚡ Loaded instantly from local cache (0 quota consumed)'
        );
        setTimeout(() => setCacheNotice(null), 4000);

        const audioBlob = base64ToBlob(cached.audioBase64, 'audio/wav');
        const audioUrl = URL.createObjectURL(audioBlob);

        const cachedSpeechItem: GeneratedSpeech = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          text: text.trim(),
          voice: safeVoice,
          voiceDisplayName: isRtl ? selectedVoiceOption.arabicName : selectedVoiceOption.name,
          styleLabel: isRtl
            ? `${activeEmotion.arabicShortLabel} (${activeLevel.arabicLabel})`
            : `${activeEmotion.label} (${activeLevel.label})`,
          dialectLabel,
          reverbEnvironment: effectiveCustomization.reverbEnvironment,
          reverbLevel: effectiveCustomization.reverbLevel,
          audioBase64: cached.audioBase64,
          audioUrl,
          durationSec: cached.durationSec || 0,
          createdAt: Date.now(),
          deliveryStyle,
          deliveryStyleLabel,
          emotionId: selectedEmotionId,
          emotionLabel,
          intensity: selectedIntensity,
          intensityLabel,
          pitchLabel,
          paceLabel,
        };

        setCurrentSpeech(cachedSpeechItem);
        setIsLoading(false);
        setErrorMessage(null);
        setIsQuotaError(false);
        setQuotaType(null);
        setQuotaCountdown(null);
        return;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: safeVoice,
          voiceInstruction: dramaticInstruction,
          style: '',
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResp = await response.text();
        throw new Error(`Server returned unexpected response: ${textResp.slice(0, 100)}`);
      }

      if (!response.ok) {
        const errMsg = data.error || `Request failed with status ${response.status}`;
        const isQuota =
          errMsg.includes('429') ||
          errMsg.includes('quota') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('Rate limit');

        if (isQuota) {
          setIsQuotaError(true);
          const nextFailures = consecutiveQuotaFailures + 1;
          setConsecutiveQuotaFailures(nextFailures);

          const isDaily = errMsg.includes('PerDay') || errMsg.includes('Daily');
          setQuotaType(isDaily ? 'daily' : 'rate_limit');

          if (!isDaily && nextFailures < 2) {
            setQuotaCountdown(15);
          } else {
            setQuotaCountdown(null);
          }
        } else {
          setIsQuotaError(false);
          setQuotaType(null);
          setQuotaCountdown(null);
        }

        throw new Error(errMsg);
      }

      // Save to local cache for instant future replay
      saveCachedAudio(
        text.trim(),
        selectedVoiceOption.baseVoice,
        selectedEmotionId,
        selectedIntensity,
        currentDialect,
        data.audioBase64,
        data.durationSec || 0,
        dramaticInstruction
      );

      setConsecutiveQuotaFailures(0);
      setIsQuotaError(false);
      setQuotaType(null);
      setQuotaCountdown(null);

      const audioBlob = base64ToBlob(data.audioBase64, 'audio/wav');
      const audioUrl = URL.createObjectURL(audioBlob);

      const newSpeechItem: GeneratedSpeech = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        text: data.text || text.trim(),
        voice: selectedVoiceOption.baseVoice,
        voiceDisplayName: isRtl ? selectedVoiceOption.arabicName : selectedVoiceOption.name,
        styleLabel: isRtl
          ? `${activeEmotion.arabicShortLabel} (${activeLevel.arabicLabel})`
          : `${activeEmotion.label} (${activeLevel.label})`,
        dialectLabel,
        reverbEnvironment: effectiveCustomization.reverbEnvironment,
        reverbLevel: effectiveCustomization.reverbLevel,
        audioBase64: data.audioBase64,
        audioUrl,
        durationSec: data.durationSec || 0,
        createdAt: Date.now(),
        deliveryStyle,
        deliveryStyleLabel,
        emotionId: selectedEmotionId,
        emotionLabel,
        intensity: selectedIntensity,
        intensityLabel,
        pitchLabel,
        paceLabel,
      };

      setCurrentSpeech(newSpeechItem);
    } catch (err: any) {
      console.error('Speech generation error:', err);
      setErrorMessage(
        err?.message || 'تعذر تحويل النص إلى صوت حالياً. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Global Ctrl+Enter / Cmd+Enter shortcut to generate speech
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isLoading && text.trim()) {
          e.preventDefault();
          handleGenerateSpeech();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, text, selectedVoiceOption, currentDialect, selectedEmotionId, selectedIntensity]);

  // Automatically persist session settings to localStorage so they are restored on reload
  useEffect(() => {
    saveLastSession({
      text,
      selectedVoiceId: selectedVoiceOption.id,
      currentDialect,
      deliveryStyle,
      selectedEmotionId,
      selectedIntensity,
      selectedReverbEnv,
      selectedReverbLevel,
      activeMode,
      isRtl,
      isDirectivesOpen,
      isVoiceMenuOpen,
      isStyleMenuOpen,
      lastSpeech: currentSpeech
        ? {
            id: currentSpeech.id,
            text: currentSpeech.text,
            voice: currentSpeech.voice,
            voiceDisplayName: currentSpeech.voiceDisplayName,
            styleLabel: currentSpeech.styleLabel,
            dialectLabel: currentSpeech.dialectLabel,
            reverbEnvironment: currentSpeech.reverbEnvironment,
            reverbLevel: currentSpeech.reverbLevel,
            audioBase64: currentSpeech.audioBase64,
            durationSec: currentSpeech.durationSec,
            createdAt: currentSpeech.createdAt,
            deliveryStyle: currentSpeech.deliveryStyle,
            deliveryStyleLabel: currentSpeech.deliveryStyleLabel,
            emotionId: currentSpeech.emotionId,
            emotionLabel: currentSpeech.emotionLabel,
            intensity: currentSpeech.intensity,
            intensityLabel: currentSpeech.intensityLabel,
            pitchLabel: currentSpeech.pitchLabel,
            paceLabel: currentSpeech.paceLabel,
          }
        : null,
      savedAt: Date.now(),
    });
  }, [
    text,
    selectedVoiceOption.id,
    currentDialect,
    deliveryStyle,
    selectedEmotionId,
    selectedIntensity,
    selectedReverbEnv,
    selectedReverbLevel,
    activeMode,
    isRtl,
    isDirectivesOpen,
    isVoiceMenuOpen,
    isStyleMenuOpen,
    currentSpeech,
  ]);

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] text-[#43413E] flex flex-col font-sans selection:bg-[#6B705C]/20"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Header
        isRtl={isRtl}
        onToggleRtl={() => setIsRtl(!isRtl)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenTitlesModal={() => setIsTitlesModalOpen(true)}
        onResetSession={handleResetSession}
        hasSavedSession={hasLastSession()}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-4">
        {/* Previous Session Restored Notice Banner */}
        {sessionRestoredNotice && (
          <div className="p-3 px-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium flex items-center justify-between shadow-2xs animate-fade-in flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>
                {isRtl
                  ? 'تم استرجاع إعدادات آخر جلسة تلقائياً (النص، خيارات الصوت، أسلوب الأداء، وبيئة الصدى)'
                  : 'Restored previous session settings (Script, Voice & Performance choices)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSession}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
              >
                {isRtl ? 'بدء جلسة جديدة' : 'New Session'}
              </button>
              <button
                type="button"
                onClick={() => setSessionRestoredNotice(false)}
                className="text-amber-700 hover:text-amber-900 text-xs font-semibold cursor-pointer px-1.5"
                title={isRtl ? 'إغلاق الإشعار' : 'Dismiss'}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {/* Workspace Mode Switcher Tabs & External Backup & Voice Cloner Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#EDE9E1] rounded-2xl border border-[#DCD7CC] w-full sm:w-auto sm:min-w-[280px] shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveMode('solo')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === 'solo'
                  ? 'bg-white text-[#1F1E1B] shadow-xs'
                  : 'text-[#6B665A] hover:text-[#1F1E1B] hover:bg-white/50'
              }`}
            >
              <Mic className="w-4 h-4 text-[#C86446]" />
              <span>{isRtl ? 'أداء فردي' : 'Solo Voice'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('compare')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === 'compare'
                  ? 'bg-white text-[#1F1E1B] shadow-xs'
                  : 'text-[#6B665A] hover:text-[#1F1E1B] hover:bg-white/50'
              }`}
            >
              <Columns className="w-4 h-4 text-[#5A6E82]" />
              <span>{isRtl ? 'مقارنة (A/B)' : 'A/B Comparison'}</span>
            </button>

            <button
              type="button"
              id="batch-mode-tab-btn"
              onClick={() => setActiveMode('batch')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMode === 'batch'
                  ? 'bg-white text-[#1F1E1B] shadow-xs'
                  : 'text-[#6B665A] hover:text-[#1F1E1B] hover:bg-white/50'
              }`}
            >
              <ListOrdered className="w-4 h-4 text-[#C86446]" />
              <span>{isRtl ? 'طابور الدفعات' : 'Batch Queue'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Edit Section Titles Button */}
            <button
              type="button"
              id="top-edit-titles-btn"
              onClick={() => setIsTitlesModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#6B705C]/40 hover:border-[#6B705C] text-[#6B705C] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-98"
              title={isRtl ? 'تعديل وتخصيص عناوين جميع الأقسام' : 'Edit Section Titles'}
            >
              <Edit3 className="w-4 h-4 text-[#6B705C]" />
              <span>{isRtl ? 'تعديل عناوين الأقسام' : 'Titles'}</span>
            </button>

            {/* Vocal Guide Trigger */}
            <button
              type="button"
              id="top-guide-btn"
              onClick={() => setIsGuideModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#BC6C25]/40 hover:border-[#BC6C25] text-[#BC6C25] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-98"
              title={isRtl ? 'مرشد الحناجر والأحبال الصوتية وملمس الصوت (لاختيار سهل دون حيرة)' : 'Vocal Anatomy Guide'}
            >
              <HelpCircle className="w-4 h-4 text-[#BC6C25]" />
              <span>{isRtl ? 'مرشد الحناجر والأحبال 💡' : 'Vocal Guide'}</span>
            </button>

            {/* External Backup & Restore Trigger */}
            <button
              type="button"
              id="top-backup-btn"
              onClick={() => setIsBackupModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#0077B6]/40 hover:border-[#0077B6] text-[#0077B6] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-98"
              title={isRtl ? 'حفظ واستيراد الأصوات والإعدادات خارج المتصفح كملف JSON' : 'External JSON Backup & Restore'}
            >
              <HardDrive className="w-4 h-4 text-[#0077B6]" />
              <span>{isRtl ? 'حفظ واستيراد خارجي' : 'Backup & Restore'}</span>
              {deletedVoiceIds.length > 0 && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full font-bold">
                  {deletedVoiceIds.length}
                </span>
              )}
            </button>

            {/* Voice Cloning Trigger Button */}
            <button
              type="button"
              id="open-voice-clone-modal-btn"
              onClick={() => setIsCloneModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-[#C86446]/40 hover:border-[#C86446] text-[#C86446] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98"
              title={isRtl ? 'رفع ملف صوتي واستخراج رنين الحنجرة والأحبال الصوتية' : 'Extract voice features from audio file'}
            >
              <Wand2 className="w-4 h-4 text-[#C86446]" />
              <span>{isRtl ? 'استنساخ صوت من ملف' : 'Clone Voice from Audio'}</span>
            </button>
          </div>
        </div>

        {/* Cloned Voice Success Toast */}
        {cloneSuccessNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{cloneSuccessNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setCloneSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-semibold"
            >
              {isRtl ? 'إغلاق' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* MODE 1: SOLO VOICE */}
        {activeMode === 'solo' && (
          <div className="space-y-4">
            {/* 1. TOP CARD: Text Input Box (مربع كتابة النص في الأعلى) */}
            <div className="bg-white rounded-3xl border border-[#E5E1D8] p-5 sm:p-6 shadow-sm space-y-3.5">
              {/* Header with Title and Clear Action */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label
                  htmlFor="tts-input-textarea"
                  className="text-sm sm:text-base font-bold text-[#343230] flex items-center gap-2"
                >
                  <Quote className="w-4 h-4 text-[#C86446]" />
                  <span>{sectionTitles.script.title || (isRtl ? 'النص المطلوب تمثيله صوتياً:' : 'Dramatic Script Text:')}</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDirectivesOpen((prev) => !prev)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isDirectivesOpen
                        ? 'bg-[#C86446]/10 text-[#C86446] border-[#C86446]/40'
                        : 'bg-[#FAF8F5] text-[#7D786E] border-[#DCD7CC] hover:bg-[#FAF8F5] hover:text-[#C86446]'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5 text-[#C86446]" />
                    <span>
                      {isDirectivesOpen
                        ? isRtl
                          ? 'لوحة التوجيهات مفتوحة بالأسفل ↓'
                          : 'Tags Open Below ↓'
                        : isRtl
                        ? '+ توجيهات وفواصل تمثيلية'
                        : '+ In-line Dramatic Tags'}
                    </span>
                    {isDirectivesOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#C86446]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#7D786E]" />
                    )}
                  </button>

                  {text && (
                    <button
                      id="clear-text-btn"
                      type="button"
                      onClick={() => setText('')}
                      className="text-xs text-[#A5A58D] hover:text-[#B07D62] transition-colors flex items-center gap-1 cursor-pointer font-medium px-2 py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'مسح النص' : 'Clear text'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  id="tts-input-textarea"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      if (!isLoading && text.trim()) {
                        handleGenerateSpeech();
                      }
                    }
                  }}
                  placeholder={
                    sectionTitles.script.subtitle ||
                    (isRtl
                      ? 'اكتب أو الصق النص هنا ليتم تمثيله بنقاء فائق وباللهجة والنبرة المختارة...'
                      : 'Type or paste the dramatic text here...')
                  }
                  className="w-full rounded-2xl border border-[#DCD7CC] bg-[#F7F5F0]/60 p-4 text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-[#6B705C]/25 focus:border-[#6B705C] transition-all resize-y text-[#343230] placeholder:text-[#A5A58D] font-serif-display leading-relaxed"
                />
                <div className="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 text-[11px] text-[#A5A58D] font-medium">
                  {text.length} {isRtl ? 'حرف' : 'characters'}
                </div>
              </div>

              {/* Top Text Card Footer: Mode & Character Indicators */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F0EEE8] text-xs text-[#7D786E]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#43413E]">
                    {isRtl ? 'الإعداد المختار حالياً:' : 'Active Settings:'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#6B705C]/10 text-[#6B705C] font-bold">
                    {selectedVoiceOption.arabicName.split('(')[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#C86446]/10 text-[#C86446] font-bold">
                    {activeEmotion.arabicShortLabel} ({activeLevel.arabicLabel})
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EDE9E1] text-[#7D786E]">
                    {currentDialect === 'cairo' ? 'مصرية قاهرية' : 'مصرية إسكندرانية'}
                  </span>
                </div>
                <span className="text-[11px] text-[#A5A58D] hidden sm:inline">
                  {isRtl ? 'زر التوليد النهائي في أسفل الصفحة ↓' : 'Generate button at bottom of page ↓'}
                </span>
              </div>
            </div>

            {/* In-line Dramatic Directives & Pauses (Standard Closable Section Card) */}
            <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-2xs overflow-hidden transition-all">
              <button
                type="button"
                id="dramatic-directives-toggle-btn"
                onClick={() => setIsDirectivesOpen(!isDirectivesOpen)}
                className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors cursor-pointer text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C86446]/15 text-[#C86446] flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#343230]">
                        {isRtl ? 'التوجيهات التمثيلية الموضعية والفواصل (وقفات، تنفس، إيقاع)' : 'Dramatic Tags & Acting Pauses'}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C86446]/10 text-[#C86446] border border-[#C86446]/20">
                        {isRtl ? `${DRAMATIC_TAGS.length} توجيهاً درامياً` : `${DRAMATIC_TAGS.length} Tags`}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {isRtl ? 'تُنَفّذ فوراً في موضع المؤشر' : 'Inserts at Cursor'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7D786E] mt-0.5">
                      {isRtl ? 'إدراج سكتات حبس أنفاس، وقفات دهشة، تنهيدات، زفير، وإيماءات صوتية موضعية' : 'Insert micro-pauses, gasps, and emotional gestures in script'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7D786E] font-medium hidden sm:inline">
                    {isDirectivesOpen ? (isRtl ? 'طي القائمة' : 'Collapse') : isRtl ? 'فتح التوجيهات' : 'Expand'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E1D8] flex items-center justify-center text-[#7D786E]">
                    {isDirectivesOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {isDirectivesOpen && (
                <div className="p-4 sm:p-5 border-t border-[#F0EEE8] bg-[#FCFBF9] animate-fade-in">
                  <InlineTagsBar
                    onInsertTag={handleInsertTag}
                    disabled={isLoading}
                    onClose={() => setIsDirectivesOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* 2. Closable Menu: Voice & Character Selector (اختيار الصوت والشخصية) */}
            <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-2xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsVoiceMenuOpen(!isVoiceMenuOpen)}
                className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors cursor-pointer text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6B705C]/15 text-[#6B705C] flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                    <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#343230]">
                        {sectionTitles.voiceSelector.title || (isRtl ? 'اختيار صوت الشخصية والممثل' : 'Voice & Actor Selection')}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#6B705C]/10 text-[#6B705C] border border-[#6B705C]/20">
                        {isRtl ? selectedVoiceOption.arabicName : selectedVoiceOption.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7D786E] mt-0.5">
                      {sectionTitles.voiceSelector.subtitle || (isRtl ? `الحنجرة الأساسية: ${selectedVoiceOption.baseVoice} • اللهجة: ${currentDialect === 'cairo' ? 'مصرية قاهرية' : 'مصرية إسكندرانية'}` : '')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7D786E] font-medium hidden sm:inline">
                    {isVoiceMenuOpen ? (isRtl ? 'طي القائمة' : 'Collapse') : isRtl ? 'فتح وتغيير الصوت' : 'Expand'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E1D8] flex items-center justify-center text-[#7D786E]">
                    {isVoiceMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {isVoiceMenuOpen && (
                <div className="p-4 sm:p-6 border-t border-[#F0EEE8] bg-[#FCFBF9] animate-fade-in">
                  <VoiceSelector
                    selectedVoiceId={selectedVoiceOption.id}
                    onSelectVoiceOption={handleSelectVoice}
                    customVoices={customVoices}
                    voiceCustomizations={voiceCustomizations}
                    deletedVoiceIds={deletedVoiceIds}
                    onSaveCustomVoice={handleSaveCustomVoice}
                    onDeleteVoice={handleDeleteVoice}
                    currentDialect={currentDialect}
                    onSelectDialect={setCurrentDialect}
                    isRtl={isRtl}
                    onOpenCloneModal={() => setIsCloneModalOpen(true)}
                    onOpenBackupModal={() => setIsBackupModalOpen(true)}
                    onOpenGuideModal={() => setIsGuideModalOpen(true)}
                  />
                </div>
              )}
            </div>

            {/* 3. Closable Menu: Performance Style & Emotions (نمط الأداء والانفعال وشدة النبرة) */}
            <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-2xs overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors cursor-pointer text-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C86446]/15 text-[#C86446] flex items-center justify-center shrink-0">
                    <Theater className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#343230]">
                        {sectionTitles.performanceStyle.title || (isRtl ? 'نمط الأداء والتمثيل الصوتي وتخصيص الانفعال' : 'Acting Style & Emotion')}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C86446]/10 text-[#C86446] border border-[#C86446]/20">
                        {isRtl ? `النمط: ${DELIVERY_STYLE_DIRECTIVES[deliveryStyle]?.arabicName || 'تمثيل مسرحي'}` : `Style: ${DELIVERY_STYLE_DIRECTIVES[deliveryStyle]?.name || 'Drama'}`}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#6B705C]/10 text-[#6B705C] border border-[#6B705C]/20">
                        {isRtl ? activeEmotion.arabicShortLabel : activeEmotion.label}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        الشدة: {isRtl ? activeLevel.arabicLabel : activeLevel.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7D786E] mt-0.5">
                      {sectionTitles.performanceStyle.subtitle || (isRtl ? 'مفكوكة الارتباط: اختر أي نمط تمثيلي مع أي نبرة شعورية بنقاء 100%' : 'Decoupled: combine any performance style with any emotion')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7D786E] font-medium hidden sm:inline">
                    {isStyleMenuOpen ? (isRtl ? 'طي القائمة' : 'Collapse') : isRtl ? 'فتح وتعديل النمط' : 'Expand'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E1D8] flex items-center justify-center text-[#7D786E]">
                    {isStyleMenuOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {isStyleMenuOpen && (
                <div className="p-4 sm:p-6 border-t border-[#F0EEE8] bg-[#FCFBF9] animate-fade-in">
                  <StyleSelector
                    deliveryStyle={deliveryStyle}
                    onSelectDeliveryStyle={setDeliveryStyle}
                    selectedEmotionId={selectedEmotionId}
                    selectedIntensity={selectedIntensity}
                    onSelectEmotion={setSelectedEmotionId}
                    onSelectIntensity={setSelectedIntensity}
                    isRtl={isRtl}
                  />
                </div>
              )}
            </div>

            {/* 4. Dedicated Vocal Cords Dynamics & Advanced Dramatic Acting (تحكم الأحبال الصوتية والمقترحات 1 و 2 و 4) */}
            <VocalCordsControl
              customization={selectedVoiceOption.customization}
              onChange={handleVocalCordsChange}
              isRtl={isRtl}
            />

            {/* 5. Standalone Reverb & Acoustic Environment Control (صدى الصوت والبيئة الصوتية منفصلة تماماً خارج استوديو التخصيص) */}
            <ReverbEnvironmentControl
              reverbEnvironment={selectedReverbEnv}
              reverbLevel={selectedReverbLevel}
              onSelectEnvironment={handleSelectReverbEnv}
              onChangeLevel={handleChangeReverbLevel}
              isRtl={isRtl}
              customTitle={sectionTitles.reverbEnvironment.title}
              customSubtitle={sectionTitles.reverbEnvironment.subtitle}
            />

            {/* Local Cache Notice */}
            {cacheNotice && (
              <div
                id="cache-hit-banner"
                className="p-3.5 rounded-2xl bg-[#588157]/10 border border-[#588157]/30 text-[#3A5A40] text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fade-in"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#588157] shrink-0" />
                  <span>{cacheNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCacheNotice(null)}
                  className="text-[#588157] hover:text-[#3A5A40] text-xs cursor-pointer"
                >
                  {isRtl ? 'إغلاق' : 'Dismiss'}
                </button>
              </div>
            )}

            {/* Error / Quota Notice Banner */}
            {errorMessage && (
              <div
                id="tts-error-banner"
                className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm flex flex-col gap-3.5 ${
                  isQuotaError
                    ? 'bg-[#BC6C25]/10 border-[#BC6C25]/30 text-[#8F4E18]'
                    : 'bg-[#CB997E]/15 border-[#CB997E]/30 text-[#B07D62]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isQuotaError ? (
                    <Clock className="w-5 h-5 shrink-0 mt-0.5 text-[#BC6C25]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#B07D62]" />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm">
                        {isQuotaError
                          ? quotaType === 'daily'
                            ? isRtl
                              ? 'تم استنفاد الحصة اليومية لنموذج الصوت (Gemini Daily Quota)'
                              : 'Daily Quota Exhausted for Audio Model'
                            : isRtl
                            ? 'تم الوصول لحد سرعة الطلبات (Error 429: Rate Limit)'
                            : 'Rate Limit Reached (Error 429)'
                          : isRtl
                          ? 'تنبيه أثناء المعالجة'
                          : 'Processing Error'}
                      </span>
                    </div>

                    <div className="mt-1.5 leading-relaxed opacity-95">
                      {errorMessage}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#BC6C25]/20">
                  {isQuotaError && quotaCountdown !== null && quotaCountdown > 0 && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#BC6C25]/15 border border-[#BC6C25]/30 font-bold text-xs flex items-center gap-1.5 text-[#8F4E18]">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>{isRtl ? `انتظر ${quotaCountdown} ث` : `Wait ${quotaCountdown}s`}</span>
                    </div>
                  )}

                  {(!quotaCountdown || quotaCountdown <= 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setIsQuotaError(false);
                        setQuotaType(null);
                        handleGenerateSpeech();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#BC6C25] hover:bg-[#A3591B] text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إعادة محاولة Gemini TTS' : 'Retry Gemini TTS'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setIsQuotaError(false);
                      setQuotaCountdown(null);
                    }}
                    className="px-2.5 py-2 rounded-xl text-xs text-[#7D786E] hover:text-[#43413E] font-medium cursor-pointer"
                  >
                    {isRtl ? 'إغلاق' : 'Dismiss'}
                  </button>
                </div>
              </div>
            )}

            {/* 5. PRIMARY GENERATE ACTION SECTION AT BOTTOM OF PAGE (زر التوليد في أسفل الصفحة) */}
            <div
              id="bottom-generate-control-bar"
              className="bg-gradient-to-b from-white to-[#FAF8F5] rounded-3xl border-2 border-[#E5E1D8] hover:border-[#C86446]/40 p-5 sm:p-6 shadow-sm space-y-4 transition-all"
            >
              {/* Header: Action Status & Active Configuration Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EEE8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#C86446]/15 text-[#C86446] flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-5 h-5 text-[#C86446]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#343230]">
                      {sectionTitles.readyAndPillars.title || (isRtl ? 'جاهز لتوليد الأداء الصوتي الدرامي' : 'Ready to Synthesize Dramatic Speech')}
                    </h3>
                    <p className="text-xs text-[#7D786E]">
                      {sectionTitles.readyAndPillars.subtitle ||
                        (isRtl
                          ? 'خلاصة عناصر التمثيل والحنجرة والبيئة الصوتية المعتمدة لتوليد الأداء مع Gemini 3.1 Flash'
                          : 'Active performance pillars, vocal tract DNA & acoustic spec for Gemini Flash TTS')}
                    </p>
                  </div>
                </div>

                {/* Configuration Summary Badges & Studio Customizer Trigger */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-xl bg-[#6B705C]/10 text-[#6B705C] font-bold border border-[#6B705C]/20 text-xs">
                    {displayNameText}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#C86446]/10 text-[#C86446] font-bold border border-[#C86446]/20 text-xs">
                    {activeEmotion.arabicShortLabel} ({activeLevel.arabicLabel})
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-white text-[#7D786E] border border-[#E5E1D8] text-xs font-semibold">
                    {currentDialect === 'alex' ? (isRtl ? 'مصرية إسكندرانية' : 'Alex') : (isRtl ? 'مصرية قاهرية' : 'Cairo')}
                  </span>
                  <button
                    type="button"
                    onClick={() => openCustomizerWithTab('elements')}
                    className="text-xs font-bold text-[#6B705C] bg-[#EDE9E1] hover:bg-[#E5E1D8] px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'استوديو التخصيص' : 'Open Customizer'}</span>
                  </button>
                </div>
              </div>

              {/* MERGED UNCOLLAPSIBLE STUDIO PERFORMANCE PILLARS GRID (خلاصة عناصر الأداء غير قابلة للطي ومدمجة كلياً) */}
              <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#E5E1D8] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7D786E] font-bold px-1">
                  <span className="flex items-center gap-1.5 text-[#343230]">
                    <Sliders className="w-3.5 h-3.5 text-[#6B705C]" />
                    <span>{isRtl ? 'خلاصة أركان الأداء واستوديو التخصيص:' : 'Performance Pillars Summary:'}</span>
                  </span>
                  <span className="text-[11px] font-normal text-[#8C887B]">
                    {isRtl ? 'اضغط على أي ركن للتعديل المباشر أو السريع' : 'Click any pillar for direct quick tuning'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  {/* Pillar 1: Voice & Base Vocal Tract Lock */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openCustomizerWithTab('baseVoice')}
                    className="p-2.5 bg-white hover:bg-[#FAF8F5] rounded-xl border border-[#E5E1D8] hover:border-[#6B705C] flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs group text-start"
                  >
                    <div>
                      <span className="text-[10px] text-[#7D786E] font-medium block">1. الصوت والحنجرة</span>
                      <div className="font-extrabold text-[#343230] text-xs mt-0.5 truncate">
                        {displayNameText}
                      </div>
                      <div className="text-[10px] text-[#6B705C] font-bold truncate mt-0.5 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{selectedVoiceOption.baseVoice}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6B705C] font-semibold mt-1 group-hover:underline">
                      {isRtl ? 'تعديل الحنجرة' : 'Edit Tract'}
                    </span>
                  </div>

                  {/* Pillar 2: Dialect */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      const nextDialect = currentDialect === 'cairo' ? 'alex' : 'cairo';
                      setCurrentDialect(nextDialect);
                      setSelectedVoiceOption((prev) => ({
                        ...prev,
                        customization: {
                          ...prev.customization,
                          dialect: nextDialect,
                          dialectSubStyle: nextDialect === 'alex' ? 'alex_coastal' : 'cairo_urban',
                        },
                      }));
                    }}
                    className="p-2.5 bg-white hover:bg-[#FAF8F5] rounded-xl border border-[#E5E1D8] hover:border-[#6B705C] flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs group text-start"
                  >
                    <div>
                      <span className="text-[10px] text-[#7D786E] font-medium block">2. اللهجة</span>
                      <div className="font-extrabold text-[#343230] text-xs mt-0.5 truncate">
                        {currentDialect === 'alex' ? 'مصرية إسكندرانية' : 'مصرية قاهرية'}
                      </div>
                      <div className="text-[10px] text-[#7D786E] truncate mt-0.5">
                        {currentDialect === 'alex' ? 'ساحل بحري' : 'حضري عام'}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6B705C] font-semibold mt-1 group-hover:underline">
                      {isRtl ? 'اضغط للتبديل ⇄' : 'Click to toggle'}
                    </span>
                  </div>

                  {/* Pillar 3: Pitch & Age */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openCustomizerWithTab('elements')}
                    className="p-2.5 bg-white hover:bg-[#FAF8F5] rounded-xl border border-[#E5E1D8] hover:border-[#6B705C] flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs group text-start"
                  >
                    <div>
                      <span className="text-[10px] text-[#7D786E] font-medium block">3. العمر والطبقة</span>
                      <div className="font-extrabold text-[#343230] text-xs mt-0.5 truncate">
                        {selectedVoiceOption.exactAge ? `${selectedVoiceOption.exactAge} سنة` : '10 سنوات'}
                      </div>
                      <div className="text-[10px] text-[#7D786E] truncate mt-0.5">
                        {activePitchInfo ? activePitchInfo.arabicLabel.split('(')[0] : 'متوسط'}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6B705C] font-semibold mt-1 group-hover:underline">
                      {isRtl ? 'تعديل العمر' : 'Tune age'}
                    </span>
                  </div>

                  {/* Pillar 4: Emotion & Intensity */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedIntensity((prev) =>
                        prev === 'low' ? 'medium' : prev === 'medium' ? 'high' : 'low'
                      );
                    }}
                    className="p-2.5 bg-white hover:bg-[#FAF8F5] rounded-xl border border-[#E5E1D8] hover:border-[#6B705C] flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs group text-start"
                  >
                    <div>
                      <span className="text-[10px] text-[#7D786E] font-medium block">4. النبرة والشدة</span>
                      <div className="font-extrabold text-[#343230] text-xs mt-0.5 truncate">
                        {activeEmotion.arabicShortLabel}
                      </div>
                      <div className="text-[10px] text-[#C86446] font-bold truncate mt-0.5">
                        {activeLevel.arabicLabel}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6B705C] font-semibold mt-1 group-hover:underline">
                      {isRtl ? 'تبديل الشدة' : 'Cycle intensity'}
                    </span>
                  </div>

                  {/* Pillar 5: Pace & Timbre */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openCustomizerWithTab('elements')}
                    className="p-2.5 bg-white hover:bg-[#FAF8F5] rounded-xl border border-[#E5E1D8] hover:border-[#6B705C] flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs group text-start"
                  >
                    <div>
                      <span className="text-[10px] text-[#7D786E] font-medium block">5. الإيقاع والطابع</span>
                      <div className="font-extrabold text-[#343230] text-xs mt-0.5 truncate">
                        {activePaceInfo ? activePaceInfo.arabicLabel.split(' ')[0] : 'متوازن'}
                      </div>
                      <div className="text-[10px] text-[#7D786E] truncate mt-0.5">
                        {activeTimbreInfo ? activeTimbreInfo.arabicLabel.split(' ')[0] : 'نقي'}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6B705C] font-semibold mt-1 group-hover:underline">
                      {isRtl ? 'ضبط الإيقاع' : 'Tune pace'}
                    </span>
                  </div>

                  {/* Pillar 6: Acoustic Environment & Reverb */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      const el = document.getElementById('reverb-acoustic-environment-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2.5 bg-white hover:bg-[#FAF8F5] rounded-xl border border-[#E5E1D8] hover:border-[#6B705C] flex flex-col justify-between cursor-pointer transition-all shadow-2xs hover:shadow-xs group text-start"
                  >
                    <div>
                      <span className="text-[10px] text-[#7D786E] font-medium block">6. البيئة والصدى</span>
                      <div className="font-extrabold text-[#343230] text-xs mt-0.5 truncate">
                        {selectedReverbEnv === 'dry_studio'
                          ? (isRtl ? 'استوديو معزول' : 'Dry Studio')
                          : selectedReverbEnv === 'small_room'
                          ? (isRtl ? 'غرفة منزلية' : 'Room')
                          : selectedReverbEnv === 'grand_theater'
                          ? (isRtl ? 'مسرح كبير' : 'Theater')
                          : (isRtl ? 'قاعة واسعة' : 'Hall')}
                      </div>
                      <div className="text-[10px] text-[#5A6E82] font-semibold truncate mt-0.5">
                        {selectedReverbLevel === 0 ? (isRtl ? 'صوت جاف 0%' : 'Dry 0%') : `${selectedReverbLevel}% ${isRtl ? 'ارتداد' : 'Wet'}`}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6B705C] font-semibold mt-1 group-hover:underline">
                      {isRtl ? 'تغيير المكان' : 'Change venue'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Button Row: Big Primary Generate Button + Clone Audio Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* The Primary Generate Button (زر التوليد في أسفل الصفحة) */}
                <button
                  id="generate-speech-btn"
                  type="button"
                  disabled={isLoading || !text.trim()}
                  onClick={handleGenerateSpeech}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md active:scale-[0.99] ${
                    isLoading || !text.trim()
                      ? 'bg-[#E5E1D8] text-[#A5A58D] cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-[#C86446] to-[#B5573B] hover:from-[#B5573B] hover:to-[#A04A30] text-white shadow-[#C86446]/25 hover:shadow-lg'
                  }`}
                  title={
                    !text.trim()
                      ? isRtl
                        ? 'يرجى إدخال نص أولاً في المربع بالأعلى'
                        : 'Enter dramatic text first'
                      : isRtl
                      ? 'توليد الصوت (أو اضغط Ctrl + Enter)'
                      : 'Generate speech (or press Ctrl + Enter)'
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>
                        {isRtl
                          ? 'جارٍ التوليد والتمثيل الصوتي بنقاء استوديو فائق...'
                          : 'Synthesizing Studio Audio with Gemini Flash...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200/30" />
                      <span>
                        {isRtl
                          ? 'توليد الأداء الصوتي الدرامي (Gemini 3.1 Flash)'
                          : 'Generate Dramatic Speech (Gemini 3.1 Flash)'}
                      </span>
                      <kbd className="hidden md:inline-block px-2.5 py-0.5 rounded-lg bg-black/20 text-white/90 text-xs font-mono tracking-wider ml-1">
                        Ctrl + Enter
                      </kbd>
                    </>
                  )}
                </button>

                {/* Secondary Button: Clone Voice from Audio File */}
                <button
                  type="button"
                  id="bottom-clone-voice-btn"
                  onClick={() => setIsCloneModalOpen(true)}
                  className="px-4 py-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-[#C86446]/40 hover:border-[#C86446] text-[#C86446] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs shrink-0 active:scale-98"
                  title={isRtl ? 'رفع ملف صوتي لاستخراج رنين الحنجرة والأحبال الصوتية' : 'Extract voice features from audio file'}
                >
                  <Wand2 className="w-4 h-4 text-[#C86446]" />
                  <span>{isRtl ? 'استنساخ صوت من ملف' : 'Clone Voice from Audio'}</span>
                </button>
              </div>

              {!text.trim() && (
                <div className="text-center text-xs text-[#A5A58D] font-medium pt-0.5">
                  {isRtl
                    ? '💡 اكتب النص في الصندوق بالأعلى، ثم اضغط زر التوليد هنا أو استخدم اختصار (Ctrl+Enter).'
                    : '💡 Type your script in the top box, then click Generate or press (Ctrl+Enter).'}
                </div>
              )}
            </div>

            {/* Current Active Playback Card */}
            {currentSpeech && (
              <div className="space-y-2 animate-fade-in">
                <h2 className="text-sm font-bold text-[#343230] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#6B705C]" />
                  <span>{sectionTitles.audioPlayer.title || (isRtl ? 'التسجيل الصوتي الحالي' : 'Active Audio Player')}</span>
                </h2>
                <AudioPlayerCard speech={currentSpeech} isRtl={isRtl} />
              </div>
            )}
          </div>
        )}

        {/* MODE 2: A/B PERFORMANCE COMPARISON */}
        {activeMode === 'compare' && (
          <ComparisonWorkspace
            voices={allAvailableVoices}
            emotionCategories={EMOTIONS}
            currentDialect={currentDialect}
            onDialectChange={setCurrentDialect}
            initialText={text}
          />
        )}

        {/* MODE 3: BATCH SCRIPT QUEUE GENERATION (نمط توليد دفعات متعددة) */}
        {activeMode === 'batch' && (
          <BatchWorkspace
            voices={allAvailableVoices}
            currentDialect={currentDialect}
            isRtl={isRtl}
            defaultVoice={selectedVoiceOption}
            defaultDeliveryStyle={deliveryStyle}
            defaultEmotionId={selectedEmotionId}
            defaultIntensity={selectedIntensity}
          />
        )}
      </main>

      {/* Voice Clone Modal for Audio File Upload & Feature Extraction */}
      <VoiceCloneModal
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        onSaveClonedVoice={handleSaveClonedVoice}
        isRtl={isRtl}
      />

      {/* Quick Customizer Modal from active banner */}
      <CustomVoiceModal
        isOpen={isQuickCustomizerOpen}
        onClose={() => setIsQuickCustomizerOpen(false)}
        onSave={handleSaveCustomVoice}
        onApplyToCurrent={handleApplyToCurrent}
        editingVoice={selectedVoiceOption}
        initialTab={quickCustomizerTab}
        isRtl={isRtl}
      />

      {/* External Backup & Restore Modal (حفظ واستيراد خارجي خارج المتصفح) */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        isRtl={isRtl}
        customVoices={customVoices}
        deletedVoiceIds={deletedVoiceIds}
        currentDialect={currentDialect}
        selectedVoiceId={selectedVoiceOption.id}
        selectedEmotionId={selectedEmotionId}
        selectedEmotionIntensity={selectedIntensity}
        currentText={text}
        onRestoreBackup={handleRestoreBackup}
        onRestoreDeletedVoice={handleRestoreDeletedVoice}
        onRestoreAllDeletedVoices={handleRestoreAllDeletedVoices}
      />

      {/* Vocal Anatomy & Selection Guide Modal (مرشد الحناجر والأحبال الصوتية وملمس الصوت) */}
      <VocalGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        isRtl={isRtl}
        onApplyRecipe={handleApplyVocalRecipe}
      />

      {/* Section Titles Customization Modal (تعديل وتخصيص عناوين كل الأقسام) */}
      <SectionTitlesModal
        isOpen={isTitlesModalOpen}
        onClose={() => setIsTitlesModalOpen(false)}
        titles={sectionTitles}
        onSaveTitles={handleSaveSectionTitles}
        isRtl={isRtl}
      />

      {/* Sticky Bottom Dock for Instant Audio Generation Access */}
      {activeMode === 'solo' && text.trim() && (
        <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-lg w-full z-40 animate-fade-in pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md border border-[#E5E1D8] shadow-2xl rounded-2xl p-2.5 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0 pr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="min-w-0 text-xs">
                <span className="font-bold text-[#343230] truncate block">
                  {selectedVoiceOption.arabicName.split('(')[0]}
                </span>
                <span className="text-[10px] text-[#7D786E] truncate block">
                  {activeEmotion.arabicShortLabel} • {text.length} حرف
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCloneModalOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F0EEE8] border border-[#E5E1D8] text-[#C86446] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                title="استنساخ صوت من ملف"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">استنساخ صوت</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerateSpeech}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 text-white shadow-sm transition-all cursor-pointer ${
                  isLoading
                    ? 'bg-[#E5E1D8] text-[#A5A58D] cursor-not-allowed'
                    : 'bg-[#C86446] hover:bg-[#B5573B] active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ التوليد...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد الصوت</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-[#DCD7CC] py-6 text-center text-xs text-[#A5A58D]">
        <p>
          {isRtl
            ? 'استوديو الأصوات التمثيلية المصرية • جودة استوديو عالية النقاء بواسطة Google Gemini 3.1 Flash TTS'
            : 'Egyptian Dramatic Speech Studio • High Fidelity Studio Audio by Gemini 3.1 Flash TTS'}
        </p>
      </footer>
    </div>
  );
}
