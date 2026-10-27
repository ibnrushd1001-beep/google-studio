import React, { useState } from 'react';
import {
  X,
  Sparkles,
  HelpCircle,
  Volume2,
  Check,
  Zap,
  Mic,
  Activity,
  User,
  Heart,
  Flame,
  Feather,
  Shield,
  Compass,
  ArrowRight,
  Sliders,
  Layers,
  Shuffle,
  RotateCcw,
} from 'lucide-react';
import {
  VoiceName,
  Gender,
  PitchLevel,
  VocalTexture,
  ResonanceChamber,
  VocalTimbre,
  PaceLevel,
  BreathingPattern,
  MelodyType,
  VoiceCustomization,
} from '../types';

export interface VocalRecipe {
  id: string;
  title: string;
  arabicTitle: string;
  icon: string;
  category: 'protagonist' | 'child' | 'deep' | 'dramatic' | 'folk' | 'cosmic';
  description: string;
  arabicDescription: string;
  bestBaseVoice: VoiceName;
  gender: Gender;
  exactAge: number;
  pitch: PitchLevel;
  texture: VocalTexture;
  resonance: ResonanceChamber;
  timbre: VocalTimbre;
  pace: PaceLevel;
  breathing: BreathingPattern;
  melody: MelodyType;
  whyThisWorks: string;
}

