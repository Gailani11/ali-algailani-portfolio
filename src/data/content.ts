/**
 * Portfolio content — transcribed from "Ali Algailani Portfolio 2026.pdf" (51 pages).
 * The PDF is the single source of truth: names, descriptions, captions, palettes,
 * page counts and contact details below are copied from it verbatim.
 * Short UI strings (labels, button text) are website copy only.
 */
import { ID_TILES } from './assets';

export type ChapterKey = 'logos' | 'identity' | 'uiux' | 'profiles' | 'print' | 'social';

export interface Chapter {
  n: string;
  key: ChapterKey;
  en: string;
  ar: string;
  /** Page number of the chapter divider in the PDF (from the PDF index page). */
  page: number;
}

export const CHAPTERS: Chapter[] = [
  { n: '01', key: 'logos', en: 'Logos', ar: 'الشعارات', page: 5 },
  { n: '02', key: 'identity', en: 'Visual Identities', ar: 'الهويات البصرية', page: 7 },
  { n: '03', key: 'uiux', en: 'UI / UX', ar: 'واجهات وتجربة المستخدم', page: 24 },
  { n: '04', key: 'profiles', en: 'Company Profiles', ar: 'بروفايلات الشركات', page: 31 },
  { n: '05', key: 'print', en: 'Print', ar: 'المطبوعات', page: 38 },
  { n: '06', key: 'social', en: 'Social Media', ar: 'السوشيال ميديا', page: 44 },
];

export const PERSON = {
  nameEn: 'Ali Algailani',
  nameAr: 'علي الجيلاني',
  title: 'Senior Graphic & UI/UX Designer',
  email: 'info@alialgailani.com',
  phone: '+966 50 235 1845',
  whatsapp: 'https://wa.me/966502351845',
  location: 'Saudi Arabia',
  year: '2026',
  pdf: 'Ali-Algailani-Portfolio-2026.pdf',
};

export const COVER = {
  kicker: ['Branding', 'UI/UX', 'Social'],
  titleAr: 'ملف أعمال',
  titleEn: 'Portfolio',
  disciplinesAr: ['تصميم', 'هوية بصرية', 'شعارات', 'واجهات', 'سوشيال ميديا'],
};

export const WELCOME = {
  ar: 'أهلًا',
  en: 'Welcome',
  lineAr: 'بين يديكم ملف أعمالي الذي أفتخر به',
  lineEn: 'In your hands is a portfolio I am proud of.',
};

export const ABOUT = {
  headingEn: 'I am Ali',
  headingAr: 'أنا علي',
  bioEn:
    'A multidisciplinary graphic & UI/UX designer who turns ideas into clear, memorable visual work — brand identities, interfaces, and print built to communicate.',
  bioAr:
    'مصمم جرافيكي وواجهات مستخدم متعدّد التخصصات، يحوّل الأفكار إلى أعمال بصرية واضحة تترك أثرًا: هويات تجارية، واجهات، ومطبوعات تخدم التواصل.',
  /** Skills list, English and Arabic, in the PDF's order. `chapter` links a skill to where it is shown. */
  skills: [
    { en: 'Brand Identity Development', ar: 'بناء وتطوير الهويات التجارية', chapter: 'identity' },
    { en: 'Logo Design', ar: 'ابتكار وتصميم الشعارات', chapter: 'logos' },
    { en: 'UI/UX Design', ar: 'تصميم واجهات المستخدم UI/UX', chapter: 'uiux' },
    { en: 'Presentations & Profiles', ar: 'تصميم العروض والبروفايلات', chapter: 'profiles' },
    { en: 'Advertising Design', ar: 'تصميم المنشورات الإعلانية', chapter: 'social' },
    { en: 'Print Design', ar: 'تصميم كافة أنواع المطبوعات', chapter: 'print' },
    { en: 'Social Media Design', ar: 'تصميم السوشيال ميديا', chapter: 'social' },
  ] as { en: string; ar: string; chapter: ChapterKey }[],
  tools: [
    { abbr: 'Ps', name: 'Photoshop', bg: '#001E36', fg: '#31A8FF' },
    { abbr: 'Ai', name: 'Illustrator', bg: '#330000', fg: '#FF9A00' },
    { abbr: 'Pr', name: 'Premiere', bg: '#2A0634', fg: '#9999FF' },
    { abbr: 'Ae', name: 'After Effects', bg: '#1A0E3A', fg: '#9999FF' },
    { abbr: 'Id', name: 'InDesign', bg: '#49021F', fg: '#FF3366' },
    { abbr: 'Ac', name: 'Acrobat', bg: '#3A0000', fg: '#FF5B5B' },
  ],
};

