export type VoiceName =
  | 'Kore'
  | 'Puck'
  | 'Charon'
  | 'Fenrir'
  | 'Zephyr'
  | 'Calliope'
  | 'Aoede'
  | 'Leda'
  | 'Orus'
  | 'Enceladus';

export type Gender = 'female' | 'male';

export type EgyptianDialect = 'cairo' | 'alex';

export type DialectSubStyle =
  | 'cairo_urban'
  | 'cairo_folk'
  | 'alex_classic'
  | 'alex_coastal'
  | 'alex_youth'
  | 'suez_canal'
  | 'portsaid_canal'
  | 'saidi_upper'
  | 'alex_spirited'; // backwards compatible alias

export type AgeCategory =
  | 'child_5_8'
  | 'child_9_12'
  | 'child_4_7'
  | 'child_8_11'
  | 'teen_12_17'
  | 'youth_18_35'
  | 'mature_36_55'
  | 'elder_56_85'
  // Backwards compatibility legacy aliases
  | 'child_8_10'
  | 'teen_11_14'
  | 'youth_18_30'
  | 'adult_35_50'
  | 'elder_60_plus';

export type PitchLevel = 'very_high' | 'high' | 'medium' | 'deep' | 'very_deep';

export type MelodyType = 'melodic' | 'grounded' | 'dynamic';

export type ResonanceChamber = 'chest' | 'throat' | 'head' | 'nasal';

export type VocalTexture = 'pure' | 'breathy' | 'raspy' | 'constricted';

export type PaceLevel = 'very_slow' | 'slow' | 'balanced' | 'fast' | 'urgent' | 'ultra_fast';

export type BreathingPattern = 'contemplative' | 'natural' | 'breathless';

export type VocalTimbre =
  | 'warm'
  | 'resonant'
  | 'muffled'
  | 'whispered'
  | 'raspy'
  | 'bright';

export type ReverbEnvironment =
  | 'dry_studio'      // استوديو مغلق معزول
  | 'small_room'     // غرفة صغيرة
  | 'grand_theater'  // مسرح كبير وقاعة
  | 'vast_space';    // فضاء سينمائي واسع

export type DramaticDeliveryStyle =
  | 'theatrical_drama'        // تمثيل مسرحي درامي
  | 'casual_talk'             // حوار واقعي عفوي
  | 'storytelling'            // قصص وحكايات
  | 'animation_dub'           // دبلجة ورسوم متحركة
  | 'documentary'             // وثائقي ورصين
  | 'comedy_wit'              // كوميديا وسخرية مصرية
  | 'introspective_soliloquy' // مونولوج وتأمل نفسي
  | 'commercial_promo'        // إعلاني وحماسي
  | 'cinematic_whisper'       // سينمائي واقعي هامس
  | 'epic_heroic'             // ملحمي وبطولي تاريخي
  | 'folk_hakawati'           // حكواتي شعبي وموال بلدي
  | 'investigative_noir'      // تحقيقي استقصائي بوليسي
  | 'horror_thriller'         // رعب وغموض نفسي
  | 'poetic_romantic'         // شعر وأدب وجداني راقٍ
  | 'modern_podcast'          // بودكاست حواري معاصر
  | 'melodramatic_telenovela';// ميلودراما ودوبلاج عاطفي

export interface VoiceCustomization {
  // Gender & Exact Age
  gender?: Gender;
  exactAge?: number; // Exact age in years (e.g. 4 to 85)
  age?: AgeCategory;

  // Dialect & Sub-style
  dialect?: EgyptianDialect;
  dialectSubStyle?: DialectSubStyle;

  // Pitch & Melody
  pitch?: PitchLevel;
  melody?: MelodyType;

  // Timbre, Resonance & Texture
  timbre?: VocalTimbre;
  resonance?: ResonanceChamber;
  texture?: VocalTexture;

  // Pace, Tempo & Breathing
  pace?: PaceLevel;
  breathing?: BreathingPattern;

  // Staging Distance & Acoustic Proximity (المسافة الصوتية وقرب الميكروفون)
  stagingDistance?: StagingDistance;

