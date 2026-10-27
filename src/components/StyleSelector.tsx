import React, { useState, useMemo } from 'react';
import {
  EmotionCategory,
  EmotionIntensity,
  EmotionLevel,
  DramaticDeliveryStyle,
} from '../types';
import { EMOTIONS } from '../emotions';
import {
  Sparkles,
  Flame,
  ShieldAlert,
  Award,
  Angry,
  AlertTriangle,
  HeartHandshake,
  HeartCrack,
  MessageSquareHeart,
  MessageSquare,
  Zap,
  Smile,
  Laugh,
  Layers,
  Volume2,
  Theater,
  BookOpen,
  Film,
  Radio,
  ShieldCheck,
  Check,
  Megaphone,
  Search,
  Compass,
  Feather,
  VolumeX,
  HelpCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export interface DramaticStyleArchetype {
  id: DramaticDeliveryStyle;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  suggestedEmotionId: string;
  suggestedIntensity: EmotionIntensity;
  icon: React.ReactNode;
}

export const DRAMATIC_STYLES: DramaticStyleArchetype[] = [
  {
    id: 'theatrical_drama',
    name: 'Theatrical Drama',
    arabicName: 'تمثيل مسرحي درامي',
    description: 'Deep emotional expression, passionate dialogue, rich theatrical presence',
    arabicDescription: 'أداء درامي عميق ومؤثر، مشاعر دافقة ووقفات معبرة',
    suggestedEmotionId: 'astonished',
    suggestedIntensity: 'high',
    icon: <Theater className="w-3.5 h-3.5" />,
  },
  {
    id: 'casual_talk',
    name: 'Natural Conversation',
    arabicName: 'حوار واقعي عفوي',
    description: '100% natural, effortless Egyptian conversation with zero theatrical excess',
    arabicDescription: 'حديث يومي تلقائي طبيعي 100% بدون تكلف أو مبالغة تمثيلية',
    suggestedEmotionId: 'casual_conversation',
    suggestedIntensity: 'medium',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
  },
  {
    id: 'cinematic_whisper',
    name: 'Cinematic Realism',
    arabicName: 'سينمائي واقعي هامس',
    description: 'Intimate close-mic delivery, nuanced breathy articulation, subtle film dialogue',
    arabicDescription: 'واقعية سينمائية مقربة، همس حميمي وإحساس نفسي عميق بلا افتعال',
    suggestedEmotionId: 'serenity_peace',
    suggestedIntensity: 'low',
    icon: <Film className="w-3.5 h-3.5" />,
  },
  {
    id: 'storytelling',
    name: 'Children Storyteller',
    arabicName: 'قصص وحكايات أطفال',
    description: 'Warm, engaging, gentle narration full of wonder and curiosity',
    arabicDescription: 'نبرة حكواتي دافئة ومشوقة تجذب انتباه الأطفال بالبراءة والتشويق',
    suggestedEmotionId: 'hope_enthusiasm',
    suggestedIntensity: 'medium',
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: 'animation_dub',
    name: 'Cartoon & Dubbing',
    arabicName: 'دبلجة ورسوم متحركة',
    description: 'Vibrant, animated, colorful and dynamic character acting',
    arabicDescription: 'تلوين صوتي كرتوني مرح، طاقة حركية وحضور شخصية مرحة مفعمة بالحيوية',
    suggestedEmotionId: 'child_squabble',
    suggestedIntensity: 'high',
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  {
    id: 'documentary',
    name: 'Documentary Narration',
    arabicName: 'وثائقي ورصين',
    description: 'Prestigious, measured, calm, authoritative Egyptian delivery',
    arabicDescription: 'إلقاء وقور، هادئ ومتزن بتركيز عالٍ وهيبة السرد الوثائقي',
    suggestedEmotionId: 'natural_neutral',
    suggestedIntensity: 'low',
    icon: <Radio className="w-3.5 h-3.5" />,
  },
  {
    id: 'comedy_wit',
    name: 'Egyptian Comedy & Wit',
    arabicName: 'كوميديا وسخرية مصرية',
    description: 'Authentic quick-witted Egyptian sarcasm, playful tone & banter',
    arabicDescription: 'خفة دم مصرية أصيلة، مقتضبة، لماحة ومشاكسة بطابع كوميدي محبب',
    suggestedEmotionId: 'sarcasm',
    suggestedIntensity: 'medium',
    icon: <Laugh className="w-3.5 h-3.5" />,
  },
  {
    id: 'introspective_soliloquy',
    name: 'Introspective Soliloquy',
    arabicName: 'مونولوج وتأمل نفسي',
    description: 'Deep internal monologue, vulnerable contemplation, intimate soul-searching',
    arabicDescription: 'بوح داخلي هادئ، حديث النفس بصدق وشجن وتأمل وجداني عميق',
    suggestedEmotionId: 'sorrow',
    suggestedIntensity: 'low',
    icon: <HeartCrack className="w-3.5 h-3.5" />,
  },
  {
    id: 'commercial_promo',
    name: 'Commercial & Promo',
    arabicName: 'إعلاني وحماسي ترويجي',
    description: 'Punchy, persuasive, bright and energetic commercial delivery',
    arabicDescription: 'نبرة إعلانية حماسية وجاذبة للانتباه، إيقاع سريع وواثق ومقنع',
    suggestedEmotionId: 'joy',
    suggestedIntensity: 'high',
    icon: <Megaphone className="w-3.5 h-3.5" />,
  },
  {
    id: 'epic_heroic',
    name: 'Epic & Heroic History',
    arabicName: 'ملحمي وبطولي تاريخي',
    description: 'Majestic grandeur, commanding diaphragmatic projection, historic courage',
    arabicDescription: 'أداء بطولي جهوري، فخامة لغوية وهيبة المعارك والشجاعة النبيلة',
    suggestedEmotionId: 'pride_dignity',
    suggestedIntensity: 'high',
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  {
    id: 'folk_hakawati',
    name: 'Folk Baladi Storyteller',
    arabicName: 'حكواتي شعبي وموال بلدي',
    description: 'Traditional Egyptian folk narrative, Baladi charm, warmth of the alleyway',
    arabicDescription: 'سيرة شعبية ونغمات ابن البلد، دفء المصاطب والمقاهي والأمثال الشعبية',
    suggestedEmotionId: 'chivalry_gallantry',
    suggestedIntensity: 'medium',
    icon: <Compass className="w-3.5 h-3.5" />,
  },
  {
    id: 'investigative_noir',
    name: 'Investigative & Forensic Noir',
    arabicName: 'تحقيقي استقصائي بوليسي',
    description: 'Forensic suspense, analytical focus, watchful deduction, mysterious tension',
    arabicDescription: 'سرد جنائي متوتر، تحليل الأدلة بريبة وتركيز شارد ونبرة استقصائية',
    suggestedEmotionId: 'suspicion',
    suggestedIntensity: 'medium',
    icon: <Search className="w-3.5 h-3.5" />,
  },
  {
    id: 'horror_thriller',
    name: 'Psychological Thriller',
    arabicName: 'رعب وغموض نفسي',
    description: 'Eerie suspense, hair-raising dread, dark whispers, tense psychological chills',
    arabicDescription: 'نبرات متهدجة تثير القشعريرة، همسات مشحونة بالترقب وكوابيس الظلام',
    suggestedEmotionId: 'suspense_mystery',
    suggestedIntensity: 'high',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  {
    id: 'poetic_romantic',
    name: 'Poetic & Romantic Recitation',
    arabicName: 'شعر وأدب وجداني راقٍ',
    description: 'Lyrical cadence, tender soulful phrasing, passionate romantic reverence',
    arabicDescription: 'إلقاء شعري فصيح ورومانسي دافئ، تنغيم موسيقي للمفردات ومشاعر مرهفة',
    suggestedEmotionId: 'tenderness',
    suggestedIntensity: 'medium',
    icon: <Feather className="w-3.5 h-3.5" />,
  },
  {
    id: 'modern_podcast',
    name: 'Modern Podcast & Deep Talk',
    arabicName: 'بودكاست حواري معاصر',
    description: 'Engaging intellectual warmth, conversational curiosity, polished studio clarity',
    arabicDescription: 'حوار فكري متعمق، نبرة مقربة ومريحة تجمع بين المعرفة والألفة والذكاء',
    suggestedEmotionId: 'casual_conversation',
    suggestedIntensity: 'medium',
    icon: <Radio className="w-3.5 h-3.5" />,
  },
  {
    id: 'melodramatic_telenovela',
    name: 'Passionate Melodrama',
    arabicName: 'ميلودراما ودوبلاج عاطفي',
    description: 'Heightened emotional stakes, passionate declarations, tearful dramatic intensity',
    arabicDescription: 'مشاعر فياضة ومبالغات درامية حادة للشخصيات العاطفية المكلومة',
    suggestedEmotionId: 'grief_weeping',
    suggestedIntensity: 'high',
    icon: <HeartCrack className="w-3.5 h-3.5" />,
  },
];

interface StyleSelectorProps {
  deliveryStyle?: DramaticDeliveryStyle;
  onSelectDeliveryStyle: (style: DramaticDeliveryStyle) => void;
  selectedEmotionId: string;
  selectedIntensity: EmotionIntensity;
  onSelectEmotion: (emotionId: string) => void;
  onSelectIntensity: (intensity: EmotionIntensity) => void;
  isRtl: boolean;
}

type EmotionFilterCategory =
  | 'all'
  | 'joy_hope'
  | 'sorrow_grief'
  | 'tension_anger'
  | 'relations_social'
  | 'ego_scheming'
  | 'natural_daily';

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  deliveryStyle = 'theatrical_drama',
  onSelectDeliveryStyle,
  selectedEmotionId,
  selectedIntensity,
  onSelectEmotion,
  onSelectIntensity,
  isRtl,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<EmotionFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeEmotion =
    EMOTIONS.find((e) => e.id === selectedEmotionId) || EMOTIONS[0];
  const activeLevel: EmotionLevel =
    activeEmotion.levels[selectedIntensity] || activeEmotion.levels.medium;
  const activeArchetype =
    DRAMATIC_STYLES.find((s) => s.id === deliveryStyle) || DRAMATIC_STYLES[0];

  const getEmotionIcon = (iconName: string, className: string = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Angry':
        return <Angry className={className} />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'HeartCrack':
        return <HeartCrack className={className} />;
      case 'MessageSquareHeart':
        return <MessageSquareHeart className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Smile':
        return <Smile className={className} />;
      case 'Laugh':
        return <Laugh className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      case 'VolumeX':
        return <VolumeX className={className} />;
      default:
        return <Smile className={className} />;
    }
  };

  const emotionFilterCategories: { id: EmotionFilterCategory; label: string; arabicLabel: string }[] = [
    { id: 'all', label: `All (${EMOTIONS.length})`, arabicLabel: `الكل (${EMOTIONS.length})` },
    { id: 'joy_hope', label: 'Joy & Hope', arabicLabel: 'بهجة وأمل' },
    { id: 'sorrow_grief', label: 'Sorrow & Grief', arabicLabel: 'شجن وألم' },
    { id: 'tension_anger', label: 'Tension & Anger', arabicLabel: 'توتر وغضب' },
    { id: 'relations_social', label: 'Warmth & Bonds', arabicLabel: 'علاقات ومشاعر' },
    { id: 'ego_scheming', label: 'Pride & Schemes', arabicLabel: 'هيبة ومكر' },
    { id: 'natural_daily', label: 'Daily & Calm', arabicLabel: 'حوار وعفوي' },
  ];

  const filteredEmotions = useMemo(() => {
    return EMOTIONS.filter((emotion) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          emotion.arabicLabel.toLowerCase().includes(q) ||
          emotion.arabicShortLabel.toLowerCase().includes(q) ||
          emotion.label.toLowerCase().includes(q) ||
          emotion.arabicDescription.toLowerCase().includes(q) ||
          emotion.description.toLowerCase().includes(q);
        if (!matchesName) return false;
      }

      // 2. Category Filter
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'joy_hope') {
        return ['joy', 'hope_enthusiasm', 'playful', 'relief', 'serenity_peace', 'astonished'].includes(emotion.id);
      }
      if (selectedFilter === 'sorrow_grief') {
        return ['sorrow', 'heartbroken', 'grief_weeping', 'gentle_reproach', 'remorse_guilt', 'nostalgia'].includes(emotion.id);
      }
      if (selectedFilter === 'tension_anger') {
        return ['agitation_anger', 'rage', 'panic_terror', 'suspicion', 'suspense_mystery', 'defensive'].includes(emotion.id);
      }
      if (selectedFilter === 'relations_social') {
        return ['tenderness', 'chivalry_gallantry', 'pleading', 'shyness_modesty', 'sarcasm'].includes(emotion.id);
      }
      if (selectedFilter === 'ego_scheming') {
        return ['pride_dignity', 'condescending', 'contempt_scorn', 'conspiracy_cunning', 'child_squabble'].includes(emotion.id);
      }
      if (selectedFilter === 'natural_daily') {
        return ['casual_conversation', 'natural_neutral', 'confusion_perplexed'].includes(emotion.id);
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  const intensityKeys: EmotionIntensity[] = ['low', 'medium', 'high'];

  const handleArchetypeClick = (archetype: DramaticStyleArchetype) => {
    onSelectDeliveryStyle(archetype.id);
  };

  return (
    <div className="space-y-4">
      {/* 1. Primary Style Selection: الأنماط التمثيلية الكبرى (مفكوكة الارتباط بالكامل - 16 نمطاً) */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-[#43413E] flex items-center gap-1.5">
              <Theater className="w-4 h-4 text-[#C86446]" />
              <span>{isRtl ? 'نمط الأداء والتمثيل الصوتي' : 'Dramatic Performance Style'}</span>
            </label>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {isRtl ? `16 نمطاً درامياً وسينمائياً` : '16 Acting Styles'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#7D786E]">
              {isRtl ? 'النمط المختار:' : 'Selected Style:'}{' '}
              <strong className="text-[#343230]">
                {isRtl ? activeArchetype.arabicName : activeArchetype.name}
              </strong>
            </span>
          </div>
        </div>

        {/* Archetype Cards Grid (16 styles in a modern responsive layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {DRAMATIC_STYLES.map((st) => {
            const isArchetypeActive = deliveryStyle === st.id;

            return (
              <button
                key={st.id}
                type="button"
                id={`style-archetype-${st.id}`}
                onClick={() => handleArchetypeClick(st)}
                title={`${isRtl ? st.arabicName : st.name}: ${isRtl ? st.arabicDescription : st.description}`}
                className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                  isArchetypeActive
                    ? 'bg-[#C86446] text-white border-[#C86446] shadow-sm ring-2 ring-[#C86446]/25'
                    : 'bg-white/90 text-[#43413E] border-[#E5E1D8] hover:border-[#DCD7CC] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`p-1.5 rounded-lg ${
                      isArchetypeActive ? 'bg-white/20 text-white' : 'bg-[#EDE9E1] text-[#C86446]'
                    }`}
                  >
                    {st.icon}
                  </span>
                  {isArchetypeActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                      ✓ {isRtl ? 'مُفعّل' : 'Active'}
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-bold text-xs leading-tight">
                    {isRtl ? st.arabicName : st.name}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 line-clamp-2 leading-tight ${
                      isArchetypeActive ? 'text-white/80' : 'text-[#7D786E]'
                    }`}
                  >
                    {isRtl ? st.arabicDescription : st.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Emotion Inflections Grid (31 Comprehensive Emotions) */}
      <div className="space-y-2.5 pt-3 border-t border-[#E5E1D8]/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#43413E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6B705C]" />
              <span>{isRtl ? 'التخصيص الدقيق للانفعال والنبرة الشعورية:' : 'Fine-Tune Emotional Inflection:'}</span>
            </label>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isRtl ? `31 نبرة شعورية متكاملة` : '31 Nuanced Emotions'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>
                {isRtl
                  ? 'نقاء النبرة: ضبط النبرة بدون أصوات عشوائية'
                  : 'Acoustic Purity'}
              </span>
            </span>
            <span className="text-[11px] text-[#7D786E] font-medium">
              {isRtl
                ? `المختار: ${activeEmotion.arabicShortLabel}`
                : `Selected: ${activeEmotion.label}`}
            </span>
          </div>
        </div>

        {/* Emotion Category Filter Tabs & Quick Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF8F5] p-2 rounded-xl border border-[#E5E1D8]">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {emotionFilterCategories.map((cat) => {
              const isCatActive = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isCatActive
                      ? 'bg-[#6B705C] text-white shadow-xs'
                      : 'bg-white/80 text-[#5B604C] hover:bg-white hover:text-[#343230] border border-[#E5E1D8]'
                  }`}
                >
                  {isRtl ? cat.arabicLabel : cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-[#7D786E] absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'بحث في النبرات...' : 'Search emotions...'}
              className="w-full ps-8 pe-2.5 py-1 text-xs bg-white rounded-lg border border-[#E5E1D8] focus:border-[#6B705C] focus:outline-none text-[#43413E]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-2 top-1/2 -translate-y-1/2 text-xs text-[#7D786E] hover:text-[#43413E]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filtered Emotions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-[360px] overflow-y-auto p-1 pr-1.5 rounded-xl border border-[#E5E1D8]/60 bg-white/40">
          {filteredEmotions.map((emotion) => {
            const isSelected = selectedEmotionId === emotion.id;
            return (
              <button
                key={emotion.id}
                id={`emotion-btn-${emotion.id}`}
                type="button"
                onClick={() => onSelectEmotion(emotion.id)}
                className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#6B705C] text-white border-[#6B705C] shadow-sm ring-2 ring-[#6B705C]/20'
                    : 'bg-white/90 text-[#43413E] border-[#E5E1D8] hover:border-[#DCD7CC] hover:bg-[#EDE9E1]/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`p-1 rounded-lg ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#EDE9E1] text-[#6B705C]'
                    }`}
                  >
                    {getEmotionIcon(emotion.iconName, 'w-3 h-3')}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                      {selectedIntensity === 'low'
                        ? isRtl
                          ? 'مستوى 1'
                          : 'Lvl 1'
                        : selectedIntensity === 'medium'
                        ? isRtl
                          ? 'مستوى 2'
                          : 'Lvl 2'
                        : isRtl
                        ? 'مستوى 3'
                        : 'Lvl 3'}
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-bold text-xs leading-tight">
                    {isRtl ? emotion.arabicShortLabel : emotion.label}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-white/80' : 'text-[#7D786E]'
                    }`}
                  >
                    {isRtl ? emotion.arabicDescription : emotion.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Emotional Intensity Levels (3 Levels) */}
      <div className="bg-[#FAF8F5] border border-[#E5E1D8] rounded-2xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#6B705C]" />
            <span className="text-xs font-bold text-[#43413E]">
              {isRtl
                ? `درجة شدة نبرة "${activeEmotion.arabicShortLabel}":`
                : `Intensity Level for "${activeEmotion.label}":`}
            </span>
          </div>
          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 font-bold">
            {isRtl
              ? '💡 «هادئ» أو «متوسط» يحافظ على نبرة الصوت بثبات كامل'
              : '💡 Low or Medium keeps voice 100% stable'}
          </span>
        </div>

        {/* The 3 Levels Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {intensityKeys.map((key, index) => {
            const levelObj = activeEmotion.levels[key];
            const isLevelActive = selectedIntensity === key;
            const isRecommended = key === 'low' || key === 'medium';
            return (
              <button
                key={key}
                type="button"
                id={`intensity-btn-${key}`}
                onClick={() => onSelectIntensity(key)}
                className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                  isLevelActive
                    ? 'bg-white text-[#43413E] border-[#6B705C] ring-2 ring-[#6B705C]/30 shadow-xs'
                    : 'bg-white/50 text-[#7D786E] border-transparent hover:bg-white hover:border-[#DCD7CC]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      isLevelActive
                        ? 'bg-[#6B705C] text-white'
                        : 'bg-[#EDE9E1] text-[#7D786E]'
                    }`}
                  >
                    {isRtl ? `المستوى ${index + 1}` : `Level ${index + 1}`}
                  </span>
                  {isRecommended && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {isRtl ? 'ثبات ممتاز' : 'Stable'}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#43413E]">
                    {isRtl ? levelObj.arabicLabel : levelObj.label}
                  </span>
                </div>
                <div className="text-[11px] text-[#7D786E] line-clamp-1 leading-snug">
                  {isRtl ? levelObj.arabicDescription : levelObj.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Decoupled Synthesis Summary Bar */}
        <div className="pt-2 border-t border-[#DCD7CC]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#5B604C]">
          <div className="flex items-center gap-2 flex-wrap">
            <Volume2 className="w-3.5 h-3.5 text-[#C86446] shrink-0" />
            <span className="font-semibold text-[#43413E]">
              {isRtl ? 'خلاصة التوليفة التمثيلية المعتمدة:' : 'Active Performance Synthesis:'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#C86446]/10 text-[#C86446] font-bold">
              {isRtl ? `النمط: ${activeArchetype.arabicName}` : `Style: ${activeArchetype.name}`}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#6B705C]/10 text-[#6B705C] font-bold">
              {isRtl ? `الانفعال: ${activeEmotion.arabicShortLabel}` : `Emotion: ${activeEmotion.label}`}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-[#DCD7CC] font-medium text-[#7D786E]">
              {isRtl ? `الشدة: ${activeLevel.arabicLabel}` : `Intensity: ${activeLevel.label}`}
            </span>
          </div>

          <span className="text-[10px] text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60 font-semibold self-start sm:self-auto">
            {isRtl ? '✓ كلاهما مدمج في التوجيه الدرامي بنقاء' : '✓ Seamlessly combined in prompt'}
          </span>
        </div>
      </div>
    </div>
  );
};
