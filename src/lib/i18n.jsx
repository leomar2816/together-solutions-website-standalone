import { useSiteContent } from "@/lib/site-content";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const DICT = {
  en: {
    "nav.about": "About",
    "nav.divisions": "Divisions",
    "nav.projects": "Projects",
    "nav.leadership": "Leadership",
    "nav.partners": "Partners",
    "nav.contact": "Contact",

    "cta.start": "Start a conversation",
    "cta.divisions": "Explore the divisions",
    "cta.viewAll": "View all projects",
    "cta.explore": "Explore",
    "cta.contact": "Contact the group",
    "cta.workWith": "Work with this division",

    "home.hero.title": "Progressing together toward a better future",
    "home.hero.body":
      "A Riyadh-based multi-sector group, working since 2010 across communications, sport, real estate, agriculture, camps and international trade for the Kingdom's largest organisations.",
    "home.vision.statement": "Our vision is the vision of our homeland",
    "home.vision.body":
      "Together has grown alongside Vision 2030, sector by sector: building the communication, the events, the sporting programmes, the agricultural projects and the international partnerships that the Kingdom's institutions need to deliver their mandates.",
    "home.ledger.title": "Proof, not promises",
    "home.ledger.body":
      "More than a decade of delivery across the Kingdom, measured in outputs a client can audit.",
    "home.divisions.title": "Six divisions, one group",
    "home.divisions.body":
      "Each division runs its own specialists and its own identity inside Together. All of them share one delivery standard, one project office and one point of contact.",
    "home.projects.title": "Recent projects",
    "home.projects.body":
      "A selection from the last five years, with government entities, PIF companies and international partners.",
    "home.partners.title": "Who we work with",
    "home.contact.title": "Tell us what you are building next",
    "home.contact.body":
      "Enquiries reach the group's project office and are routed to the division that fits the brief.",

    "about.title": "Built in Riyadh, for the Kingdom",
    "about.body":
      "Together began in 2010 as Together Solutions, a communications and events practice working with government entities in the capital. That practice grew into a group of six divisions serving the sectors Vision 2030 depends on.",
    "about.founded.title": "Since 2010",
    "about.founded.body":
      "From our base in Riyadh we deliver across every region of the Kingdom and operate on three continents, with partners in Europe, Asia and the Gulf.",
    "about.vision.title": "Vision",
    "about.vision.body":
      "To be the leading strategic partner in providing innovative and diverse solutions, in line with the Kingdom's Vision 2030.",
    "about.mission.title": "Mission",
    "about.mission.body":
      "To design and deliver solutions that create measurable impact for our clients, through specialist teams, disciplined project management and partners who share our standards.",
    "about.values.title": "Core values",
    "about.values.body":
      "Five commitments that govern how we take on work and how we report on it.",
    "about.approach.title": "Our approach",
    "about.approach.body":
      "The same four stages run through every engagement, from a 200-person training programme to a national exhibition.",

    "projects.title": "Projects",
    "projects.body":
      "Every engagement we can name publicly, arranged by the year it started. Filter by division, or jump to a year.",
    "projects.filter.division": "Division",
    "projects.filter.year": "Year",
    "projects.count": "{n} projects",
    "projects.empty": "No projects match this filter.",
    "projects.clear": "Clear filters",

    "leadership.title": "Leadership",
    "leadership.body":
      "The group is led by two principals who have worked together on communications, investment and institutional projects across the Kingdom.",

    "partners.title": "Partners",
    "partners.body":
      "Government entities, PIF companies, international institutions and brands the group has delivered with.",
    "partners.note": "Logos are reproduced from the Together company profile and belong to their respective owners.",

    "contact.title": "Contact",
    "contact.body":
      "Tell us about the programme, launch or partnership you are planning. Enquiries are read by the group's project office and routed to the right division.",
    "contact.location.title": "Head office",
    "contact.location.value": "Riyadh, Saudi Arabia",
    "contact.hours": "Sunday to Thursday, 09:00 to 17:00 (AST)",

    "form.name": "Full name",
    "form.organisation": "Organisation",
    "form.email": "Email",
    "form.phone": "Phone",
    "form.division": "Division of interest",
    "form.message": "How can we help?",
    "form.submit": "Send enquiry",
    "form.sending": "Sending",
    "form.select": "Select a division",
    "form.optional": "optional",
    "form.required": "This field is required",
    "form.invalidEmail": "Enter a valid email address",
    "form.success.title": "Enquiry received",
    "form.success.body": "Thank you. The project office will reply within one working day.",
    "form.again": "Send another enquiry",
    "form.error": "The enquiry could not be sent. Please try again, or email us directly.",

    "footer.blurb":
      "A Riyadh-based multi-sector group: communications, sport, real estate, agriculture, camps and international trade.",
    "footer.divisions": "Divisions",
    "footer.group": "The group",
    "footer.contact": "Get in touch",
    "footer.rights": "All rights reserved.",

    "division.services": "Services",
    "division.projects": "Related projects",
    "division.projects.empty": "Selected projects for this division are shared on request.",
    "division.back": "All divisions",

    "maintenance.title": "We're improving our website",
    "maintenance.body":
      "The Together Solutions website is being updated and will be back shortly. Thank you for your patience.",
    "maintenance.signin": "Staff sign in",
    "maintenance.checking": "Checking your access",
    "maintenance.noAccess": "This account doesn't have admin access.",
    "maintenance.signout": "Sign out",
  },
  ar: {
    "nav.about": "من نحن",
    "nav.divisions": "الأقسام",
    "nav.projects": "المشاريع",
    "nav.leadership": "القيادة",
    "nav.partners": "الشركاء",
    "nav.contact": "تواصل",

    "cta.start": "ابدأ حوارًا",
    "cta.divisions": "استكشف الأقسام",
    "cta.viewAll": "جميع المشاريع",
    "cta.explore": "استكشف",
    "cta.contact": "تواصل مع المجموعة",
    "cta.workWith": "اعمل مع هذا القسم",

    "home.hero.title": "نتقدّم معًا نحو مستقبل أفضل",
    "home.hero.body":
      "مجموعة متعددة القطاعات مقرها الرياض، تعمل منذ عام 2010 في الاتصال والرياضة والعقارات والزراعة والفعاليات والتجارة الدولية لخدمة كبرى جهات المملكة.",
    "home.vision.statement": "رؤيتنا هي رؤية وطننا",
    "home.vision.body":
      "نمت شريك بموازاة رؤية 2030، قطاعًا بعد قطاع: بناء الاتصال والفعاليات والبرامج الرياضية والمشاريع الزراعية والشراكات الدولية التي تحتاجها مؤسسات المملكة لتحقيق مستهدفاتها.",
    "home.ledger.title": "أثر قابل للقياس",
    "home.ledger.body": "أكثر من عشر سنوات من التنفيذ في المملكة، بمخرجات يمكن للعميل مراجعتها.",
    "home.divisions.title": "ستة أقسام، مجموعة واحدة",
    "home.divisions.body":
      "كل قسم يعمل بفريقه المتخصص وهوّيته داخل شريك، وتجمعها جميعًا معايير تنفيذ واحدة ومكتب مشاريع واحد ونقطة تواصل واحدة.",
    "home.projects.title": "أحدث المشاريع",
    "home.projects.body":
      "مختارات من السنوات الخمس الماضية مع الجهات الحكومية وشركات صندوق الاستثمارات العامة والشركاء الدوليين.",
    "home.partners.title": "من نعمل معهم",
    "home.contact.title": "أخبرنا بما تعمل عليه",
    "home.contact.body": "تصل الطلبات إلى مكتب المشاريع في المجموعة وتُوجّه إلى القسم المناسب.",

    "about.title": "تأسّست في الرياض، لخدمة المملكة",
    "about.body":
      "بدأت شريك عام 2010 باسم شريك الحلول للمشاريع، ممارسة في الاتصال والفعاليات مع الجهات الحكومية في العاصمة. نمت تلك الممارسة لتصبح مجموعة من ستة أقسام تخدم القطاعات التي تقوم عليها رؤية 2030.",
    "about.founded.title": "منذ 2010",
    "about.founded.body":
      "من مقرنا في الرياض ننفّذ في جميع مناطق المملكة، ونعمل في ثلاث قارات مع شركاء في أوروبا وآسيا والخليج.",
    "about.vision.title": "الرؤية",
    "about.vision.body":
      "أن نكون الشريك الاستراتيجي الرائد في تقديم حلول مبتكرة ومتنوعة تواكب رؤية المملكة 2030.",
    "about.mission.title": "الرسالة",
    "about.mission.body":
      "أن نصمّم وننفّذ حلولًا تصنع أثرًا قابلًا للقياس لعملائنا، عبر فرق متخصصة وإدارة مشاريع منضبطة وشركاء يشاركوننا المعايير نفسها.",
    "about.values.title": "القيم",
    "about.values.body": "خمسة التزامات تحكم طريقة تبنّينا للأعمال وطريقة إبلاغنا عن نتائجها.",
    "about.approach.title": "منهجيتنا",
    "about.approach.body":
      "أربع مراحل واحدة تمر بها كل مشاريعنا، من برنامج تدريبي لمئتي شخص إلى معرض وطني.",

    "projects.title": "المشاريع",
    "projects.body":
      "كل مشروع يمكننا الإعلان عنه، مرتبًا حسب سنة البداية. صنّف حسب القسم أو انتقل إلى سنة محددة.",
    "projects.filter.division": "القسم",
    "projects.filter.year": "السنة",
    "projects.count": "{n} مشروعًا",
    "projects.empty": "لا توجد مشاريع مطابقة لهذا التصنيف.",
    "projects.clear": "إلغاء التصنيف",

    "leadership.title": "القيادة",
    "leadership.body":
      "يقود المجموعة عضوان عملا معًا في مشاريع الاتصال والاستثمار والمشاريع المؤسسية في المملكة.",

    "partners.title": "الشركاء",
    "partners.body":
      "جهات حكومية وشركات صندوق الاستثمارات العامة ومؤسسات دولية وعلامات تجارية نفّذت المجموعة مشاريع معها.",
    "partners.note": "الشعارات مأخوذة من الملف التعريفي للمجموعة وهي ملك لأصحابها.",

    "contact.title": "تواصل",
    "contact.body":
      "أخبرنا عن البرنامج أو الإطلاق أو الشراكة التي تخطط لها. يقرأ مكتب المشاريع الطلبات ويوجّهها إلى القسم المناسب.",
    "contact.location.title": "المقر الرئيسي",
    "contact.location.value": "الرياض، المملكة العربية السعودية",
    "contact.hours": "من الأحد إلى الخميس، 9:00 – 17:00",

    "form.name": "الاسم الكامل",
    "form.organisation": "جهة العمل",
    "form.email": "البريد الإلكتروني",
    "form.phone": "رقم الجوال",
    "form.division": "القسم محل الاهتمام",
    "form.message": "كيف يمكننا المساعدة؟",
    "form.submit": "إرسال الطلب",
    "form.sending": "جارٍ الإرسال",
    "form.select": "اختر القسم",
    "form.optional": "اختياري",
    "form.required": "هذا الحقل مطلوب",
    "form.invalidEmail": "أدخل بريدًا إلكترونيًا صحيحًا",
    "form.success.title": "تم استلام طلبك",
    "form.success.body": "شكرًا لك. سيتواصل معك مكتب المشاريع خلال يوم عمل واحد.",
    "form.again": "إرسال طلب آخر",
    "form.error": "تعذّر إرسال الطلب. حاول مرة أخرى أو راسلنا مباشرة.",

    "footer.blurb":
      "مجموعة متعددة القطاعات مقرها الرياض: الاتصال والرياضة والعقارات والزراعة والفعاليات والتجارة الدولية.",
    "footer.divisions": "الأقسام",
    "footer.group": "المجموعة",
    "footer.contact": "للتواصل",
    "footer.rights": "جميع الحقوق محفوظة.",

    "division.services": "الخدمات",
    "division.projects": "مشاريع ذات صلة",
    "division.projects.empty": "تُشارك مشاريع هذا القسم المختارة عند الطلب.",
    "division.back": "جميع الأقسام",

    "maintenance.title": "نعمل على تطوير موقعنا",
    "maintenance.body": "يجري تحديث موقع شريك الحلول للمشاريع وسيعود قريبًا. شكرًا لصبركم.",
    "maintenance.signin": "دخول فريق العمل",
    "maintenance.checking": "جارٍ التحقق من الصلاحية",
    "maintenance.noAccess": "لا يملك هذا الحساب صلاحية الإدارة.",
    "maintenance.signout": "تسجيل الخروج",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("together-lang");
      if (saved === "ar" || saved === "en") setLang(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    const isArabic = lang === "ar";
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("together-lang", lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  // Text an admin has published in the content manager wins over the built-in copy.
  const { texts } = useSiteContent();
  const t = useCallback(
    (key) => texts?.[lang]?.[key] || DICT[lang]?.[key] || texts?.en?.[key] || DICT.en[key] || key,
    [lang, texts],
  );
  const pick = useCallback(
    (value) => (value && typeof value === "object" ? value[lang] ?? value.en ?? "" : value ?? ""),
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, isAr: lang === "ar", t, pick }), [lang, t, pick]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used inside LanguageProvider");
  return context;
}