  // Vocal Cords & Glottal Dynamics (تحكم متقدم في الأحبال الصوتية والانغلاق المزماري)
  vocalCordsTension?: VocalCordsTension;
  vocalCordTremor?: VocalCordTremor;

  // Dynamic Emotional Arc & Smart Hesitation Beats
  emotionalArc?: EmotionalArcConfig;
  smartHesitationBeats?: boolean;

  // Reverb & Recording Environment (صدى الصوت وبيئة التسجيل)
  reverbEnvironment?: ReverbEnvironment;
  reverbLevel?: number; // 0 to 100 percentage

  // Casting settings
  autoCastActor?: boolean;
  baseVoiceLock?: boolean;

  // Delivery style & Conversational mode
  deliveryStyle?: DramaticDeliveryStyle;
  isCasualConversation?: boolean;
  isEnergyOrb?: boolean;

  // Emotion and Intensity settings
  emotionIntensity?: EmotionIntensity;
  selectedEmotionId?: string;

  // Base Voice reference
  baseVoice?: VoiceName;

  customNotes?: string;
}

export type StagingDistance = 'intimate_close_mic' | 'standard_studio' | 'projected_stage';

export type VocalCordsTension =
  | 'taut_firm'          // مشدودة بانغلاق محكم
  | 'relaxed_breathy'    // مرتخية مع تسريب هواء همسي
  | 'pressed_creaky'     // مضغوطة بحشرجة مزمارية
  | 'elastic_melodic';   // مرنة مطاطية طروبة

export type VocalCordTremor =
  | 'steady_pure'        // ثابتة نقية دون رعشة
  | 'subtle_warmth'      // تموج دفء خفيف
  | 'emotional_tremor';  // رعشة تأثر عاطفي متهدج

export interface EmotionalArcConfig {
  enabled: boolean;
  startEmotionId?: string;
  startEmotion?: string;
  transitionPoint?: 'early' | 'middle' | 'climax';
  climaxPoint?: 'final_sentence' | 'final_third' | 'mid_script';
  targetEmotionId?: string;
  targetEmotion?: string;
}

export interface BatchScriptItem {
  id: string;
  text: string;
  voiceId?: string;
  dialect?: EgyptianDialect;
  deliveryStyle?: DramaticDeliveryStyle;
  emotionId?: string;
  intensity?: EmotionIntensity;
  emotionIntensity?: EmotionIntensity;
  status: 'idle' | 'generating' | 'completed' | 'error';
  audioBase64?: string;
  audioUrl?: string;
  durationSec?: number;
  errorMessage?: string;
  error?: string;
  filename?: string;
  speech?: GeneratedSpeech;
}

export type VoiceCategory = 'all' | 'children' | 'adults' | 'alex' | 'nabd' | 'custom';

export interface VoiceOption {
  id: string;
  name: string;
  arabicName: string;
  baseVoice: VoiceName;
  gender: Gender;
  category: 'adult' | 'child' | 'custom';
  ageGroup?: 'child_10' | 'child_12' | 'adult' | 'custom' | string;
  exactAge?: number;
  ageLabel?: string;
  arabicAgeLabel?: string;
  character: string;
  arabicCharacter: string;
  color: string;
  avatarBg: string;
  voiceInstruction?: string;
  isCustom?: boolean;
  isModified?: boolean;
  isEnergyOrb?: boolean;
  createdAt?: number;
  customization?: VoiceCustomization;
}

export interface CustomVoicePreset {
  id: string;
  name: string;
  arabicName: string;
  baseVoice: VoiceName;
  gender: Gender;
  exactAge?: number;
  ageLabel: string;
  arabicAgeLabel: string;
  character: string;
  arabicCharacter: string;
  voiceInstruction: string;
  customization: VoiceCustomization;
  createdAt: number;
}

export interface StyleOption {
  id: string;
  label: string;
  arabicLabel: string;
  promptPrefix: string;
  description: string;
  iconName: string;
}

export type EmotionIntensity = 'low' | 'medium' | 'high' | 'extreme';