export const THANKS = {
  kicker: 'Get in touch',
  ar: 'شكرًا',
  en: 'Thank you',
  lineAr: 'سعدت بمشاركتكم أعمالي — وأتطلع للعمل معكم',
};

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export interface Screen {
  en: string;
  ar: string;
  note: string;
  noteAr: string;
}

interface Base {
  id: string;
  kind: ChapterKey;
  name: string;
  ar?: string;
  /** Short category line as printed in the PDF (e.g. "Gifts & Retail"). */
  sector: string;
  sectorAr?: string;
  description?: string;
  descriptionAr?: string;
  scope?: string;
  scopeAr?: string;
  year: string;
  accent: string;
  /** PDF pages this project occupies — drives the folio counter. */
  pages: number[];
  cover: string;
}

export interface Identity extends Base {
  kind: 'identity';
  index: number;
  palette: string[];
  mark: string;
  logo: string;
  tiles: string[];
}
export interface UIProduct extends Base {
  kind: 'uiux';
  index: number;
  hero: string;
  screens: (Screen & { img: string })[];
}
export interface Profile extends Base {
  kind: 'profiles';
  index: number;
  pageCount: number;
  hero: string;
  strip: string;
  language: string;
  languageAr: string;
}
export interface PrintPiece extends Base {
  kind: 'print';
  index: number;
  format: string;
  formatAr: string;
  nameAr?: string;
  images: string[];
  strip?: string;
}
export interface SocialSet extends Base {
  kind: 'social';
  index: number;
  phone: string;
  posts: string[];
}
export type Project = Identity | UIProduct | Profile | PrintPiece | SocialSet;

const idScope = 'Logo · Visual Identity';

