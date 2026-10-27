import React, { useState, useEffect } from 'react';
import {
  VoiceName,
  VoiceOption,
  CustomVoicePreset,
  VoiceCustomization,
  EgyptianDialect,
  DialectSubStyle,
  PitchLevel,
  MelodyType,
  ResonanceChamber,
  VocalTexture,
  AgeCategory,
  PaceLevel,
  BreathingPattern,
  VocalTimbre,
  Gender,
  EmotionIntensity,
  ReverbEnvironment,
} from '../types';
import {
  BASE_GEMINI_VOICES,
  DIALECTS,
  DIALECT_SUB_STYLES,
  AGE_STAGES,
  getStageFromAge,
  PITCH_OPTIONS,
  MELODY_OPTIONS,
  RESONANCE_OPTIONS,
  TEXTURE_OPTIONS,
  TIMBRE_OPTIONS,
  PACE_OPTIONS,
  BREATHING_OPTIONS,
  REVERB_ENVIRONMENTS,
  REVERB_ENVIRONMENTS_LIST,
  REVERB_LEVEL_PRESETS,
  smartAutoCastVoice,
  buildDramaticPrompt,
} from '../utils/dramaticVoice';
import { playReverbPreviewTone } from '../utils/audio';
import { EMOTIONS } from '../emotions';
import { VocalGuideModal, VocalRecipe } from './VocalGuideModal';
import {
  X,
  Sparkles,
  Sliders,
  Compass,
  Zap,
  Volume2,
  Check,
  Save,
  Wand2,
  User,
  Info,
  Clock,
  Layers,
  Smile,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Lock,
  CheckCircle2,
  Waves,
  Theater,
  Home,
  Radio,
} from 'lucide-react';

interface CustomVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voice: CustomVoicePreset) => void;
  onApplyToCurrent?: (
    customization: VoiceCustomization,
    baseVoice: VoiceName,
    name: string,
    character?: string,
    arabicCharacter?: string
  ) => void;
  editingVoice: VoiceOption | CustomVoicePreset | null;
  initialTab?: 'elements' | 'baseVoice' | 'preview';
  isRtl: boolean;
}