export const VOCAL_RECIPES: VocalRecipe[] = [
  {
    id: 'documentary_narrator',
    title: 'Documentary Narrator / Radio Host',
    arabicTitle: '🎙️ معلق وثائقي / مذيع إذاعي وقور',
    icon: 'Shield',
    category: 'deep',
    description: 'Rich, comforting, crystal-clear projection with authoritative chest body',
    arabicDescription: 'نبرة عميقة ودافئة ذات فخامة إذاعية ومخارج حروف ناصعة بدون أي شوائب',
    bestBaseVoice: 'Charon',
    gender: 'male',
    exactAge: 48,
    pitch: 'deep',
    texture: 'pure',
    resonance: 'chest',
    timbre: 'resonant',
    pace: 'balanced',
    breathing: 'natural',
    melody: 'grounded',
    whyThisWorks:
      'الرنين الصدري يمنح الصوت جسداً ممتلئاً، مع نسيج بلوري صافٍ لإعطاء النقاء الإذاعي، وطبقة عميقة لفرض الهيبة.',
  },
  {
    id: 'sweet_child',
    title: 'Innocent & Playful Child (Girl or Boy)',
    arabicTitle: '👶 طفل أو طفلة بريئة مفعمة بالحيوية',
    icon: 'Feather',
    category: 'child',
    description: 'Bright high-pitch head resonance with pure joyful energy',
    arabicDescription: 'صوت طفولي بريء وعذب كالجرس، رنين رأسي خفيف وإيقاع حركي عفوي',
    bestBaseVoice: 'Zephyr',
    gender: 'female',
    exactAge: 10,
    pitch: 'very_high',
    texture: 'pure',
    resonance: 'head',
    timbre: 'bright',
    pace: 'fast',
    breathing: 'natural',
    melody: 'melodic',
    whyThisWorks:
      'الأحبال الصوتية الحادة مع الرنين الرأسي تحاكي تماماً حنجرة الطفل الصغيرة، واللحنية تعطي التموج العفوي لكلام الصغار.',
  },
  {
    id: 'nabd_consciousness',
    title: 'Nabd: Human Consciousness & Psychoanalyst',
    arabicTitle: '🌌 نبض: طاقة الوعي والمحلل النفسي',
    icon: 'Zap',
    category: 'cosmic',
    description: 'Transcendent, hypnotic clarity dissecting inner thoughts and emotions',
    arabicDescription: 'صوت أثيري متسامٍ، فائق الهدوء والوضوح ينفذ لأعماق المشاعر والصراعات النفسية',
    bestBaseVoice: 'Zephyr',
    gender: 'female',
    exactAge: 35,
    pitch: 'medium',
    texture: 'pure',
    resonance: 'head',
    timbre: 'resonant',
    pace: 'balanced',
    breathing: 'contemplative',
    melody: 'melodic',
    whyThisWorks:
      'حنجرة Zephyr ذات الصفاء التأملي الشجي، مع تنفس تأملي يترك سكنات وقورة بين العبارات لتعميق الأثر النفسي والسينمائي.',
  },
  {
    id: 'gritty_worker',
    title: 'Authentic Folk / Working-Class Fighter',
    arabicTitle: '☕ ابن البلد / شخصية شعبية مكافحة',
    icon: 'Flame',
    category: 'folk',
    description: 'Warm street twang with raspy weathered vocal grain',
    arabicDescription: 'بحة كفاح ورجولة، نبرة حارة أصيلة بخنة شعبية خفيفة وقوة إنسانية',
    bestBaseVoice: 'Charon',
    gender: 'male',
    exactAge: 40,
    pitch: 'deep',
    texture: 'raspy',
    resonance: 'nasal',
    timbre: 'raspy',
    pace: 'slow',
    breathing: 'natural',
    melody: 'dynamic',
    whyThisWorks:
      'النسيج الأجش (Raspy) يحاكي خشونة الأحبال المعروكة بالحياة، والرنين الأنفي يضيف نكهة الحارة المصرية العفوية.',
  },
  {
    id: 'loving_mother',
    title: 'Warm & Loving Matriarch / Everyday Mother',
    arabicTitle: '❤️ أم حنونة / سيدة مصرية دافئة',
    icon: 'Heart',
    category: 'protagonist',
    description: 'Cozy, grounded, deeply comforting conversational maternal presence',
    arabicDescription: 'نبرة مريحة تفيض بالحنان والاحتواء، حديث عفوي هادئ يشعرك بالدفء المنزلي',
    bestBaseVoice: 'Kore',
    gender: 'female',
    exactAge: 42,
    pitch: 'medium',
    texture: 'pure',
    resonance: 'chest',
    timbre: 'warm',
    pace: 'balanced',
    breathing: 'natural',
    melody: 'melodic',
    whyThisWorks:
      'حنجرة Kore مع نبرة دافئة وطبقة متوسطة ورنين صدري تمنح الألفة التامة والشعور الطبيعي غير المتكلف.',
  },
  {
    id: 'choked_tears',
    title: 'Heartbroken / Holding Back Tears',
    arabicTitle: '💔 كتمان دموع / غصة حلقية وتأثر تراجيدي',
    icon: 'Activity',
    category: 'dramatic',
    description: 'Constricted throat holding back grief, struggling through suppressed emotion',
    arabicDescription: 'كلام يخرج بصعوبة من وراء خنقة البكاء، أحبال صوتية مشدودة وإيقاع متقطع متهدج',
    bestBaseVoice: 'Zephyr',
    gender: 'female',
    exactAge: 28,
    pitch: 'high',
    texture: 'constricted',
    resonance: 'throat',
    timbre: 'muffled',
    pace: 'very_slow',
    breathing: 'breathless',
    melody: 'dynamic',
    whyThisWorks:
      'النسيج المخنوق (Constricted) يضغط على الحنجرة وكأن المتحدث يبلع ريقه ويكبت بكاءه، مع تنفس لاهث متهدج.',
  },
  {
    id: 'heroic_warrior',
    title: 'Booming Heroic Champion',
    arabicTitle: '⚔️ بطل ملحمي جهوري وحماسي',
    icon: 'Shield',
    category: 'protagonist',
    description: 'Fearless diaphragmatic power with booming stage conviction',
    arabicDescription: 'صوت جهوري ملتهب بالشهامة والعزم، حضور مسرحي طاغٍ يملأ الأفق',
    bestBaseVoice: 'Fenrir',
    gender: 'male',
    exactAge: 32,
    pitch: 'deep',
    texture: 'pure',
    resonance: 'chest',
    timbre: 'resonant',
    pace: 'fast',
    breathing: 'natural',
    melody: 'dynamic',
    whyThisWorks:
      'حنجرة Fenrir الجهورية البطولية مع الرنين الصدري القوي والطبقة العميقة، تدفع الصوت بقوة مسرحية ملحمية.',
  },
  {
    id: 'intimate_whisper',
    title: 'Cinematic Breathy Whisper / Secretive',
    arabicTitle: '🤫 همس سينمائي حميمي مشوب بأنفاس',
    icon: 'Feather',
    category: 'dramatic',
    description: 'Gentle air streaming with close-mic proximity, vulnerability & tenderness',
    arabicDescription: 'صوت قريب جداً من الميكروفون مشوب بهواء خفيف ورقيق للبوح بالأسرار والمشاعر الرقيقة',
    bestBaseVoice: 'Zephyr',
    gender: 'female',
    exactAge: 22,
    pitch: 'medium',
    texture: 'breathy',
    resonance: 'head',
    timbre: 'whispered',
    pace: 'slow',
    breathing: 'contemplative',
    melody: 'grounded',
    whyThisWorks:
      'النسيج الهوائي (Breathy) يمرر زفير هواء رقيق بين الأحبال الصوتية، فيعطي إحساس الهمس السينمائي القريب جداً للأذن.',
  },
  {
    id: 'nabd_al_kashef_orb',
    title: 'Nabd Al-Kashef (The Scientific Revealer)',
    arabicTitle: '🔮 نبض: الكاشف العلمي (وعي التحقيق والتحليل)',
    icon: 'Zap',
    category: 'cosmic',
    description: 'Ageless energy orb of pure consciousness and objective analysis from the forensic office',
    arabicDescription: 'كرة طاقة نقية تمثل عملية الوعي، صوت هادئ واثق يقول برصانة العالم: "توقف لحظة..." ويشرح بلا تسرع ولا سخرية',
    bestBaseVoice: 'Fenrir',
    gender: 'male',
    exactAge: 30,
    pitch: 'medium',
    texture: 'pure',
    resonance: 'throat',
    timbre: 'resonant',
    pace: 'balanced',
    breathing: 'contemplative',
    melody: 'grounded',
    whyThisWorks:
      'حنجرة رصينة متزنة مع نسيج نقي بلوري ورنين حنجري مباشر وتنفس تأملي، يجسد هدوء الكاشف الواثق وثقة العالم في مكتب التحقيق العلمي.',
  },
  {
    id: 'calliope_orator',
    title: 'Calliope: Theatrical Heroine & Eloquent Orator',
    arabicTitle: '👑 كاليوبي: بطلة درامية وخطيبة مفوهة',
    icon: 'Flame',
    category: 'dramatic',
    description: 'Bold, commanding theatrical female projection with heroic resonance',
    arabicDescription: 'إسقاط أنثوي جهوري واثق، مخارج حروف حادة وفصيحة تناسب البطولات والمناظرات',
    bestBaseVoice: 'Calliope',
    gender: 'female',
    exactAge: 34,
    pitch: 'medium',
    texture: 'pure',
    resonance: 'chest',
    timbre: 'resonant',
    pace: 'balanced',
    breathing: 'natural',
    melody: 'dynamic',
    whyThisWorks:
      'حنجرة كاليوبي تجمع بين القوة الحنجرية والرنين الصدري الأنثوي، مما يمنح الشخصية صوتاً قيادياً مهيباً لا ينكسر.',
  },
  {
    id: 'aoede_poet',
    title: 'Aoede: Soulful Poet & Melodic Storyteller',
    arabicTitle: '🪕 أويدي: شاعرة وحكواتية وجدانية عذبة',
    icon: 'Sparkles',
    category: 'protagonist',
    description: 'Lyrical, melodious, and tenderly expressive cadence steeped in longing',
    arabicDescription: 'نبرة عذبة متموجة تفيض بالحنين والموسيقى والجمال الأدبي والوجداني',
    bestBaseVoice: 'Aoede',
    gender: 'female',
    exactAge: 25,
    pitch: 'high',
    texture: 'pure',
    resonance: 'throat',
    timbre: 'resonant',
    pace: 'balanced',
    breathing: 'contemplative',
    melody: 'melodic',
    whyThisWorks:
      'حنجرة أويدي النغمية مع تموجات لحنية ورنين حنجري رقيق تخلق وقعاً موسيقياً آسراً في الأذن.',
  },
  {
    id: 'leda_matriarch',
    title: 'Leda: Wise Elder Matriarch & Reassuring Sanctuary',
    arabicTitle: '🕊️ ليدا: جدة حكيمة وأمومة مطمئنة مقدسة',
    icon: 'Heart',
    category: 'deep',
    description: 'Solemn, serene, deeply reassuring maternal voice of peace and wisdom',
    arabicDescription: 'نبرة وقورة تفيض بالسكينة الروحية والحكمة، أمان مطلق واحتواء أمومي دافئ',
    bestBaseVoice: 'Leda',
    gender: 'female',
    exactAge: 62,
    pitch: 'medium',
    texture: 'pure',
    resonance: 'chest',
    timbre: 'warm',
    pace: 'slow',
    breathing: 'contemplative',
    melody: 'grounded',
    whyThisWorks:
      'حنجرة ليدا ذات الرنين الصدري الوقور مع الإيقاع المتمهل والتنفس التأملي تبث الطمأنينة الشافية.',
  },
  {
    id: 'orus_investigator',
    title: 'Orus: Forensic Investigator & Rational Thinker',
    arabicTitle: '🔍 أوروس: محقق استقصائي ومفكر عقلاني',
    icon: 'Compass',
    category: 'protagonist',
    description: 'Firm, grounded, analytical baritone with crisp articulate deduction',
    arabicDescription: 'باريتون متزن ومباشر، مخارج واضحة ومقنعة خالية من الانفعال تحلل الوقائع بحزم',
    bestBaseVoice: 'Orus',
    gender: 'male',
    exactAge: 39,
    pitch: 'deep',
    texture: 'pure',
    resonance: 'throat',
    timbre: 'resonant',
    pace: 'balanced',
    breathing: 'natural',
    melody: 'grounded',
    whyThisWorks:
      'حنجرة أوروس المتزنة مع الرنين الحنجري المباشر والنبرة الراسخة تمنح المتحدث حضوراً عقلانياً فائق الإقناع.',
  },
  {
    id: 'enceladus_titan',
    title: 'Enceladus: Earthy Deep Bass & Hardened Worker',
    arabicTitle: '🔨 إنسيلادوس: باس عميق وأجش لمكافح شعبي صلب',
    icon: 'Flame',
    category: 'folk',
    description: 'Subterranean bass, rugged weathered gravel and diaphragmatic weight',
    arabicDescription: 'طبقة باس زلزالية، بحّة خشنة معروكة بالكفاح، صلابة إنسانية تصنع الملاحم',
    bestBaseVoice: 'Enceladus',
    gender: 'male',
    exactAge: 48,
    pitch: 'very_deep',
    texture: 'raspy',
    resonance: 'nasal',
    timbre: 'raspy',
    pace: 'slow',
    breathing: 'natural',
    melody: 'dynamic',
    whyThisWorks:
      'حنجرة إنسيلادوس الباس مع النسيج الأجش والرنين الأنفي تزلزل المشهد بصدق كفاح ابن البلد.',
  },
];