const identityRaw: Omit<Identity, 'kind' | 'index' | 'mark' | 'logo' | 'tiles' | 'cover' | 'year' | 'scope'>[] = [
  {
    id: 'gift-zone', name: 'Gift Zone', ar: 'جِفت زون', sector: 'Gifts & Retail', accent: '#0F765F', pages: [8, 9],
    description:
      'Gift Zone is all about surprise, joy and beautiful moments. The logo combines the letters G and Z with a gift box and ribbon for a memorable, friendly identity.',
    sectorAr: 'هدايا وتجزئة',
    descriptionAr:
      'جفت زون عن المفاجأة والفرح واللحظات الجميلة. يجمع الشعار الحرفين G وZ مع صندوق هدية وشريطة، في هوية ودودة لا تُنسى.',
    palette: ['#0F765F', '#6E2A85', '#C3CFD4', '#3D917E', '#EAF0F0'],
  },
  {
    id: 'al-omari', name: 'Al-Omari', ar: 'العمري', sector: 'Law · Legal Consulting', accent: '#2A2550', pages: [10, 11],
    description:
      'Al-Omari Law Firm stands for trust, integrity and legal expertise. The AS monogram — the initials of Ahmed & Saleh — meets the scales of justice.',
    sectorAr: 'محاماة · استشارات قانونية',
    descriptionAr:
      'مكتب العمري للمحاماة يمثّل الثقة والنزاهة والخبرة القانونية. يلتقي فيه مونوغرام AS — الحرفان الأولان من أحمد وصالح — مع ميزان العدالة.',
    palette: ['#CFA387', '#2A2550', '#C2B8BC', '#DCBCA6', '#D4AC93'],
  },
  {
    id: 'learn-mys', name: 'Learn MYS', sector: 'Education · E-Learning', accent: '#3675B2', pages: [12, 13],
    description:
      'Learn MYS is about growth, knowledge and new opportunities. A rising figure in a graduation cap emerges from an open book, in layered blues.',
    sectorAr: 'تعليم · تعلّم إلكتروني',
    descriptionAr:
      'Learn MYS عن النمو والمعرفة والفرص الجديدة. شخصية صاعدة بقبعة التخرج تخرج من كتاب مفتوح، بطبقات متدرّجة من الأزرق.',
    palette: ['#305A8F', '#CBD7E5', '#AFC2D8', '#3675B2', '#90A5C1'],
  },
  {
    id: 'mr-group', name: 'MR Group', sector: 'Car Rental & Tourism', accent: '#B8911F', pages: [14, 15],
    description:
      'MR Group is about premium travel, mobility and tourism. Bold MR initials sit within a golden circular sweep for a confident, upscale identity.',
    sectorAr: 'تأجير سيارات وسياحة',
    descriptionAr:
      'MR Group عن السفر الراقي والتنقّل والسياحة. حرفا MR بخط عريض داخل انحناءة دائرية ذهبية، لهوية واثقة وفاخرة.',
    palette: ['#CFB683', '#B8911F', '#C4A125', '#E0CFA6', '#D4B630'],
  },
  {
    id: 'villa-puteri', name: 'Villa Puteri', ar: 'فيلا بوتري', sector: 'Villa Rental', accent: '#1270B7', pages: [16, 17],
    description:
      'Villa Puteri offers comfortable villas for rent. A bright house mark in blue and sunlit yellow creates a friendly, welcoming identity.',
    sectorAr: 'تأجير فلل',
    descriptionAr:
      'فيلا بوتري تقدّم فللًا مريحة للإيجار. علامة منزل مشرقة بالأزرق والأصفر المشمس تصنع هوية ودودة ومرحّبة.',
    palette: ['#1270B7', '#FDD717', '#E0ECF4', '#AFCFE7', '#C5DCED'],
  },
  {
    id: 'shams-store', name: 'Shams Store', ar: 'متجر شمس', sector: 'E-Commerce · Accessories & Prints', accent: '#F07E14', pages: [18, 19],
    description:
      'Shams Store is an online shop for accessories and prints. A glowing sun with radiating rays anchors a warm, energetic identity.',
    sectorAr: 'تجارة إلكترونية · إكسسوارات ومطبوعات',
    descriptionAr:
      'متجر شمس متجر إلكتروني للإكسسوارات والمطبوعات. شمس متوهّجة بأشعة ممتدة ترتكز عليها هوية دافئة ومفعمة بالطاقة.',
    palette: ['#F07E14', '#F4994A', '#F8B579', '#FAD5AC', '#FEF4E9'],
  },
  {
    id: 'scc', name: 'SCC', ar: 'القنوات الذكية', sector: 'Fire-Fighting Systems', accent: '#EB1D25', pages: [20, 21],
    description:
      'Smart Channels Company installs and supplies fire-fighting systems. The SCC monogram sits in a solid rounded frame beneath a clean flame mark.',
    sectorAr: 'أنظمة مكافحة الحريق',
    descriptionAr:
      'شركة القنوات الذكية تورّد وتركّب أنظمة مكافحة الحريق. يستقر مونوغرام SCC داخل إطار مستدير متين أسفل علامة لهب نظيفة.',
    palette: ['#D4CBCB', '#707070', '#ABAAAA', '#403E3E', '#EB1D25'],
  },
  {
    id: 'afak', name: 'AFAK', ar: 'آفق الاحترافية', sector: 'Business Solutions', accent: '#1A2D58', pages: [22, 23],
    description:
      'Afaq Al-Ihtirafiyah delivers professional business solutions with trust and precision. A clean, geometric AFAK wordmark in deep navy sits above a refined beige subtitle.',
    sectorAr: 'حلول الأعمال',
    descriptionAr:
      'آفاق الاحترافية تقدّم حلول أعمال احترافية بثقة ودقة. شعار كتابي هندسي نظيف لـ AFAK بالكحلي العميق، فوق عنوان فرعي بلون بيج راقٍ.',
    palette: ['#1A2D58', '#D6B696', '#B8BDCA', '#EEEAE7', '#8992A8'],
  },
];

