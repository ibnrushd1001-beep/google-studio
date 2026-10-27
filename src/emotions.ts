import { EmotionCategory } from './types';

export const EMOTIONS: EmotionCategory[] = [
  // ==========================================
  // 1. JOY & RADIANT CELEBRATION (فرح وبهجة عارمة)
  // ==========================================
  {
    id: 'joy',
    label: 'Joy & Radiant Happiness',
    arabicLabel: 'فرح وبهجة عارمة (سعادة واحتفال)',
    arabicShortLabel: 'فرح وبهجة',
    iconName: 'Smile',
    description: 'Radiant happiness, celebratory warmth, smiling tone filled with elation',
    arabicDescription: 'نبرة تفيض بهجة وسروراً عارماً وابتسامة مسموعة في الصوت واحتفالاً بالحياة',
    levels: {
      low: {
        level: 'low',
        label: 'Gentle Gladness',
        arabicLabel: 'خفيف (بشاشة وسرور هادئ)',
        promptPrefix:
          'Speak with gentle joyful warmth, pleasant gladness and an affectionate smiling tone in the cadence',
        description: 'Soft joyful satisfaction and warm smiling tone',
        arabicDescription: 'بشاشة وجه وسرور هادئ وابتسامة مريحة في الصوت',
      },
      medium: {
        level: 'medium',
        label: 'Radiant Joy',
        arabicLabel: 'متوسط (فرحة مشرقة وغامرة)',
        promptPrefix:
          'Speak with radiant joy, vibrant upbeat melody, delightful enthusiasm and sparkling happy inflection',
        description: 'Audible bright happiness, energetic smile and delight',
        arabicDescription: 'فرحة واضحة ومشرقة، نغمة مبهجة وسعادة دافقة تسر السامع',
      },
      high: {
        level: 'high',
        label: 'Ecstatic Celebration',
        arabicLabel: 'حاد / قوي (فرحة هستيرية واحتفال)',
        promptPrefix:
          'Speak with explosive ecstatic joy, celebratory exhilaration, triumphant laughter in the cadence and unbounded happiness',
        description: 'Uncontainable ecstatic bliss and triumphant exhilaration',
        arabicDescription: 'فرحة عارمة واحتفال جارف وتهليل مفعم بالنشوة والانتصار',
      },
    },
  },

  // ==========================================
  // 2. HOPE & ENTHUSIASM (أمل وحماس)
  // ==========================================
  {
    id: 'hope_enthusiasm',
    label: 'Hope & Enthusiasm',
    arabicLabel: 'أمل وحماس متقد',
    arabicShortLabel: 'أمل وحماس',
    iconName: 'Flame',
    description: 'Tone radiant with optimism, energetic passion and spirited hope',
    arabicDescription: 'نبرة متفائلة تشع أملاً وحيوية وطاقة متقدة وعزيمة مقبلة على الحياة',
    levels: {
      low: {
        level: 'low',
        label: 'Gentle Hope',
        arabicLabel: 'هادئ (تفاؤل دافئ مطمئن)',
        promptPrefix:
          'Speak with gentle, calm hopefulness and warm, optimistic reassurance',
        description: 'Warm quiet optimism and serene hope',
        arabicDescription: 'أمل هادئ وتفاؤل دافئ مطمئن يبعث على الراحة',
      },
      medium: {
        level: 'medium',
        label: 'Spirited & Eager',
        arabicLabel: 'متوسط (حماس وشغف متدفق)',
        promptPrefix:
          'Speak with lively enthusiasm and bright optimistic energy, eager and spirited',
        description: 'Upbeat eagerness and inspiring hope',
        arabicDescription: 'حماس متقد ونبرة محفزة مليئة بالشغف والتطلع للأفضل',
      },
      high: {
        level: 'high',
        label: 'Blazing Passion',
        arabicLabel: 'حاد / قوي (شغف ناري وحماس جارف)',
        promptPrefix:
          'Speak with explosive excitement, passionate hope and vibrant electric energy, triumphantly ecstatic',
        description: 'Uncontainable excitement and passionate zeal',
        arabicDescription: 'طاقة نارية وانفجار حماس واحتفال جارف بالأمل والإنجاز',
      },
    },
  },

  // ==========================================
  // 3. DEEP SORROW & MELANCHOLY (شجن وحزن عميق)
  // ==========================================
  {
    id: 'sorrow',
    label: 'Deep Sorrow & Melancholy',
    arabicLabel: 'شجن وحزن عميق (ألم نبيل ومواساة)',
    arabicShortLabel: 'شجن وحزن',
    iconName: 'HeartCrack',
    description: 'Poignant melancholy, heavy heartfelt sadness and noble emotional ache',
    arabicDescription: 'نبرة حزينة محملة بالشجن والأسى الإنساني النبيل وصدق المواساة',
    levels: {
      low: {
        level: 'low',
        label: 'Subtle Melancholy',
        arabicLabel: 'خفيف (شجن هادئ وخاطر مكسور)',
        promptPrefix:
          'Speak with quiet, gentle melancholy, subdued sorrow and a tender aching cadence',
        description: 'Soft wistful sadness and subdued heartache',
        arabicDescription: 'شجن رقيق وحزن هادئ يمس شغاف القلب بلا صخب',
      },
      medium: {
        level: 'medium',
        label: 'Deep Heartfelt Grief',
        arabicLabel: 'متوسط (أسى عميق وحزن ملموس)',
        promptPrefix:
          'Speak with deep soulful sorrow, heavy emotional weight, measured mournful pacing and poignant ache',
        description: 'Profound sadness and solemn emotional gravity',
        arabicDescription: 'حزن عميق ووزن عاطفي ثقيل ونبرة تنضح بالألم والتأثر',
      },
      high: {
        level: 'high',
        label: 'Aching Anguish',
        arabicLabel: 'قوي / حاد (مرارة الفقد والأسى الجارف)',
        promptPrefix:
          'Speak with agonizing sorrow and profound heartbreak, heavy mournful cadence vibrating with suppressed tears and sorrowful gravity',
        description: 'Crushing grief and deeply resonant emotional ache',
        arabicDescription: 'مرارة الفقد وأسى مبرح يثقل الكلمات ويهز الوجدان',
      },
    },
  },

  // ==========================================
  // 4. HEARTBROKEN & CRUSHED (انكسار وخيبة)
  // ==========================================
  {
    id: 'heartbroken',
    label: 'Heartbroken & Defeated',
    arabicLabel: 'انكسار وخيبة (كسرة نفس وخذلان)',
    arabicShortLabel: 'انكسار وخيبة',
    iconName: 'HeartCrack',
    description: 'Tone crushed by defeat, betrayal, disillusionment or heartbreak',
    arabicDescription: 'نبرة مكسورة ومحطمة بالخذلان أو الهزيمة أو خيبة الأمل القاسية',
    levels: {
      low: {
        level: 'low',
        label: 'Muted Disappointment',
        arabicLabel: 'خفيف (خيبة أمل صامتة)',
        promptPrefix:
          'Speak with quiet, subdued disappointment, solemn sorrow and sad resignation',
        description: 'Subdued sorrow and disappointed resignation',
        arabicDescription: 'خيبة أمل مكتومة وتسليم حزين بالواقع',
      },
      medium: {
        level: 'medium',
        label: 'Crushed Sorrow',
        arabicLabel: 'متوسط (انكسار وأسى ملموس)',
        promptPrefix:
          'Speak in a defeated, emotionally crushed tone, voice weighed down by deep hurt and sorrow',
        description: 'Defeated sadness and emotional hurt',
        arabicDescription: 'انكسار واضح وشعور بالهزيمة والأسى والخذلان',
      },
      high: {
        level: 'high',
        label: 'Shattered Tears',
        arabicLabel: 'قوي (انهيار وكسرة قلب)',
        promptPrefix:
          'Speak in a deeply shattered, heartbroken tone, voice trembling on the verge of tears with unbearable grief',
        description: 'Tear-soaked anguish and shattered despair',
        arabicDescription: 'كسرة قلب تامة وانهيار عاطفي وصوت يرتجف من البكاء',
      },
    },
  },

  // ==========================================
  // 5. WEEPING & TEARFUL SOBS (تأثر وبكاء مخنوق)
  // ==========================================
  {
    id: 'grief_weeping',
    label: 'Tearful Weeping & Choked Sob',
    arabicLabel: 'تأثر وبكاء مخنوق (غصة ودموع)',
    arabicShortLabel: 'بكاء وتأثر',
    iconName: 'HeartCrack',
    description: 'Choked vocal tract, holding back weeping, trembling emotional fragility',
    arabicDescription: 'نبرة متهدجة تفيض بالدموع، غصة في الحلق ورجفة بكاء صادقة',
    levels: {
      low: {
        level: 'low',
        label: 'Holding Back Tears',
        arabicLabel: 'خفيف (غصة وكتمان دمعة)',
        promptPrefix:
          'Speak with a slight tremble in the voice, holding back tears with a tight swallowed throat cadence',
        description: 'Subtle throat tightness fighting tears',
        arabicDescription: 'ابتلاع ريق وغصة حلقية خفيفة تحبس الدمع وتغالب البكاء',
      },
      medium: {
        level: 'medium',
        label: 'Choked Emotional Weeping',
        arabicLabel: 'متوسط (بكاء متقطع متأثر)',
        promptPrefix:
          'Speak with audible choked vulnerability, quavering pitch, tearful cadence and sincere grief',
        description: 'Audible tearfulness and broken fragile tone',
        arabicDescription: 'صوت مخنوق بالدموع ونبرة منكسرة تفيض بالمشاعر الصادقة',
      },
      high: {
        level: 'high',
        label: 'Heartrending Weep',
        arabicLabel: 'قوي / حاد (نحيب متفجع مؤثر)',
        promptPrefix:
          'Speak with profound tearful anguish, trembling fragile pitch, heartbroken quivering delivery and desperate weeping weight',
        description: 'Deeply moving sob-filled vocal texture and despair',
        arabicDescription: 'نحيب متفجع وصوت متهدج يرتجف تحت وطأة الحزن الباكي',
      },
    },
  },

  // ==========================================
  // 6. TENDERNESS & COMPASSION (حنان وعطف ودفء)
  // ==========================================
  {
    id: 'tenderness',
    label: 'Tenderness & Compassion',
    arabicLabel: 'حنان وعطف (أمومة وأبوة ودفء إنساني)',
    arabicShortLabel: 'حنان وعطف',
    iconName: 'HeartHandshake',
    description: 'Infinite warmth, maternal/paternal tenderness, protective loving care',
    arabicDescription: 'دفء إنساني غامر، نبرة حنونة كعطف الأم أو الأب، مشاعر رعاية وحب خالص',
    levels: {
      low: {
        level: 'low',
        label: 'Gentle Warmth',
        arabicLabel: 'هادئ (مودة ورقة لطيفة)',
        promptPrefix:
          'Speak with soft, soothing tenderness, gentle care and compassionate vocal warmth',
        description: 'Soft comforting warmth and care',
        arabicDescription: 'رقة هادئة ومودة ناعمة تريح السامع وتهدئ روعه',
      },
      medium: {
        level: 'medium',
        label: 'Loving Care',
        arabicLabel: 'متوسط (حنان فياض واحتواء)',
        promptPrefix:
          'Speak with deeply affectionate tenderness, nurturing empathy, warm embrace in the cadence and protective love',
        description: 'Deeply nurturing, protective and affectionate',
        arabicDescription: 'حنان فياض ونبرة احتواء واطمئنان تشبه عناق الأهل',
      },
      high: {
        level: 'high',
        label: 'Soulful Devotion',
        arabicLabel: 'عميق (عاطفة أبوية/أمومية مقدسة)',
        promptPrefix:
          'Speak with profound, boundless maternal or paternal tenderness, heartfelt devotion, soothing every fear with touching love',
        description: 'Boundless sacrificial devotion and profound tenderness',
        arabicDescription: 'عاطفة أبوية أو أمومية مقدسة تفيض إخلاصاً وحنواً لا حد له',
      },
    },
  },

  // ==========================================
  // 7. SARCASM & PLAYFUL IRONY (سخرية وتهكم لاذع)
  // ==========================================
  {
    id: 'sarcasm',
    label: 'Egyptian Sarcasm & Mockery',
    arabicLabel: 'سخرية وتهكم (مشاكسة لاذعة وذكية)',
    arabicShortLabel: 'سخرية وتهكم',
    iconName: 'Laugh',
    description: 'Iconic Egyptian wit, sharp playful sarcasm, ironic eyebrow-raising delivery',
    arabicDescription: 'خفة دم مصرية لماحة، تهكم ذكي ولاذع ونبرة ساخرة تكشف التناقض بذكاء',
    levels: {
      low: {
        level: 'low',
        label: 'Playful Banter',
        arabicLabel: 'خفيف (مشاكسة وملاوعة لطيفة)',
        promptPrefix:
          'Speak with light playful Egyptian teasing, mild ironic smirk in the tone, and humorous colloquial charm',
        description: 'Mild witty teasing and smirk',
        arabicDescription: 'مشاكسة خفيفة وظريفة بطابع مصري محبب وملاوعة ذكية',
      },
      medium: {
        level: 'medium',
        label: 'Biting Irony',
        arabicLabel: 'متوسط (سخرية لاذعة واضحة)',
        promptPrefix:
          'Speak with sharp, unmistakable Egyptian sarcasm, clever ironic cadence, mocking inflections and biting wit',
        description: 'Clear sarcastic bite and ironic skepticism',
        arabicDescription: 'سخرية مصرية صريحة وتهكم لاذع يظهر التناقض بذكاء ودعابة',
      },
      high: {
        level: 'high',
        label: 'Cutting Mockery',
        arabicLabel: 'حاد (تهكم جارح ولاذع جداً)',
        promptPrefix:
          'Speak with cutting, unapologetic Egyptian theatrical mockery, sardonic taunting rhythm, and devastating ironic scorn',
        description: 'Cutting scornful ridicule and razor-sharp sarcasm',
        arabicDescription: 'تهكم قاسٍ ولاذع جداً واستخفاف ساخر يكسر كل الحواجز',
      },
    },
  },

  // ==========================================
  // 8. PLAYFUL & MISCHIEVOUS (مرح ودعابة)
  // ==========================================
  {
    id: 'playful',
    label: 'Playful & Mischievous Banter',
    arabicLabel: 'مرح ودعابة (مشاكسة وخفة دم)',
    arabicShortLabel: 'مرح ودعابة',
    iconName: 'Smile',
    description: 'High-spirited mischief, bouncy rhythm, spontaneous laughter and fun',
    arabicDescription: 'روح مرحة مشاغبة، إيقاع نطاط وعفوي وضحكات خفية بين الكلمات',
    levels: {
      low: {
        level: 'low',
        label: 'Subtle Playfulness',
        arabicLabel: 'هادئ (مرح لطيف وبسمة)',
        promptPrefix:
          'Speak with subtle playful mischief, a light bounce in the cadence, and cheerful good humor',
        description: 'Lighthearted warmth and gentle playfulness',
        arabicDescription: 'مرح خفيف وبسمة لطيفة في الصوت وإيقاع منساب',
      },
      medium: {
        level: 'medium',
        label: 'Bouncy Mischief',
        arabicLabel: 'متوسط (شقاوة ودعابة حيوية)',
        promptPrefix:
          'Speak with lively mischievous banter, animated playful rhythm, and quick witty Egyptian colloquial joy',
        description: 'Animated cheeky humor and lively banter',
        arabicDescription: 'شقاوة محبوبة وخفة دم حيوية ونقاش عفوي مرح',
      },
      high: {
        level: 'high',
        label: 'Exuberant Prankster',
        arabicLabel: 'حاد / قوي (ضحك ومشاكسة مفرطة)',
        promptPrefix:
          'Speak with exuberant, giggly prankster energy, wildly bouncing playful cadence, and infectious childish fun',
        description: 'Wild playful energy, giggly mischief and excitement',
        arabicDescription: 'طاقة لعب ومشاكسة مفرطة وضحك طفولي لا ينقطع',
      },
    },
  },

  // ==========================================
  // 9. NOSTALGIA & LONGING (حنين وشوق وأيام زمان)
  // ==========================================
  {
    id: 'nostalgia',
    label: 'Nostalgia & Longing',
    arabicLabel: 'حنين وشوق (ذكريات دافئة وشجن الأيام)',
    arabicShortLabel: 'حنين وشوق',
    iconName: 'HeartHandshake',
    description: 'Warm wistful yearning, tender memories of the past, soulful Egyptian nostalgia',
    arabicDescription: 'شوق دافئ لأيام زمان، استحضار الذكريات برقة وشجن جميل ووداع حلو ومر',
    levels: {
      low: {
        level: 'low',
        label: 'Wistful Reflection',
        arabicLabel: 'هادئ (استرجاع ذكرى برقة)',
        promptPrefix:
          'Speak with gentle nostalgic longing, warm wistful inflection, and tender recollection of cherished times',
        description: 'Soft quiet reminiscing and gentle nostalgia',
        arabicDescription: 'استرجاع للذكريات بهدوء وابتسامة حالمة حنونة',
      },
      medium: {
        level: 'medium',
        label: 'Soulful Yearning',
        arabicLabel: 'متوسط (شوق عميق وحنين مؤثر)',
        promptPrefix:
          'Speak with deep soulful nostalgia, tender yearning cadence, heartfelt warmth and vivid poetic memory',
        description: 'Deep poignant longing and evocative warmth',
        arabicDescription: 'شوق عميق وملموس يحيي تفاصيل الماضي بنبرة حالمة مؤثرة',
      },
      high: {
        level: 'high',
        label: 'Aching Nostalgia',
        arabicLabel: 'عميق (شجن جارف لزمن مضى)',
        promptPrefix:
          'Speak with aching, bittersweet nostalgia, voice trembling with fond memories and poignant yearning for what was',
        description: 'Bittersweet overwhelming nostalgia and passionate remembrance',
        arabicDescription: 'شجن جارف وحسرة محبة على فراق الأحبة وزمن الطيبين',
      },
    },
  },

  // ==========================================
  // 10. SERENITY & PEACE (طمأنينة وسكينة)
  // ==========================================
  {
    id: 'serenity_peace',
    label: 'Serenity & Deep Peace',
    arabicLabel: 'طمأنينة وسكينة (سلام نفسي وهدوء)',
    arabicShortLabel: 'طمأنينة وسكينة',
    iconName: 'ShieldCheck',
    description: 'Profound tranquility, soothing reassurance, calm meditative certitude',
    arabicDescription: 'سكينة روحية عميقة، نبرة مطمئنة تبث الأمان واليقين وتهدئ النفوس المضطربة',
    levels: {
      low: {
        level: 'low',
        label: 'Calm Reassurance',
        arabicLabel: 'هادئ (راحة وطمأنة لطيفة)',
        promptPrefix:
          'Speak in a calm, soothing, tranquil tone that gently eases tension and breathes peaceful reassurance',
        description: 'Gentle soothing peace and relaxation',
        arabicDescription: 'راحة هادئة وطمأنة لطيفة تزيل القلق بسلاسة',
      },
      medium: {
        level: 'medium',
        label: 'Deep Serenity',
        arabicLabel: 'متوسط (سكينة قلبية ويقين تام)',
        promptPrefix:
          'Speak with deep serene composure, grounded peaceful cadence, pure stillness and comforting authority',
        description: 'Steady tranquil presence and spiritual calm',
        arabicDescription: 'سكينة راسخة ويقين تام ونبرة واثقة تبث الطمأنينة المطلقة',
      },
      high: {
        level: 'high',
        label: 'Sublime Stillness',
        arabicLabel: 'عميق (سلام روحي متسامٍ)',
        promptPrefix:
          'Speak with sublime, meditative spiritual peace, breathing unshakeable sanctuary, infinite calm and pure solace',
        description: 'Transcendent peace and profound unshakeable stillness',
        arabicDescription: 'سلام روحي متسامٍ يعلو فوق هموم الدنيا ويغمر السامع بالأمان',
      },
    },
  },

  // ==========================================
  // 11. PRIDE & DIGNITY (فخر واعتزاز وكبرياء)
  // ==========================================
  {
    id: 'pride_dignity',
    label: 'Pride & Noble Dignity',
    arabicLabel: 'فخر واعتزاز (كبرياء وشموخ وأنفة)',
    arabicShortLabel: 'فخر واعتزاز',
    iconName: 'Award',
    description: 'Commanding self-respect, noble Egyptian pride, upright dignity and honorable presence',
    arabicDescription: 'اعتزاز شجاع بالنفس، عزة مصرية شامخة، نبرة وقورة ملؤها الكرامة والشرف',
    levels: {
      low: {
        level: 'low',
        label: 'Quiet Self-Respect',
        arabicLabel: 'هادئ (عزة نفس ووقار)',
        promptPrefix:
          'Speak with quiet dignified pride, calm self-respect, grounded posture in the voice and polite firmness',
        description: 'Understated dignity and self-possession',
        arabicDescription: 'عزة نفس هادئة ووقار راسخ بدون مباهاة أو استعلاء',
      },
      medium: {
        level: 'medium',
        label: 'Proud Conviction',
        arabicLabel: 'متوسط (اعتزاز واثق ورأس مرفوع)',
        promptPrefix:
          'Speak with resonant proud conviction, head held high, clear honorable delivery and unshakeable dignity',
        description: 'Resonant pride, honorable strength and certitude',
        arabicDescription: 'فخر واثق وصوت جهوري متزن يعلن الكرامة بكل ثقة ورسوخ',
      },
      high: {
        level: 'high',
        label: 'Majestic Glory',
        arabicLabel: 'حاد / قوي (شموخ بطولي وكبرياء عارم)',
        promptPrefix:
          'Speak with majestic heroic pride, booming theatrical glory, soaring honorable defiance and towering nobility',
        description: 'Towering heroic grandeur and triumphant nobility',
        arabicDescription: 'شموخ بطولي عارم وكبرياء مهيب يتحدى الصعاب بشرف وعزيمة',
      },
    },
  },

  // ==========================================
  // 12. EGYPTIAN GALLANTRY & CHIVALRY (شهامة وجدعنة مصرية)
  // ==========================================
  {
    id: 'chivalry_gallantry',
    label: 'Egyptian Gallantry & Chivalry',
    arabicLabel: 'شهامة ومروءة (جدعنة مصرية ورجولة)',
    arabicShortLabel: 'شهامة وجدعنة',
    iconName: 'ShieldAlert',
    description: 'Authentic Egyptian "Gad‘ana", brotherhood, chivalrous protective warmth and valor',
    arabicDescription: 'جدعنة أولاد البلد، نبرة مروءة وشهامة مصرية خالصة تقف في ضهر الصاحب والضعيف',
    levels: {
      low: {
        level: 'low',
        label: 'Friendly Solidarity',
        arabicLabel: 'هادئ (وقفة صاحب ومساندة)',
        promptPrefix:
          'Speak with warm Egyptian fraternal solidarity, sincere reliable reassurance and protective brotherhood',
        description: 'Warm friendly support and brotherly loyalty',
        arabicDescription: 'مساندة أخوية صادقة ونبرة أمان توحي بأن الصاحب سند',
      },
      medium: {
        level: 'medium',
        label: 'True Gallantry (Ibn Balad)',
        arabicLabel: 'متوسط (جدعنة ابن البلد الأصيل)',
        promptPrefix:
          'Speak in the hearty, chivalrous cadence of an authentic Egyptian Ibn-Balad: brave, protective, generous and dependable',
        description: 'Hearty Baladi chivalry, bravery and generosity',
        arabicDescription: 'نخوة ابن البلد الأصيل، صوت دافئ ورجولي يفيض بالوفاء والشجاعة',
      },
      high: {
        level: 'high',
        label: 'Heroic Brotherhood',
        arabicLabel: 'قوي (نخوة وفداء بطولي)',
        promptPrefix:
          'Speak with fierce chivalrous protective loyalty, fearless brotherhood, sworn devotion and bold Egyptian valor',
        description: 'Fierce heroic sacrifice, fearlessness and supreme loyalty',
        arabicDescription: 'فداء بطولي ونخوة حارقة لا تتوانى عن تقديم الروح من أجل المبادئ',
      },
    },
  },

  // ==========================================
  // 13. SUSPICION & MISTRUST (شك وريبة وتوجس)
  // ==========================================
  {
    id: 'suspicion',
    label: 'Suspicion & Paranoia',
    arabicLabel: 'شك وريبة (توجس وحذر وتربص)',
    arabicShortLabel: 'شك وريبة',
    iconName: 'HelpCircle',
    description: 'Guarded skepticism, sideways glances, searching for deception in every syllable',
    arabicDescription: 'نبرة متشككة تراقب كل كلمة بحذر، ريبة وتوجس من وجود فخ أو خداع مستتر',
    levels: {
      low: {
        level: 'low',
        label: 'Mild Skepticism',
        arabicLabel: 'خفيف (تساؤل حذر وتحفظ)',
        promptPrefix:
          'Speak with guarded skepticism, slight suspicious squint in the tone, and careful questioning cadence',
        description: 'Wary questioning and subtle doubt',
        arabicDescription: 'تحفظ حذر ونبرة تزن الكلمات بتشكك خفيف',
      },
      medium: {
        level: 'medium',
        label: 'Active Suspicion',
        arabicLabel: 'متوسط (ريبة واضحة واستجواب)',
        promptPrefix:
          'Speak with sharp suspicious mistrust, watchful investigative cadence, probing tone looking for lies',
        description: 'Watchful scrutiny, distrust and probing doubt',
        arabicDescription: 'ريبة واضحة وتوجس مستمر واستجواب ذكي لكشف الحقيقة المستورة',
      },
      high: {
        level: 'high',
        label: 'Feverish Paranoia',
        arabicLabel: 'حاد / قوي (هوس الشك والمؤامرة)',
        promptPrefix:
          'Speak in tense, cornered paranoia, intensely suspicious whispered edge, suspecting treachery everywhere',
        description: 'Cornered paranoia and frantic suspicious dread',
        arabicDescription: 'هوس شك حاد ونبرة مأزومة ترى في كل إيماءة خيانة وغدراً',
      },
    },
  },

  // ==========================================
  // 14. SUSPENSE & MYSTERY (ترقب وغموض وإثارة)
  // ==========================================
  {
    id: 'suspense_mystery',
    label: 'Suspense & Dark Mystery',
    arabicLabel: 'ترقب وغموض (حبس أنفاس وتشويق)',
    arabicShortLabel: 'ترقب وغموض',
    iconName: 'VolumeX',
    description: 'Hushed breath, thrilling anticipation, pregnant pauses, secrets lurking in shadows',
    arabicDescription: 'نبرة غامضة مشوقة تحبس الأنفاس، إيقاع حذر يمهد لمفاجأة مرتقبة في الظلام',
    levels: {
      low: {
        level: 'low',
        label: 'Intriguing Whisper',
        arabicLabel: 'خفيف (همس مشوق وسر خفي)',
        promptPrefix:
          'Speak in an intriguing, hushed cadence, hinting at hidden secrets with measured suspenseful curiosity',
        description: 'Curious hush and subtle suspense',
        arabicDescription: 'همس فضولي مشوق يلمح لأسرار غامضة بتأنٍ',
      },
      medium: {
        level: 'medium',
        label: 'Breathless Thriller',
        arabicLabel: 'متوسط (حبس أنفاس وترقب مشدود)',
        promptPrefix:
          'Speak with tight suspenseful pacing, hushed anticipation, dramatic pregnant beats and gripping mystery',
        description: 'Tight breathless suspense and mounting tension',
        arabicDescription: 'إيقاع مشدود يحبس أنفاس المستمع وينتظر وقوع الحدث في أي ثانية',
      },
      high: {
        level: 'high',
        label: 'Climactic Dread',
        arabicLabel: 'حاد / قوي (ذروة الرعب والترقب المخيف)',
        promptPrefix:
          'Speak with hair-raising cinematic suspense, spine-chilling hushed urgency, razor-edge dread and ominous gravity',
        description: 'Ominous spine-chilling suspense at breaking point',
        arabicDescription: 'ذروة الترقب المخيف، همسات تقشعر لها الأبدان ومفاجأة وشيكة',
      },
    },
  },

  // ==========================================
  // 15. ASTONISHED & AWE (مبهورة ودهشة)
  // ==========================================
  {
    id: 'astonished',
    label: 'Astonished / Awe',
    arabicLabel: 'مبهورة (دهشة وإعجاب وذهول)',
    arabicShortLabel: 'مبهورة',
    iconName: 'Sparkles',
    description: 'Tone filled with awe, wide-eyed wonder and breathless admiration',
    arabicDescription: 'نبرة مليئة بالانبهار والدهشة البريئة والإعجاب الشديد بما تراه العين',
    levels: {
      low: {
        level: 'low',
        label: 'Subtle Awe',
        arabicLabel: 'خفيف (إعجاب لطيف)',
        promptPrefix:
          'Speak in a pleasantly astonished tone with a subtle, gentle sense of wonder and soft admiring inflection',
        description: 'Light surprise with gentle pleasant appreciation',
        arabicDescription: 'دهشة خفيفة مع إعجاب لطيف',
      },
      medium: {
        level: 'medium',
        label: 'Clear Wonder',
        arabicLabel: 'متوسط (انبهار واضح)',
        promptPrefix:
          'Speak in a clearly astonished, fascinated tone, with wide-eyed wonder and breathless admiration',
        description: 'Audible awe and engaged astonishment',
        arabicDescription: 'انبهار ملموس وتعبير واضح عن الذهول والإعجاب',
      },
      high: {
        level: 'high',
        label: 'Intense Awe',
        arabicLabel: 'قوي (ذهول وانبهار شديد)',
        promptPrefix:
          'Speak with intense, dramatic awe and utter amazement, gasped excitement, breathless and completely captivated',
        description: 'Overwhelming amazement and starstruck astonishment',
        arabicDescription: 'ذهول عارم وانبهار شديد ممتزج بالفرحة والدهشة الغامرة',
      },
    },
  },

  // ==========================================
  // 16. AGITATION & ANGER (إنفعال وغضب)
  // ==========================================
  {
    id: 'agitation_anger',
    label: 'Agitation & Outburst',
    arabicLabel: 'إنفعال وغضب (توتر واحتجاج عاصف)',
    arabicShortLabel: 'إنفعال وغضب',
    iconName: 'Zap',
    description: 'Fiery frustration, growing tension or explosive wrath',
    arabicDescription: 'نبرة غضب وانفعال متوتر وتفريغ شحنات الغيظ والاحتجاج على الخطأ',
    levels: {
      low: {
        level: 'low',
        label: 'Simmering Tension',
        arabicLabel: 'خفيف (توتر ونرفزة مكتومة)',
        promptPrefix:
          'Speak with tense, irritated restraint, clipped syllables and simmering annoyance',
        description: 'Restrained annoyance and clipped tension',
        arabicDescription: 'غيظ مكتوم ونرفزة متوترة تحت السيطرة',
      },
      medium: {
        level: 'medium',
        label: 'Rising Outburst',
        arabicLabel: 'متوسط (غضب متصاعد وانفعال)',
        promptPrefix:
          'Speak with rising fiery agitation, indignant anger and forceful vehement pacing',
        description: 'Heated indignation and forceful anger',
        arabicDescription: 'انفعال متصاعد ونبرة محتدة واحتجاج غاضب',
      },
      high: {
        level: 'high',
        label: 'Explosive Fury',
        arabicLabel: 'حاد / قوي (فورة غضب عارمة)',
        promptPrefix:
          'Speak in an intense emotional explosion of anger, shouting fury, furious outrage and vehement power',
        description: 'Blazing fury and explosive emotional outrage',
        arabicDescription: 'فورة غضب عارمة وانفجار انفعالي حاد وشديد القوة',
      },
    },
  },

  // ==========================================
  // 17. BLAZING RAGE (غضب حارق وفوران)
  // ==========================================
  {
    id: 'rage',
    label: 'Blazing Theatrical Rage',
    arabicLabel: 'غضب حارق (ثورة بركانية وغيظ عارم)',
    arabicShortLabel: 'غضب حارق',
    iconName: 'Angry',
    description: 'Volcanic wrath, righteous indignation, fierce booming fury that shakes the room',
    arabicDescription: 'ثورة بركانية وغضب حارق من الظلم، صوت جهوري مشتعل بالحمية والعدالة',
    levels: {
      low: {
        level: 'low',
        label: 'Cold Threatening Rage',
        arabicLabel: 'خفيف (غضب بارد مهدد)',
        promptPrefix:
          'Speak with deadly, icy quiet rage, clenched teeth and intensely threatening cold restraint',
        description: 'Chilling suppressed wrath and deadly quiet',
        arabicDescription: 'غضب بارد كالثلج، نبرة مهددة وهدوء ما قبل العاصفة',
      },
      medium: {
        level: 'medium',
        label: 'Flaming Outrage',
        arabicLabel: 'متوسط (ثورة حارقة واحتجاج صارم)',
        promptPrefix:
          'Speak with blazing fury, vehement vocal power, sharp indignant cadence and thunderous righteousness',
        description: 'Fierce righteous fury and powerful indignation',
        arabicDescription: 'نبرة محتدمة بالنار والحق، تصرخ في وجه الباطل بعزم',
      },
      high: {
        level: 'high',
        label: 'Volcanic Fury',
        arabicLabel: 'حاد / قوي (انفجار بركاني مدمر)',
        promptPrefix:
          'Speak in an unbridled theatrical tempest of rage, booming diaphragmatic fury, apocalyptic fury and unstoppable wrath',
        description: 'Uncontainable tempest of apocalyptic rage',
        arabicDescription: 'عاصفة غضب هوجاء لا تبقي ولا تذر، صرخة شرف مدوية',
      },
    },
  },

  // ==========================================
  // 18. PANIC & TERROR (فزع وذعر وهلع)
  // ==========================================
  {
    id: 'panic_terror',
    label: 'Panic & Terror',
    arabicLabel: 'فزع وذعر (هلع واضطراب مرعوب)',
    arabicShortLabel: 'فزع وذعر',
    iconName: 'AlertTriangle',
    description: 'Tone shaken by sudden fear, mortal terror, shock or stampeding panic',
    arabicDescription: 'نبرة مرعوبة أو مذعورة مشوبة بالارتباك والخوف المفاجئ وارتجاف الأطراف',
    levels: {
      low: {
        level: 'low',
        label: 'Nervous Unease',
        arabicLabel: 'خفيف (قلق وتوجس مرتعش)',
        promptPrefix:
          'Speak in a nervous, uneasy tone with subtle underlying anxiety and wary apprehension',
        description: 'Tense anticipation and subtle anxiety',
        arabicDescription: 'توجس وقلق ونبرة حذرة خائفة من المجهول',
      },
      medium: {
        level: 'medium',
        label: 'Alarmed Fear',
        arabicLabel: 'متوسط (خوف وارتباك مسموع)',
        promptPrefix:
          'Speak in a visibly shaken, alarmed and panicked tone, breath quickening with real fear',
        description: 'Shaky voice and startled alarm',
        arabicDescription: 'صوت مرتجف ومليء بالخوف والاضطراب الواضح وتسارع النبض',
      },
      high: {
        level: 'high',
        label: 'Sheer Terror',
        arabicLabel: 'حاد / قوي (ذعر وهلع عارم)',
        promptPrefix:
          'Speak in sheer breathless terror and horrified panic, trembling frantically with desperate alarm',
        description: 'Horrified panic and desperate terror',
        arabicDescription: 'فزع مرعب وصرخة هلع واضطراب تنفسي شديد أمام الموت أو الخطر',
      },
    },
  },

  // ==========================================
  // 19. GENTLE REPROACH (عتاب هادئ وحنون)
  // ==========================================
  {
    id: 'gentle_reproach',
    label: 'Gentle Reproach',
    arabicLabel: 'عتاب هادئ وحنون (لوم المحبين والحرقة)',
    arabicShortLabel: 'عتاب هادئ',
    iconName: 'MessageSquareHeart',
    description: 'Loving reproof, sad gentle blame without harshness, speaking directly to the conscience',
    arabicDescription: 'لوم رقيق محب، عتاب من القلب بصوت هادئ دون تجريح يوقظ الضمير بحياء',
    levels: {
      low: {
        level: 'low',
        label: 'Tender Blame',
        arabicLabel: 'خفيف (لوم رقيق محب)',
        promptPrefix:
          'Speak with tender, loving reproach, mild sadness and warm affectionate remonstrance',
        description: 'Affectionate and mild loving reproach',
        arabicDescription: 'عتاب لطيف جداً يحمل كل المحبة والحرص',
      },
      medium: {
        level: 'medium',
        label: 'Heartfelt Reproof',
        arabicLabel: 'متوسط (عتاب حزين وهادئ)',
        promptPrefix:
          'Speak with calm, poignant reproach, quiet disappointment delivered with gentle dignity and deep love',
        description: 'Poignant quiet disappointment and dignity',
        arabicDescription: 'عتاب صادق وحزين بنبرة هادئة ورزينة تمس المشاعر',
      },
      high: {
        level: 'high',
        label: 'Deep Soulful Reproof',
        arabicLabel: 'عميق (عتاب مؤلم ومؤثر)',
        promptPrefix:
          'Speak with profoundly sorrowful and tender reproach, deeply hurt yet speaking in a hushed, aching, loving cadence',
        description: 'Aching sorrowful reproof with profound tenderness',
        arabicDescription: 'عتاب عميق ومؤلم يخرج من أعماق القلب بصوت هادئ مؤثر',
      },
    },
  },

  // ==========================================
  // 20. PLEADING & BEGGING (رجاء واستعطاف وتوسل)
  // ==========================================
  {
    id: 'pleading',
    label: 'Pleading & Begging',
    arabicLabel: 'رجاء وتوسل (استعطاف رقيق وملح)',
    arabicShortLabel: 'رجاء وتوسل',
    iconName: 'HeartHandshake',
    description: 'Heartfelt begging, imploring or asking desperately for favor, touching the listener’s heart',
    arabicDescription: 'نبرة استعطاف ورجاء وتوسل ملح مؤثر في المشاعر تلين له الحجارة',
    levels: {
      low: {
        level: 'low',
        label: 'Polite Request',
        arabicLabel: 'هادئ (طلب لطيف ورجاء عذب)',
        promptPrefix:
          'Speak in a sweet, gentle pleading tone, soft-spoken with polite hopeful appeal',
        description: 'Sweet gentle imploring',
        arabicDescription: 'طلب عذب ورجاء هادئ بأسلوب لطيف وأدب جم',
      },
      medium: {
        level: 'medium',
        label: 'Earnest Entreaty',
        arabicLabel: 'متوسط (استعطاف ملح ومؤثر)',
        promptPrefix:
          'Speak in an earnest, emotionally pleading tone, imploring with heartfelt urgency and vulnerability',
        description: 'Urgent emotional appeal and earnest vulnerability',
        arabicDescription: 'استعطاف ملموس ونبرة ترجي مؤثرة تطلب النجدة والصفح',
      },
      high: {
        level: 'high',
        label: 'Desperate Begging',
        arabicLabel: 'قوي (توسل شديد وباكٍ)',
        promptPrefix:
          'Speak in desperate, tearful begging tone, heartrending supplication with cracked voice and profound emotion',
        description: 'Cracked voice and desperate tearful begging',
        arabicDescription: 'توسل باكي واستعطاف مستميت بصوت مخنوق يتوسل الرحمة',
      },
    },
  },

  // ==========================================
  // 21. REMORSE & GUILT (ندم وحسرة وتأنيب ضمير)
  // ==========================================
  {
    id: 'remorse_guilt',
    label: 'Remorse & Penitence',
    arabicLabel: 'ندم وحسرة (تأنيب ضمير واعتراف)',
    arabicShortLabel: 'ندم وحسرة',
    iconName: 'HeartCrack',
    description: 'Aching regret, deep guilt, painful self-reproach and humble admission of fault',
    arabicDescription: 'نبرة متحسرة نادمة تعترف بالخطأ بحرقة وتطلب الصفح والمسامحة بصدق',
    levels: {
      low: {
        level: 'low',
        label: 'Quiet Regret',
        arabicLabel: 'خفيف (أسف صادق واعتذار)',
        promptPrefix:
          'Speak with quiet, humble remorse, sincere apologetic warmth and reflective regret',
        description: 'Soft remorseful apology and modest regret',
        arabicDescription: 'اعتذار هادئ وصادق ينبع من القلب مع خجل من الخطأ',
      },
      medium: {
        level: 'medium',
        label: 'Painful Guilt',
        arabicLabel: 'متوسط (حسرة مؤلمة وتأنيب ضمير)',
        promptPrefix:
          'Speak with painful self-reproach, heavy penitence, aching confession and heartfelt regret',
        description: 'Aching guilt, self-blame and earnest confession',
        arabicDescription: 'تأنيب ضمير صريح وحسرة على ما فات ورغبة ملحة في التصحيح',
      },
      high: {
        level: 'high',
        label: 'Agonizing Remorse',
        arabicLabel: 'حاد / عميق (حسرة ممزقة وندم مدمر)',
        promptPrefix:
          'Speak with agonizing, soul-crushing remorse, trembling confession, devastated by one’s own mistake',
        description: 'Crushing guilt and desperate tearful plea for forgiveness',
        arabicDescription: 'ندم مدمر وحسرة تكوي الفؤاد واعتراف ممزق بالذنب',
      },
    },
  },

  // ==========================================
  // 22. SHYNESS & MODESTY (خجل وحياء وارتباك لطيف)
  // ==========================================
  {
    id: 'shyness_modesty',
    label: 'Shyness & Modest Embarrassment',
    arabicLabel: 'خجل وحياء (ارتباك لطيف وبراءة)',
    arabicShortLabel: 'خجل وحياء',
    iconName: 'Smile',
    description: 'Blushing modesty, gentle bashfulness, sweet hesitation and delicate innocence',
    arabicDescription: 'حياء رقيق وعفة، ارتباك لطيف وتردد بريء ينبع من الحشمة والطيبة',
    levels: {
      low: {
        level: 'low',
        label: 'Modest Politeness',
        arabicLabel: 'خفيف (حياء خافت وتهذيب)',
        promptPrefix:
          'Speak with soft, modest politeness, quiet gentle hesitation and demure respect',
        description: 'Demure modesty and soft-spoken respect',
        arabicDescription: 'أدب جم وتهذيب ناعم مع لمسة حياء خافتة',
      },
      medium: {
        level: 'medium',
        label: 'Bashful Hesitation',
        arabicLabel: 'متوسط (خجل واضح وارتباك جميل)',
        promptPrefix:
          'Speak with sweet, blushing shyness, hesitant pauses, delicate bashfulness and endearing modesty',
        description: 'Endearing shyness, gentle stammering and modesty',
        arabicDescription: 'خجل لطيف وتردد محبب في الكلمات مع تلعثم عفوي رقيق',
      },
      high: {
        level: 'high',
        label: 'Flustered Innocence',
        arabicLabel: 'حاد (ارتباك شديد واحمرار خجل)',
        promptPrefix:
          'Speak in an intensely flustered, sweetly embarrassed cadence, blushing profusely and speaking in breathless timid murmurs',
        description: 'Intense fluster, sweet embarrassment and timid softness',
        arabicDescription: 'ارتباك خجول شديد وتعلثم طفولي بريء من شدة الموقف',
      },
    },
  },

  // ==========================================
  // 23. CONFUSION & PERPLEXITY (حيرة وتشتت وضياع)
  // ==========================================
  {
    id: 'confusion_perplexed',
    label: 'Confusion & Bewilderment',
    arabicLabel: 'حيرة وتشتت (ضياع وتساؤل عاجز)',
    arabicShortLabel: 'حيرة وتشتت',
    iconName: 'HelpCircle',
    description: 'Puzzlement, disorientation, seeking understanding through clouded thoughts',
    arabicDescription: 'نبرة حائرة تبحث عن إجابات وسط الضباب، تساؤل متخبط وفقدان للبوصلة',
    levels: {
      low: {
        level: 'low',
        label: 'Curious Puzzlement',
        arabicLabel: 'خفيف (استغراب وتساؤل هادئ)',
        promptPrefix:
          'Speak with curious puzzlement, mild scratching-head inflection, seeking clarification',
        description: 'Mild questioning and curious uncertainty',
        arabicDescription: 'استغراب خفيف وسؤال استيضاحي بنبرة هادئة',
      },
      medium: {
        level: 'medium',
        label: 'Lost & Perplexed',
        arabicLabel: 'متوسط (حيرة واضحة وتخبط)',
        promptPrefix:
          'Speak with disoriented bewilderment, tangled cadence, questioning tone wrestling with conflicting facts',
        description: 'Noticeable perplexity, lost train of thought and wonder',
        arabicDescription: 'حيرة ملموسة وتخبط بين الخيارات وتساؤل عن الصواب والخطأ',
      },
      high: {
        level: 'high',
        label: 'Utter Disorientation',
        arabicLabel: 'حاد (ضياع تام وعجز عن الفهم)',
        promptPrefix:
          'Speak in complete bewildering confusion, stunned mental paralysis, fragmented thoughts and desperate disorientation',
        description: 'Total mental chaos, helplessness and stunned incomprehension',
        arabicDescription: 'ضياع ذهني تام وصدمة عجز عن استيعاب ما يدور من هول الموقف',
      },
    },
  },

  // ==========================================
  // 24. DEFENSIVE (نبرة دفاعية)
  // ==========================================
  {
    id: 'defensive',
    label: 'Defensive Stance',
    arabicLabel: 'نبرة دفاعية (تبرير واحتجاج)',
    arabicShortLabel: 'دفاعية',
    iconName: 'ShieldAlert',
    description: 'Defending stance against accusations or questioning',
    arabicDescription: 'نبرة دفاع عن النفس وتبرير الموقف ورفض الاتهام',
    levels: {
      low: {
        level: 'low',
        label: 'Calm Defensive',
        arabicLabel: 'هادئة (دفاع متزن ومبرر)',
        promptPrefix:
          'Speak in a calm defensive tone, measured and composed, gently justifying the action without raising voice',
        description: 'Composed, measured self-defense',
        arabicDescription: 'تبرير هادئ ومبرر ومنطقي مع ضبط النفس',
      },
      medium: {
        level: 'medium',
        label: 'Moderate Defensive',
        arabicLabel: 'متوسطة (تحفّظ واحتجاج واضح)',
        promptPrefix:
          'Speak in a noticeably defensive, guarded tone, protesting firmly against being blamed or misunderstood',
        description: 'Guarded self-justification and noticeable resistance',
        arabicDescription: 'دفاع مع تحفظ واحتجاج واضح ورفض للمسؤولية',
      },
      high: {
        level: 'high',
        label: 'Sharp Defensive',
        arabicLabel: 'حادة (دفاع حاد وهجومي)',
        promptPrefix:
          'Speak in a sharply defensive, tense, and biting argumentative tone, intensely bristling and rejecting accusation outright',
        description: 'Sharp, confrontational, highly agitated defense',
        arabicDescription: 'نبرة حادة ومتوترة ورفض قاطع وهجوم دفاعي صريح',
      },
    },
  },

  // ==========================================
  // 25. CONDESCENDING & PATRONIZING (نبرة تفضُّل واستعلاء)
  // ==========================================
  {
    id: 'condescending',
    label: 'Patronizing / Concession',
    arabicLabel: 'نبرة تفضُّل (استعلاء وتنازل)',
    arabicShortLabel: 'تفضُّل',
    iconName: 'Award',
    description: 'Tone conveying superior concession or condescending generosity',
    arabicDescription: 'نبرة استعلاء وتنازل وتفضُّل وكأن المتحدث يتكرم على المستمع',
    levels: {
      low: {
        level: 'low',
        label: 'Polite Superiority',
        arabicLabel: 'خفيف (مجاملة باستعلاء)',
        promptPrefix:
          'Speak with subtle condescension, polite yet slightly patronizing, as if doing a minor courteous favor',
        description: 'Mild patronizing politeness',
        arabicDescription: 'مجاملة لطيفة ولكن تشعر فيها بنبرة فوقية خفيفة',
      },
      medium: {
        level: 'medium',
        label: 'Clear Condescension',
        arabicLabel: 'متوسط (تفضُّل وتنازل ملموس)',
        promptPrefix:
          'Speak with a distinctly condescending and patronizing tone, smugly magnanimous and acting superior',
        description: 'Noticeable smugness and superior concession',
        arabicDescription: 'تفضُّل صريح وشعور بالمنّة والاستعلاء',
      },
      high: {
        level: 'high',
        label: 'Haughty & Arrogant',
        arabicLabel: 'قوي (ترفع واستعلاء فج)',
        promptPrefix:
          'Speak with haughty, highly patronizing arrogance, dripping with disdainful generosity and blatant superiority',
        description: 'Open arrogance and exaggerated benevolent superiority',
        arabicDescription: 'استعلاء فج وغرور مبالغ فيه ونبرة منّة قوية',
      },
    },
  },

  // ==========================================
  // 26. CONTEMPT & SCORN (ازدراء واحتقار)
  // ==========================================
  {
    id: 'contempt_scorn',
    label: 'Contempt & Cold Scorn',
    arabicLabel: 'ازدراء واحتقار (استهانة وبرود)',
    arabicShortLabel: 'ازدراء واحتقار',
    iconName: 'ShieldAlert',
    description: 'Cold disdain, looking down one’s nose, dismissive refusal to grant worth',
    arabicDescription: 'نبرة باردة محتقرة تستهين بالآخر ببرود شديد واستخفاف تام',
    levels: {
      low: {
        level: 'low',
        label: 'Dismissive Coldness',
        arabicLabel: 'خفيف (إعراض وبرود خافت)',
        promptPrefix:
          'Speak with cool, dismissive indifference, slight haughty sneer in the cadence, giving minimal attention',
        description: 'Cold brush-off and minimal regard',
        arabicDescription: 'إعراض هادئ ولا مبالاة متعالية تشعر الآخر بعدم أهميته',
      },
      medium: {
        level: 'medium',
        label: 'Overt Contempt',
        arabicLabel: 'متوسط (احتقار صريح ونفور)',
        promptPrefix:
          'Speak with icy, clear contempt, scornful disdain, sharp patronizing chill and complete lack of respect',
        description: 'Cutting disdain and chilly disrespect',
        arabicDescription: 'احتقار صريح وبرود جليدي ينفر من المقابل باستعلاء قاطع',
      },
      high: {
        level: 'high',
        label: 'Venomous Disdain',
        arabicLabel: 'حاد / قوي (ازدراء ساحق ونفور تام)',
        promptPrefix:
          'Speak with venomous, devastating scorn, dripping with disgust, crushing dismissal and absolute contempt',
        description: 'Venomous disgust and crushing theatrical dismissal',
        arabicDescription: 'ازدراء ساحق وتقزز كامل يعامل الطرف الآخر كأنه عدم',
      },
    },
  },

  // ==========================================
  // 27. CONSPIRACY & CUNNING (مؤامرة ودهاء ومكر)
  // ==========================================
  {
    id: 'conspiracy_cunning',
    label: 'Cunning Conspiracy & Plotting',
    arabicLabel: 'مؤامرة ودهاء (مكر وهمس وتخطيط)',
    arabicShortLabel: 'مؤامرة ودهاء',
    iconName: 'Zap',
    description: 'Subtle whispers, sly cunning, Machiavellian schemes and scheming satisfaction',
    arabicDescription: 'نبرة ماكرة تهمس بالخطط السرية بخبث ودهاء، حبك للمؤامرات وابتسامة مكر',
    levels: {
      low: {
        level: 'low',
        label: 'Sly Suggestion',
        arabicLabel: 'خفيف (تلميح ماكر وخبيث)',
        promptPrefix:
          'Speak with sly, suggestive subtlety, hushed conspiratorial undertone and clever wink in the inflection',
        description: 'Subtle conspiratorial wink and scheming hint',
        arabicDescription: 'تلميح ذكي وهامس يوحي بوجود خطة خفية لا يفهمها إلا الشركاء',
      },
      medium: {
        level: 'medium',
        label: 'Machiavellian Scheming',
        arabicLabel: 'متوسط (مكر ودهاء مخطط)',
        promptPrefix:
          'Speak with cunning, calculated stealth, hushed scheming cadence, relish in the plot and shrewd whispers',
        description: 'Calculated stealth and relish in plotting',
        arabicDescription: 'تخطيط خبيث ونبرة واثقة من الإيقاع بالخصم في الفخ المحكم',
      },
      high: {
        level: 'high',
        label: 'Mastermind Triumph',
        arabicLabel: 'قوي (مؤامرة كبرى وانتصار داهية)',
        promptPrefix:
          'Speak with sinister, masterminded triumph, villainous theatrical cunning, whispered treacherous glee and venomous control',
        description: 'Sinister villainous delight and total scheming control',
        arabicDescription: 'شماتة داهية كبرى وانتصار ميكافيلي مظلم يتحكم في خيوط اللعبة',
      },
    },
  },

  // ==========================================
  // 28. CHILD SQUABBLE (شجار طفولي وعناد)
  // ==========================================
  {
    id: 'child_squabble',
    label: 'Childish Squabble',
    arabicLabel: 'شجار طفولي (عناد ومشاكسة)',
    arabicShortLabel: 'شجار طفولي',
    iconName: 'Angry',
    description: 'Child-like bickering, sulking or argumentative stubbornness',
    arabicDescription: 'خلاف وعناد طفولي ومشاكسة وإلحاح بالحق الطفولي وبكاء مشاغب',
    levels: {
      low: {
        level: 'low',
        label: 'Mild Sulk',
        arabicLabel: 'خفيف (مشاكسة وعناد خفيف)',
        promptPrefix:
          'Speak with childish petulance, slight sulking and playful argumentative stubbornness',
        description: 'Playful stubbornness and mild pouting',
        arabicDescription: 'ملاوعة طفولية وعناد خفيف ولطيف',
      },
      medium: {
        level: 'medium',
        label: 'Bickering',
        arabicLabel: 'متوسط (شجار ومشاكسة واضحة)',
        promptPrefix:
          'Speak in an agitated childish squabble cadence, stubborn, petulant and whining with defiant objection',
        description: 'Petulant bickering and whining dispute',
        arabicDescription: 'جدال طفولي محتد ونبرة حردانة معترضة',
      },
      high: {
        level: 'high',
        label: 'Tantrum Feud',
        arabicLabel: 'حاد (صراخ وعناد طفولي حاد)',
        promptPrefix:
          'Speak like a child in a fierce tantrum squabble, shrill defiant cadence, sulking furiously and stamping verbally',
        description: 'High-pitched tantrum and fierce childish indignation',
        arabicDescription: 'صياح طفولي حاد وعناد شديد وغضب صبياني محتد',
      },
    },
  },

  // ==========================================
  // 29. RELIEF & SOLACE (ارتياح واستبشار)
  // ==========================================
  {
    id: 'relief',
    label: 'Relief & Unburdening',
    arabicLabel: 'ارتياح واستبشار (زوال هم وراحة بال)',
    arabicShortLabel: 'ارتياح واستبشار',
    iconName: 'ShieldCheck',
    description: 'Release of heavy tension, deep breath of ease, grateful sigh after fear passed',
    arabicDescription: 'زوال الهم وانفراج الكربة، نبرة ارتياح عميقة تستقبل النجاة بامتنان وشكر',
    levels: {
      low: {
        level: 'low',
        label: 'Light Relief',
        arabicLabel: 'هادئ (تنفس الصعداء برفق)',
        promptPrefix:
          'Speak with gentle quiet relief, subtle releasing sigh in the cadence, easing into safety',
        description: 'Soft quiet unburdening and easing tension',
        arabicDescription: 'تنفس الصعداء بهدوء وإحساس بالأمان بعد القلق',
      },
      medium: {
        level: 'medium',
        label: 'Heartfelt Relief',
        arabicLabel: 'متوسط (راحة بال ملموسة وامتنان)',
        promptPrefix:
          'Speak with profound, grateful relief, audible exhale of burdens lifted, joyful ease and reassurance',
        description: 'Grateful release of anxiety and audible reassurance',
        arabicDescription: 'راحة بال غامرة وزوال ثقل جبل عن الصدر بنبرة تفيض أملاً',
      },
      high: {
        level: 'high',
        label: 'Miraculous Deliverance',
        arabicLabel: 'قوي (فرحة نجاة كبرى واستبشار عظيم)',
        promptPrefix:
          'Speak with jubilant, overwhelming relief, joyous deliverance from danger, sobbing with gratitude and liberated happiness',
        description: 'Overwhelming jubilant deliverance and pure liberation',
        arabicDescription: 'فرحة نجاة كبرى من مأزق قاتل واستبشار عظيم بالفرج والنور',
      },
    },
  },

  // ==========================================
  // 30. CASUAL CONVERSATION (حوار يومي عادي)
  // ==========================================
  {
    id: 'casual_conversation',
    label: 'Everyday Casual Conversation',
    arabicLabel: 'حوار يومي عادي (دردشة عفوية)',
    arabicShortLabel: 'حوار يومي عادي',
    iconName: 'MessageSquare',
    isCasual: true,
    description:
      'Completely unforced, everyday street or home conversation, 100% natural colloquial delivery with zero theatrical exaggeration',
    arabicDescription:
      'حوار مصري واقعي واعتيادي جداً بين الأهل أو الأصدقاء بدون أي تمثيل مسرحي أو تصنع أو مبالغة درامية',
    levels: {
      low: {
        level: 'low',
        label: 'Gentle Casual',
        arabicLabel: 'هادئ وبسيط (كلام بيت وأصحاب)',
        promptPrefix:
          'Speak in an intimate, easygoing, everyday Egyptian casual conversation tone (حوار يومي مصري هادئ وعفوي). Keep delivery relaxed, completely unforced, smooth, and authentic like two close friends chatting at home without any dramatic performance',
        description: 'Soft-spoken, relaxed conversation among close friends or family',
        arabicDescription: 'دردشة هادئة ومريحة بين اتنين أصحاب أو في البيت بأعلى درجات العفوية',
      },
      medium: {
        level: 'medium',
        label: 'Natural Everyday',
        arabicLabel: 'عفوي واعتيادي (حوار مصري يومي طبيعي)',
        promptPrefix:
          'Speak in an authentic, natural everyday Egyptian colloquial conversation style (حوار مصري يومي طبيعي وعفوي 100%). Zero dramatic theatricality, realistic casual inflection, effortless Egyptian street and living-room cadence, authentic colloquial phrasing and natural conversational flow',
        description: 'Standard everyday conversational rhythm, effortless and authentic',
        arabicDescription: 'حوار يومي واقعي وطبيعي 100% كما يتحدث الناس في الشارع والبيت بدون أي تصنع',
      },
      high: {
        level: 'high',
        label: 'Lively Banter',
        arabicLabel: 'دردشة سريعة وأخذ وعطاء (نقاش حيوي)',
        promptPrefix:
          'Speak in a lively, fast-paced everyday Egyptian conversational banter (دردشة يومية سريعة وأخذ وعطاء عفوي). Spontaneous real-world delivery, animated Egyptian conversational nuances, realistic colloquial rhythm with quick natural reactions',
        description: 'Animated everyday banter with spontaneous quick reactions',
        arabicDescription: 'أخذ وعطاء عفوي وسريع، نقاش يومي مشوق وحيوي بطابع مصري أصيل',
      },
    },
  },

  // ==========================================
  // 31. NATURAL & BALANCED (طبيعي وتلقائي)
  // ==========================================
  {
    id: 'natural_neutral',
    label: 'Natural & Balanced',
    arabicLabel: 'طبيعي وتلقائي (أداء متزن ونقي)',
    arabicShortLabel: 'طبيعي وتلقائي',
    iconName: 'Sparkles',
    description: 'Balanced everyday speaking delivery, pure vocal clarity without theatrical coloring',
    arabicDescription: 'إلقاء عفوي وتلقائي متزن دون انفعال مصطنع، يبرز جمال الصوت ونقاء الأداء',
    levels: {
      low: {
        level: 'low',
        label: 'Soft & Relaxed',
        arabicLabel: 'هادئ (انسيابي رقيق)',
        promptPrefix: 'Say gently in a relaxed, calm conversational tone',
        description: 'Gentle, soft conversational cadence',
        arabicDescription: 'إلقاء هادئ ومريح وانسيابي',
      },
      medium: {
        level: 'medium',
        label: 'Natural Daily',
        arabicLabel: 'متوسط (تلقائي يومي)',
        promptPrefix: 'Say naturally with conversational inflection and clear articulation',
        description: 'Standard natural conversational cadence',
        arabicDescription: 'نبرة عفوية تحاكي الحديث اليومي المعتاد',
      },
      high: {
        level: 'high',
        label: 'Confident & Crisp',
        arabicLabel: 'واضح (واثق ومخارج قوية)',
        promptPrefix:
          'Speak with crisp clarity, confident dynamic cadence and articulate presence',
        description: 'Dynamic, clear and articulate delivery',
        arabicDescription: 'إلقاء واثق وواضح مع مخارج حروف قوية وجذابة',
      },
    },
  },
];