// Egyptian authentic name suggestions for realistic dramatic characters
function suggestEgyptianCharacterName(gender: Gender, age: number): { arabic: string; english: string } {
  if (gender === 'female') {
    if (age <= 12) {
      const names = [
        { arabic: 'نور (طفلة 10 سنوات)', english: 'Nour (Child)' },
        { arabic: 'سارة (طفلة مرحة)', english: 'Sara (Child)' },
        { arabic: 'فريدة (طفلة بريئة)', english: 'Farida (Child)' },
        { arabic: 'ملك (تلميذة)', english: 'Malak (Child)' },
        { arabic: 'جنى (طفلة شقية)', english: 'Jana (Child)' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    } else if (age <= 25) {
      const names = [
        { arabic: 'مريم (شابة جامعية)', english: 'Mariam (Young)' },
        { arabic: 'ندى (شابة عفوية)', english: 'Nada (Young)' },
        { arabic: 'سلمى (شابة هادئة)', english: 'Salma (Young)' },
        { arabic: 'ياسمين (شابة طموحة)', english: 'Yasmine (Young)' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    } else if (age <= 50) {
      const names = [
        { arabic: 'منى (سيدة وقورة)', english: 'Mona (Adult)' },
        { arabic: 'أمينة (ربة منزل طيبة)', english: 'Amina (Adult)' },
        { arabic: 'داليا (أم حنونة)', english: 'Dalia (Adult)' },
        { arabic: 'أبلة فوزية', english: 'Abla Fawzia' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    } else {
      const names = [
        { arabic: 'الحاجة فاطمة (جدة)', english: 'Haja Fatima (Elder)' },
        { arabic: 'الحاجة زينب (مسنة طيبة)', english: 'Haja Zeinab (Elder)' },
        { arabic: 'الجدة أمينة (حكيمة العائلة)', english: 'Grandma Amina' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    }
  } else {
    // Male
    if (age <= 12) {
      const names = [
        { arabic: 'عمر (طفل 10 سنوات)', english: 'Omar (Child)' },
        { arabic: 'ياسين (تلميذ شاطر)', english: 'Yassin (Child)' },
        { arabic: 'كريم (طفل نشيط)', english: 'Karim (Child)' },
        { arabic: 'حمزة (ولد مرح)', english: 'Hamza (Child)' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    } else if (age <= 25) {
      const names = [
        { arabic: 'أحمد (شاب جامعي)', english: 'Ahmed (Young)' },
        { arabic: 'مروان (شاب نشيط)', english: 'Marwan (Young)' },
        { arabic: 'طارق (شاب إسكندراني)', english: 'Tarek (Young)' },
        { arabic: 'زياد (شاب عفوي)', english: 'Ziad (Young)' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    } else if (age <= 50) {
      const names = [
        { arabic: 'الأستاذ حسن (معلم قدير)', english: 'Professor Hassan' },
        { arabic: 'الأسطى عبده (حرفي خفيف الظل)', english: 'Osta Abdo' },
        { arabic: 'حسام (رجل أعمال هادئ)', english: 'Hossam (Adult)' },
        { arabic: 'شريف (أب طيب)', english: 'Sherif (Adult)' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    } else {
      const names = [
        { arabic: 'عم حسن (رجل مسن وقور)', english: 'Amm Hassan (Elder)' },
        { arabic: 'الحاج إبراهيم (شيخ طيب)', english: 'Hajj Ibrahim (Elder)' },
        { arabic: 'الجد شاكر (جد حنون)', english: 'Grandpa Shaker' },
      ];
      return names[Math.floor(Math.random() * names.length)];
    }
  }
}

export const CustomVoiceModal: React.FC<CustomVoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onApplyToCurrent,
  editingVoice,
  initialTab,
  isRtl,
}) => {
  const isEditingExistingCustom = editingVoice !== null;

  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [baseVoice, setBaseVoice] = useState<VoiceName>('Zephyr');
  const [gender, setGender] = useState<Gender>('female');

  // Exact age in years & stage
  const [exactAge, setExactAge] = useState<number>(10);
  const [ageStage, setAgeStage] = useState<AgeCategory>('child_8_11');

  // Base vocal tract lock (Pins Zephyr for girls or Puck for boys to protect against prompt dominance)
  const [baseVoiceLocked, setBaseVoiceLocked] = useState<boolean>(true);

  // Emotional intensity level: low, medium, high (recommended: low or medium)
  const [emotionIntensity, setEmotionIntensity] =
    useState<EmotionIntensity>('medium');

  // Auto-save notification timestamp
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<number | null>(null);

  // Auto-casting toggle (Smart Auto Actor Match)
  const [autoCastActor, setAutoCastActor] = useState<boolean>(false);
  const [showVocalTractExplainer, setShowVocalTractExplainer] = useState<boolean>(false);

  // Dialect & Sub-Style
  const [dialect, setDialect] = useState<EgyptianDialect>('cairo');
  const [dialectSubStyle, setDialectSubStyle] =
    useState<DialectSubStyle>('cairo_urban');

  // Pitch & Melody
  const [pitch, setPitch] = useState<PitchLevel>('high');
  const [melody, setMelody] = useState<MelodyType>('melodic');

  // Timbre, Resonance & Texture
  const [timbre, setTimbre] = useState<VocalTimbre>('bright');
  const [resonance, setResonance] = useState<ResonanceChamber>('throat');
  const [texture, setTexture] = useState<VocalTexture>('pure');

  // Pace, Tempo & Breathing
  const [pace, setPace] = useState<PaceLevel>('balanced');
  const [breathing, setBreathing] = useState<BreathingPattern>('natural');

  // Reverb & Acoustic Recording Environment (صدى الصوت وبيئة التسجيل)
  const [reverbEnvironment, setReverbEnvironment] =
    useState<ReverbEnvironment>('dry_studio');
  const [reverbLevel, setReverbLevel] = useState<number>(0);
  const [isPlayingReverbAudition, setIsPlayingReverbAudition] =
    useState<boolean>(false);

  // Everyday Casual Conversation mode
  const [isCasualConversation, setIsCasualConversation] =
    useState<boolean>(false);

  const [customNotes, setCustomNotes] = useState('');
  const [selectedEmotionId, setSelectedEmotionId] =
    useState<string>('casual_conversation');

  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'elements' | 'baseVoice' | 'preview'>(
    initialTab || 'elements'
  );
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [larynxFilter, setLarynxFilter] = useState<'all' | 'female' | 'male'>('all');

  const handleApplyRecipeFromModal = (recipe: VocalRecipe) => {
    setGender(recipe.gender);
    setExactAge(recipe.exactAge);
    setBaseVoice(recipe.bestBaseVoice);
    setBaseVoiceLocked(true);
    setPitch(recipe.pitch);
    setTexture(recipe.texture);
    setResonance(recipe.resonance);
    setTimbre(recipe.timbre);
    setPace(recipe.pace);
    setBreathing(recipe.breathing);
    setMelody(recipe.melody);
    if (!arabicName || arabicName.startsWith('صوت مخصص') || arabicName === '') {
      const cleanTitle = recipe.arabicTitle.replace(/^[\p{Extended_Pictographic}\s]+/u, '').trim();
      setArabicName(cleanTitle);
      setName(recipe.title);
    }
  };

  // Initialize or reset when editingVoice changes
  useEffect(() => {
    if (editingVoice) {
      setName(editingVoice.name);
      setArabicName(editingVoice.arabicName);
      setBaseVoice(editingVoice.baseVoice);
      setGender(editingVoice.gender || 'female');

      const cust =
        'customization' in editingVoice && editingVoice.customization
          ? editingVoice.customization
          : null;

      // Extract exact age reliably from exactAge field, customization, or ageGroup
      const derivedAge =
        (editingVoice as any).exactAge ??
        cust?.exactAge ??
        (('category' in editingVoice && editingVoice.category === 'child')
          ? (editingVoice.id.includes('6')
            ? 6
            : editingVoice.id.includes('8')
            ? 8
            : editingVoice.id.includes('12')
            ? 12
            : 10)
          : editingVoice.id.includes('elder')
          ? 65
          : editingVoice.id.includes('drama') || editingVoice.id.includes('45')
          ? 45
          : editingVoice.id.includes('gritty') || editingVoice.id.includes('40')
          ? 40
          : editingVoice.id.includes('hero') || editingVoice.id.includes('30')
          ? 30
          : 25);

      setExactAge(derivedAge);
      setAgeStage(cust?.age || getStageFromAge(derivedAge).id);
      setAutoCastActor(false);
      setBaseVoiceLocked(cust?.baseVoiceLock ?? (derivedAge <= 15));
      setEmotionIntensity(cust?.emotionIntensity || 'medium');

      if (cust) {
        setDialect(cust.dialect || (editingVoice.id.includes('alex') ? 'alex' : 'cairo'));
        setDialectSubStyle(
          cust.dialectSubStyle || (cust.dialect === 'alex' ? 'alex_coastal' : 'cairo_urban')
        );
        setPitch(
          cust.pitch ||
            (derivedAge <= 7 ? 'very_high' : derivedAge <= 12 ? 'high' : derivedAge >= 55 ? 'deep' : 'medium')
        );
        setMelody(cust.melody || 'melodic');
        setTimbre(cust.timbre || (editingVoice.gender === 'female' ? 'bright' : 'resonant'));
        setResonance(cust.resonance || (editingVoice.gender === 'female' ? 'throat' : 'chest'));
        setTexture(cust.texture || 'pure');
        setPace(cust.pace || 'balanced');
        setBreathing(cust.breathing || 'natural');
        setReverbEnvironment(cust.reverbEnvironment || 'dry_studio');
        setReverbLevel(
          cust.reverbLevel !== undefined
            ? cust.reverbLevel
            : (cust.reverbEnvironment === 'dry_studio' || !cust.reverbEnvironment ? 0 : 35)
        );
        setIsCasualConversation(cust.isCasualConversation || false);
        setCustomNotes(cust.customNotes || '');
      } else {
        setDialect(editingVoice.id.includes('alex') ? 'alex' : 'cairo');
        setDialectSubStyle(editingVoice.id.includes('alex') ? 'alex_coastal' : 'cairo_urban');
        setPitch(
          derivedAge <= 7 ? 'very_high' : derivedAge <= 12 ? 'high' : derivedAge >= 55 ? 'deep' : 'medium'
        );
        setMelody('melodic');
        setTimbre(editingVoice.gender === 'female' ? 'bright' : 'resonant');
        setResonance(editingVoice.gender === 'female' ? 'throat' : 'chest');
        setTexture('pure');
        setPace('balanced');
        setBreathing('natural');
        setReverbEnvironment('dry_studio');
        setReverbLevel(0);
        setIsCasualConversation(false);
        setCustomNotes('');
      }
    } else {
      // Check if user has an existing saved draft in localStorage to restore
      let hasDraft = false;
      try {
        const savedDraft = localStorage.getItem('dramatic_custom_voice_draft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === 'object') {
            if (parsed.arabicName) setArabicName(parsed.arabicName);
            if (parsed.name) setName(parsed.name);
            if (parsed.baseVoice) setBaseVoice(parsed.baseVoice);
            if (parsed.gender) setGender(parsed.gender);
            if (parsed.exactAge) setExactAge(parsed.exactAge);
            if (parsed.ageStage) setAgeStage(parsed.ageStage);
            if (parsed.dialect) setDialect(parsed.dialect);
            if (parsed.dialectSubStyle) setDialectSubStyle(parsed.dialectSubStyle);
            if (parsed.pitch) setPitch(parsed.pitch);
            if (parsed.melody) setMelody(parsed.melody);
            if (parsed.timbre) setTimbre(parsed.timbre);
            if (parsed.resonance) setResonance(parsed.resonance);
            if (parsed.texture) setTexture(parsed.texture);
            if (parsed.pace) setPace(parsed.pace);
            if (parsed.breathing) setBreathing(parsed.breathing);
            if (parsed.reverbEnvironment) setReverbEnvironment(parsed.reverbEnvironment);
            if (parsed.reverbLevel !== undefined) setReverbLevel(parsed.reverbLevel);
            if (parsed.isCasualConversation !== undefined) setIsCasualConversation(parsed.isCasualConversation);
            if (parsed.emotionIntensity) setEmotionIntensity(parsed.emotionIntensity);
            if (parsed.selectedEmotionId) setSelectedEmotionId(parsed.selectedEmotionId);
            if (parsed.customNotes) setCustomNotes(parsed.customNotes);
            if (parsed.baseVoiceLocked !== undefined) setBaseVoiceLocked(parsed.baseVoiceLocked);
            hasDraft = true;
          }
        }
      } catch (e) {
        console.warn('Draft restoration error', e);
      }

      if (!hasDraft) {
        // Brand New Voice Defaults
        const initialGen: Gender = 'female';
        const initialAge = 10;
        const initialSuggest = suggestEgyptianCharacterName(initialGen, initialAge);
        setName(initialSuggest.english);
        setArabicName(initialSuggest.arabic);
        setGender(initialGen);
        setExactAge(initialAge);
        setAgeStage('child_9_12');
        setBaseVoice('Zephyr');
        setBaseVoiceLocked(true);
        setAutoCastActor(false);
        setDialect('cairo');
        setDialectSubStyle('cairo_urban');
        setPitch('high');
        setMelody('melodic');
        setTimbre('bright');
        setResonance('throat');
        setTexture('pure');
        setPace('balanced');
        setBreathing('natural');
        setIsCasualConversation(false);
        setEmotionIntensity('medium');
        setCustomNotes('');
      }
    }
    setError(null);
    setActiveTab(initialTab || 'elements');
  }, [editingVoice, isOpen, initialTab]);

  // Instant Auto-Save to localStorage on every change
  useEffect(() => {
    if (!isOpen) return;

    const draft = {
      name,
      arabicName,
      baseVoice,
      gender,
      exactAge,
      ageStage,
      dialect,
      dialectSubStyle,
      pitch,
      melody,
      timbre,
      resonance,
      texture,
      pace,
      breathing,
      reverbEnvironment,
      reverbLevel,
      autoCastActor,
      baseVoiceLocked,
      isCasualConversation,
      emotionIntensity,
      selectedEmotionId,
      customNotes,
      editingVoiceId: editingVoice?.id || null,
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem('dramatic_custom_voice_draft', JSON.stringify(draft));
      setLastAutoSaveTime(Date.now());
    } catch (e) {
      console.warn('Auto-save to localStorage failed', e);
    }
  }, [
    isOpen,
    name,
    arabicName,
    baseVoice,
    gender,
    exactAge,
    ageStage,
    dialect,
    dialectSubStyle,
    pitch,
    melody,
    timbre,
    resonance,
    texture,
    pace,
    breathing,
    reverbEnvironment,
    reverbLevel,
    autoCastActor,
    baseVoiceLocked,
    isCasualConversation,
    emotionIntensity,
    selectedEmotionId,
    customNotes,
    editingVoice?.id,
  ]);

  // Sync tab when initialTab changes while modal is open
  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Update base voice automatically ONLY when auto-cast is explicitly enabled by user and not locked
  useEffect(() => {
    if (autoCastActor && !baseVoiceLocked) {
      const optimalVoice = smartAutoCastVoice(gender, exactAge, pitch, timbre);
      setBaseVoice(optimalVoice);
    }
  }, [gender, exactAge, pitch, timbre, autoCastActor, baseVoiceLocked]);

  // Handle exact age adjustment without destructively overwriting chosen pitch
  const handleExactAgeChange = (newAge: number) => {
    const clamped = Math.max(4, Math.min(85, newAge));
    setExactAge(clamped);
    const stage = getStageFromAge(clamped);
    setAgeStage(stage.id);

    // If age is child (<= 15) and baseVoiceLocked is true:
    if (clamped <= 15 && baseVoiceLocked) {
      setBaseVoice(gender === 'female' ? 'Zephyr' : 'Puck');
    }
  };

  const handleGenderSelect = (newGender: Gender) => {
    setGender(newGender);
    if (exactAge <= 15 || baseVoiceLocked) {
      setBaseVoice(newGender === 'female' ? 'Zephyr' : 'Puck');
    } else if (autoCastActor) {
      const optimal = smartAutoCastVoice(newGender, exactAge, pitch, timbre);
      setBaseVoice(optimal);
    }
  };

  const handleStageSelect = (stageId: AgeCategory) => {
    setAgeStage(stageId);
    const foundStage = AGE_STAGES.find((s) => s.id === stageId);
    if (foundStage) {
      setExactAge(foundStage.defaultAge);
      // Auto adjust pitch suggestion only when explicitly picking age stages
      if (foundStage.defaultAge <= 7) setPitch('very_high');
      else if (foundStage.defaultAge <= 11) setPitch('high');
      else if (foundStage.defaultAge <= 35) setPitch('medium');
      else if (foundStage.defaultAge <= 55) setPitch(gender === 'male' ? 'deep' : 'medium');
      else setPitch(gender === 'male' ? 'very_deep' : 'deep');

      // Auto pin base voice for child categories: Zephyr for female, Puck for male!
      if (foundStage.defaultAge <= 15) {
        setBaseVoice(gender === 'female' ? 'Zephyr' : 'Puck');
        setBaseVoiceLocked(true);
      }
    }
  };

  const handleDialectChange = (newDialect: EgyptianDialect) => {
    setDialect(newDialect);
    if (newDialect === 'cairo') {
      setDialectSubStyle('cairo_urban');
      setArabicName((prev) =>
        prev
          .replace(/إسكندرانية/g, 'قاهرية')
          .replace(/إسكندراني/g, 'قاهري')
          .replace(/الإسكندرية/g, 'القاهرة')
      );
    } else {
      setDialectSubStyle('alex_coastal');
      setArabicName((prev) =>
        prev
          .replace(/قاهرية/g, 'إسكندرانية')
          .replace(/قاهري/g, 'إسكندراني')
          .replace(/القاهرة/g, 'الإسكندرية')
      );
    }
  };

  if (!isOpen) return null;

  const subStyleObj = DIALECT_SUB_STYLES.find((s) => s.id === dialectSubStyle);
  const resolvedDialect: EgyptianDialect = subStyleObj ? subStyleObj.dialect : dialect;
  const subStyleLabel = subStyleObj
    ? (isRtl ? subStyleObj.arabicLabel.split('(')[0].trim() : subStyleObj.label)
    : (resolvedDialect === 'alex' ? (isRtl ? 'إسكندراني' : 'Alexandrian') : (isRtl ? 'قاهري' : 'Cairene'));

  const currentCustomization: VoiceCustomization = {
    gender,
    exactAge,
    age: ageStage,
    dialect: resolvedDialect,
    dialectSubStyle,
    pitch,
    melody,
    timbre,
    resonance,
    texture,
    pace,
    breathing,
    reverbEnvironment,
    reverbLevel,
    autoCastActor,
    baseVoiceLock: baseVoiceLocked,
    isCasualConversation,
    emotionIntensity,
    selectedEmotionId,
    customNotes,
  };

  const activeStageInfo = getStageFromAge(exactAge);
  const selectedBaseVoiceInfo = BASE_GEMINI_VOICES.find(
    (b) => b.name === baseVoice
  );
  const activeDialectSubStyles = DIALECT_SUB_STYLES;

  const handleApplyImmediate = () => {
    let finalName =
      arabicName.trim() ||
      name.trim() ||
      (isRtl
        ? `${gender === 'female' ? 'شخصية أنثوية' : 'شخصية ذكورية'} (${exactAge} سنة)`
        : `${gender === 'female' ? 'Female' : 'Male'} Character (${exactAge}y)`);

    if (resolvedDialect === 'alex') {
      finalName = finalName.replace(/قاهرية/g, 'إسكندرانية').replace(/قاهري/g, 'إسكندراني');
    }

    const finalCharacter = `${activeStageInfo.label} • ${pitch} pitch`;
    const finalArabicCharacter = `${activeStageInfo.arabicLabel} • ${gender === 'female' ? 'أنثى' : 'ذكر'} • ${subStyleLabel} • حنجرة ${baseVoice}`;

    if (onApplyToCurrent) {
      onApplyToCurrent(currentCustomization, baseVoice, finalName, finalCharacter, finalArabicCharacter);
    } else {
      // Build and save preset directly
      const emotionObj =
        EMOTIONS.find((em) => em.id === selectedEmotionId) || EMOTIONS[0];
      const intensityLevel = emotionIntensity || 'medium';
      const promptPrefix = emotionObj.levels[intensityLevel]?.promptPrefix || emotionObj.levels.medium.promptPrefix;
      const generatedPrompt = buildDramaticPrompt(
        currentCustomization,
        promptPrefix,
        customNotes
      );
      const preset: CustomVoicePreset = {
        id: isEditingExistingCustom
          ? editingVoice!.id
          : `custom_voice_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: name.trim() || finalName,
        arabicName: finalName,
        baseVoice,
        gender,
        exactAge,
        ageLabel: `${exactAge}y (${gender})`,
        arabicAgeLabel: `${exactAge} سنة (${gender === 'female' ? 'أنثى' : 'ذكر'})`,
        character: finalCharacter,
        arabicCharacter: finalArabicCharacter,
        voiceInstruction: generatedPrompt,
        customization: currentCustomization,
        createdAt: isEditingExistingCustom && editingVoice && 'createdAt' in editingVoice && editingVoice.createdAt
          ? (editingVoice.createdAt as number)
          : Date.now(),
      };
      onSave(preset);
    }
    onClose();
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    let finalName =
      arabicName.trim() ||
      name.trim() ||
      (isRtl
        ? `${gender === 'female' ? 'شخصية أنثوية' : 'شخصية ذكورية'} (${exactAge} سنة)`
        : `${gender === 'female' ? 'Female' : 'Male'} Character (${exactAge}y)`);

    if (resolvedDialect === 'alex') {
      finalName = finalName.replace(/قاهرية/g, 'إسكندرانية').replace(/قاهري/g, 'إسكندراني');
    }

    const finalCharacter = `${activeStageInfo.label} • ${pitch} pitch`;
    const finalArabicCharacter = `${activeStageInfo.arabicLabel} • ${gender === 'female' ? 'أنثى' : 'ذكر'} • ${subStyleLabel} • حنجرة ${baseVoice}`;

    const emotionObj =
      EMOTIONS.find((em) => em.id === selectedEmotionId) || EMOTIONS[0];
    const intensityLevel = emotionIntensity || 'medium';
    const promptPrefix = emotionObj.levels[intensityLevel]?.promptPrefix || emotionObj.levels.medium.promptPrefix;
    const generatedPrompt = buildDramaticPrompt(
      currentCustomization,
      promptPrefix,
      customNotes
    );

    const presetId = isEditingExistingCustom
      ? editingVoice!.id
      : `custom_voice_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const presetCreatedAt =
      isEditingExistingCustom && editingVoice && 'createdAt' in editingVoice && editingVoice.createdAt
        ? (editingVoice.createdAt as number)
        : Date.now();

    const preset: CustomVoicePreset = {
      id: presetId,
      name: name.trim() || finalName,
      arabicName: finalName,
      baseVoice,
      gender,
      exactAge,
      ageLabel: `${exactAge}y (${gender})`,
      arabicAgeLabel: `${exactAge} سنة (${gender === 'female' ? 'أنثى' : 'ذكر'})`,
      character: finalCharacter,
      arabicCharacter: finalArabicCharacter,
      voiceInstruction: generatedPrompt,
      customization: currentCustomization,
      createdAt: presetCreatedAt,
    };

    onSave(preset);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="dramatic-voice-customizer-modal"
        className="bg-white rounded-3xl border border-[#DCD7CC] shadow-2xl max-w-4xl w-full my-auto overflow-hidden text-[#43413E] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="bg-[#FAF8F5] border-b border-[#E5E1D8] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6B705C] text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#43413E]">
                  {isRtl
                    ? 'استوديو بناء وتخصيص الصوت التمثيلي المصري'
                    : 'Egyptian Dramatic Voice Customization Studio'}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6B705C]/15 text-[#5B604C] font-semibold">
                  {isRtl ? 'نقاء استوديو فائق' : 'Studio-Grade Purity'}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isRtl ? '✓ حفظ تلقائي فوري بالمتصفح' : '✓ Auto-Saved'}</span>
                </div>
              </div>
              <p className="text-xs text-[#7D786E] mt-0.5">
                {isRtl
                  ? 'تخصيص النوع، العمر، الحنجرة الأساسية، وشدة الانفعال مع حفظ فوري لجميع التعديلات'
                  : 'Customize gender, age, base voice lock, and emotion intensity with instant auto-save'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#BC6C25]/40 bg-[#BC6C25]/10 hover:bg-[#BC6C25]/20 text-[#BC6C25] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title={isRtl ? 'دليل الحناجر والأحبال لمساعدتك على الاختيار' : 'Vocal Guide'}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isRtl ? 'مرشد الحناجر والأحبال 💡' : 'Vocal Guide'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EDE9E1] text-[#7D786E] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#E5E1D8] px-6 bg-white gap-2 text-xs font-bold shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('elements')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'elements'
                ? 'border-[#6B705C] text-[#6B705C]'
                : 'border-transparent text-[#7D786E] hover:text-[#43413E]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isRtl ? 'عناصر التمثيل والأداء والحنجرة الأساسية' : 'Acting Elements & Base Voice'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('baseVoice')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'baseVoice'
                ? 'border-[#6B705C] text-[#6B705C]'
                : 'border-transparent text-[#7D786E] hover:text-[#43413E]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {isRtl
                ? `دليل الحناجر الفيزيائية DNA (${selectedBaseVoiceInfo?.name || baseVoice})`
                : `Base Vocal Tract (${baseVoice})`}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-[#6B705C] text-[#6B705C]'
                : 'border-transparent text-[#7D786E] hover:text-[#43413E]'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>{isRtl ? 'معاينة الصوت واختبار الأداء والحفظ' : 'Preview & Save'}</span>
          </button>
        </div>

        {/* Modal Form Scrollable Area */}
        <form
          onSubmit={handleSavePreset}
          className="p-6 space-y-6 overflow-y-auto flex-1 text-xs"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* VOICE PERSONA IDENTITY & NAME (Always visible at top of form) */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#6B705C] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  {arabicName ? arabicName.trim()[0] : gender === 'female' ? 'ن' : 'ع'}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#43413E] flex items-center gap-2">
                    <span>{isRtl ? 'اسم وهوية الشخصية الصوتية المخصصة:' : 'Voice Character Identity & Name:'}</span>
                    {isEditingExistingCustom ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B07D62]/15 text-[#B07D62] font-semibold">
                        {isRtl ? 'تعديل صوت محفوظ' : 'Editing Preset'}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B705C]/15 text-[#5B604C] font-semibold">
                        {isRtl ? 'صوت تمثيلي جديد' : 'New Voice'}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-[#7D786E]">
                    {isRtl
                      ? 'حدد اسم الشخصية لتمييزها واستخدامها في الحوارات والتمثيل الصوتي'
                      : 'Define the character name for dialogue script and voice acting'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const suggestion = suggestEgyptianCharacterName(gender, exactAge);
                  setArabicName(suggestion.arabic);
                  setName(suggestion.english);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DCD7CC] hover:border-[#6B705C] text-[#6B705C] hover:text-[#5B604C] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                title={isRtl ? 'اقتراح اسم شخصية مصرية تلقائياً مناسب للسن والنوع' : 'Suggest authentic Egyptian character name'}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{isRtl ? 'اقتراح اسم مصري' : 'Suggest Egyptian Name'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-[#43413E] block mb-1">
                  {isRtl ? 'اسم الشخصية باللغة العربية (مطلوب):' : 'Arabic Name (Required):'}
                </label>
                <input
                  type="text"
                  required
                  value={arabicName}
                  onChange={(e) => setArabicName(e.target.value)}
                  placeholder={
                    isRtl
                      ? `مثال: ${gender === 'female' ? 'سارة (10 سنوات)' : 'عمر (10 سنوات)'}`
                      : 'e.g. Sara (10y)'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD7CC] bg-white focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 focus:border-[#6B705C] text-xs font-bold text-[#43413E] shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7D786E] block mb-1">
                  {isRtl ? 'الاسم بالإنجليزية (اختياري):' : 'English Name (Optional):'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sara (Egyptian Girl)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD7CC] bg-white focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 focus:border-[#6B705C] text-xs text-[#43413E] shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* TAB 1: ELEMENTS & ACTING PERFORMANCE */}
          {activeTab === 'elements' && (
            <div className="space-y-6">
              {/* 1. EXACT CHARACTER AGE SECTION (تحديد وتخصيص العمر الدقيق للشخصية) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E1D8] shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-bold text-[#343230] flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-[#6B705C]" />
                    <span>{isRtl ? '1. العمر الدقيق للشخصية (بالأعوام)' : '1. Exact Character Age (Years)'}</span>
                  </label>
                  <span className="text-xs font-bold text-[#6B705C] px-3 py-1 rounded-full bg-[#6B705C]/15 border border-[#6B705C]/30 shadow-2xs">
                    {exactAge} {isRtl ? 'سنة' : 'years'} ({isRtl ? activeStageInfo.arabicLabel : activeStageInfo.label})
                  </span>
                </div>

                {/* Direct Number Input Box & Stepper Buttons */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border-2 border-[#6B705C]/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#43413E] block">
                        {isRtl ? 'خانة إدخال وتعديل العمر الدقيق للشخصية:' : 'Exact Age Input Box (Years):'}
                      </span>
                      <span className="text-[11px] text-[#7D786E]">
                        {isRtl ? 'اكتب العمر المطلوب مباشرة أو استخدم زري (+ / -)' : 'Type age directly or click (+ / -)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleExactAgeChange(Math.max(4, exactAge - 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-[#DCD7CC] hover:bg-[#EDE9E1] font-bold text-lg flex items-center justify-center text-[#43413E] cursor-pointer shadow-2xs transition-colors"
                        title={isRtl ? 'إنقاص سنة' : '-1 year'}
                      >
                        -
                      </button>

                      <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#6B705C] shadow-inner">
                        <input
                          type="number"
                          min={4}
                          max={85}
                          value={exactAge}
                          onChange={(e) => handleExactAgeChange(parseInt(e.target.value) || 10)}
                          className="w-16 text-center font-extrabold text-base text-[#43413E] bg-transparent focus:outline-none"
                        />
                        <span className="text-xs font-bold text-[#6B705C]">
                          {isRtl ? 'سنة' : 'yrs'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleExactAgeChange(Math.min(85, exactAge + 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-[#DCD7CC] hover:bg-[#EDE9E1] font-bold text-lg flex items-center justify-center text-[#43413E] cursor-pointer shadow-2xs transition-colors"
                        title={isRtl ? 'زيادة سنة' : '+1 year'}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={4}
                      max={85}
                      step={1}
                      value={exactAge}
                      onChange={(e) => handleExactAgeChange(parseInt(e.target.value))}
                      className="w-full accent-[#6B705C] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#7D786E] font-medium">
                      <span>4 {isRtl ? 'سنوات (طفل)' : 'y (child)'}</span>
                      <span>12 {isRtl ? 'سنة' : 'y'}</span>
                      <span>25 {isRtl ? 'سنة (شاب)' : 'y (youth)'}</span>
                      <span>45 {isRtl ? 'سنة (ناضج)' : 'y (mature)'}</span>
                      <span>85 {isRtl ? 'سنة (مسن)' : 'y (elder)'}</span>
                    </div>
                  </div>

                  {/* Quick Stage Shortcuts */}
                  <div className="pt-2 border-t border-[#EDE9E1] space-y-1.5">
                    <span className="text-[11px] text-[#7D786E] font-semibold block">
                      {isRtl ? 'أو اختر مرحلة عمرية سريعة:' : 'Or pick an age stage:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                      {AGE_STAGES.map((stg) => {
                        const isSelected = ageStage === stg.id;
                        return (
                          <button
                            key={stg.id}
                            type="button"
                            onClick={() => handleStageSelect(stg.id)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                              isSelected
                                ? 'bg-[#6B705C] text-white border-[#6B705C] font-bold shadow-2xs'
                                : 'bg-white border-[#E5E1D8] text-[#7D786E] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            <div className="truncate">{isRtl ? stg.arabicLabel : stg.label}</div>
                            <div className="text-[10px] opacity-75 mt-0.5">{stg.minAge}-{stg.maxAge} {isRtl ? 'سنة' : 'y'}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. GENDER SECTION */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#43413E] flex items-center gap-1.5 text-xs">
                    <User className="w-4 h-4 text-[#6B705C]" />
                    <span>
                      {isRtl ? '2. النوع الصوتي للشخصية' : '2. Character Gender'}
                    </span>
                  </label>
                  <span className="text-[11px] font-bold text-[#6B705C] px-2.5 py-0.5 rounded-full bg-[#6B705C]/15">
                    {gender === 'female'
                      ? isRtl ? 'أنثى (بنت / فتاة)' : 'Female'
                      : isRtl ? 'ذكر (ولد / رجل)' : 'Male'}
                  </span>
                </div>

                {/* Gender Toggle */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleGenderSelect('female')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-[#CB997E]/15 border-[#CB997E] text-[#B07D62] shadow-2xs'
                        : 'bg-white border-[#E5E1D8] text-[#7D786E] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B07D62]" />
                    <span>{isRtl ? 'أنثى (بنت / فتاة / سيدة)' : 'Female (Girl / Woman)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderSelect('male')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-[#6B705C]/15 border-[#6B705C] text-[#5B604C] shadow-2xs'
                        : 'bg-white border-[#E5E1D8] text-[#7D786E] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6B705C]" />
                    <span>{isRtl ? 'ذكر (ولد / فتى / رجل)' : 'Male (Boy / Man)'}</span>
                  </button>
                </div>
              </div>

              {/* 3. BASE VOICE PINNING & PROMPT DOMINANCE SHIELD CARD */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#43413E] flex items-center gap-2">
                        <span>{isRtl ? '3. تثبيت الحنجرة الأساسية (Base Voice Lock):' : '3. Pin Base Vocal Tract:'}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 font-bold text-xs">
                          {baseVoice} ({gender === 'female' ? (isRtl ? 'بنات' : 'Girls') : (isRtl ? 'بنين' : 'Boys')})
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#7D786E]">
                        {isRtl
                          ? 'Zephyr للبنات أو Puck للبنين: يمنع تحول نبرة الصوت لشخص آخر عند تغيير الانفعالات'
                          : 'Zephyr for girls / Puck for boys: prevents voice morphing during emotions'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetVoice = gender === 'female' ? 'Zephyr' : 'Puck';
                        setBaseVoice(targetVoice);
                        setBaseVoiceLocked(true);
                        setAutoCastActor(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                    >
                      {isRtl
                        ? gender === 'female'
                          ? '🔒 تثبيت حنجرة Zephyr للبنات'
                          : '🔒 تثبيت حنجرة Puck للبنين'
                        : `Lock ${gender === 'female' ? 'Zephyr' : 'Puck'}`}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBaseVoiceLocked(!baseVoiceLocked)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        baseVoiceLocked
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-[#7D786E] border-[#DCD7CC]'
                      }`}
                    >
                      {baseVoiceLocked ? (isRtl ? '✓ الحنجرة مثبتة' : 'Locked') : (isRtl ? 'غير مثبتة' : 'Unlocked')}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. REGIONAL DIALECT SUB-STYLE SECTION */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#43413E] flex items-center gap-1.5 text-xs">
                    <Compass className="w-4 h-4 text-[#6B705C]" />
                    <span>
                      {isRtl
                        ? '4. الفرع البيئي الدقيق للهجة (Regional Sub-Style)'
                        : '4. Regional Dialect Sub-Style'}
                    </span>
                  </label>
                  <span className="text-[10px] text-[#7D786E]">
                    {isRtl ? '(مزامنة تلقائية مع اللهجة الرئيسية)' : '(Auto-synced with main dialect)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeDialectSubStyles.map((sub) => {
                    const isSelected = dialectSubStyle === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setDialectSubStyle(sub.id);
                          setDialect(sub.dialect);
                          if (sub.dialect === 'alex') {
                            setArabicName((prev) =>
                              prev
                                .replace(/قاهرية/g, 'إسكندرانية')
                                .replace(/قاهري/g, 'إسكندراني')
                                .replace(/القاهرة/g, 'الإسكندرية')
                            );
                          } else if (sub.dialect === 'cairo') {
                            setArabicName((prev) =>
                              prev
                                .replace(/إسكندرانية/g, 'قاهرية')
                                .replace(/إسكندراني/g, 'قاهري')
                                .replace(/الإسكندرية/g, 'القاهرة')
                            );
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6B705C]/15 border-[#6B705C] text-[#5B604C] font-bold shadow-2xs'
                            : 'bg-white border-[#E5E1D8] text-[#7D786E] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <p className="font-bold text-xs">
                          {isRtl ? sub.arabicLabel : sub.label}
                        </p>
                        <p className="text-[10px] text-[#7D786E] mt-0.5">
                          {isRtl ? sub.arabicDescription : sub.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. MELODY & CONTOUR SECTION */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#43413E] flex items-center gap-1.5 text-xs">
                    <Layers className="w-4 h-4 text-[#B07D62]" />
                    <span>
                      {isRtl
                        ? '5. الانعطاف النغمي وتطريب الكلام (Melody & Contour)'
                        : '5. Intonation Contour & Melody'}
                    </span>
                  </label>
                  <span className="text-[10px] text-[#7D786E]">
                    {isRtl ? '(تردد القرار والجواب F0 يُحدد من الواجهة)' : '(Pitch F0 is set on main screen)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MELODY_OPTIONS.map((mOpt) => {
                    const isSelected = melody === mOpt.id;
                    return (
                      <button
                        key={mOpt.id}
                        type="button"
                        onClick={() => setMelody(mOpt.id)}
                        className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#6B705C] bg-[#6B705C]/15 text-[#5B604C] font-bold shadow-2xs'
                            : 'border-[#E5E1D8] bg-white hover:bg-[#FAF8F5] text-[#7D786E]'
                        }`}
                      >
                        <p className="font-bold text-xs">
                          {isRtl ? mOpt.arabicLabel : mOpt.label}
                        </p>
                        <p className="text-[10px] text-[#7D786E] mt-0.5">
                          {isRtl ? mOpt.arabicDescription : mOpt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. VOCAL TIMBRE, RESONANCE & TEXTURE (SPLIT ELEMENT) */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] shadow-2xs space-y-4">
                <label className="font-bold text-[#43413E] flex items-center gap-1.5 text-xs">
                  <Zap className="w-4 h-4 text-[#D4A373]" />
                  <span>
                    {isRtl
                      ? '6. طابع الخروج الصوتي والرنين وملمس الأحبال (مقسوم لعنصرين)'
                      : '6. Vocal Timbre, Resonance Chamber & Texture'}
                  </span>
                </label>

                {/* A. Resonance Chamber */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#7D786E] block">
                    {isRtl
                      ? 'أ) موضع الرنين الصوتي الأساسي (Resonance Chamber):'
                      : 'A) Resonance Chamber Focus:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {RESONANCE_OPTIONS.map((rOpt) => {
                      const isSelected = resonance === rOpt.id;
                      return (
                        <button
                          key={rOpt.id}
                          type="button"
                          onClick={() => setResonance(rOpt.id)}
                          className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#BC6C25] bg-[#D4A373]/20 text-[#8C4A0E] font-bold'
                              : 'border-[#E5E1D8] bg-white hover:bg-[#FAF8F5] text-[#7D786E]'
                          }`}
                        >
                          <p className="font-bold text-xs">
                            {isRtl ? rOpt.arabicLabel : rOpt.label}
                          </p>
                          <p className="text-[10px] text-[#7D786E] mt-0.5">
                            {isRtl ? rOpt.arabicDescription : rOpt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* B. Vocal Texture */}
                <div className="space-y-1.5 pt-2 border-t border-[#EDE9E1]">
                  <span className="text-[11px] font-semibold text-[#7D786E] block">
                    {isRtl
                      ? 'ب) ملمس ونسيج الحبال الصوتية (Texture & Breathiness):'
                      : 'B) Vocal Cord Texture & Breathiness:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {TEXTURE_OPTIONS.map((txOpt) => {
                      const isSelected = texture === txOpt.id;
                      return (
                        <button
                          key={txOpt.id}
                          type="button"
                          onClick={() => setTexture(txOpt.id)}
                          className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#6B705C] bg-[#6B705C]/15 text-[#5B604C] font-bold'
                              : 'border-[#E5E1D8] bg-white hover:bg-[#FAF8F5] text-[#7D786E]'
                          }`}
                        >
                          <p className="font-bold text-xs">
                            {isRtl ? txOpt.arabicLabel : txOpt.label}
                          </p>
                          <p className="text-[10px] text-[#7D786E] mt-0.5">
                            {isRtl ? txOpt.arabicDescription : txOpt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 7. PACE & BREATHING PATTERNS (SPLIT ELEMENT) */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] shadow-2xs space-y-4">
                <label className="font-bold text-[#43413E] flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-[#6B705C]" />
                  <span>
                    {isRtl
                      ? '7. الإيقاع وسرعة الكلام وطبيعة التنفس (مقسوم لعنصرين)'
                      : '7. Speech Pace, Tempo & Breathing Pauses'}
                  </span>
                </label>

                {/* A. Speed / Pace */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#7D786E] block">
                    {isRtl
                      ? 'أ) سرعة الكلمات وتدفق العبارات (Speech Tempo):'
                      : 'A) Speech Tempo & Pace:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {PACE_OPTIONS.map((pOpt) => {
                      const isSelected = pace === pOpt.id;
                      return (
                        <button
                          key={pOpt.id}
                          type="button"
                          onClick={() => setPace(pOpt.id)}
                          className={`p-2 rounded-xl border text-start transition-all cursor-pointer text-xs ${
                            isSelected
                              ? 'border-[#6B705C] bg-[#6B705C]/15 text-[#5B604C] font-bold'
                              : 'border-[#E5E1D8] bg-white hover:bg-[#FAF8F5] text-[#7D786E]'
                          }`}
                        >
                          <p className="font-semibold">
                            {isRtl ? pOpt.arabicLabel.split(' ')[0] : pOpt.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* B. Breathing & Pauses */}
                <div className="space-y-1.5 pt-2 border-t border-[#EDE9E1]">
                  <span className="text-[11px] font-semibold text-[#7D786E] block">
                    {isRtl
                      ? 'ب) طبيعة الوقفات والتنفس واللهاث (Dramatic Breathing):'
                      : 'B) Dramatic Respiration & Pauses:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {BREATHING_OPTIONS.map((bOpt) => {
                      const isSelected = breathing === bOpt.id;
                      return (
                        <button
                          key={bOpt.id}
                          type="button"
                          onClick={() => setBreathing(bOpt.id)}
                          className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#6B705C] bg-[#6B705C]/15 text-[#5B604C] font-bold'
                              : 'border-[#E5E1D8] bg-white hover:bg-[#FAF8F5] text-[#7D786E]'
                          }`}
                        >
                          <p className="font-bold text-xs">
                            {isRtl ? bOpt.arabicLabel : bOpt.label}
                          </p>
                          <p className="text-[10px] text-[#7D786E] mt-0.5">
                            {isRtl ? bOpt.arabicDescription : bOpt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 8. DIRECTOR'S DRAMATIC NOTES (توجيهات المخرج والملاحظات الإضافية) */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#43413E] flex items-center gap-1.5 text-xs">
                    <MessageSquare className="w-4 h-4 text-[#6B705C]" />
                    <span>
                      {isRtl
                        ? '8. توجيهات المخرج الدرامية الحرة والملاحظات الإضافية (اختياري)'
                        : "8. Director's Custom Dramatic Notes & Directives"}
                    </span>
                  </label>
                  <span className="text-[10px] text-[#7D786E]">
                    {isRtl ? 'تعليمات خاصة بالمشهد أو الشخصية' : 'Scene-specific nuances'}
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'مثال: نبرة تلميذة متحمسة، أو حديث شرفة صباحي دافئ وعفوي، أو توتر خفيف مكتوم...'
                      : 'e.g. cheerful morning balcony chat, excited school student, subtle nervous undertone...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 focus:border-[#6B705C] text-xs text-[#43413E] leading-relaxed resize-none shadow-inner"
                />

                {/* Quick Directive Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#7D786E] font-medium">
                    {isRtl ? 'اقتراحات سريعة:' : 'Quick ideas:'}
                  </span>
                  {[
                    { ar: 'حوار عفوي وتلقائي 100%', en: '100% natural spontaneous' },
                    { ar: 'نبرة دافئة ومهدئة', en: 'Warm soothing tone' },
                    { ar: 'طاقة شبابية حيوية', en: 'Vibrant youthful energy' },
                    { ar: 'وقفات تأملية محسوبة', en: 'Thoughtful pauses' },
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomNotes((prev) => (prev ? `${prev}، ${sug.ar}` : sug.ar))}
                      className="px-2 py-0.5 rounded-lg bg-white border border-[#DCD7CC] text-[10px] text-[#6B705C] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      + {isRtl ? sug.ar : sug.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BASE VOCAL TRACT & AUTO-CASTING */}
          {activeTab === 'baseVoice' && (
            <div className="space-y-5">
              {/* Explainer Box on Why Base Voice Exists */}
              <div className="p-4 rounded-2xl bg-[#EDE9E1]/60 border border-[#E5E1D8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#6B705C]" />
                    <h3 className="font-bold text-xs text-[#43413E]">
                      {isRtl
                        ? 'لماذا توجد خانة «الصوت الأساسي» طالما يمكنني التخصيص؟'
                        : 'Why does the Base Voice exist if full customization is available?'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVocalTractExplainer(!showVocalTractExplainer)}
                    className="text-[11px] font-bold text-[#6B705C] underline cursor-pointer"
                  >
                    {showVocalTractExplainer
                      ? isRtl
                        ? 'إخفاء التوضيح'
                        : 'Hide'
                      : isRtl
                      ? 'قراءة التفاصيل التشريحية'
                      : 'Details'}
                  </button>
                </div>

                <p className="text-[11px] text-[#7D786E] leading-relaxed">
                  {isRtl
                    ? 'الصوت الأساسي يمثل «الحنجرة الفيزيائية الأولية للممثل» (طول القناة الصوتية وحجم التجويف الصدري). بينما التخصيص يمثل «الأداء والمكياج التمثيلي». اختيار الحنجرة المتوافقة مع العمر والنوع يضمن إخراج صوت نقي وطبيعي 100% بدون أي تصنع.'
                    : 'The Base Voice is the acoustic vocal tract anatomy. Customization is the acting performance. Auto-casting picks the ideal vocal tract for your character.'}
                </p>

                {showVocalTractExplainer && (
                  <div className="p-3 bg-white rounded-xl border border-[#DCD7CC] text-[11px] text-[#43413E] space-y-1.5 mt-2">
                    <p>
                      <strong>• الحنجرة الفيزيائية (Acoustic DNA):</strong> أصوات مثل
                      Zephyr و Puck تمتلك تردداً طبيعياً مرتفعاً يناسب الأطفال، بينما
                      أصوات مثل Charon و Fenrir تمتلك رنيناً صدرياً رجولياً ضخماً.
                    </p>
                    <p>
                      <strong>• ميزة الترشيح التلقائي:</strong> النظام يقوم نيابة عنك باختيار
                      أفضل حنجرة مطابقة فور اختيارك للنوع والعمر!
                    </p>
                  </div>
                )}
              </div>

              {/* Auto-Casting Toggle Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      autoCastActor
                        ? 'bg-[#6B705C] text-white'
                        : 'bg-[#EDE9E1] text-[#7D786E]'
                    }`}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${autoCastActor ? 'animate-spin-slow' : ''}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#43413E]">
                      {isRtl
                        ? 'الترشيح التلقائي الذكي للحنجرة (Auto-Casting)'
                        : 'Smart Auto-Casting'}
                    </h4>
                    <p className="text-[11px] text-[#7D786E]">
                      {isRtl
                        ? `المطابقة الحالية تلقائياً: ${selectedBaseVoiceInfo?.arabicLabel || baseVoice}`
                        : `Current auto-match: ${baseVoice}`}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCastActor}
                    onChange={(e) => setAutoCastActor(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#DCD7CC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-[#DCD7CC] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B705C]"></div>
                </label>
              </div>

              {/* 10 Gemini Base Voices Grid (Selectable manually if autoCast is off or user wants to experiment) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#43413E]">
                      {isRtl
                        ? 'قائمة الحناجر الصوتية الـ 10 من Gemini (يمكنك التبديل يدوياً):'
                        : '10 Physical Gemini Vocal Tracts:'}
                    </span>
                    <span className="text-[10px] bg-[#6B705C] text-white px-2 py-0.5 rounded-full font-bold">
                      10 حناجر
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E1D8]">
                    <button
                      type="button"
                      onClick={() => setLarynxFilter('all')}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        larynxFilter === 'all'
                          ? 'bg-[#6B705C] text-white shadow-xs'
                          : 'text-[#7D786E] hover:text-[#343230]'
                      }`}
                    >
                      {isRtl ? 'الكل (10)' : 'All (10)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLarynxFilter('female')}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        larynxFilter === 'female'
                          ? 'bg-[#CB997E] text-white shadow-xs'
                          : 'text-[#7D786E] hover:text-[#343230]'
                      }`}
                    >
                      {isRtl ? 'إناث (5)' : 'Females (5)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLarynxFilter('male')}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        larynxFilter === 'male'
                          ? 'bg-[#43413E] text-white shadow-xs'
                          : 'text-[#7D786E] hover:text-[#343230]'
                      }`}
                    >
                      {isRtl ? 'ذكور (5)' : 'Males (5)'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto p-1 pr-1.5 rounded-xl border border-[#E5E1D8]/60 bg-white/40">
                  {BASE_GEMINI_VOICES.filter((bVoice) => {
                    if (larynxFilter === 'all') return true;
                    return bVoice.gender === larynxFilter;
                  }).map((bVoice) => {
                    const isSelected = baseVoice === bVoice.name;
                    return (
                      <button
                        key={bVoice.name}
                        type="button"
                        onClick={() => {
                          setBaseVoice(bVoice.name);
                          setAutoCastActor(false);
                        }}
                        className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-white border-[#6B705C] shadow-sm ring-2 ring-[#6B705C]/30'
                            : 'bg-white/80 border-[#E5E1D8] hover:bg-white hover:border-[#DCD7CC]'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${bVoice.avatarBg}`}
                        >
                          {bVoice.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className="font-bold text-xs text-[#43413E]">
                              {isRtl ? bVoice.arabicLabel : bVoice.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                                {bVoice.recommendedAgeRange[0]}-{bVoice.recommendedAgeRange[1]} سنة
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#EDE9E1] text-[#7D786E] font-medium">
                                {bVoice.archetype}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-[#7D786E] mt-1 leading-relaxed line-clamp-2">
                            {isRtl
                              ? bVoice.arabicCharacterDescription
                              : bVoice.characterDescription}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PREVIEW, DIRECTIVES & SAVE */}
          {activeTab === 'preview' && (
            <div className="space-y-5">
              {/* Preset Identity Name Inputs */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E1D8] space-y-3">
                <h3 className="font-bold text-xs text-[#43413E]">
                  {isRtl ? 'اسم الشخصية الصوتية للحفظ:' : 'Save Voice Persona Identity:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#7D786E] block mb-1">
                      {isRtl ? 'الاسم باللغة العربية:' : 'Arabic Name:'}
                    </label>
                    <input
                      type="text"
                      value={arabicName}
                      onChange={(e) => setArabicName(e.target.value)}
                      placeholder={
                        isRtl
                          ? `مثال: ${gender === 'female' ? 'ندى' : 'عمر'} (${exactAge} سنة)`
                          : 'e.g. Nada (10y)'
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#6B705C] text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#7D786E] block mb-1">
                      {isRtl ? 'الاسم بالإنجليزية (اختياري):' : 'English Name:'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nada (Egyptian Girl)"
                      className="w-full px-3 py-2 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#6B705C] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7D786E] block mb-1">
                    {isRtl ? 'ملاحظة تمثيلية خاصة (اختياري):' : 'Custom Acting Notes:'}
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder={
                      isRtl
                        ? 'مثال: نبرة تلميذة متحمسة، أو حديث شرفة صباحي مبهج...'
                        : 'e.g. cheerful morning balcony chat...'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#6B705C] text-xs"
                  />
                </div>
              </div>

              {/* Live Generated Prompt Directive Preview */}
              <div className="p-4 rounded-2xl bg-[#EDE9E1]/50 border border-[#E5E1D8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#43413E] flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#6B705C]" />
                    <span>
                      {isRtl
                        ? 'كود التوجيه الهندسي المولد لنموذج Gemini 3.1 Flash TTS:'
                        : 'Engineered Prompt Sent to Gemini 3.1 Flash TTS:'}
                    </span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#6B705C] border border-[#DCD7CC]">
                    Base Actor: {baseVoice}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#DCD7CC] text-[11px] text-[#43413E] font-mono leading-relaxed max-h-36 overflow-y-auto">
                  {buildDramaticPrompt(
                    currentCustomization,
                    'Emotional tone: active',
                    customNotes
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Action Buttons */}
          <div className="pt-4 border-t border-[#E5E1D8] flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#DCD7CC] text-[#7D786E] hover:bg-[#FAF8F5] text-xs font-bold transition-all cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onApplyToCurrent && (
                <button
                  type="button"
                  id="apply-to-current-session-btn"
                  onClick={handleApplyImmediate}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#6B705C] bg-white text-[#6B705C] hover:bg-[#6B705C]/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تطبيق فوري على الجلسة الحالية' : 'Apply to Session'}</span>
                </button>
              )}

              <button
                type="submit"
                id="save-custom-voice-modal-btn"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#6B705C] hover:bg-[#5B604C] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>
                  {isEditingExistingCustom
                    ? isRtl
                      ? 'تحديث وحفظ الصوت'
                      : 'Update & Save Voice'
                    : isRtl
                    ? 'حفظ وتطبيق كصوت مخصص'
                    : 'Save Voice Preset'}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Embedded Vocal Anatomy & Selection Guide */}
        <VocalGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          isRtl={isRtl}
          onApplyRecipe={handleApplyRecipeFromModal}
        />
      </div>
    </div>
  );
};
