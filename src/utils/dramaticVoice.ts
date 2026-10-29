export const VALID_GEMINI_VOICES: VoiceName[] = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];

export const VOICE_FALLBACK_MAP: Record<string, VoiceName> = {
  Calliope: 'Kore',
  Aoede: 'Zephyr',
  Leda: 'Kore',
  Orus: 'Fenrir',
  Enceladus: 'Charon',
};

export function sanitizeGeminiVoice(voice: any): VoiceName {
  if (typeof voice === 'string' && VALID_GEMINI_VOICES.includes(voice as VoiceName)) {
    return voice as VoiceName;
  }
  if (typeof voice === 'string' && VOICE_FALLBACK_MAP[voice]) {
    return VOICE_FALLBACK_MAP[voice];
  }
  return 'Kore';
}

import {
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
  VoiceName,
  Gender,
  VoiceCustomization,
  ReverbEnvironment,
  DramaticDeliveryStyle,
  StagingDistance,
  VocalCordsTension,
  VocalCordTremor,
  EmotionalArcConfig,
  EmotionIntensity,
  EmotionCategory,
  EmotionLevel,
  VoiceOption,
} from '../types';

// ==========================================
// 1. DIALECTS & SUB-STYLES
// ==========================================
export interface DialectInfo {
  id: EgyptianDialect;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  promptDirective: string;
}

export const DIALECTS: Record<EgyptianDialect, DialectInfo> = {
  cairo: {
    id: 'cairo',
    name: 'Cairene Egyptian',
    arabicName: 'اللهجة المصرية القاهرية',
    description:
      'Crisp urban Cairene phonology, rhythmic city cadence, natural unforced Egyptian expressions',
    arabicDescription:
      'نبرة قاهرية أصيلة، إيقاع مدني رشيق ومخارج حروف واضحة وعفوية',
    promptDirective:
      'Perform in authentic Cairene Egyptian dialect (لهجة مصرية قاهرية أصيلة). Use natural urban Egyptian pronunciation, fluent rhythmic city cadence, authentic everyday Egyptian colloquial intonation, and zero classical MSA mannerisms',
  },
  alex: {
    id: 'alex',
    name: 'Alexandrian Egyptian',
    arabicName: 'اللهجة المصرية الإسكندرانية',
    description:
      'Distinct coastal Mediterranean Alexandrian lilt, melodic vowel elongation, warm coastal phrasing',
    arabicDescription:
      'نغمة بحرية ساحلية مميزة، مد لطيف في أواخر الكلمات والنغمات، ونبرة إسكندرانية محببة أصيلة',
    promptDirective:
      'Perform in authentic Alexandrian Egyptian dialect (لهجة مصرية إسكندرانية أصيلة). Embody the warm coastal Mediterranean Alexandrian lilt and cadence, subtle melodic vowel stretching at phrase cadences, distinctive friendly coastal inflection, and true Alexandrian vernacular mannerisms',
  },
};