export const generateRandomVocalRecipe = (): VocalRecipe => {
  const archetypes: Array<{
    title: string;
    arabicTitle: string;
    category: VocalRecipe['category'];
    gender: Gender;
    ageRange: [number, number];
    voices: VoiceName[];
    pitches: PitchLevel[];
    textures: VocalTexture[];
    resonances: ResonanceChamber[];
    timbres: VocalTimbre[];
    paces: PaceLevel[];
    breathings: BreathingPattern[];
    melodies: MelodyType[];
    descAr: string;
    whyAr: string;
  }> = [
    {
      title: 'Energetic Egyptian Child',
      arabicTitle: 'طفل مصري مرح وشقي',
      category: 'child',
      gender: Math.random() > 0.5 ? 'male' : 'female',
      ageRange: [6, 11],
      voices: ['Zephyr', 'Puck'],
      pitches: ['very_high', 'high'],
      textures: ['pure', 'breathy'],
      resonances: ['head'],
      timbres: ['bright'],
      paces: ['fast'],
      breathings: ['natural', 'breathless'],
      melodies: ['melodic', 'dynamic'],
      descAr: 'نبرة طفولية عفوية حركية عالية الرنين الرأسي كالجرس الصغير الصافي',
      whyAr: 'الرنين الرأسي وطبقة الأحبال الحادة تحاكي حنجرة الطفل الطبيعية تماماً.',
    },
    {
      title: 'Warm Authentic Egyptian Mother',
      arabicTitle: 'أم حنونة واحتوائية دافئة',
      category: 'protagonist',
      gender: 'female',
      ageRange: [38, 55],
      voices: ['Kore', 'Zephyr', 'Leda'],
      pitches: ['medium'],
      textures: ['pure', 'breathy'],
      resonances: ['chest'],
      timbres: ['warm', 'resonant'],
      paces: ['balanced', 'slow'],
      breathings: ['natural', 'contemplative'],
      melodies: ['melodic'],
      descAr: 'دفء أمومي حقيقي يشعرك بالسكينة والطمأنينة البيتية',
      whyAr: 'الرنين الصدري يمنح صوتاً ناضجاً دافئاً بنبرة احتضان مريحة.',
    },
    {
      title: 'Heroic Stage Leader',
      arabicTitle: 'شخصية قيادية ملحمية جهورية',
      category: 'protagonist',
      gender: 'male',
      ageRange: [28, 48],
      voices: ['Fenrir', 'Charon', 'Orus'],
      pitches: ['deep'],
      textures: ['pure'],
      resonances: ['chest'],
      timbres: ['resonant'],
      paces: ['balanced', 'fast'],
      breathings: ['natural'],
      melodies: ['dynamic', 'grounded'],
      descAr: 'حضور مسرحي هادر وثقة مطلقة وصوت يملأ الأفق بالحماس',
      whyAr: 'الحنجرة الجهورية مع الرنين الصدري تمنح الصوت جسماً مهيباً كالقادة.',
    },
    {
      title: 'Folk Working-Class Fighter',
      arabicTitle: 'ابن بلد أصيل مكافح بخنة شعبية',
      category: 'folk',
      gender: 'male',
      ageRange: [32, 54],
      voices: ['Charon', 'Enceladus', 'Fenrir'],
      pitches: ['deep', 'medium'],
      textures: ['raspy'],
      resonances: ['nasal', 'throat'],
      timbres: ['raspy'],
      paces: ['slow', 'balanced'],
      breathings: ['natural'],
      melodies: ['dynamic'],
      descAr: 'بحة كفاح شعبية معجونة بروح الشارع المصري ورنين أنفي أصيل',
      whyAr: 'الملمس الأجش مع الرنين الأنفي ينقل روح الحارة الشعبية بواقعية شديدة.',
    },
    {
      title: 'Poetic Contemplative Soul',
      arabicTitle: 'شخصية شجية وحالمة عميقة المشاعر',
      category: 'dramatic',
      gender: Math.random() > 0.5 ? 'male' : 'female',
      ageRange: [24, 42],
      voices: ['Zephyr', 'Aoede', 'Puck'],
      pitches: ['medium', 'high'],
      textures: ['breathy', 'pure'],
      resonances: ['head', 'chest'],
      timbres: ['whispered', 'warm'],
      paces: ['slow', 'very_slow'],
      breathings: ['contemplative'],
      melodies: ['melodic', 'grounded'],
      descAr: 'نبرة وجدانية تنطق برقة مشوبة بهمس الأنفاس وعمق المشاعر',
      whyAr: 'التنفس التأملي والملمس الهوائي يخلقان قرباً ميكروفونياً حميمياً ناصعاً.',
    },
    {
      title: 'Wise Egyptian Elder',
      arabicTitle: 'حكيم وقور ناضج التجارب',
      category: 'deep',
      gender: 'male',
      ageRange: [60, 78],
      voices: ['Charon', 'Leda', 'Orus'],
      pitches: ['deep', 'very_deep'],
      textures: ['raspy', 'pure'],
      resonances: ['chest', 'throat'],
      timbres: ['resonant', 'warm'],
      paces: ['slow', 'very_slow'],
      breathings: ['contemplative', 'natural'],
      melodies: ['grounded'],
      descAr: 'صوت ثقيل وقور مفعم بالحكمة وهدوء السنين ورزانة الحديث',
      whyAr: 'الطبقة العميقة جداً مع رنين التجويف الصدري تعكس وقار الشيخوخة.',
    },
    {
      title: 'Coastal Alexandrian Youth',
      arabicTitle: 'يافع سكندري بحري خفيف الظل',
      category: 'folk',
      gender: Math.random() > 0.5 ? 'male' : 'female',
      ageRange: [18, 26],
      voices: ['Puck', 'Fenrir'],
      pitches: ['medium', 'high'],
      textures: ['pure'],
      resonances: ['head', 'nasal'],
      timbres: ['bright', 'resonant'],
      paces: ['fast', 'balanced'],
      breathings: ['natural'],
      melodies: ['melodic', 'dynamic'],
      descAr: 'حيوية ساحلية منطلقة وإيقاع كلام رشيق بروح البحر الأبيض',
      whyAr: 'الإيقاع السريع مع الرنين المتوهج يعطي خفة الظل والطلاقة السكندرية.',
    },
    {
      title: 'Nabd Pure Cosmic Consciousness',
      arabicTitle: 'نبض: طاقة الوعي المتسامية',
      category: 'cosmic',
      gender: 'female',
      ageRange: [30, 45],
      voices: ['Zephyr', 'Kore'],
      pitches: ['medium', 'high'],
      textures: ['pure'],
      resonances: ['head'],
      timbres: ['resonant', 'bright'],
      paces: ['balanced', 'slow'],
      breathings: ['contemplative'],
      melodies: ['melodic'],
      descAr: 'صوت أثيري بلوري يعبر عن الوعي الباطني وتحليل الخواطر',
      whyAr: 'النقاء الأثيري بدون أي خشونة مع تنفس تأملي يعطي إيحاء الذكاء الروحي الشامل.',
    },
  ];

  const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const arch = pickRandom(archetypes);
  const age = Math.floor(Math.random() * (arch.ageRange[1] - arch.ageRange[0] + 1)) + arch.ageRange[0];
  const uniqueId = `random_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return {
    id: uniqueId,
    title: arch.title,
    arabicTitle: `🎲 توليد عشوائي: ${arch.arabicTitle}`,
    icon: 'Sparkles',
    category: arch.category,
    description: arch.title,
    arabicDescription: `${arch.descAr} (عمر تقديري ${age} سنة)`,
    bestBaseVoice: pickRandom(arch.voices),
    gender: arch.gender,
    exactAge: age,
    pitch: pickRandom(arch.pitches),
    texture: pickRandom(arch.textures),
    resonance: pickRandom(arch.resonances),
    timbre: pickRandom(arch.timbres),
    pace: pickRandom(arch.paces),
    breathing: pickRandom(arch.breathings),
    melody: pickRandom(arch.melodies),
    whyThisWorks: arch.whyAr,
  };
};

interface VocalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
  onApplyRecipe?: (recipe: VocalRecipe) => void;
}

export const VocalGuideModal: React.FC<VocalGuideModalProps> = ({
  isOpen,
  onClose,
  isRtl,
  onApplyRecipe,
}) => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'larynx' | 'cords' | 'texture' | 'resonance'>('recipes');
  const [appliedRecipeId, setAppliedRecipeId] = useState<string | null>(null);
  const [randomRecipe, setRandomRecipe] = useState<VocalRecipe | null>(null);

  if (!isOpen) return null;

  const handleSelectRecipe = (recipe: VocalRecipe) => {
    if (onApplyRecipe) {
      onApplyRecipe(recipe);
      setAppliedRecipeId(recipe.id);
      setTimeout(() => {
        setAppliedRecipeId(null);
        onClose();
      }, 1200);
    }
  };

  const handleGenerateRandom = () => {
    const generated = generateRandomVocalRecipe();
    setRandomRecipe(generated);
    setActiveTab('recipes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#DCD7CC] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5E1D8] bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#BC6C25] to-[#99582A] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#343230] flex items-center gap-2">
                <span>{isRtl ? 'مرشد الحناجر وهندسة الصوت والأحبال' : 'Vocal Anatomy & Selection Guide'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BC6C25]/15 text-[#BC6C25] font-bold">
                  بدون حيرة
                </span>
              </h2>
              <p className="text-xs text-[#7D786E] mt-0.5">
                {isRtl
                  ? 'دليلك المبسط لاختيار الحنجرة، الأحبال الصوتية، ملمس الصوت ورنين الصدر دون اختيار أعمى'
                  : 'Practical, intuitive acoustic guide to craft exact character voices with zero guesswork'}
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
        <div className="flex flex-wrap border-b border-[#E5E1D8] bg-[#FAF8F5]/80 px-4 pt-2 gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
              activeTab === 'recipes'
                ? 'bg-white border-[#E5E1D8] text-[#BC6C25] shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BC6C25]" />
            <span>{isRtl ? 'وصفات جاهزة بنقرة واحدة' : 'Instant Recipes'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('larynx')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
              activeTab === 'larynx'
                ? 'bg-white border-[#E5E1D8] text-[#6B705C] shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الحناجر الـ 10 (DNA الصوت)' : 'The 10 Larynges'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('texture')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
              activeTab === 'texture'
                ? 'bg-white border-[#E5E1D8] text-[#C86446] shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isRtl ? 'ملمس ونسيج الصوت' : 'Vocal Texture'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cords')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
              activeTab === 'cords'
                ? 'bg-white border-[#E5E1D8] text-[#0077B6] shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الأحبال والطبقات (Pitch)' : 'Vocal Cords'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resonance')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
              activeTab === 'resonance'
                ? 'bg-white border-[#E5E1D8] text-[#7F5539] shadow-2xs'
                : 'border-transparent text-[#7D786E] hover:text-[#343230]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? 'غرف الرنين (أين يهتز؟)' : 'Resonance'}</span>
          </button>

          {/* Dedicated Random Recipe Generator Button in Tab Strip */}
          <button
            type="button"
            id="vocal-guide-random-gen-tab-btn"
            onClick={handleGenerateRandom}
            className="ms-auto mb-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-600 via-orange-500 to-[#BC6C25] hover:opacity-90 text-white shadow-xs active:scale-95"
            title={isRtl ? 'توليد صوت ووصفة عشوائية فوراً' : 'Generate Random Vocal Recipe'}
          >
            <Shuffle className="w-3.5 h-3.5 animate-pulse" />
            <span>{isRtl ? '🎲 توليد عشوائي' : 'Random Voice'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* TAB 1: INSTANT RECIPES */}
          {activeTab === 'recipes' && (
            <div className="space-y-4">
              {/* Random Vocal Recipe Generator Banner & Trigger */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#BC6C25]/15 to-orange-500/10 border-2 border-[#BC6C25]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#BC6C25] to-amber-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <Shuffle className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#343230] flex items-center gap-1.5">
                      <span>{isRtl ? 'زر التوليد العشوائي للوصفات والحناجر' : 'Random Vocal Anatomy Generator'}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-900 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                        {isRtl ? 'توليف تلقائي' : 'Instant Mix'}
                      </span>
                    </h4>
                    <p className="text-xs text-[#7D786E] mt-0.5">
                      {isRtl
                        ? 'أنشئ وصفة صوتية فيزيائية عشوائية متزنة (الحنجرة، الأحبال، الرنين، والملمس) بنقرة واحدة وطبقها في الاستوديو'
                        : 'Generate a surprise vocal recipe with balanced acoustics and apply it to the studio instantly'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="vocal-guide-random-generate-btn"
                  onClick={handleGenerateRandom}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BC6C25] to-amber-600 hover:from-[#A25A1E] hover:to-amber-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shrink-0"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>{isRtl ? '🎲 توليد صوت ووصفة عشوائية' : 'Generate Random Recipe'}</span>
                </button>
              </div>

              {/* Spotlight on Generated Random Recipe Card if active */}
              {randomRecipe && (
                <div className="p-4 sm:p-5 rounded-3xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white shadow-md animate-fade-in space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        🎲
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm sm:text-base text-[#343230]">
                            {randomRecipe.arabicTitle}
                          </h4>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300 font-bold">
                            عمر {randomRecipe.exactAge} سنة • {randomRecipe.gender === 'female' ? 'أنثى' : 'ذكر'}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B705C] font-semibold mt-0.5">
                          الحنجرة الأساسية: {randomRecipe.bestBaseVoice} • النمط: {randomRecipe.category}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRandomRecipe(null)}
                      className="text-xs text-[#7D786E] hover:text-red-600 cursor-pointer p-1"
                      title={isRtl ? 'إخفاء' : 'Dismiss'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#5B604C] leading-relaxed">
                    {randomRecipe.arabicDescription}
                  </p>

                  <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs text-[#7D786E] space-y-1.5">
                    <span className="font-bold text-[#343230] block">💡 التحليل الصوتي للتركيب العشوائي:</span>
                    <p className="leading-relaxed text-[#5B604C]">{randomRecipe.whyThisWorks}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono">
                      <span className="px-2 py-0.5 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-md">
                        طبقة الأحبال: {randomRecipe.pitch}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-md">
                        الملمس: {randomRecipe.texture}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-md">
                        الرنين: {randomRecipe.resonance}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-md">
                        الطابع: {randomRecipe.timbre}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-md">
                        الإيقاع: {randomRecipe.pace}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateRandom}
                      className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isRtl ? '🔄 توليد توليفة أخرى' : 'Reshuffle'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectRecipe(randomRecipe)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isRtl ? '✨ تطبيق هذا الصوت العشوائي في الاستوديو' : 'Apply This Voice'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-[#343230] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#BC6C25]" />
                  <span>{isRtl ? 'وصفات مدروسة تلغي الحيرة تماماً' : 'Pre-Engineered Acoustic Recipes'}</span>
                </h3>
                <p className="text-xs text-[#7D786E] leading-relaxed">
                  {isRtl
                    ? 'بدلاً من ضبط 10 مؤشرات يدويًا: اختر الشخصية التي تريدها وسيقوم النظام بضبط الحنجرة، الأحبال، النسيج وغرف الرنين فوراً بالمعايير الفيزيائية الصحيحة.'
                    : 'Click any archetype to automatically apply all anatomical parameters (larynx, cords, texture, resonance, and pacing).'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VOCAL_RECIPES.map((recipe) => {
                  const isApplied = appliedRecipeId === recipe.id;
                  return (
                    <div
                      key={recipe.id}
                      className="p-4 rounded-2xl border border-[#E5E1D8] hover:border-[#BC6C25]/50 bg-white hover:bg-[#FAF8F5]/60 transition-all shadow-2xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs sm:text-sm text-[#343230]">
                            {isRtl ? recipe.arabicTitle : recipe.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E1D8] text-[#6B705C] font-semibold">
                            {recipe.bestBaseVoice} ({recipe.gender === 'female' ? 'أنثى' : 'ذكر'})
                          </span>
                        </div>

                        <p className="text-[11px] text-[#7D786E] leading-relaxed">
                          {isRtl ? recipe.arabicDescription : recipe.description}
                        </p>

                        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]/60 text-[10px] text-[#5B604C] space-y-1">
                          <span className="font-bold block text-[#7D786E]">لماذا يعمل هذا التركيب؟</span>
                          <p>{recipe.whyThisWorks}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D8]/70">
                        <div className="flex items-center gap-1.5 text-[9px] text-[#7D786E]">
                          <span className="px-1.5 py-0.5 bg-white border border-[#E5E1D8] rounded-md font-mono">
                            {recipe.pitch}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-[#E5E1D8] rounded-md font-mono">
                            {recipe.texture}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-[#E5E1D8] rounded-md font-mono">
                            {recipe.resonance}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectRecipe(recipe)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                            isApplied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#BC6C25] hover:bg-[#99582A] text-white active:scale-95'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'تم التطبيق!' : 'Applied!'}</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'تطبيق هذه الوصفة' : 'Apply'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: THE 10 LARYNGES (الحناجر الـ 10 الكاملة من GEMINI) */}
          {activeTab === 'larynx' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#6B705C]/10 border border-[#6B705C]/20 text-xs text-[#5B604C] space-y-1.5 leading-relaxed">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#343230] flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-[#6B705C]" />
                    <span>ما هي الحناجر الـ 10 الأساسية (Gemini Physical Vocal Tract DNA)؟</span>
                  </span>
                  <span className="text-[10px] bg-[#6B705C] text-white px-2 py-0.5 rounded-full font-bold">
                    10 حناجر متكاملة
                  </span>
                </div>
                <p>
                  الحنجرة هي البصمة التشريحية الأساسية لجهاز النطق (حجم تجويف البلعوم، مرونة الأحبال الصوتية، وموضع رنين الصدر والرأس).
                  تضم عائلة Gemini الصوتية 10 حناجر فيزيائية متمايزة (5 نسائية و5 رجالية) تمنح كل شخصية درامية هوية بيولوجية فريدة لا تتشابه مع غيرها.
                </p>
              </div>

              {/* 1. FEMALE VOCAL TRACTS (5 حناجر نسائية) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-1.5">
                  <h4 className="text-xs font-bold text-[#6B705C] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>حناجر نسائية (5 Female Vocal Tracts)</span>
                  </h4>
                  <span className="text-[10px] text-[#7D786E] font-medium">5 بصمات أنثوية متنوعة</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* 1. Zephyr */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#CB997E] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">زفير (Zephyr)</span>
                        <span className="text-[10px] text-[#B07D62] bg-[#CB997E]/20 px-2 py-0.5 rounded-full font-bold">
                          4 - 28 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#B07D62] mb-1">
                        طفلة وشابة عذبة • صفاء تأملي لنبض
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        نبرة رقيقة نضرة مفعمة بالبراءة والحرارة والصفاء التأملي الشجي. القاعدة المثالية للطفلات والفتيات الصغيرات والشخصيات الرقيقة.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_zephyr',
                          title: 'Zephyr Larynx',
                          arabicTitle: 'حنجرة زفير (Zephyr)',
                          icon: 'Feather',
                          category: 'child',
                          description: 'Delicate, pure and sweet female vocal tract',
                          arabicDescription: 'حنجرة أنثوية عذبة ورقيقة للبنات والشابات',
                          bestBaseVoice: 'Zephyr',
                          gender: 'female',
                          exactAge: 10,
                          pitch: 'high',
                          texture: 'pure',
                          resonance: 'head',
                          timbre: 'bright',
                          pace: 'balanced',
                          breathing: 'natural',
                          melody: 'melodic',
                          whyThisWorks: 'حنجرة زفير تمتاز برنين رأسي خفيف يناسب البراءة والوضوح.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#CB997E]/15 text-[#B07D62] border border-[#CB997E]/30 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة زفير</span>
                      </button>
                    )}
                  </div>

                  {/* 2. Kore */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#6B705C] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">كوري (Kore)</span>
                        <span className="text-[10px] text-[#5B604C] bg-[#6B705C]/20 px-2 py-0.5 rounded-full font-bold">
                          18 - 85 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#5B604C] mb-1">
                        شابة وسيدة متزنة • إلقاء درامي رصين
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        دفء ورصانة الحوارات الواقعية اليومية، إلقاء سلس وتمثيل درامي رصين للأمهات والسيدات والشخصيات الثابتة الحضور.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_kore',
                          title: 'Kore Larynx',
                          arabicTitle: 'حنجرة كوري (Kore)',
                          icon: 'Heart',
                          category: 'protagonist',
                          description: 'Warm, grounded, articulate adult female presence',
                          arabicDescription: 'حنجرة أنثوية دافئة ومتزنة للشابات والسيدات',
                          bestBaseVoice: 'Kore',
                          gender: 'female',
                          exactAge: 32,
                          pitch: 'medium',
                          texture: 'pure',
                          resonance: 'throat',
                          timbre: 'warm',
                          pace: 'balanced',
                          breathing: 'natural',
                          melody: 'grounded',
                          whyThisWorks: 'حنجرة كوري هي الميزان المثالي للحديث الواقعي الطبيعي.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#6B705C]/15 text-[#5B604C] border border-[#6B705C]/30 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة كوري</span>
                      </button>
                    )}
                  </div>

                  {/* 3. Calliope */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#C86446] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">كاليوبي (Calliope)</span>
                        <span className="text-[10px] text-[#B5573B] bg-[#C86446]/20 px-2 py-0.5 rounded-full font-bold">
                          22 - 60 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#B5573B] mb-1">
                        بطلة درامية • خطيبة مفوهة وجهورية
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        إسقاط حنجري جهوري أنثوي قوي وواثق، مخارج حروف حادة تناسب البطولات المسرحية والمناظرات والشخصيات القيادية الصارمة.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_calliope',
                          title: 'Calliope Larynx',
                          arabicTitle: 'حنجرة كاليوبي (Calliope)',
                          icon: 'Flame',
                          category: 'dramatic',
                          description: 'Bold, commanding theatrical female projection',
                          arabicDescription: 'حنجرة أنثوية جهورية بطولية وخطيبة مفوهة',
                          bestBaseVoice: 'Calliope',
                          gender: 'female',
                          exactAge: 35,
                          pitch: 'medium',
                          texture: 'pure',
                          resonance: 'chest',
                          timbre: 'resonant',
                          pace: 'balanced',
                          breathing: 'natural',
                          melody: 'dynamic',
                          whyThisWorks: 'إسقاط حنجري واثق يمنح المرأة حضوراً مسرحياً مهيباً.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#C86446]/15 text-[#B5573B] border border-[#C86446]/30 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة كاليوبي</span>
                      </button>
                    )}
                  </div>

                  {/* 4. Aoede */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#0077B6] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">أويدي (Aoede)</span>
                        <span className="text-[10px] text-[#0077B6] bg-[#0077B6]/15 px-2 py-0.5 rounded-full font-bold">
                          16 - 50 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#0077B6] mb-1">
                        حكواتية وجدانية • إلقاء شعري لحني
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        نغمة عذبة متموجة تفيض بالموسيقى والشجن، مثالية للروايات والقصص الرومانسية والإلقاء الشعري الفصيح والذكريات الدافئة.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_aoede',
                          title: 'Aoede Larynx',
                          arabicTitle: 'حنجرة أويدي (Aoede)',
                          icon: 'Sparkles',
                          category: 'protagonist',
                          description: 'Lyrical, melodic and emotionally resonant female voice',
                          arabicDescription: 'حنجرة أنثوية لحنية شجية مفعمة بالحنين والموسيقى',
                          bestBaseVoice: 'Aoede',
                          gender: 'female',
                          exactAge: 26,
                          pitch: 'high',
                          texture: 'pure',
                          resonance: 'throat',
                          timbre: 'resonant',
                          pace: 'balanced',
                          breathing: 'contemplative',
                          melody: 'melodic',
                          whyThisWorks: 'مرونة نغمية استثنائية تعطي الكلمات رونقاً شاعرياً آسراً.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#0077B6]/15 text-[#0077B6] border border-[#0077B6]/30 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة أويدي</span>
                      </button>
                    )}
                  </div>

                  {/* 5. Leda */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#7F5539] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">ليدا (Leda)</span>
                        <span className="text-[10px] text-[#7F5539] bg-[#7F5539]/20 px-2 py-0.5 rounded-full font-bold">
                          40 - 85 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#7F5539] mb-1">
                        أمومة مطمئنة • جدة حكيمة ووقورة
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        وقار نسائي حكيم، سكينة روحية وطمأنينة تعانق القلب كأم محبة أو جدة حانية تسرد الحكمة بحنان وصبر طويل.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_leda',
                          title: 'Leda Larynx',
                          arabicTitle: 'حنجرة ليدا (Leda)',
                          icon: 'Heart',
                          category: 'deep',
                          description: 'Solemn, maternal, comforting wise matriarch',
                          arabicDescription: 'حنجرة أنثوية وقورة ومطمئنة للأمهات والجدات',
                          bestBaseVoice: 'Leda',
                          gender: 'female',
                          exactAge: 58,
                          pitch: 'medium',
                          texture: 'pure',
                          resonance: 'chest',
                          timbre: 'warm',
                          pace: 'slow',
                          breathing: 'contemplative',
                          melody: 'grounded',
                          whyThisWorks: 'رنين دافئ وإيقاع هادئ يبعثان على السكينة والثقة العميقة.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#7F5539]/15 text-[#7F5539] border border-[#7F5539]/30 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة ليدا</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. MALE VOCAL TRACTS (5 حناجر رجالية) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-1.5">
                  <h4 className="text-xs font-bold text-[#6B705C] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>حناجر رجالية (5 Male Vocal Tracts)</span>
                  </h4>
                  <span className="text-[10px] text-[#7D786E] font-medium">5 بصمات ذكورية متنوعة</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* 6. Puck */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#F4A261] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">باك (Puck)</span>
                        <span className="text-[10px] text-[#E76F51] bg-[#F4A261]/25 px-2 py-0.5 rounded-full font-bold">
                          4 - 25 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#E76F51] mb-1">
                        فتى وطفل نشيط ومشاغب • خفيف الظل
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        ذكوري فتياني حركي ومرح، خفة دم وعفوية وبراءة ونشاط كبير للأولاد الصغار والفتيان المشاغبين والشباب الحيوي.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_puck',
                          title: 'Puck Larynx',
                          arabicTitle: 'حنجرة باك (Puck)',
                          icon: 'Zap',
                          category: 'child',
                          description: 'Agile, playful youthful boyish vocal tract',
                          arabicDescription: 'حنجرة فتيانية مرحة ومشاغبة للأطفال والفتيان',
                          bestBaseVoice: 'Puck',
                          gender: 'male',
                          exactAge: 9,
                          pitch: 'high',
                          texture: 'pure',
                          resonance: 'head',
                          timbre: 'bright',
                          pace: 'fast',
                          breathing: 'natural',
                          melody: 'dynamic',
                          whyThisWorks: 'خفة وزن الأحبال تمنح الصوت شقاوة الصبي وسرعة البديهة.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4A261]/20 text-[#E76F51] border border-[#F4A261]/35 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة باك</span>
                      </button>
                    )}
                  </div>

                  {/* 7. Fenrir */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#43413E] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">فينرير (Fenrir)</span>
                        <span className="text-[10px] text-[#43413E] bg-[#43413E]/20 px-2 py-0.5 rounded-full font-bold">
                          20 - 55 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#43413E] mb-1">
                        رجل واثق • بطل درامي جهوري
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        ذكوري حاسم وواثق، نبرة رجولية محددة ومخارج واضحة وبطولية ملحمية جهورية ملؤها الحزم والفروسية والقوة.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_fenrir',
                          title: 'Fenrir Larynx',
                          arabicTitle: 'حنجرة فينرير (Fenrir)',
                          icon: 'Flame',
                          category: 'protagonist',
                          description: 'Commanding, heroic assertive masculine presence',
                          arabicDescription: 'حنجرة رجولية حاسمة وبطولية جهورية',
                          bestBaseVoice: 'Fenrir',
                          gender: 'male',
                          exactAge: 34,
                          pitch: 'deep',
                          texture: 'pure',
                          resonance: 'chest',
                          timbre: 'resonant',
                          pace: 'balanced',
                          breathing: 'natural',
                          melody: 'dynamic',
                          whyThisWorks: 'حضور صدري قوي ونفاذ حنجري يفرض الهيبة الفورية.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#43413E]/15 text-[#43413E] border border-[#43413E]/30 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة فينرير</span>
                      </button>
                    )}
                  </div>

                  {/* 8. Charon */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#283618] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">شارون (Charon)</span>
                        <span className="text-[10px] text-[#283618] bg-[#283618]/25 px-2 py-0.5 rounded-full font-bold">
                          35 - 85 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#283618] mb-1">
                        باريتون كهل ومسن • وقار مسرحي وشيخ حكيم
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        طبقة باريتون وقورة وثقيلة جداً؛ صوت الجد الحكيم، شيخ الجامع، أو معلق وثائقي إذاعي رصين ذو حضور تاريخي.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_charon',
                          title: 'Charon Larynx',
                          arabicTitle: 'حنجرة شارون (Charon)',
                          icon: 'Shield',
                          category: 'deep',
                          description: 'Deep, resonant, baritone and seasoned elder presence',
                          arabicDescription: 'حنجرة باريتون وقورة للمسنين والحكماء',
                          bestBaseVoice: 'Charon',
                          gender: 'male',
                          exactAge: 65,
                          pitch: 'very_deep',
                          texture: 'raspy',
                          resonance: 'chest',
                          timbre: 'raspy',
                          pace: 'slow',
                          breathing: 'contemplative',
                          melody: 'grounded',
                          whyThisWorks: 'تجويف صدري عميق مع خشونة خفيفة يوحيان بسنوات الخبرة.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#283618]/15 text-[#283618] border border-[#283618]/35 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة شارون</span>
                      </button>
                    )}
                  </div>

                  {/* 9. Orus */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#5B604C] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">أوروس (Orus)</span>
                        <span className="text-[10px] text-[#5B604C] bg-[#5B604C]/20 px-2 py-0.5 rounded-full font-bold">
                          25 - 60 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#5B604C] mb-1">
                        باريتون متزن • محقق استقصائي وعقلاني
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        ذكوري متزن وحازم، باريتون عملي مباشر ومخارج حروف صريحة ومقنعة للمحققين، الأطباء، والمفكرين في الحوارات الهادفة.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_orus',
                          title: 'Orus Larynx',
                          arabicTitle: 'حنجرة أوروس (Orus)',
                          icon: 'Compass',
                          category: 'protagonist',
                          description: 'Firm, balanced and analytical baritone presence',
                          arabicDescription: 'حنجرة باريتون متزنة وعقلانية للمحققين والمفكرين',
                          bestBaseVoice: 'Orus',
                          gender: 'male',
                          exactAge: 38,
                          pitch: 'deep',
                          texture: 'pure',
                          resonance: 'throat',
                          timbre: 'resonant',
                          pace: 'balanced',
                          breathing: 'natural',
                          melody: 'grounded',
                          whyThisWorks: 'نبرة رصينة متزنة ومخارج ألفاظ صريحة تبعث على الاقتناع.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#5B604C]/15 text-[#5B604C] border border-[#5B604C]/35 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة أوروس</span>
                      </button>
                    )}
                  </div>

                  {/* 10. Enceladus */}
                  <div className="p-3.5 rounded-2xl border border-[#E5E1D8] bg-white space-y-2 hover:border-[#1D2D44] transition-all flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#343230]">إنسيلادوس (Enceladus)</span>
                        <span className="text-[10px] text-[#1D2D44] bg-[#1D2D44]/15 px-2 py-0.5 rounded-full font-bold">
                          35 - 85 سنة
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#1D2D44] mb-1">
                        باس عميق وأجش • مكافح شعبي وأسطوري
                      </div>
                      <p className="text-[11px] text-[#7D786E] leading-relaxed">
                        طبقة باس تحت أرضية غليظة، بحّة خشنة معروكة بالحياة وقوة صلبة للشخصيات الشعبية الكادحة، الحدادين، والملاحم الكبرى.
                      </p>
                    </div>
                    {onApplyRecipe && (
                      <button
                        type="button"
                        onClick={() => handleSelectRecipe({
                          id: 'larynx_enceladus',
                          title: 'Enceladus Larynx',
                          arabicTitle: 'حنجرة إنسيلادوس (Enceladus)',
                          icon: 'Flame',
                          category: 'folk',
                          description: 'Rugged bass, weathered gravelly power',
                          arabicDescription: 'حنجرة باس عميقة وأجشة للمكافحين والأساطير',
                          bestBaseVoice: 'Enceladus',
                          gender: 'male',
                          exactAge: 46,
                          pitch: 'very_deep',
                          texture: 'raspy',
                          resonance: 'nasal',
                          timbre: 'raspy',
                          pace: 'slow',
                          breathing: 'natural',
                          melody: 'dynamic',
                          whyThisWorks: 'خشونة باس حارقة تجسد الكفاح والصلابة الإنسانية الصادقة.',
                        })}
                        className="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#1D2D44]/15 text-[#1D2D44] border border-[#1D2D44]/30 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>اختيار حنجرة إنسيلادوس</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VOCAL TEXTURE */}
          {activeTab === 'texture' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#C86446]/10 border border-[#C86446]/20 text-xs text-[#8C3B24] space-y-1 leading-relaxed">
                <span className="font-bold block text-[#343230]">ما هو ملمس ونسيج الصوت (Texture)؟</span>
                <p>
                  الملمس هو "طريقة تلامس واهتزاز الأحبال الصوتية". هل تنغلق بانسيابية ناعمة كالحرير، أم يمر بينها
                  زفير هواء، أم تحتك بخشونة، أم تضيق تحت وطأة الخنقة؟
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#343230]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>صافٍ بلوري (Crystal Pure)</span>
                  </div>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    <strong>كيف يبدو؟</strong> نقي 100% كالجرس الرنان، بدون أي خشونة أو بحة أو هواء زائد.
                    <br />
                    <strong>متى تختاره؟</strong> في الأخبار، الإعلانات، الوثائقيات، وبراءة الأطفال النضرة.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#343230]">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span>مشوب بأنفاس (Breathy)</span>
                  </div>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    <strong>كيف يبدو؟</strong> هواء خفيف يتسرب مع الكلام وكأن المتحدث يهمس قريباً جداً من أذنك.
                    <br />
                    <strong>متى تختاره؟</strong> في المشاهد الرومانسية، الاعتراف بالأسرار، والتأثر العاطفي الهادئ.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#343230]">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    <span>أجش وخشن (Raspy / Vocal Fry)</span>
                  </div>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    <strong>كيف يبدو؟</strong> بحّة محببة وحبيبات احتكاك مسموعة على الأحبال الصوتية.
                    <br />
                    <strong>متى تختاره؟</strong> في الشخصيات الكادحة، التعب والإرهاق، القوة والخشونة الرجولية.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#343230]">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>مخنوق ومشدود (Constricted)</span>
                  </div>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    <strong>كيف يبدو؟</strong> عضلات الحلق منقبضة وكأن الكلمات تعبر بصعوبة بالغة من وراء غصة.
                    <br />
                    <strong>متى تختاره؟</strong> كتمان الدموع والبكاء، الغيظ الشديد المكتوم، والانهيار المحبوس.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VOCAL CORDS & PITCH */}
          {activeTab === 'cords' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#0077B6]/10 border border-[#0077B6]/20 text-xs text-[#0077B6] space-y-1 leading-relaxed">
                <span className="font-bold block text-[#343230]">الأحبال الصوتية وتردد الطبقة (Pitch - F0):</span>
                <p>
                  الأحبال الصوتية تشبه أوتار العود أو الكمان: الأوتار القصيرة الرفيعة تصدر صوتاً حاداً (أطفال
                  ونساء)، بينما الأوتار الطويلة العريضة تصدر صوتاً قراراً عميقاً (رجال ومسنون).
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl border border-[#E5E1D8] bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#343230]">حادة جداً (Very High)</span>
                    <p className="text-[11px] text-[#7D786E]">أطفال صغار (4 - 8 سنوات) أو صراخ استغاثة وفرح عارم</p>
                  </div>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                    أطفال حصراً
                  </span>
                </div>

                <div className="p-3 rounded-2xl border border-[#E5E1D8] bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#343230]">عالية (High)</span>
                    <p className="text-[11px] text-[#7D786E]">فتيات ويافعون (10 - 18 سنة)، نضارة وحيوية مشرقة</p>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                    يافعين وبنات
                  </span>
                </div>

                <div className="p-3 rounded-2xl border border-[#E5E1D8] bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#343230]">متوسطة (Medium - الخيار الذهبي)</span>
                    <p className="text-[11px] text-[#7D786E]">الطبقة الطبيعية المتوازنة للحوارات اليومية وسن 20 - 45</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                    طبيعي ومريح
                  </span>
                </div>

                <div className="p-3 rounded-2xl border border-[#E5E1D8] bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#343230]">عميقة / رصينة (Deep)</span>
                    <p className="text-[11px] text-[#7D786E]">نبرة رجولية وقورة، ثقة وهدوء ورنين صدري فخم</p>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    هيبة ورجولة
                  </span>
                </div>

                <div className="p-3 rounded-2xl border border-[#E5E1D8] bg-white flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#343230]">قرار عميق جداً (Very Deep - Bass)</span>
                    <p className="text-[11px] text-[#7D786E]">شيوخ مسنون، أئمة وقورون، هيبة السنين وتجارب العمر</p>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                    مسنين وكهول
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESONANCE CHAMBERS */}
          {activeTab === 'resonance' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#7F5539]/10 border border-[#7F5539]/20 text-xs text-[#7F5539] space-y-1 leading-relaxed">
                <span className="font-bold block text-[#343230]">غرف الرنين (أين يتضخم الصوت في جسم الإنسان؟)</span>
                <p>
                  الصوت الذي تولده الأحبال ضعيف بمفرده؛ لكنه يكتسب شخصيته عبر "التجويف" الذي يتضخم فيه داخل
                  الجسم قبل أن يخرج من الفم.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-1.5">
                  <h5 className="font-bold text-xs text-[#343230]">1. رنين صدري (Chest Resonance)</h5>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    يتضخم في القفص الصدري. يعطي تردداً منخفضاً وفخامة ودفئاً كبيراً وأماناً. (مثالي للإذاعة،
                    والأب، والمسن).
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-1.5">
                  <h5 className="font-bold text-xs text-[#343230]">2. رنين رأسي (Head Resonance)</h5>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    يتضخم في تجاويف الجمجمة العلوية. يعطي نعومة، رقة، براءة وخفة. (مثالي للأطفال والهمسات
                    والفتيات).
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-1.5">
                  <h5 className="font-bold text-xs text-[#343230]">3. رنين حنجري / بلعومي (Throat)</h5>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    إسقاط مباشر من الحنجرة. يعطي نفاذاً ووضوحاً مسرحياً وقدرة على الوصول لأبعد مسافة دون صراخ.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[#E5E1D8] bg-white space-y-1.5">
                  <h5 className="font-bold text-xs text-[#343230]">4. رنين أنفي شعبي (Nasal Twang)</h5>
                  <p className="text-[11px] text-[#7D786E] leading-relaxed">
                    خنة خفيفة محببة في أعلى الأنف. تمنح الروح الشعبية العفوية الحارة للشارع المصري والحديث العفوي
                    المرح.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E1D8] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-[11px] text-[#7D786E]">
            {isRtl ? '💡 نصيحة: اختر وصفة جاهزة وسيقوم الاستوديو بضبط الباقي لك' : 'Tip: Use instant recipes to bypass manual tuning'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#EDE9E1] hover:bg-[#DCD7CC] text-[#343230] text-xs font-bold transition-colors cursor-pointer"
          >
            {isRtl ? 'إغلاق المرشد' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