export const IDENTITIES: Identity[] = identityRaw.map((p, i) => ({
  ...p,
  kind: 'identity',
  index: i + 1,
  id: p.id,
  year: '2026',
  scope: idScope,
  scopeAr: 'شعار · هوية بصرية',
  mark: `id/${p.id}/mark`,
  logo: `logos/${p.id}`,
  tiles: ID_TILES[p.id] ?? [],
  cover: (ID_TILES[p.id] ?? [])[0],
}));

const fcScreens: Screen[] = [
  { en: 'Sign up & verify', ar: 'تسجيل وتحقق', note: 'Phone, OTP, profile.', noteAr: 'رقم الجوال، رمز التحقق، الملف الشخصي.' },
  { en: 'Vehicle & connector', ar: 'السيارة والقابس', note: 'Connector drives the map.', noteAr: 'نوع القابس يحدّد ما تعرضه الخريطة.' },
  { en: 'Pair charge key', ar: 'إقران المفتاح', note: 'NFC, charge point, or manual.', noteAr: 'عبر NFC أو نقطة الشحن أو يدويًا.' },
  { en: 'Wallet & history', ar: 'المحفظة والسجل', note: 'Balance before the drive.', noteAr: 'الرصيد قبل الانطلاق.' },
  { en: 'Charging session', ar: 'جلسة الشحن', note: 'Live speed, energy, cost.', noteAr: 'السرعة والطاقة والتكلفة لحظة بلحظة.' },
  { en: 'Membership & offers', ar: 'العضوية والعروض', note: 'Premium tier and partners.', noteAr: 'الباقة المميزة والشركاء.' },
  { en: 'Charge keys', ar: 'مفاتيح الشحن', note: 'NFC, pairing, or order one.', noteAr: 'عبر NFC أو الإقران أو طلب مفتاح جديد.' },
  { en: 'Read the key', ar: 'قراءة المفتاح', note: 'Hold the key to the phone.', noteAr: 'قرّب المفتاح من الجوال.' },
  { en: 'Station & connector', ar: 'المحطة والقابس', note: 'CTA stays off until valid.', noteAr: 'زر المتابعة معطّل حتى تكتمل البيانات.' },
  { en: 'Order a key', ar: 'طلب مفتاح', note: 'Shipping and payment inline.', noteAr: 'الشحن والدفع في الشاشة نفسها.' },
  { en: 'Payment confirmed', ar: 'تأكيد الدفع', note: 'Receipt, then straight back.', noteAr: 'الإيصال، ثم العودة مباشرة.' },
  { en: 'Partner offers', ar: 'عروض الشركاء', note: 'Redeem against an invoice.', noteAr: 'استبدال العرض مقابل فاتورة.' },
];
const trScreens: Screen[] = [
  { en: 'Onboarding', ar: 'الشاشة التعريفية', note: 'Three slides, one promise.', noteAr: 'ثلاث شاشات، ووعد واحد.' },
  { en: 'Update as you go', ar: 'تحديث فوري', note: 'Sync framed as a habit.', noteAr: 'المزامنة عادةٌ يومية.' },
  { en: 'Smart filtering', ar: 'فلترة ذكية', note: 'Search before scrolling.', noteAr: 'البحث قبل التمرير.' },
  { en: 'Create account', ar: 'إنشاء حساب', note: 'Company captured up front.', noteAr: 'اسم الشركة من الخطوة الأولى.' },
  { en: 'Sign in', ar: 'تسجيل الدخول', note: 'Two fields, nothing else.', noteAr: 'حقلان فقط، لا أكثر.' },
  { en: 'Project switch', ar: 'تبديل المشروع', note: 'Empty state states the reason.', noteAr: 'الحالة الفارغة توضّح السبب.' },
  { en: 'Point cards', ar: 'بطاقات النقاط', note: 'One ring per point.', noteAr: 'حلقة تقدّم واحدة لكل نقطة.' },
  { en: 'Troubled point', ar: 'نقطة متعثرة', note: 'Colour carries the alert.', noteAr: 'اللون يحمل التنبيه.' },
  { en: 'Card expanded', ar: 'بطاقة موسّعة', note: 'Four stages plus serial scan.', noteAr: 'أربع مراحل مع مسح الرقم التسلسلي.' },
  { en: 'Point in tree', ar: 'نقطة في الشجرة', note: 'Same card, tree context.', noteAr: 'البطاقة نفسها داخل الشجرة.' },
  { en: 'Site hierarchy', ar: 'شجرة الموقع', note: 'Hotel, building, floor, point.', noteAr: 'الفندق، المبنى، الطابق، النقطة.' },
  { en: 'Tree in context', ar: 'الشجرة بالتفصيل', note: 'Detail without losing place.', noteAr: 'التفاصيل دون أن تفقد موقعك.' },
];
const withImgs = (slug: string, s: Screen[]) =>
  s.map((x, i) => ({ ...x, img: `ui/${slug}/s${String(i + 1).padStart(2, '0')}` }));

