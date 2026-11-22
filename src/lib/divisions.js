import { media } from "@/lib/media";

export const DIVISIONS = [
  // Together Global always comes first wherever divisions are listed.
  {
    slug: "global",
    // Together Global has its own website; links go there instead of a page here.
    externalUrl: "https://togethersolutions.com/",
    tag: "GLOBAL",
    color: "#187295",
    image: media.global,
    name: { en: "Together Global", ar: "شريك الحلول العالمية" },
    short: {
      en: "International partnerships, import and mobile stages.",
      ar: "الشراكات الدولية والاستيراد والمسارح المتنقلة.",
    },
    description: {
      en: "Together Global connects the group to international markets: agency and partnership agreements, the import of products and technology, and the mobile stages and promotional trucks the group delivers with Shanghai Ticktack.",
      ar: "تربط شريك الحلول العالمية المجموعة بالأسواق الدولية: اتفاقيات الوكالات والشراكات، واستيراد المنتجات والتقنية، والمسارح المتنقلة والشاحنات الترويجية التي تنفّذها المجموعة مع شانغهاي تيكتاك.",
    },
    services: [
      { en: "International partnerships and agencies", ar: "الشراكات الدولية والوكالات" },
      { en: "Product and technology import", ar: "استيراد المنتجات والتقنية" },
      { en: "Mobile stages and promotional trucks", ar: "المسارح المتنقلة والشاحنات الترويجية" },
      { en: "Customisation and after-sales", ar: "التخصيص وخدمات ما بعد البيع" },
    ],
  },
  {
    slug: "solutions",
    tag: "SOLUTIONS",
    color: "#101820",
    image: media.solutions,
    name: { en: "Together Solutions", ar: "شريك الحلول للمشاريع" },
    short: {
      en: "Communication, marketing and end-to-end project and event delivery.",
      ar: "الاتصال والتسويق وإدارة المشاريع والفعاليات من البداية إلى النهاية.",
    },
    description: {
      en: "The group's founding division and its largest practice. Together Solutions plans and delivers communications, campaigns, launches and events for government entities, PIF companies and major corporates, from strategy through to on-site execution and reporting.",
      ar: "القسم المؤسس للمجموعة وأكبر ممارساتها. تخطّط شريك الحلول للمشاريع وتنفّذ الاتصال والحملات والإطلاقات والفعاليات للجهات الحكومية وشركات صندوق الاستثمارات العامة والشركات الكبرى، من الاستراتيجية حتى التنفيذ الميداني والتقرير الختامي.",
    },
    services: [
      { en: "Communication and marketing strategy", ar: "استراتيجية الاتصال والتسويق" },
      { en: "Business strategy and project planning", ar: "استراتيجية الأعمال وتخطيط المشاريع" },
      { en: "End-to-end project management", ar: "إدارة المشاريع من البداية إلى النهاية" },
      { en: "Product launches and campaigns", ar: "إطلاق المنتجات والحملات" },
    ],
  },
  {
    slug: "sports",
    tag: "SPORTS",
    color: "#CF1F2C",
    image: media.sports,
    name: { en: "Together Sports", ar: "شريك الحلول للرياضة" },
    short: {
      en: "Sports strategy, training programmes, talent and events.",
      ar: "الاستراتيجية الرياضية والبرامج التدريبية والمواهب والفعاليات.",
    },
    description: {
      en: "Together Sports builds sporting programmes with measurable outcomes: strategy and advisory work, training and education, talent pathways, and events delivered with clubs, federations and international partners such as LALIGA Business School.",
      ar: "تبني شريك الحلول للرياضة برامج رياضية بنتائج قابلة للقياس: الاستراتيجية والاستشارات، والتدريب والتعليم، ومسارات المواهب، والفعاليات بالشراكة مع الأندية والاتحادات وشركاء دوليين مثل كلية لاليغا للأعمال.",
    },
    services: [
      { en: "Sports strategy and advisory", ar: "الاستراتيجية والاستشارات الرياضية" },
      { en: "Educational and training programmes", ar: "البرامج التعليمية والتدريبية" },
      { en: "Talent identification and athlete management", ar: "اكتشاف المواهب وإدارة الرياضيين" },
      { en: "Sports events, sponsorships and partnerships", ar: "الفعاليات والرعايات والشراكات الرياضية" },
    ],
  },
  {
    slug: "real-estate",
    // Together Real Estate has its own website; links go there instead of a page here.
    externalUrl: "https://realestate.togethersolutions.com/en",
    tag: "REAL ESTATE",
    color: "#75797C",
    image: media.realEstate,
    name: { en: "Together Real Estate", ar: "شريك الحلول العقارية" },
    short: {
      en: "Property operations, brokerage and electronic leasing.",
      ar: "تشغيل العقارات والوساطة والتأجير الإلكتروني.",
    },
    description: {
      en: "Together Real Estate manages and operates property across the Kingdom, pairing asset operations with brokerage, e-leasing and electronic contracts issued under current Saudi regulation.",
      ar: "تدير وتشغّل شريك الحلول العقارية الأصول العقارية في المملكة، وتجمع بين تشغيل الأصول والوساطة العقارية والتأجير الإلكتروني والعقود الإلكترونية وفق الأنظمة السعودية المعتمدة.",
    },
    services: [
      { en: "Property management and operations", ar: "إدارة وتشغيل العقارات" },
      { en: "Brokerage", ar: "الوساطة العقارية" },
      { en: "E-leasing and electronic contracts", ar: "التأجير الإلكتروني والعقود الإلكترونية" },
    ],
  },
  {
    slug: "green",
    tag: "GREEN",
    color: "#00B373",
    image: media.green,
    name: { en: "Together Green", ar: "شريك الحلول الخضراء" },
    short: {
      en: "Agriculture, food security and afforestation.",
      ar: "الزراعة والأمن الغذائي والتشجير.",
    },
    description: {
      en: "Together Green works on agriculture and food security: planning agricultural projects, agronomic consultancy, afforestation, and the agreements that connect producers, technology and markets.",
      ar: "تعمل شريك الحلول الخضراء في الزراعة والأمن الغذائي: تخطيط المشاريع الزراعية، والاستشارات الزراعية، والتشجير، والاتفاقيات التي تربط المنتجين والتقنية والأسواق.",
    },
    services: [
      { en: "Agricultural project planning", ar: "تخطيط المشاريع الزراعية" },
      { en: "Agricultural consultancy", ar: "الاستشارات الزراعية" },
      { en: "Food security solutions", ar: "حلول الأمن الغذائي" },
      { en: "Afforestation", ar: "التشجير" },
    ],
  },
  {
    slug: "camp",
    tag: "CAMP",
    color: "#835E32",
    image: media.camp,
    name: { en: "Together Camp", ar: "شريك الحلول للفعاليات" },
    short: {
      en: "Team-building, camps and tourism with Hajj and Umrah guidance.",
      ar: "بناء فرق العمل والفعاليات والرحلات مع إرشاد الحج والعمرة.",
    },
    description: {
      en: "Together Camp designs programmes that bring people together: corporate team-building, camps and outdoor activity, and tourism trips supported by full Hajj and Umrah guidance.",
      ar: "تصمّم شريك الحلول للفعاليات برامج تجمع الناس: بناء فرق العمل للمؤسسات، والفعاليات والأنشطة الخارجية، والرحلات السياحية مع إرشاد كامل للحج والعمرة.",
    },
    services: [
      { en: "Team-building programmes", ar: "برامج بناء فرق العمل" },
      { en: "Tourism trips and Hajj / Umrah guidance", ar: "الرحلات السياحية وإرشاد الحج والعمرة" },
      { en: "Camps and outdoor activities", ar: "الفعاليات والأنشطة الخارجية" },
    ],
  },
];

export const DIVISION_MAP = DIVISIONS.reduce((acc, division) => {
  acc[division.slug] = division;
  return acc;
}, {});

export const getDivision = (slug) => DIVISION_MAP[slug] || DIVISION_MAP.solutions;

export const DIVISION_SLUGS = DIVISIONS.map((division) => division.slug);