export interface DialectSubStyleInfo {
  id: DialectSubStyle;
  dialect: EgyptianDialect;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const DIALECT_SUB_STYLES: DialectSubStyleInfo[] = [
  {
    id: 'alex_classic',
    dialect: 'alex',
    label: 'Classic Alexandrian',
    arabicLabel: 'السكندري الأصيل',
    description: 'Classic Alexandrian vocabulary, balanced Mediterranean lilt',
    arabicDescription: 'لهجة إسكندرانية كلاسيكية متوازنة بمفردات عروس البحر المميزة (أيوة، كورة، استني)',
    directive:
      'Dialect nuance: classic Alexandrian Mediterranean lilt, authentic vowel prolongation and friendly coastal inflection',
  },
  {
    id: 'alex_coastal',
    dialect: 'alex',
    label: 'Coastal Alexandrian (Sawhili)',
    arabicLabel: 'السواحيلي السكندري (بحري والأنفوشي والساحل)',
    description: 'Deep maritime coastal cadence, elongated endings, authentic Bahari slang',
    arabicDescription: 'نبرة بحرية أصيلة من حي بحري والأنفوشي بمدّات كلام ساحلية ومصطلحات شاطئية عريقة',
    directive:
      'Dialect nuance: authentic Bahari maritime Alexandrian cadence, pronounced coastal vowel stretching and salty seaside warmth',
  },
  {
    id: 'alex_youth',
    dialect: 'alex',
    label: 'Youthful Alexandrian',
    arabicLabel: 'السكندري الشبابي (إيقاع عفوي سريع)',
    description: 'Quick-witted coastal rhythm, lively modern seaside youth slang',
    arabicDescription: 'إيقاع إسكندراني شبابي سريع ومرح، خفيف الظل وعفوي مفعم بالطاقة والحيوية',
    directive:
      'Dialect nuance: dynamic youthful Alexandrian delivery, energetic quick-witted coastal rhythm and playful street slang',
  },
  {
    id: 'suez_canal',
    dialect: 'alex',
    label: 'Suez Regional Dialect',
    arabicLabel: 'السويسي الأصيل (مدن القناة)',
    description: 'Brave, spirited seaside Canal cadence, proud Suez dialect',
    arabicDescription: 'نبرة سويسية أصيلة من مدن القناة الباسلة بإيقاع ساحلي حار ولهجة فدائية مميزة',
    directive:
      'Dialect nuance: authentic Suez Canal Egyptian dialect, spirited proud seaside cadence, warm canal colloquial phrasing and maritime vigor',
  },
  {
    id: 'portsaid_canal',
    dialect: 'alex',
    label: 'Port Said Coastal Dialect',
    arabicLabel: 'البورسعيدي الأصيل (البحر والسمسمية)',
    description: 'Lively, melodic Mediterranean flair with characteristic Port Said intonation',
    arabicDescription: 'لهجة بورسعيدية أصيلة خفيفة الدم بنغمة السمسمية وإيقاع بحري منطلق',
    directive:
      'Dialect nuance: authentic Port Said coastal Egyptian dialect, musical Canal intonation, lively Mediterranean warmth and cheerful harbor cadence',
  },
  {
    id: 'cairo_urban',
    dialect: 'cairo',
    label: 'Urban Civilized Cairene',
    arabicLabel: 'القاهري المدني الهادئ (المعادي ومصر الجديدة)',
    description: 'Polite, modern city cadence, smooth everyday conversational tone',
    arabicDescription: 'نبرة حضرية مدنية راقية وهادئة مناسبة للحوارات اليومية العصرية',
    directive:
      'Dialect nuance: refined urban Cairene phrasing, clean colloquial cadence and polished natural city delivery',
  },
  {
    id: 'cairo_folk',
    dialect: 'cairo',
    label: 'Authentic Folk Cairene',
    arabicLabel: 'القاهري الشعبي العفوي (شبرا والحسين)',
    description: 'Warm, vivid neighborhood street cadence with punchy warmth',
    arabicDescription: 'لهجة شعبية حارة وعفوية ذات حيوية وخفة دم وروح حارة أصيلة',
    directive:
      'Dialect nuance: authentic lively folk Cairene cadence, vibrant street colloquial warmth and spontaneous neighborhood inflection',
  },
  {
    id: 'saidi_upper',
    dialect: 'cairo',
    label: 'Upper Egyptian Saidi',
    arabicLabel: 'الصعيدي الأصيل (صعيد مصر وجنوب الوادي)',
    description: 'Dignified, deep Upper Egyptian cadence with proud Southern phonetics',
    arabicDescription: 'نبرة صعيدية أصيلة ذات هيبة وأصالة وروح كرم وشهامة من جنوب مصر',
    directive:
      'Dialect nuance: authentic Upper Egyptian Saidi dialect, deep proud southern cadence, authentic phonetic dignity and regional expressions',
  },
];

// ==========================================
// 2. BASE GEMINI VOICES (PHYSICAL VOCAL TRACT DNA)
// ==========================================
export interface BaseVoiceInfo {
  name: VoiceName;
  gender: Gender;
  arabicLabel: string;
  characterDescription: string;
  arabicCharacterDescription: string;
  archetype: string;
  avatarBg: string;
  recommendedAgeRange: [number, number];
}

export const BASE_GEMINI_VOICES: BaseVoiceInfo[] = [
  // ==========================================
  // 5 FEMALE VOCAL TRACTS (5 حناجر نسائية)
  // ==========================================
  {
    name: 'Zephyr',
    gender: 'female',
    arabicLabel: 'زفير (Zephyr)',
    characterDescription:
      'Youthful, bright, gentle and sweet; ideal for girls, young women, and innocent characters',
    arabicCharacterDescription:
      'أنثوي عذب ومشرق، حنجرة رقيقة نضرة مفعمة بالبراءة والحرارة والصفاء التأملي',
    archetype: 'شابة / طفلة عذبة / صفاء تأملي',
    avatarBg: 'bg-[#CB997E]/25 text-[#B07D62] border-[#CB997E]/40',
    recommendedAgeRange: [4, 28],
  },
  {
    name: 'Kore',
    gender: 'female',
    arabicLabel: 'كوري (Kore)',
    characterDescription:
      'Warm, balanced, emotionally grounded and articulate; natural conversational presence or mature drama',
    arabicCharacterDescription:
      'أنثوي دافئ ومتزن، تمثيل درامي رصين وإلقاء سلس للحوارات الواقعية والشخصيات الناضجة والوقورة',
    archetype: 'شابة / سيدة ناضجة ووقورة',
    avatarBg: 'bg-[#6B705C]/20 text-[#6B705C] border-[#6B705C]/35',
    recommendedAgeRange: [18, 85],
  },
  {
    name: 'Calliope',
    gender: 'female',
    arabicLabel: 'كاليوبي (Calliope)',
    characterDescription:
      'Bold, eloquent, and passionately articulate theatrical female projection; commanding diaphragmatic presence',
    arabicCharacterDescription:
      'أنثوي فصيح وحماسي، بطلة درامية وخطيبة مفوهة، إسقاط حنجري قوي وواثق للمناظرات والبطولة',
    archetype: 'بطلة درامية / خطيبة مفوهة',
    avatarBg: 'bg-[#C86446]/20 text-[#B5573B] border-[#C86446]/40',
    recommendedAgeRange: [22, 60],
  },
  {
    name: 'Aoede',
    gender: 'female',
    arabicLabel: 'أويدي (Aoede)',
    characterDescription:
      'Melodious, lyrical, enchanting and emotionally expressive female voice with rich musical cadence',
    arabicCharacterDescription:
      'أنثوي لحني شجي، نبرة حكواتية وجدانية عذبة تفيض بالحنين والموسيقى والجمال الأدبي',
    archetype: 'حكواتية وجدانية / إلقاء شعري',
    avatarBg: 'bg-[#0077B6]/20 text-[#0077B6] border-[#0077B6]/40',
    recommendedAgeRange: [16, 50],
  },
  {
    name: 'Leda',
    gender: 'female',
    arabicLabel: 'ليدا (Leda)',
    characterDescription:
      'Solemn, maternal, wise, and deeply reassuring mature female presence with noble serenity',
    arabicCharacterDescription:
      'أنثوي وقور وحكيم، أمومة مطمئنة، هيبة الجدة الحنونة، وسكينة روحية تبعث على الأمان',
    archetype: 'أمومة مطمئنة / جدة حكيمة ووقورة',
    avatarBg: 'bg-[#7F5539]/25 text-[#7F5539] border-[#7F5539]/40',
    recommendedAgeRange: [40, 85],
  },

  // ==========================================
  // 5 MALE VOCAL TRACTS (5 حناجر رجالية)
  // ==========================================
  {
    name: 'Puck',
    gender: 'male',
    arabicLabel: 'باك (Puck)',
    characterDescription:
      'Spirited, youthful, agile and animated; great for boys and energetic young characters',
    arabicCharacterDescription:
      'ذكوري فتياني مرح، حركي، خفيف الظل ومفعم بالنشاط والبراءة',
    archetype: 'فتى / طفل نشيط ومشاغب',
    avatarBg: 'bg-[#F4A261]/25 text-[#E76F51] border-[#F4A261]/45',
    recommendedAgeRange: [4, 25],
  },
  {
    name: 'Fenrir',
    gender: 'male',
    arabicLabel: 'فينرير (Fenrir)',
    characterDescription:
      'Firm, assertive, confident and decisively articulate masculine voice; heroic and energetic',
    arabicCharacterDescription:
      'ذكوري حاسم وواثق، نبرة رجولية محددة ومخارج واضحة وبطولية',
    archetype: 'رجل واثق / بطل درامي جهوري',
    avatarBg: 'bg-[#43413E]/20 text-[#43413E] border-[#43413E]/35',
    recommendedAgeRange: [20, 55],
  },
  {
    name: 'Charon',
    gender: 'male',
    arabicLabel: 'شارون (Charon)',
    characterDescription:
      'Deep, resonant, baritone and solemnly authoritative; grand theatrical weight, gritty or elder',
    arabicCharacterDescription:
      'ذكوري عميق وجهوري، وقار مسرحي، صوت كهل، مكافح أجش أو شيخ حكيم ورصين',
    archetype: 'عميق وجهوري / باريتون كهل ومسن',
    avatarBg: 'bg-[#283618]/25 text-[#283618] border-[#283618]/40',
    recommendedAgeRange: [35, 85],
  },
  {
    name: 'Orus',
    gender: 'male',
    arabicLabel: 'أوروس (Orus)',
    characterDescription:
      'Firm, grounded, straightforward baritone with resolute cadence and crisp masculine articulation',
    arabicCharacterDescription:
      'ذكوري متزن وحازم، باريتون عملي وعقلاني، مخارج حروف صريحة ومقنعة للمحققين والمهنيين',
    archetype: 'باريتون متزن / محقق عقلاني',
    avatarBg: 'bg-[#5B604C]/25 text-[#5B604C] border-[#5B604C]/40',
    recommendedAgeRange: [25, 60],
  },
  {
    name: 'Enceladus',
    gender: 'male',
    arabicLabel: 'إنسيلادوس (Enceladus)',
    characterDescription:
      'Subterranean bass, rugged gravelly resonance, weathered diaphragmatic power and deep presence',
    arabicCharacterDescription:
      'ذكوري غليظ وباس عميق جداً، بحّة خشنة معروكة بالحياة، حضور زلزالي للمكافحين والأساطير',
    archetype: 'باس عميق وأجش / أسطوري ومكافح',
    avatarBg: 'bg-[#1D2D44]/30 text-[#0D1B2A] border-[#1D2D44]/45',
    recommendedAgeRange: [35, 85],
  },
];


// ==========================================
// 3. SMART AUTO-CASTING FUNCTION
// Automatically picks the ideal Gemini vocal tract based on Gender & Exact Age
// ==========================================
export function smartAutoCastVoice(
  gender: Gender,
  ageYears: number,
  pitch?: PitchLevel,
  timbre?: VocalTimbre
): VoiceName {
  if (gender === 'female') {
    if (ageYears <= 18) return 'Zephyr';
    if (ageYears <= 35) {
      if (timbre === 'bright' || pitch === 'high' || pitch === 'very_high') return 'Zephyr';
      return 'Kore';
    }
    return 'Kore';
  } else {
    if (ageYears <= 16) return 'Puck';
    if (ageYears <= 45) {
      if (pitch === 'very_deep') return 'Charon';
      return 'Fenrir';
    }
    return 'Charon';
  }
}

// ==========================================
// 4. AGE STAGES & EXACT NUMERICAL CALCULATION
// ==========================================
export interface AgeStageInfo {
  id: AgeCategory;
  minAge: number;
  maxAge: number;
  defaultAge: number;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const AGE_STAGES: AgeStageInfo[] = [
  {
    id: 'child_5_8',
    minAge: 4,
    maxAge: 8,
    defaultAge: 7,
    label: 'Young Child (5 - 8 years)',
    arabicLabel: 'طفل صغير (5 - 8 سنوات)',
    description: 'Sweet, innocent, lively young child voice with tender playful cadence',
    arabicDescription: 'صوت طفل أو طفلة صغيرة (5 - 8 سنوات): عذب، بريء، عفوي ومفعم بالبهجة الطفولية',
    directive:
      'Age persona: 5 to 8-year-old young child with sweet, adorable, innocent vocal tone, high pitch agility, and cheerful spontaneous childish cadence',
  },
  {
    id: 'child_9_12',
    minAge: 9,
    maxAge: 12,
    defaultAge: 10,
    label: 'School Child & Pre-teen (9 - 12 years)',
    arabicLabel: 'طفل مدرسي ويافع (9 - 12 سنة)',
    description: 'Bright, articulate, confident school child / pre-teen',
    arabicDescription: 'صوت طفل أو طفلة في سن المدرسة (9 - 12 سنة): واثق، ذكي، نضر ومشرق بالحيوية',
    directive:
      'Age persona: 9 to 12-year-old school child / pre-teen with articulate, natural youthful cadence, energetic confidence, and clear bright clarity',
  },
  {
    id: 'teen_12_17',
    minAge: 13,
    maxAge: 17,
    defaultAge: 14,
    label: 'Adolescent & Teenager (13 - 17 years)',
    arabicLabel: 'يافع ومراهق (13 - 17 سنة)',
    description: 'Adolescent middle-to-high school youth, expressive and spirited',
    arabicDescription: 'صوت يافع أو فتاة مراهقة في الإعدادي/الثانوي، مفعم بالحماس والتعبير',
    directive:
      'Age persona: 13 to 17-year-old adolescent teenager with dynamic youthful attitude, expressive modern cadence and relatable vitality',
  },
  {
    id: 'youth_18_35',
    minAge: 18,
    maxAge: 35,
    defaultAge: 25,
    label: 'Young Adult (18 - 35 years)',
    arabicLabel: 'شاب / شابة (18 - 35 سنة)',
    description: 'Vibrant, clear, mature young adult presence',
    arabicDescription: 'صوت شبابي نضر، واثق الحضور وذو مخارج واضحة ومقنعة',
    directive:
      'Age persona: 18 to 35-year-old vibrant young adult, confident, organic, articulate and dynamically expressive',
  },
  {
    id: 'mature_36_55',
    minAge: 36,
    maxAge: 55,
    defaultAge: 45,
    label: 'Mature Adult (36 - 55 years)',
    arabicLabel: 'ناضج وكهل (36 - 55 سنة)',
    description: 'Experienced, grounded, authoritative mature presence',
    arabicDescription: 'صوت ناضج متزن يجمع بين الوقار، الخبرة الحياتية وقوة الحضور',
    directive:
      'Age persona: 36 to 55-year-old mature grounded adult, experienced, composed, authoritative and realistically centered',
  },
  {
    id: 'elder_56_85',
    minAge: 56,
    maxAge: 85,
    defaultAge: 68,
    label: 'Elder & Senior (56 - 85 years)',
    arabicLabel: 'شيخ ومسن (56 - 85 سنة)',
    description: 'Seasoned, warm elder presence with weathered wisdom and dignity',
    arabicDescription: 'صوت مسن دافئ ومحنك يحمل هيبة السنين وحكمة التجارب ونبرة وقورة',
    directive:
      'Age persona: 56 to 85-year-old seasoned elder with weathered wisdom, grandfatherly/grandmotherly warmth, relaxed dignified cadence and seasoned acoustic depth',
  },
];

// Helper to determine stage from exact age
export function getStageFromAge(ageYears: number): AgeStageInfo {
  if (ageYears <= 8) return AGE_STAGES[0]; // child_5_8
  if (ageYears <= 12) return AGE_STAGES[1]; // child_9_12
  if (ageYears <= 17) return AGE_STAGES[2]; // teen_12_17
  if (ageYears <= 35) return AGE_STAGES[3]; // youth_18_35
  if (ageYears <= 55) return AGE_STAGES[4]; // mature_36_55
  return AGE_STAGES[5]; // elder_56_85
}

// Backwards compatibility legacy AGE_OPTIONS list
export const AGE_OPTIONS = AGE_STAGES;

// ==========================================
// 5. PITCH & MELODY (F0 REGISTER & INTONATION)
// ==========================================
export interface PitchOptionInfo {
  id: PitchLevel;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const PITCH_OPTIONS: PitchOptionInfo[] = [
  {
    id: 'very_high',
    label: 'Very High (Childish / Shrill)',
    arabicLabel: 'حادة جداً (طفولية بريئة)',
    description: 'High-frequency child throat acoustics, youthful light vocal cords',
    arabicDescription: 'طبقة طفولية رقيقة وحادة تناسب الأطفال الصغار وبراءة الطفولة',
    directive:
      'Vocal pitch (F0 register): distinctly high-pitched, child-like light throat resonance and youthful vocal tract',
  },
  {
    id: 'high',
    label: 'High (Youthful / Fresh)',
    arabicLabel: 'عالية (نضرة ومشرقة)',
    description: 'Youthful medium-high register with bright resonance',
    arabicDescription: 'طبقة عالية نضرة تناسب الفتيات واليافعين في سن الحيوية',
    directive:
      'Vocal pitch (F0 register): bright medium-high register with youthful adolescent clarity and light agility',
  },
  {
    id: 'medium',
    label: 'Medium (Natural / Balanced)',
    arabicLabel: 'متوسطة (طبيعية متزنة)',
    description: 'Standard comfortable speaking pitch for conversational ease',
    arabicDescription: 'طبقة متوسطة متوازنة ومريحة تناسب الشباب والحديث الطبيعي العفوي',
    directive:
      'Vocal pitch (F0 register): balanced medium natural pitch register, grounded and organic',
  },
  {
    id: 'deep',
    label: 'Deep (Resonant / Grounded)',
    arabicLabel: 'منخفضة / عميقة (رصينة ووقورة)',
    description: 'Chest-dominant deep register with gravitas',
    arabicDescription: 'طبقة صوتية عميقة صادرة من الصدر ذات وقار وثقل وحضور',
    directive:
      'Vocal pitch (F0 register): deep, grounded lower register with warm chest resonance',
  },
  {
    id: 'very_deep',
    label: 'Very Deep (Baritone / Elder Bass)',
    arabicLabel: 'قرار عميق جداً (جهوري أو شيخ)',
    description: 'Resonant bass register with solemn weight',
    arabicDescription: 'طبقة قرار عميقة جداً وجهورية توحي بالسن والرهبة والخبرة',
    directive:
      'Vocal pitch (F0 register): very deep, resonant bass register with heavy acoustic weight and diaphragmatic depth',
  },
];

export interface MelodyOptionInfo {
  id: MelodyType;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const MELODY_OPTIONS: MelodyOptionInfo[] = [
  {
    id: 'melodic',
    label: 'Melodic & Musical (Lilt & Curve)',
    arabicLabel: 'لحني ومتموج (نغمات موسيقية ومدّات)',
    description: 'Expressive musical rise-and-fall, pleasant vowel curves',
    arabicDescription: 'تدرج نغمي جميل وتطريب عفوي في الكلام (ممتاز للإسكندراني والأطفال)',
    directive:
      'Intonation & Melody: melodic, lilting inflection with expressive vocal curves, natural musical rises at key emotional words and pleasant sentence contours',
  },
  {
    id: 'grounded',
    label: 'Grounded & Straight (Everyday Realism)',
    arabicLabel: 'رتيب وواقعي (حديث هادئ ومستوٍ)',
    description: 'Even, realistic cadence without unnecessary flourishes',
    arabicDescription: 'نبرة كلام متزنة ومستوية تعكس الهدوء أو الجدية أو الحزن الواقعي',
    directive:
      'Intonation & Melody: grounded, steady and realistic intonation without sing-song fluctuations, naturally level and conversational',
  },
  {
    id: 'dynamic',
    label: 'Dynamic & Spontaneous (Lively Jumps)',
    arabicLabel: 'ديناميكي متقلب (قفزات نغمية عفوية)',
    description: 'Quick pitch jumps mirroring surprise, excitement or agitation',
    arabicDescription: 'قفزات صوتية مفاجئة وسريعة تعكس شدة الدهشة أو العصبية أو خفة الظل',
    directive:
      'Intonation & Melody: highly dynamic and spontaneous pitch modulation, playful or reactive inflection leaps driven by immediate emotion',
  },
];

// ==========================================
// 6. VOCAL TIMBRE, RESONANCE & TEXTURE
// ==========================================
export interface ResonanceOptionInfo {
  id: ResonanceChamber;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const RESONANCE_OPTIONS: ResonanceOptionInfo[] = [
  {
    id: 'chest',
    label: 'Deep Chest Resonance',
    arabicLabel: 'صدري عميق (دفء وهيبة)',
    description: 'Acoustic vibration radiating from the ribcage, comforting and rich',
    arabicDescription: 'رنين دافئ وممتلئ صادر من عمق القفص الصدري يحمل وقاراً وألفة',
    directive:
      'Resonance chamber: deep chest resonance, rich lower harmonics and acoustic body',
  },
  {
    id: 'throat',
    label: 'Throat & Pharyngeal Projection',
    arabicLabel: 'حنجري رنان (مباشر ومسرحي)',
    description: 'Direct acoustic projection, clear theatrical carrying power',
    arabicDescription: 'صوت مباشر مسموع بوضوح من الحنجرة ذو قدرة نفاذ وإسقاط ممتازة',
    directive:
      'Resonance chamber: clear throat and pharyngeal resonance, direct articulate projection and acoustic presence',
  },
  {
    id: 'head',
    label: 'Light Head Voice',
    arabicLabel: 'رأسي خفيف (ناعم ورقيق)',
    description: 'Light upper-register acoustics, delicate and tender',
    arabicDescription: 'رنين رأسي خفيف وناعم يناسب الأطفال والهمسات والرقة',
    directive:
      'Resonance chamber: light head-voice resonance, soft, delicate and airy upper harmonic focus',
  },
  {
    id: 'nasal',
    label: 'Subtle Nasal Twang',
    arabicLabel: 'أنفي شعبي خفيف (عفوي وحار)',
    description: 'Authentic colloquial folk twang, punchy street conversational charm',
    arabicDescription: 'نبرة شعبية عفوية بخنة خفيفة محببة تميز الحوارات الشعبية والدردشة العفوية',
    directive:
      'Resonance chamber: subtle authentic Egyptian colloquial twang, colorful folk resonance and authentic street character charm',
  },
];

export interface TextureOptionInfo {
  id: VocalTexture;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const TEXTURE_OPTIONS: TextureOptionInfo[] = [
  {
    id: 'pure',
    label: 'Crystal Pure & Crisp',
    arabicLabel: 'صافٍ بلوري (نقي كالجرس)',
    description: 'Clean acoustic clarity, sharp pristine articulation',
    arabicDescription: 'مخارج حروف بلورية فائقة النقاء والصفاء بدون أي خشونة أو شوائب',
    directive:
      'Vocal texture: pristine, crystal-pure vocal cord vibration with crisp clarity and razor-sharp diction',
  },
  {
    id: 'breathy',
    label: 'Warm & Breathy',
    arabicLabel: 'مشوب بأنفاس (حميمي ودافئ)',
    description: 'Gentle air escape lending warmth, vulnerability or intimacy',
    arabicDescription: 'صوت حميمي مشوب بزفير هواء خفيف يبعث على الرقة أو التأثر',
    directive:
      'Vocal texture: gently breathy and intimate, soft exhalation woven into speech with close-mic emotional proximity',
  },
  {
    id: 'raspy',
    label: 'Raspy & Weathered',
    arabicLabel: 'أجش وخشن (بحّة كفاح وقوة)',
    description: 'Natural vocal fry, rough texture showing strength, struggle or fatigue',
    arabicDescription: 'بحة صوتية خشنة تدل على قوة الشخصية، كفاح، تدخين، أو تعب وإرهاق',
    directive:
      'Vocal texture: authentically raspy, rugged vocal grain with natural vocal fry and weathered strength',
  },
  {
    id: 'constricted',
    label: 'Constricted & Tight',
    arabicLabel: 'مخنوق ومشدود (كتمان بكاء أو غيظ)',
    description: 'Tight vocal cords holding back tears, choked emotion or suppressed rage',
    arabicDescription: 'صوت يخرج بصعوبة وكأن الحبال الصوتية مشدودة لكبت الدموع أو الغيظ',
    directive:
      'Vocal texture: emotionally constricted and choked timbre, as if speaking through a lump in the throat and fighting back intense emotion',
  },
];

// ==========================================
// 6.5. DEDICATED VOCAL CORDS DYNAMICS & STAGING PROXIMITY
// تحكم متقدم في الأحبال الصوتية والانغلاق المزماري والمسافة الصوتية
// ==========================================
export interface VocalCordsTensionOptionInfo {
  id: VocalCordsTension;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const VOCAL_CORDS_TENSION_OPTIONS: VocalCordsTensionOptionInfo[] = [
  {
    id: 'taut_firm',
    label: 'Taut & Firm Glottal Closure',
    arabicLabel: 'مشدودة بانغلاق مزماري محكم',
    description: 'Crisp glottal closure, minimal subglottic air leak, authoritative and resolute',
    arabicDescription: 'انغلاق مزماري تام وقوي يعطي نبرة حازمة واثقة خالية من التسريب الهوائي',
    directive: 'Vocal cords dynamic: taut vocal fold tension with firm glottal closure and decisive acoustic attack',
  },
  {
    id: 'relaxed_breathy',
    label: 'Relaxed & Breathy Closure',
    arabicLabel: 'مرتخية مع تسريب هوائي همسي',
    description: 'Subtle incomplete glottal closure allowing warm air leak for intimate tenderness',
    arabicDescription: 'ارتخاء نسبي في الأحبال الصوتية يسمح بتسريب زفير دافئ يوحي بالهمس والضعف والرقة',
    directive: 'Vocal cords dynamic: relaxed vocal folds with subtle incomplete glottal closure and warm breathy air wash',
  },
  {
    id: 'pressed_creaky',
    label: 'Pressed Glottal Fry',
    arabicLabel: 'مضغوطة بحشرجة مزمارية خشنة',
    description: 'Compressed medial compression creating low-frequency vocal fry and intense gravel',
    arabicDescription: 'ضغط مزماري مشدود يعطي حشرجة صوتية خشنة توحي بالغضب أو الإنهاك أو النبرة البوليسية',
    directive: 'Vocal cords dynamic: pressed phonation with localized vocal fry and gritty glottal friction',
  },
  {
    id: 'elastic_melodic',
    label: 'Flexible & Elastic Cords',
    arabicLabel: 'مرنة ومطاطية طروبة',
    description: 'High vocal fold elasticity allowing swift pitch transitions and melodic inflections',
    arabicDescription: 'مرونة فائقة في حواف الأحبال الصوتية تمنح صوتاً طروباً سريع التلون بين النغمات',
    directive: 'Vocal cords dynamic: highly flexible elastic vocal folds enabling rapid pitch modulation and melodic nuance',
  },
];

export interface VocalCordTremorOptionInfo {
  id: VocalCordTremor;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const VOCAL_CORD_TREMOR_OPTIONS: VocalCordTremorOptionInfo[] = [
  {
    id: 'steady_pure',
    label: 'Steady & Pure (Zero Tremor)',
    arabicLabel: 'ثابتة نقية بدون رعشة',
    description: 'Zero pitch micro-fluctuation, unwavering composure and stability',
    arabicDescription: 'استقرار تام في التردد الصوتي بدون أي ارتجاف يعكس الثبات ورباطة الجأش',
    directive: 'Vocal cord tremor: unwavering steady vocal pitch with zero involuntary tremor or vibration',
  },
  {
    id: 'subtle_warmth',
    label: 'Subtle Warm Vibrato',
    arabicLabel: 'تموج دفء خفيف',
    description: 'Gentle, natural acoustic vibrato adding human warmth and lyrical richness',
    arabicDescription: 'تموج صوتي خفيف في نهايات الجمل يضفي دفئاً إنسانياً وأناقة وجدانية',
    directive: 'Vocal cord tremor: gentle, natural acoustic micro-vibrato on sentence contours adding organic warmth',
  },
  {
    id: 'emotional_tremor',
    label: 'Emotional Quiver & Tremor',
    arabicLabel: 'رعشة تأثر عاطفي متهدج',
    description: 'Vulnerable quiver in vocal folds indicating suppressed tears, shock or deep awe',
    arabicDescription: 'ارتعاش متقطع ومتهدج في الأحبال الصوتية يعكس التأثر الشديد أو حبس البكاء أو الصدمة',
    directive: 'Vocal cord tremor: noticeable emotional quiver and trembling pitch micro-instability reflecting deep sorrow, shock or choked emotional duress',
  },
];

export interface StagingDistanceOptionInfo {
  id: StagingDistance;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const STAGING_OPTIONS: StagingDistanceOptionInfo[] = [
  {
    id: 'intimate_close_mic',
    label: 'Intimate Close-Mic (5cm)',
    arabicLabel: 'همس وميكروفون مقرب جداً (5 سم)',
    description: 'Near-ear cinematic proximity, intimate bass boost and breath nuances',
    arabicDescription: 'تموضع صوتي سينمائي مقرب جداً من الأذن مع تأثير القرب (Proximity Effect) وأنفاس حميمية',
    directive: 'Acoustic Staging Proximity: intimate close-mic positioning (5cm distance) with warm proximity effect and near-ear cinematic presence',
  },
  {
    id: 'standard_studio',
    label: 'Standard Studio (30cm)',
    arabicLabel: 'تسجيل استوديو قياسي متزن (30 سم)',
    description: 'Neutral, balanced studio microphone distance with clean fidelity',
    arabicDescription: 'مسافة استوديو نموذجية ومتوازنة تضمن وضوحاً كاملاً ونقاءً طبيعياً',
    directive: 'Acoustic Staging Proximity: balanced standard studio distance (30cm) with pristine transparent acoustic staging',
  },
  {
    id: 'projected_stage',
    label: 'Projected Theatrical Stage (2m)',
    arabicLabel: 'إسقاط صوتي مسرحي بعيد (2 متر)',
    description: 'Full theatrical vocal projection designed to carry across a large auditorium',
    arabicDescription: 'إسقاط صوتي جهوري ممتلئ كالممثل على خشبة المسرح يملأ القاعة بحضور نفاذ',
    directive: 'Acoustic Staging Proximity: projected theatrical stage acoustic delivery with powerful diaphragmatic carry and room-filling presence',
  },
];

export const TIMBRE_OPTIONS = [
  {
    id: 'warm' as VocalTimbre,
    label: 'Warm & Cozy',
    arabicLabel: 'دافئ (مريح وحميمي)',
    description: 'Rich harmonic chest warmth, soothing presence',
    arabicDescription: 'صوت دافئ ومريح للأذن ذو رنين صدري محبب ومشاعر إنسانية قريبة',
    directive:
      'Vocal Timbre: warm, rounded and comforting vocal timbre with rich chest resonance and approachable human warmth',
  },
  {
    id: 'resonant' as VocalTimbre,
    label: 'Powerful & Resonant',
    arabicLabel: 'قوي وجهوري (حضور مسرحي طاغٍ)',
    description: 'Diaphragmatic fullness, theatrical projection',
    arabicDescription: 'صوت جهوري ممتلئ ذو حضور قوي ونفاذ مسرحي يملأ المكان',
    directive:
      'Vocal Timbre: powerful, commanding and resonant diaphragmatic projection, robust theatrical presence with strong acoustic body',
  },
  {
    id: 'muffled' as VocalTimbre,
    label: 'Muffled & Suppressed',
    arabicLabel: 'مكتوم (مقموع بالهم أو الألم)',
    description: 'Throat-constricted, suppressed emotion holding back tears',
    arabicDescription: 'صوت مكتوم ومخنوق وكأنه يخرج بصعوبة تحت وطأة الألم أو الكتمان',
    directive:
      'Vocal Timbre: muffled, tight-throated, constricted timbre as if fighting back tears, emotionally repressed and speaking under heavy duress',
  },
  {
    id: 'whispered' as VocalTimbre,
    label: 'Whispered & Husky Soft',
    arabicLabel: 'خافت وهامس (أسرار ورقة)',
    description: 'Intimate breathy close-mic delivery',
    arabicDescription: 'صوت خافت مشوب بهمس ونعومة قريبة من الأذن توحي بالسرية أو الرقة البالغة',
    directive:
      'Vocal Timbre: intimate, soft-spoken, breathy and hushed vocal texture with close-up emotional subtlety',
  },
  {
    id: 'raspy' as VocalTimbre,
    label: 'Raspy & Gravelly',
    arabicLabel: 'أجش وخشن (بحّة خشنة وشخصية صلبة)',
    description: 'Textured vocal fry, rough weathered character',
    arabicDescription: 'صوت أجش يحمل بحّة خشنة وخشونة تدل على قسوة أو شقاء أو كفاح',
    directive:
      'Vocal Timbre: raspy, rugged and gravelly vocal texture with natural vocal grain, weathered and authentically unpolished character',
  },
  {
    id: 'bright' as VocalTimbre,
    label: 'Bright & Crystal-Clear',
    arabicLabel: 'رنان ونقي (مخارج بلورية كالجرس)',
    description: 'Crisp bell-like projection and acoustic clarity',
    arabicDescription: 'صوت رنان صافٍ كالجرس ذو مخارج حروف فائقة النقاء والوضوح',
    directive:
      'Vocal Timbre: bright, crystal-clear, bell-like vocal timbre with pristine acoustic clarity and razor-sharp diction',
  },
];

// ==========================================
// 7. PACE & BREATHING PATTERNS
// ==========================================
export interface PaceOptionInfo {
  id: PaceLevel;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const PACE_OPTIONS: PaceOptionInfo[] = [
  {
    id: 'very_slow',
    label: 'Very Slow & Deliberate',
    arabicLabel: 'بطيء جداً ومتمهل (تفكير عميق / حزن / وقار)',
    description: 'Deep pauses, reflecting weariness, sorrow, or profound contemplation',
    arabicDescription: 'تأنٍ شديد في نطق الكلمات يعبر عن حزن أو تعب أو تفكير عميق ومهيب',
    directive:
      'Pace & Speed: very slow, deliberate and contemplative delivery, with thoughtful pauses and measured articulation reflecting deep sorrow, exhaustion or gravity',
  },
  {
    id: 'slow',
    label: 'Slow & Composed',
    arabicLabel: 'هادئ ومتمهل (استرخاء وحنان)',
    description: 'Gentle, unhurried, composed delivery',
    arabicDescription: 'إلقاء هادئ ومريح دون استعجال يبعث على الطمأنينة',
    directive:
      'Pace & Speed: relaxed, gentle and steady pace, unhurried with natural breathing spaces',
  },
  {
    id: 'balanced',
    label: 'Balanced & Conversational',
    arabicLabel: 'متزن وتلقائي (حوار تمثيلي واقعي)',
    description: 'Natural conversational cadence',
    arabicDescription: 'سرعة محايدة وطبيعية تحاكي الحوار اليومي والواقعي',
    directive:
      'Pace & Speed: natural conversational pace, rhythmic and realistic theatrical dialogue speed',
  },
  {
    id: 'fast',
    label: 'Brisk & Energetic',
    arabicLabel: 'سريع ونشيط (حماس واندفاع وحيوية)',
    description: 'Quick-witted, eager and enthusiastic speed',
    arabicDescription: 'سرعة نشيطة ومتقدة تعكس الحماس والاندفاع وسرعة البديهة',
    directive:
      'Pace & Speed: brisk, lively, energetic and spirited speed, delivered with spirited eagerness',
  },
  {
    id: 'urgent',
    label: 'Rapid & Agitated',
    arabicLabel: 'متسارع ومضطرب (توتر / خوف / انفعال متدفق)',
    description: 'Hurried, breathless cadence driven by panic or tension',
    arabicDescription: 'إيقاع متسارع يلهث من التوتر أو الخوف أو فوران الانفعال',
    directive:
      'Pace & Speed: rapid, breathlessly urgent and agitated pacing, hurried delivery reflecting tense distress, panic or bursting emotional excitement',
  },
  {
    id: 'ultra_fast',
    label: 'Ultra-Fast & Blitz (Tier 4)',
    arabicLabel: 'خاطف وفائق السرعة (المستوى الرابع الأعلى)',
    description: 'Ultra-fast delivery, rapid-fire words, peak tempo with crisp phonetics',
    arabicDescription: 'سرعة تدفق كلامية فائقة وخاطفة هي الأعلى مع الحفاظ على وضوح مخارج الحروف',
    directive:
      'Pace & Speed: ultra-fast, rapid-fire, peak-tempo lightning delivery (Tier 4 speed), accelerated word flow with razor-sharp diction and breathless velocity',
  },
];

export interface BreathingOptionInfo {
  id: BreathingPattern;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  directive: string;
}

export const BREATHING_OPTIONS: BreathingOptionInfo[] = [
  {
    id: 'natural',
    label: 'Natural & Smooth Breathing',
    arabicLabel: 'تنفس طبيعي وانسيابي',
    description: 'Effortless conversational flow, realistic sub-audible breathing pauses',
    arabicDescription: 'سكتات تنفس طبيعية جداً وغير ملحوظة تحاكي الحديث البشري المعتاد',
    directive:
      'Breathing & Pauses: natural human respiration, smooth unforced transitions between phrases',
  },
  {
    id: 'contemplative',
    label: 'Contemplative Pauses & Measured Pacing',
    arabicLabel: 'وقفات وسكتات تأملية (تفكير وتأنٍ)',
    description: 'Dramatic micro-pauses, thoughtful deep breaths between sentences',
    arabicDescription: 'سكتات تمثيلية مدروسة ووقفات تأنٍ تعطي النص عمقاً فكرياً أو عاطفياً',
    directive:
      'Breathing & Pauses: dramatic contemplative micro-pauses and thoughtful measured pauses as if weighing each thought with calm depth',
  },
  {
    id: 'breathless',
    label: 'Breathless & Gasping',
    arabicLabel: 'لهاث وانقطاع نفس (انفعال أو تعب أو هلع)',
    description: 'Audible sharp intakes of breath, hurried oxygen starved speech',
    arabicDescription: 'أنفاس مسموعة متلاحقة توحي بالهلع أو الإجهاد الشديد أو البكاء المتلاحق',
    directive:
      'Breathing & Pauses: audible hurried breaths, breathless gasp pauses and emotional urgency under intense pressure or physical exhaustion',
  },
];

// ==========================================
// 8. REVERB & ACOUSTIC RECORDING ENVIRONMENTS
// ==========================================
export interface ReverbEnvironmentInfo {
  id: ReverbEnvironment;
  label: string;
  arabicLabel: string;
  description: string;
  arabicDescription: string;
  roomSizeLabel: string;
  arabicRoomSizeLabel: string;
  defaultLevel: number; // 0 to 100
  impulseDuration: number; // seconds for convolver impulse
  impulseDecay: number; // exponential decay
  directive: (level: number) => string;
}

export const REVERB_ENVIRONMENTS: Record<ReverbEnvironment, ReverbEnvironmentInfo> = {
  dry_studio: {
    id: 'dry_studio',
    label: 'Soundproof Studio Booth (Dry)',
    arabicLabel: 'استوديو مغلق معزول (صوت جاف ونقي)',
    description: 'Acoustically isolated vocal booth, close-mic, zero room reflections',
    arabicDescription: 'كابينة تسجيل معزولة تماماً عن الضوضاء والانعكاسات، صوت مقرب ومباشر بدون أي صدى',
    roomSizeLabel: 'Isolated Vocal Booth (< 5m²)',
    arabicRoomSizeLabel: 'كابينة صوتية معزولة (< 5 م²)',
    defaultLevel: 0,
    impulseDuration: 0.05,
    impulseDecay: 10,
    directive: (_level) =>
      'Acoustic recording environment: strictly dry, soundproofed recording studio booth (استوديو مغلق معزول تماماً عن الصدى). Pristine close-mic vocal capture with zero room reverberation, zero slapback echo, direct intimate acoustic presence with clinical clarity',
  },
  small_room: {
    id: 'small_room',
    label: 'Small Natural Room',
    arabicLabel: 'غرفة صغيرة (ارتداد طبيعي دافئ)',
    description: 'Warm, cozy domestic room or home office with realistic soft reflections',
    arabicDescription: 'غرفة منزلية أو مكتبية صغيرة، ارتداد صوتي طبيعي دافئ وقريب يحاكي الحوارات اليومية الحقيقية',
    roomSizeLabel: 'Small Living Room (15-20m²)',
    arabicRoomSizeLabel: 'غرفة منزلية أو مكتب (15-20 م²)',
    defaultLevel: 30,
    impulseDuration: 0.65,
    impulseDecay: 3.6,
    directive: (level) =>
      `Acoustic recording environment: natural small room acoustics (غرفة صغيرة طبيعية دافئة). Warm domestic room resonance with subtle ${level}% acoustic presence, soft near-field reflections, natural lived-in ambiance without artificial reverb`,
  },
  grand_theater: {
    id: 'grand_theater',
    label: 'Grand Theater & Auditorium',
    arabicLabel: 'مسرح كبير وقاعة عرض (صدى مسرحي واسع)',
    description: 'Expansive theatrical hall with rich reverberation and dramatic stage presence',
    arabicDescription: 'مسرح كبير وقاعة عروض فسيحة، ارتداد صوتي مهيب وصدى غني يملأ الأرجاء بهيبة مسرحية',
    roomSizeLabel: 'Grand Auditorium (500+ seats)',
    arabicRoomSizeLabel: 'مسرح كبير وقاعة عروض (500+ مقعد)',
    defaultLevel: 65,
    impulseDuration: 2.2,
    impulseDecay: 2.1,
    directive: (level) =>
      `Acoustic recording environment: majestic grand theater auditorium and theatrical stage (مسرح كبير وقاعة عرض مهيبة). Expansive reverberant hall acoustics with ${level}% rich theatrical reverb tail, resonant acoustic projection, spacious decay, and dramatic stage presence`,
  },
  vast_space: {
    id: 'vast_space',
    label: 'Vast Cinematic Space',
    arabicLabel: 'فضاء سينمائي واسع (صدى عميق وأفق ممتد)',
    description: 'Massive cathedral or cinematic soundstage with deep lingering reflections',
    arabicDescription: 'أفق صوتي سينمائي مفتوح، ارتداد عميق وأثيري يمتد في الأرجاء لأجواء ملحمية وتأملية',
    roomSizeLabel: 'Massive Soundstage / Cathedral',
    arabicRoomSizeLabel: 'صرح سينمائي / أفق أثيري مفتوح',
    defaultLevel: 80,
    impulseDuration: 3.5,
    impulseDecay: 1.4,
    directive: (level) =>
      `Acoustic recording environment: vast cinematic soundstage or cathedral space (فضاء سينمائي وأثيري واسع). Deep, cavernous acoustic reverberation with ${level}% immersive wetness, lingering cinematic acoustic decay, and profound atmospheric spatial depth`,
  },
};

export const REVERB_ENVIRONMENTS_LIST = Object.values(REVERB_ENVIRONMENTS);

export interface ReverbPresetLevel {
  level: number;
  label: string;
  arabicLabel: string;
  badge: string;
}

export const REVERB_LEVEL_PRESETS: ReverbPresetLevel[] = [
  { level: 0, label: 'Dry (0%)', arabicLabel: 'جاف تماماً (0%)', badge: 'Dry' },
  { level: 25, label: 'Subtle (25%)', arabicLabel: 'خفيف (25%)', badge: 'Subtle' },
  { level: 50, label: 'Balanced (50%)', arabicLabel: 'متوازن (50%)', badge: 'Balanced' },
  { level: 75, label: 'Theatrical (75%)', arabicLabel: 'مسرحي (75%)', badge: 'Theater' },
  { level: 100, label: 'Max (100%)', arabicLabel: 'أقصى صدى (100%)', badge: 'Max' },
];

// ==========================================
// 8.5. DRAMATIC DELIVERY STYLES (OVERARCHING ACTING FRAMES)
// Completely decoupled from emotional fine-tuning
// ==========================================
export interface DramaticDeliveryDirectiveInfo {
  id: DramaticDeliveryStyle;
  name: string;
  arabicName: string;
  directive: string;
}

export const DELIVERY_STYLE_DIRECTIVES: Record<DramaticDeliveryStyle, DramaticDeliveryDirectiveInfo> = {
  theatrical_drama: {
    id: 'theatrical_drama',
    name: 'Theatrical Drama',
    arabicName: 'تمثيل مسرحي درامي',
    directive:
      'OVERARCHING ACTING STYLE - THEATRICAL DRAMA: Deliver with rich theatrical gravitas, deep emotional immersion, profound stage presence, and measured dramatic pauses',
  },
  casual_talk: {
    id: 'casual_talk',
    name: 'Natural Conversation',
    arabicName: 'حوار واقعي عفوي',
    directive:
      'OVERARCHING ACTING STYLE - NATURAL CASUAL CONVERSATION: Deliver in 100% natural, everyday colloquial Egyptian conversational flow, unforced domestic rhythm, relaxed pace, and zero melodrama or artificial theatricality',
  },
  storytelling: {
    id: 'storytelling',
    name: 'Children Storyteller',
    arabicName: 'قصص وحكايات أطفال',
    directive:
      'OVERARCHING ACTING STYLE - STORYTELLING NARRATIVE: Deliver as an engaging, warm, enchanting storyteller with captivating vocal inflection, inviting narrative pauses, and vivid illustrative cadence',
  },
  animation_dub: {
    id: 'animation_dub',
    name: 'Animation & Dubbing',
    arabicName: 'دبلجة ورسوم متحركة',
    directive:
      'OVERARCHING ACTING STYLE - ANIMATION DUBBING: Deliver with colorful, animated, highly expressive character acting, spirited vocal energy, and vibrant cartoon personality',
  },
  documentary: {
    id: 'documentary',
    name: 'Documentary Narration',
    arabicName: 'وثائقي ورصين',
    directive:
      'OVERARCHING ACTING STYLE - DOCUMENTARY NARRATION: Deliver with authoritative, measured, calm, and cultured composure, clear articulation, and dignified intellectual cadence',
  },
  comedy_wit: {
    id: 'comedy_wit',
    name: 'Egyptian Comedy & Wit',
    arabicName: 'كوميديا وسخرية مصرية',
    directive:
      'OVERARCHING ACTING STYLE - EGYPTIAN COMEDY & WIT: Deliver with authentic Egyptian comedic flair, sharp quick-witted colloquial rhythm, playful banter cadence, and lighthearted charm',
  },
  introspective_soliloquy: {
    id: 'introspective_soliloquy',
    name: 'Introspective Soliloquy',
    arabicName: 'مونولوج وتأمل نفسي',
    directive:
      'OVERARCHING ACTING STYLE - INTROSPECTIVE SOLILOQUY: Deliver as an intimate personal inner monologue, contemplative pauses, nuanced emotional vulnerability, and deep personal reflection',
  },
  commercial_promo: {
    id: 'commercial_promo',
    name: 'Commercial & Promo',
    arabicName: 'إعلاني وحماسي ترويجي',
    directive:
      'OVERARCHING ACTING STYLE - COMMERCIAL PROMO: Deliver with crisp, energetic, confident projection, punchy cadence, persuasive warmth, and engaging broadcast vitality',
  },
  cinematic_whisper: {
    id: 'cinematic_whisper',
    name: 'Cinematic Intimate Realism',
    arabicName: 'سينمائي واقعي هامس',
    directive:
      'OVERARCHING ACTING STYLE - CINEMATIC INTIMATE REALISM: Deliver with close-mic intimacy, nuanced breathy articulation, subtle cinematic vulnerability, deep psychological presence, and authentic unhurried film dialogue realism',
  },
  epic_heroic: {
    id: 'epic_heroic',
    name: 'Epic & Historical Heroism',
    arabicName: 'ملحمي وبطولي تاريخي',
    directive:
      'OVERARCHING ACTING STYLE - EPIC HEROIC: Deliver with majestic grandeur, commanding diaphragmatic projection, heroic resonance, unwavering theatrical courage, and noble historic dignity',
  },
  folk_hakawati: {
    id: 'folk_hakawati',
    name: 'Folk Storyteller & Baladi Hakawati',
    arabicName: 'حكواتي شعبي وموال بلدي',
    directive:
      'OVERARCHING ACTING STYLE - FOLK HAKAWATI: Deliver with rich traditional Egyptian folk storytelling cadence, warm colloquial lilt, rhythmic Baladi charm, colorful popular inflections, and spontaneous streetwise wit',
  },
  investigative_noir: {
    id: 'investigative_noir',
    name: 'Investigative & Forensic Noir',
    arabicName: 'تحقيقي استقصائي بوليسي',
    directive:
      'OVERARCHING ACTING STYLE - INVESTIGATIVE NOIR: Deliver with forensic analytical focus, watchful suspense, measured deduction, quiet suspicious tension, and razor-sharp inquisitive delivery',
  },
  horror_thriller: {
    id: 'horror_thriller',
    name: 'Psychological Horror & Thriller',
    arabicName: 'رعب وغموض نفسي',
    directive:
      'OVERARCHING ACTING STYLE - PSYCHOLOGICAL HORROR & THRILLER: Deliver with eerie suspense, trembling suppressed dread, whispered chills, harrowing dramatic tension, and spine-tingling atmospheric darkness',
  },
  poetic_romantic: {
    id: 'poetic_romantic',
    name: 'Poetic & Romantic Recitation',
    arabicName: 'شعر وأدب وجداني راقٍ',
    directive:
      'OVERARCHING ACTING STYLE - POETIC ROMANTIC RECITATION: Deliver with sublime emotional melody, tender lyrical cadence, passionate poetic reverence, soulful phrasing, and exquisite vocal warmth',
  },
  modern_podcast: {
    id: 'modern_podcast',
    name: 'Modern Podcast & Deep Talk',
    arabicName: 'بودكاست حواري معاصر',
    directive:
      'OVERARCHING ACTING STYLE - MODERN PODCAST & DEEP TALK: Deliver with engaging intellectual warmth, approachable conversational curiosity, polished studio presence, fluent modern cadence, and captivating clarity',
  },
  melodramatic_telenovela: {
    id: 'melodramatic_telenovela',
    name: 'Passionate Melodrama & Dubbing',
    arabicName: 'ميلودراما ودوبلاج عاطفي',
    directive:
      'OVERARCHING ACTING STYLE - PASSIONATE MELODRAMA & DUBBING: Deliver with heightened emotional intensity, tearful romantic despair, dramatic gasps, fiery declarations of love and betrayal, and vibrant theatrical dubbing flair',
  },
};

export interface BuildDramaticPromptOptions {
  voiceOption?: VoiceOption;
  deliveryStyle?: DramaticDeliveryStyle;
  emotionCategory?: EmotionCategory;
  emotionLevel?: EmotionLevel;
  currentDialect?: EgyptianDialect;
  scriptText?: string;
  customization?: VoiceCustomization;
}

export function buildDramaticPrompt(
  customizationOrOptions: VoiceCustomization | BuildDramaticPromptOptions,
  emotionPromptPrefix: string = '',
  extraVoiceInstruction?: string,
  _scriptText?: string
): string {
  let customization: VoiceCustomization;
  let emotionPrefix = emotionPromptPrefix;
  let extraInstruction = extraVoiceInstruction;

  if (
    typeof customizationOrOptions === 'object' &&
    ('voiceOption' in customizationOrOptions || 'deliveryStyle' in customizationOrOptions)
  ) {
    const opts = customizationOrOptions as BuildDramaticPromptOptions;
    const v = opts.voiceOption;
    customization = {
      baseVoice: v?.baseVoice || opts.customization?.baseVoice,
      gender: v?.gender || opts.customization?.gender || 'male',
      age: v?.customization?.age || opts.customization?.age || 'youth_18_35',
      dialect: opts.currentDialect || opts.customization?.dialect || 'cairo',
      exactAge: v?.exactAge || opts.customization?.exactAge || 30,
      deliveryStyle: opts.deliveryStyle || opts.customization?.deliveryStyle,
      ...(v?.customization || {}),
      ...(opts.customization || {}),
    };
    emotionPrefix = opts.emotionLevel?.promptPrefix || '';
    extraInstruction = v?.isCustom ? undefined : v?.voiceInstruction;
  } else {
    customization = customizationOrOptions as VoiceCustomization;
  }

  const isEnergyOrb =
    customization.isEnergyOrb ||
    (extraInstruction &&
      (extraInstruction.includes('NABD') ||
        extraInstruction.includes('نبض') ||
        extraInstruction.includes('الكاشف')));
  const isCasual = customization.isCasualConversation;
  const genderWord = customization.gender === 'female' ? 'female' : 'male';
  const speakerAge = customization.exactAge || 30;
  const isChild = speakerAge <= 15;

  // Harmonize base voice and age: completely eliminates acoustic contradiction between larynx and age
  const actualBaseVoice =
    customization.baseVoice ||
    (customization.gender === 'female' ? (isChild ? 'Zephyr' : 'Kore') : (isChild ? 'Puck' : 'Fenrir'));

  let vocalTractHarmonization = '';
  if (isChild) {
    if (actualBaseVoice === 'Fenrir' || actualBaseVoice === 'Charon') {
      vocalTractHarmonization = `Rooted in the ${actualBaseVoice} acoustic formant but adapted to a young ${speakerAge}-year-old boy's smaller vocal tract, maintaining a childlike larynx with slightly deeper warmth`;
    } else if (actualBaseVoice === 'Kore') {
      vocalTractHarmonization = `Rooted in the Kore acoustic formant but adapted to a young ${speakerAge}-year-old girl's small vocal tract and higher childlike pitch register`;
    } else {
      vocalTractHarmonization = `Innocent, bright ${speakerAge}-year-old childlike larynx and vocal tract (${actualBaseVoice})`;
    }
  } else if (speakerAge >= 60) {
    if (actualBaseVoice === 'Zephyr' || actualBaseVoice === 'Puck') {
      vocalTractHarmonization = `A seasoned, mature ${speakerAge}-year-old elder vocal tract based on the ${actualBaseVoice} formant, resonating with authentic aged nuance and natural elder gravitas`;
    } else {
      vocalTractHarmonization = `Resonant, dignified ${speakerAge}-year-old mature elder larynx and vocal tract (${actualBaseVoice})`;
    }
  } else {
    vocalTractHarmonization = `Authentic adult ${speakerAge}-year-old ${genderWord} vocal tract (${actualBaseVoice})`;
  }

  // 1. Core Speaker Identity Anchor & Subordination Mandate
  const identityLock = isEnergyOrb
    ? 'CRITICAL SPEAKER IDENTITY LOCK - NABD / SCIENTIFIC REVEALER: The speaker is strictly "Nabd": a luminous, ageless, genderless, universal sphere of pure human consciousness. The Revealer is an auditory instrument representing the process of awareness itself. The character is forged entirely through its disciplined method of thinking, never through emotional reactivity. Do not rush, do not sneer, and do not become melodramatic. You are the steady, objective voice that explains, reveals, and dissects with calm clarity. Sound Design ID: Combine the calm confidence of the lucid revealer and the grounded certitude of an empirical scientist in a forensic investigation chamber. The Revealer illuminates the event with unwavering analytical composure'
    : `CRITICAL SPEAKER IDENTITY LOCK: The speaker is an authentic Egyptian ${genderWord}, exactly ${speakerAge} years old. ${vocalTractHarmonization}. This vocal anatomy and acoustic identity MUST remain 100% stable throughout. All affective descriptors are subordinate to this identity and must never alter the speaker's fundamental voice timbre, age, or vocal tract`;

  // 2. Studio Quality & Sound Design Mandate
  const studioMandate = isEnergyOrb
    ? 'Sound Design Mandate: Studio recording designed as a Scientific Investigation Chamber. Crystal-clear forensic speech clarity, transparent acoustic presence, zero room flutter, and clinical intelligibility'
    : isCasual
    ? 'Pristine studio acoustic recording with crystal-clear purity, zero background noise, and 100% genuine colloquial Egyptian conversational delivery'
    : 'Studio-grade acoustic recording with crystal-clear high fidelity, pristine vocal purity, zero background noise, and 100% natural dramatic character acting without robotic artifacts';

  // 3. Dialect & Sub-Style
  const dialectInfo = DIALECTS[customization.dialect || 'cairo'];
  const subStyleInfo = DIALECT_SUB_STYLES.find(
    (s) => s.id === customization.dialectSubStyle
  );
  const dialectDirective = isEnergyOrb
    ? 'Phonetic register: Highly articulate, educated, and universally intelligible Egyptian Arabic delivery with clinical phonetics'
    : subStyleInfo
    ? `${dialectInfo.promptDirective}. ${subStyleInfo.directive}`
    : dialectInfo.promptDirective;

  // 4. Exact Age & Persona Harmonization Directive
  let ageDirective = '';
  if (isEnergyOrb) {
    ageDirective = 'Entity persona: Timeless, ageless, and non-gendered energy orb of pure consciousness';
  } else if (customization.exactAge) {
    const stage = getStageFromAge(customization.exactAge);
    ageDirective = `Character persona: ${genderWord}, exactly ${customization.exactAge} years old. ${stage.directive}`;
  } else {
    const stage =
      AGE_STAGES.find((s) => s.id === customization.age) || AGE_STAGES[1];
    ageDirective = `Character persona: ${genderWord}. ${stage.directive}`;
  }

  // 5. Pitch & Melody
  const pitchInfo = PITCH_OPTIONS.find((p) => p.id === customization.pitch);
  const melodyInfo = MELODY_OPTIONS.find((m) => m.id === customization.melody);
  const pitchDirective = [
    pitchInfo?.directive || 'Vocal pitch: balanced',
    melodyInfo?.directive || '',
  ]
    .filter(Boolean)
    .join('. ');

  // 6. Timbre, Resonance & Texture
  const timbreInfo = TIMBRE_OPTIONS.find((t) => t.id === customization.timbre);
  const resonanceInfo = RESONANCE_OPTIONS.find(
    (r) => r.id === customization.resonance
  );
  const textureInfo = TEXTURE_OPTIONS.find((tx) => tx.id === customization.texture);
  const timbreDirective = [
    timbreInfo?.directive || 'Vocal Timbre: natural',
    resonanceInfo?.directive || '',
    textureInfo?.directive || '',
  ]
    .filter(Boolean)
    .join('. ');

  // 7. Pace & Breathing (Streamlined: non-conflicting tempo & breathflow)
  const paceInfo = PACE_OPTIONS.find((pc) => pc.id === customization.pace);
  const breathingInfo = BREATHING_OPTIONS.find(
    (b) => b.id === customization.breathing
  );
  const paceDirective = [
    paceInfo?.directive || 'Pace: balanced conversational',
    breathingInfo?.directive || '',
  ]
    .filter(Boolean)
    .join('. ');

  // 8. Overarching Delivery Style (Acting medium)
  let deliveryDirective = '';
  if (customization.deliveryStyle && DELIVERY_STYLE_DIRECTIVES[customization.deliveryStyle]) {
    deliveryDirective = DELIVERY_STYLE_DIRECTIVES[customization.deliveryStyle].directive;
  } else if (isCasual) {
    deliveryDirective = DELIVERY_STYLE_DIRECTIVES.casual_talk.directive;
  }

  // 8.5. Dedicated Vocal Cords Dynamics (Glottal mechanics)
  const vocalCordsParts: string[] = [];
  if (customization.vocalCordsTension) {
    const tensionOpt = VOCAL_CORDS_TENSION_OPTIONS.find((t) => t.id === customization.vocalCordsTension);
    if (tensionOpt) vocalCordsParts.push(tensionOpt.directive);
  }
  if (customization.vocalCordTremor) {
    const tremorOpt = VOCAL_CORD_TREMOR_OPTIONS.find((tr) => tr.id === customization.vocalCordTremor);
    if (tremorOpt) vocalCordsParts.push(tremorOpt.directive);
  }
  const vocalCordsDirective = vocalCordsParts.join('. ');

  // 8.6. Acoustic Staging Proximity & Mic Distance
  let stagingDirective = '';
  if (customization.stagingDistance) {
    const stOpt = STAGING_OPTIONS.find((s) => s.id === customization.stagingDistance);
    if (stOpt) stagingDirective = stOpt.directive;
  }

  // 8.7. Dynamic Emotional Arc
  let emotionalArcDirective = '';
  if (customization.emotionalArc?.enabled) {
    const startName = customization.emotionalArc.startEmotion || customization.emotionalArc.startEmotionId || 'initial composure';
    const targetName = customization.emotionalArc.targetEmotion || customization.emotionalArc.targetEmotionId || 'climactic peak';
    const transPoint = customization.emotionalArc.climaxPoint || customization.emotionalArc.transitionPoint || 'final third';
    emotionalArcDirective = `DYNAMIC EMOTIONAL ARC: Deliver with dynamic emotional progression. Begin with tone of ${startName}, smoothly transitioning around ${transPoint} into ${targetName}`;
  }

  // 8.8. Natural Thought Hesitation Beats (Concise: only active when enabled)
  let hesitationDirective = '';
  if (customization.smartHesitationBeats) {
    hesitationDirective =
      'NATURAL HESITATION: Honor punctuation as organic 200ms thinking pauses reflecting spontaneous human thought-formation';
  }

  // 9. Emotional Nuance & Tone Coloring (Decoupled, Fine-Tuned with all 4 Tiers)
  let emotionDirective = '';
  if (emotionPrefix && emotionPrefix.trim()) {
    const intensity = customization.emotionIntensity || 'medium';
    let intensityDirective = '';
    if (intensity === 'low') {
      intensityDirective =
        'Intensity: Restrained & Subtle. Express this feeling softly and naturally without vocal strain or shouting, keeping the speaker voice completely recognizable';
    } else if (intensity === 'medium') {
      intensityDirective =
        'Intensity: Balanced & Natural. Express this emotion clearly yet naturally, fully maintaining the original vocal character';
    } else if (intensity === 'high') {
      intensityDirective =
        'Intensity: Vivid & Theatrical. Express the emotion vividly while strictly keeping the speaker identity anchored';
    } else {
      intensityDirective =
        'Intensity: Extreme Climactic Peak (Level 4). Deliver with maximum dramatic intensity, electrifying conviction, and climactic emotional resonance';
    }
    emotionDirective = `EMOTIONAL COLORING: ${emotionPrefix.trim()}. ${intensityDirective}`;
  }

  // 10. Gestural Restriction (Strictly NO unprompted laughter or sighs)
  const gesturalRestriction =
    'ABSOLUTE GESTURAL PURITY: Do NOT produce any laughing, chuckling, giggling, smiling phonation, gasping, or sighing sounds unless the script text explicitly contains an exact bracketed tag. Emotional inflections and tones must ONLY modulate pitch, rhythm, cadence, and mood';

  // 11. Reverb & Acoustic Recording Environment Directive
  let reverbDirective = '';
  const reverbEnv = customization.reverbEnvironment || (isEnergyOrb ? 'small_room' : 'dry_studio');
  const rawLevel =
    customization.reverbLevel !== undefined
      ? customization.reverbLevel
      : (reverbEnv === 'dry_studio' ? 0 : REVERB_ENVIRONMENTS[reverbEnv]?.defaultLevel || 40);
  const envInfo = REVERB_ENVIRONMENTS[reverbEnv] || REVERB_ENVIRONMENTS.dry_studio;
  reverbDirective = isEnergyOrb && (reverbEnv === 'small_room' || reverbEnv === 'dry_studio')
    ? `Acoustic sound design environment: Scientific Investigation Chamber. Forensic analytical vocal capture with ${rawLevel}% subtle acoustic presence and razor-sharp speech transparency`
    : envInfo.directive(rawLevel);

  // 12. Assemble Prompt Directives in strict priority order (Pruned, no contradictions)
  const parts: string[] = [
    identityLock,
    gesturalRestriction,
    studioMandate,
    dialectDirective,
    ageDirective,
    pitchDirective,
    timbreDirective,
    vocalCordsDirective,
    stagingDirective,
    paceDirective,
    reverbDirective,
    deliveryDirective,
    emotionalArcDirective,
    hesitationDirective,
    emotionDirective,
  ];

  if (customization.customNotes && customization.customNotes.trim()) {
    parts.push(
      `Specific character acting note: ${customization.customNotes.trim()}`
    );
  }

  if (extraVoiceInstruction && extraVoiceInstruction.trim()) {
    parts.push(`Voice Persona Directive: ${extraVoiceInstruction.trim()}`);
  }

  return parts.filter(Boolean).join('. ');
}

export function generateDramaticInstruction(
  customization: VoiceCustomization,
  emotionPromptPrefix: string = '',
  extraVoiceInstruction?: string
): string {
  return buildDramaticPrompt(customization, emotionPromptPrefix, extraVoiceInstruction);
}

/**
 * Helper to get or dynamically synthesize an EmotionLevel for any intensity (including extreme Tier 4)
 */
export function getEmotionLevel(cat: EmotionCategory, intensity: EmotionIntensity): EmotionLevel {
  if (intensity === 'extreme') {
    if (cat.levels.extreme) return cat.levels.extreme;
    const baseHigh = cat.levels.high;
    return {
      level: 'extreme',
      label: `Peak ${baseHigh.label}`,
      arabicLabel: 'أقصى ذروة (مستوى رابع حاد جداً)',
      promptPrefix: `Climactic and ultra-intense delivery at absolute emotional peak: ${baseHigh.promptPrefix}, with breathtaking dramatic power, electrifying conviction, and climactic emotional resonance`,
      description: `Maximum theatrical peak of ${cat.label}`,
      arabicDescription: `الذروة الدرامية القصوى لشعور ${cat.arabicShortLabel} بأقصى درجات التأثير والتعبير`,
    };
  }
  return cat.levels[intensity] || cat.levels.medium;
}