export const PRODUCTS: UIProduct[] = [
  {
    id: 'fully-charged', kind: 'uiux', index: 1, name: 'Fully Charged', ar: 'فولي تشارجد',
    sector: 'EV Charging · Mobile App',
    sectorAr: 'شحن السيارات الكهربائية · تطبيق جوال',
    description: 'A multi-network EV charging platform for the Gulf — stations, wallet, membership and offers in one app.',
    descriptionAr: 'منصة شحن متعددة الشبكات للسيارات الكهربائية في الخليج — المحطات والمحفظة والعضوية والعروض في تطبيق واحد.',
    scopeAr: 'واجهات · تجربة المستخدم · نظام تصميم',
    scope: 'UI · UX · Design System', year: '2026', accent: '#14B84A', pages: [25, 26, 27],
    hero: 'ui/fully-charged/hero', cover: 'ui/fully-charged/hero', screens: withImgs('fully-charged', fcScreens),
  },
  {
    id: 'trackulizer', kind: 'uiux', index: 2, name: 'Trackulizer', ar: 'تراكولايزر',
    sector: 'Project Tracking · Mobile App',
    sectorAr: 'تتبّع المشاريع · تطبيق جوال',
    descriptionAr:
      'تطبيق لتتبّع مواقع تركيبات التيار المنخفض — كل نقطة تُتتبّع من المبنى إلى الطابق إلى الغرفة، مع تقدّم مباشر لكل مرحلة.',
    scopeAr: 'واجهات · تجربة المستخدم · نظام تصميم',
    description:
      'A site-tracking app for low-current installations — every point traced from building to floor to room, with live progress per stage.',
    scope: 'UI · UX · Design System', year: '2026', accent: '#3A9BE0', pages: [28, 29, 30],
    hero: 'ui/trackulizer/hero', cover: 'ui/trackulizer/hero', screens: withImgs('trackulizer', trScreens),
  },
];