export interface EmotionLevel {
  level: EmotionIntensity;
  label: string;
  arabicLabel: string;
  promptPrefix: string;
  description: string;
  arabicDescription: string;
}

export interface EmotionCategory {
  id: string;
  label: string;
  arabicLabel: string;
  arabicShortLabel: string;
  iconName: string;
  description: string;
  arabicDescription: string;
  isCasual?: boolean;
  levels: {
    low: EmotionLevel;
    medium: EmotionLevel;
    high: EmotionLevel;
    extreme?: EmotionLevel;
  };
}

export interface GeneratedSpeech {
  id: string;
  text: string;
  voice: VoiceName;
  voiceDisplayName?: string;
  styleLabel?: string;
  dialectLabel?: string;
  reverbEnvironment?: ReverbEnvironment;
  reverbLevel?: number;
  audioBase64: string;
  audioUrl: string;
  durationSec: number;
  createdAt: number;
  deliveryStyle?: DramaticDeliveryStyle;
  deliveryStyleLabel?: string;
  emotionId?: string;
  emotionLabel?: string;
  intensity?: EmotionIntensity;
  intensityLabel?: string;
  pitchLabel?: string;
  paceLabel?: string;
}

// In-line Dramatic Tag
export interface DramaticTag {
  id: string;
  tag: string;
  label: string;
  arabicLabel: string;
  iconName: string;
  description: string;
  category: 'emotion' | 'gesture' | 'sound' | 'pacing' | 'pause' | 'breathing';
}

// Dialogue Line for Multi-Character Script Mode
export interface DialogueLine {
  id: string;
  speakerVoiceId: string; // VoiceOption.id or CustomVoicePreset.id
  speakerName: string;
  speakerArabicName: string;
  baseVoice: VoiceName;
  gender: Gender;
  emotionId: string;
  emotionIntensity: EmotionIntensity;
  text: string;
  audioBase64?: string;
  audioUrl?: string;
  durationSec?: number;
  status: 'idle' | 'generating' | 'completed' | 'error';
  errorMessage?: string;
}

export interface DialoguePreset {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  lines: {
    speakerRole: 'speaker1' | 'speaker2';
    text: string;
    emotionId: string;
    emotionIntensity: EmotionIntensity;
  }[];
}

// A/B Performance Comparison Slot
export interface ComparisonSlot {
  text: string;
  voiceId: string;
  baseVoice: VoiceName;
  gender: Gender;
  dialect: EgyptianDialect;
  emotionId: string;
  emotionIntensity: EmotionIntensity;
  audioBase64?: string;
  audioUrl?: string;
  durationSec?: number;
  isGenerating?: boolean;
  errorMessage?: string;
}

// Colloquial Polisher Result
export interface PolishResult {
  originalText: string;
  polishedText: string;
  explanation: string;
  changes: {
    original: string;
    suggested: string;
    reason: string;
  }[];
  alternatives: string[];
}

// Section Titles Customization
export interface SectionTitleConfig {
  title: string;
  subtitle: string;
}

export interface StudioSectionTitles {
  script: SectionTitleConfig;
  voiceSelector: SectionTitleConfig;
  performanceStyle: SectionTitleConfig;
  reverbEnvironment: SectionTitleConfig;
  readyAndPillars: SectionTitleConfig;
  audioPlayer: SectionTitleConfig;
}

// AI Vocal Analysis Result from Gemini Multimodal Audio
export interface VocalMetricDetail {
  score: number;
  status: 'excellent' | 'good' | 'moderate' | 'needs_tuning';
  arabicLabel: string;
  feedback: string;
}

export interface VocalAnatomyAnalysis {
  larynxPosition: string;
  cordTension: string;
  resonanceChamber: string;
}

export interface VocalAnalysisResult {
  overallScore: number;
  overallVerdict: string;
  emotionalConsistency: VocalMetricDetail;
  pitchStability: VocalMetricDetail;
  clarityAndDiction: VocalMetricDetail;
  vocalAnatomy: VocalAnatomyAnalysis;
  directorNotes: string[];
  analyzedAt?: number;
  isFallback?: boolean;
}