const cpScope = 'Layout · Infographics · Print';
export const PROFILES: Profile[] = [
  {
    id: 'bits-arabia', name: 'BITS Arabia', ar: 'بيتس أرابيا', pageCount: 25, language: 'English',
    description:
      'A 25-page corporate profile for a systems integrator — story, services, partners and landmark projects on one editorial grid.',
    descriptionAr:
      'بروفايل شركة من 25 صفحة لشركة تكامل أنظمة — القصة والخدمات والشركاء والمشاريع البارزة على شبكة تحريرية واحدة.',
    languageAr: 'الإنجليزية',
    accent: '#D71F2B', pages: [32],
  },
  {
    id: 'bits-wellness', name: 'BITS Wellness', ar: 'بيتس أرابيا — الرعاية الصحية', pageCount: 29, language: 'English',
    description:
      'A 29-page healthcare solutions profile — ten clinical systems, their integrations and ROI evidence in one consistent layout.',
    descriptionAr:
      'بروفايل حلول رعاية صحية من 29 صفحة — عشرة أنظمة سريرية وتكاملاتها وأدلة العائد على الاستثمار في تخطيط واحد متّسق.',
    languageAr: 'الإنجليزية',
    accent: '#D71F2B', pages: [33],
  },
  {
    id: 'bits-hospitality', name: 'BITS Hospitality', ar: 'بيتس أرابيا — الضيافة', pageCount: 14, language: 'English',
    description:
      'A 14-page hospitality profile — services, competitive edge and landmark hotel projects across the Kingdom.',
    descriptionAr:
      'بروفايل ضيافة من 14 صفحة — الخدمات والميزة التنافسية ومشاريع فندقية بارزة في أنحاء المملكة.',
    languageAr: 'الإنجليزية',
    accent: '#D71F2B', pages: [34],
  },
  {
    id: 'smart-channels', name: 'Smart Channels', ar: 'القنوات الذكية — أنظمة الحريق', pageCount: 16, language: 'Arabic & English',
    description:
      'A 16-page bilingual corporate profile for a fire-safety contractor — vision, services, certifications and clients in Arabic and English.',
    descriptionAr:
      'بروفايل شركة ثنائي اللغة من 16 صفحة لمقاول سلامة من الحريق — الرؤية والخدمات والشهادات والعملاء بالعربية والإنجليزية.',
    languageAr: 'العربية والإنجليزية',
    accent: '#D71F2B', pages: [35],
  },
  {
    id: 'careinn', name: 'CareInn', ar: 'كير إن — تقنيات تجربة المريض', pageCount: 21, language: 'Arabic',
    description:
      'A 21-page Arabic corporate profile for a Saudi health-tech company — six patient-experience products, regional reach and awards.',
    descriptionAr:
      'بروفايل شركة عربي من 21 صفحة لشركة سعودية في التقنيات الصحية — ستة منتجات لتجربة المريض، وانتشار إقليمي، وجوائز.',
    languageAr: 'العربية',
    accent: '#35B4E5', pages: [36],
  },
  {
    id: 'nahr', name: 'Nahr', ar: 'نهر — تمكين الصم', pageCount: 6, language: 'Arabic',
    description:
      'A 6-page Arabic profile for a Saudi foundation empowering the deaf — story, message, services and strengths, told through sign-language hands.',
    descriptionAr:
      'بروفايل عربي من 6 صفحات لمؤسسة سعودية لتمكين الصم — القصة والرسالة والخدمات ومواطن القوة، تُروى بأيدٍ بلغة الإشارة.',
    languageAr: 'العربية',
    accent: '#1F6FC4', pages: [37],
  },
].map((p, i) => ({
  ...p,
  id: p.id,
  kind: 'profiles' as const,
  index: i + 1,
  sector: 'Corporate Profile · Print & Digital',
  sectorAr: 'بروفايل شركة · مطبوع ورقمي',
  scope: cpScope,
  scopeAr: 'إخراج · إنفوجرافيك · طباعة',
  year: '2026',
  hero: `cp/${p.id}/hero`,
  strip: `cp/${p.id}/strip`,
  cover: `cp/${p.id}/hero`,
}));

/** Print pieces carry no captions in the PDF — only names visible on the work and the format are used. */
export const PRINTS: PrintPiece[] = [
  {
    id: 'abusloum', kind: 'print', index: 1, name: 'Mahmoud Abusloum × ISRA Consulting', nameAr: 'محمود أبوسلوم × ISRA للاستشارات', sector: 'Consulting', sectorAr: 'استشارات', format: 'Brochure · 5 pages', formatAr: 'بروشور · 5 صفحات',
    year: '2026', accent: '#1B2A3A', pages: [39], images: ['pr/abusloum/hero'], strip: 'pr/abusloum/strip', cover: 'pr/abusloum/hero',
  },
  {
    id: 'careinn-brochure', kind: 'print', index: 2, name: 'CareInn — Healthcare Redefined', nameAr: 'كير إن — Healthcare Redefined', sector: 'Health-tech', sectorAr: 'تقنيات صحية', format: 'Brochure · 12 pages', formatAr: 'بروشور · 12 صفحة',
    year: '2026', accent: '#35B4E5', pages: [40], images: ['pr/careinn/hero'], strip: 'pr/careinn/strip', cover: 'pr/careinn/hero',
  },
  {
    id: 'amals-kitchen', kind: 'print', index: 3, name: "Amal's Kitchen", sector: 'Food', sectorAr: 'مطاعم', format: 'Food menu · 4 pages', formatAr: 'قائمة طعام · 4 صفحات',
    year: '2026', accent: '#F2A81D', pages: [41],
    images: ['pr/amals-kitchen/01', 'pr/amals-kitchen/02', 'pr/amals-kitchen/03', 'pr/amals-kitchen/04', 'pr/amals-kitchen/05'],
    cover: 'pr/amals-kitchen/01',
  },
  {
    id: 'ghamsa', kind: 'print', index: 4, name: 'Ghamsa', ar: 'غمسة', sector: 'Food', sectorAr: 'مطاعم', format: 'Menu', formatAr: 'قائمة طعام',
    year: '2026', accent: '#E9A91F', pages: [42], images: ['pr/ghamsa/01', 'pr/ghamsa/02', 'pr/ghamsa/03'], cover: 'pr/ghamsa/01',
  },
  {
    id: 'kopii-leaflet', kind: 'print', index: 5, name: 'KOPII', sector: 'Coffee', sectorAr: 'قهوة', format: 'Fold-out leaflet · 7 panels', formatAr: 'مطوية · 7 أقسام',
    year: '2026', accent: '#1F4D45', pages: [43], images: ['pr/kopii/01', 'pr/kopii/02'], cover: 'pr/kopii/01',
  },
];

const posts = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `sm/${slug}/${String(i + 1).padStart(2, '0')}`);
export const SOCIALS: SocialSet[] = [
  { id: 'kopii', name: 'KOPII', sector: 'Coffee', sectorAr: 'قهوة', accent: '#1F4D45', pages: [45], n: 6 },
  { id: 'memories', name: 'Memories', sector: 'Food', sectorAr: 'أغذية', accent: '#B3261E', pages: [46], n: 3 },
  { id: 'safanova', name: 'Safanova', sector: 'Skincare', sectorAr: 'عناية بالبشرة', accent: '#E6457A', pages: [47], n: 3 },
  { id: 'ghamsa', name: 'Ghamsa', ar: 'غمسة', sector: 'Food', sectorAr: 'مطاعم', accent: '#C88A2B', pages: [48], n: 3 },
  { id: 'bits-arabia', name: 'BITS Arabia', ar: 'بيتس أرابيا', sector: 'Systems Integration', sectorAr: 'تكامل الأنظمة', accent: '#D71F2B', pages: [49], n: 8 },
  { id: 'careinn', name: 'CareInn', ar: 'كير إن', sector: 'Health-tech', sectorAr: 'تقنيات صحية', accent: '#1C6FB5', pages: [50], n: 8 },
].map((s, i) => ({
  id: s.id,
  kind: 'social' as const,
  index: i + 1,
  name: s.name,
  ar: s.ar,
  sector: s.sector,
  sectorAr: s.sectorAr,
  accent: s.accent,
  pages: s.pages,
  year: '2026',
  phone: `sm/${s.id}/phone`,
  posts: posts(s.id, s.n),
  cover: `sm/${s.id}/01`,
}));

/** Selected logos, in the order of the PDF's "Selected Work" page (p. 06). */
export const LOGOS = [
  { id: 'afak', name: 'AFAK', sector: 'Business Solutions', sectorAr: 'حلول الأعمال', to: 'id-afak' },
  { id: 'al-omari', name: 'Al-Omari', sector: 'Law · Legal Consulting', sectorAr: 'محاماة · استشارات قانونية', to: 'id-al-omari' },
  { id: 'scc', name: 'SCC', sector: 'Fire-Fighting Systems', sectorAr: 'أنظمة مكافحة الحريق', to: 'id-scc' },
  { id: 'gift-zone', name: 'Gift Zone', sector: 'Gifts & Retail', sectorAr: 'هدايا وتجزئة', to: 'id-gift-zone' },
  { id: 'mr-group', name: 'MR Group', sector: 'Car Rental & Tourism', sectorAr: 'تأجير سيارات وسياحة', to: 'id-mr-group' },
  { id: 'learn-mys', name: 'Learn MYS', sector: 'Education · E-Learning', sectorAr: 'تعليم · تعلّم إلكتروني', to: 'id-learn-mys' },
  { id: 'villa-puteri', name: 'Villa Puteri', sector: 'Villa Rental', sectorAr: 'تأجير فلل', to: 'id-villa-puteri' },
  { id: 'trackulizer', name: 'Trackulizer', sector: 'Project Tracking · Mobile App', sectorAr: 'تتبّع المشاريع · تطبيق جوال', to: 'ui-trackulizer' },
  { id: 'shams-store', name: 'Shams Store', sector: 'E-Commerce · Accessories & Prints', sectorAr: 'تجارة إلكترونية · إكسسوارات ومطبوعات', to: 'id-shams-store' },
];

/* ------------------------------------------------------------------ */
/* Routing helpers                                                     */
/* ------------------------------------------------------------------ */

const prefix: Record<ChapterKey, string> = { logos: 'lg', identity: 'id', uiux: 'ui', profiles: 'cp', print: 'pr', social: 'sm' };
export const routeOf = (p: Project) => `${prefix[p.kind]}-${p.id}`;

/** Case-study order: the order a reader meets them in the book. */
export const ALL_PROJECTS: Project[] = [...IDENTITIES, ...PRODUCTS, ...PROFILES, ...PRINTS, ...SOCIALS];

export const findProject = (route: string): Project | undefined => ALL_PROJECTS.find((p) => routeOf(p) === route);

export const chapterOf = (k: ChapterKey) => CHAPTERS.find((c) => c.key === k)!;

export const kindLabel: Record<ChapterKey, string> = {
  logos: 'Logo',
  identity: 'Identity',
  uiux: 'Product',
  profiles: 'Profile',
  print: 'Print',
  social: 'Social',
};

export const kindLabelAr: Record<ChapterKey, string> = {
  logos: 'شعار',
  identity: 'هوية',
  uiux: 'منتج',
  profiles: 'بروفايل',
  print: 'مطبوعة',
  social: 'سوشيال',
};

/** Pick the Arabic or English variant of a field. */
export const tx = (lang: 'ar' | 'en', en: string | undefined, ar: string | undefined) => (lang === 'ar' && ar ? ar : en ?? '');

export const countOf: Record<ChapterKey, number> = {
  logos: LOGOS.length,
  identity: IDENTITIES.length,
  uiux: PRODUCTS.length,
  profiles: PROFILES.length,
  print: PRINTS.length,
  social: SOCIALS.length,
};
