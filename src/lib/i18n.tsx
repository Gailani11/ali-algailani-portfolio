/**
 * Bilingual interface (Arabic / English).
 *
 * Arabic is the default. The choice is remembered per browser. Portfolio content
 * itself lives in data/content.ts with Arabic fields beside the English ones; this
 * file holds the interface copy. Layout mirrors to RTL inside <main>, while the
 * fixed chrome (logo corner, folio, chapter rail) keeps the book's physical layout.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ChapterKey } from '../data/content';

export type Lang = 'ar' | 'en';
const KEY = 'aa-portfolio-lang';

const countWords = {
  en: { logos: 'projects', identity: 'projects', uiux: 'products', profiles: 'projects', print: 'projects', social: 'brands' },
  ar: { logos: 'مشاريع', identity: 'هويات', uiux: 'منتجان', profiles: 'بروفايلات', print: 'مطبوعات', social: 'علامات' },
} as const;

const en = {
  dir: 'ltr' as 'ltr' | 'rtl',
  // navigation
  nav: { work: 'Work', about: 'About', index: 'Index', contact: 'Contact' },
  menu: 'Menu',
  close: 'Close',
  chapters: 'Chapters',
  home: 'Ali Algailani — back to the beginning',
  langGroup: 'Language',
  whatsapp: 'WhatsApp',
  portfolioPdf: 'Portfolio PDF',
  // loader / hero
  opening: 'Opening the book',
  scrollToExplore: 'Scroll to explore',
  // about
  aboutEyebrow: 'About — نبذة',
  statement: ['I design', 'identities.', 'interfaces.', 'experiences.'],
  skills: 'Skills',
  tools: 'Tools',
  seeWork: 'See the work →',
  // contents
  browseAll: 'Browse every project, filtered →',
  piecesAcross: (n: number) => `${n} pieces across six chapters`,
  count: (k: ChapterKey, n: string) => `${n} ${countWords.en[k]}`,
  // chapters
  section: 'Section',
  selectedWork: 'Selected work',
  identity: 'Identity',
  product: 'Product',
  profile: 'Profile',
  scope: 'Scope',
  year: 'Year',
  openCase: 'Open case study',
  primaryMark: 'Primary mark',
  reelHint: 'Scroll — the reel moves sideways →',
  visualIdentities: 'Visual identities',
  caseStudy: (n: string) => `${n} case study →`,
  profilesLede: 'Company profiles.',
  pages: (n: number) => `${n} pages`,
  printLede: ['Menus, brochures and a fold-out —', (n: string) => `${n} pieces made for paper.`] as [string, (n: string) => string],
  posts: (n: string) => `${n} posts`,
  approach: 'Approach',
  statementLine: 'Design is how an idea becomes visible.',
  // finale
  invite: ["Let's create", 'something', 'meaningful.'],
  startConversation: 'Start a conversation',
  email: 'Email',
  phone: 'Phone · WhatsApp',
  location: 'Location',
  locationValue: 'Saudi Arabia',
  scanToChat: 'Scan to chat',
  copy: 'Copy',
  copied: 'Copied',
  download: 'Download portfolio',
  pdfMeta: 'PDF · 51 pages',
  backToBeginning: 'Back to the beginning ↑',
  // archive
  indexOfWork: 'Index of work',
  allWork: 'All work',
  archiveSum: (n: number) => `${n} pieces · six chapters · 2026`,
  all: 'All',
  filterLabel: 'Filter work by chapter',
  showing: (n: number) => `Showing ${n} pieces`,
  // case study
  sector: 'Sector',
  format: 'Format',
  length: 'Length',
  chapter: 'Chapter',
  inTheBook: 'In the book',
  pagesLabel: (a: string, b?: string) => (b ? `Pages ${a}–${b}` : `Page ${a}`),
  brandStory: 'Brand story',
  theProduct: 'The product',
  theDocument: 'The document',
  palette: 'Colour palette',
  clickToCopy: 'Click a colour to copy its hex',
  applications: 'Applications',
  images: (n: string) => `${n} images`,
  interactiveScreens: 'Interactive screens',
  interactiveNote: 'Scroll the list, tap a row, or swipe the phone',
  allScreens: 'All selected screens',
  screens: (n: string) => `${n} screens`,
  completeDocument: 'The complete document',
  viewFullSize: 'View full size',
  laidFlat: 'Laid flat',
  pagesTitle: 'Pages',
  allPages: 'All pages',
  feedPosts: 'Feed and posts',
  of: 'of',
  ofPortfolio: 'of the portfolio',
  nextProject: 'Next project',
  allWorkLink: 'All work',
  // lightbox & cursor
  viewer: 'Image viewer',
  prev: 'Previous',
  next: 'Next',
  cursor: { view: 'View', explore: 'Explore', open: 'Open', drag: 'Drag', next: 'Next', close: 'Close', copy: 'Copy' } as Record<string, string>,
  // transitions
  portfolio2026: 'Portfolio — 2026',
  languageName: 'English',
  languageKicker: 'Language',
  // document
  title: 'Ali Al-Gailani — Senior Graphic & UI/UX Designer',
  runningDefault: 'Portfolio',
};

export type Dict = typeof en;

const ar: Dict = {
  dir: 'rtl',
  nav: { work: 'أعمال', about: 'عني', index: 'الفهرس', contact: 'تواصل' },
  menu: 'القائمة',
  close: 'إغلاق',
  chapters: 'الأقسام',
  home: 'علي الجيلاني — العودة إلى البداية',
  langGroup: 'اللغة',
  whatsapp: 'واتساب',
  portfolioPdf: 'ملف الأعمال PDF',
  opening: 'نفتح الكتاب',
  scrollToExplore: 'مرّر للاستكشاف',
  aboutEyebrow: 'نبذة — About',
  statement: ['أصمّم', 'هويات.', 'واجهات.', 'تجارب.'],
  skills: 'المهارات',
  tools: 'البرامج',
  seeWork: 'شاهد الأعمال ←',
  browseAll: 'تصفّح كل المشاريع مع التصفية ←',
  piecesAcross: (n: number) => `${n} عملًا في ستة أقسام`,
  count: (k: ChapterKey, n: string) => (k === 'uiux' ? 'منتجان' : `${n} ${countWords.ar[k]}`),
  section: 'القسم',
  selectedWork: 'أعمال مختارة',
  identity: 'هوية',
  product: 'منتج',
  profile: 'بروفايل',
  scope: 'النطاق',
  year: 'السنة',
  openCase: 'افتح دراسة الحالة',
  primaryMark: 'الشعار الرئيسي',
  reelHint: 'مرّر — يتحرك الشريط أفقيًا ←',
  visualIdentities: 'الهويات البصرية',
  caseStudy: (n: string) => `دراسة حالة ${n} ←`,
  profilesLede: 'الملفات التعريفية للشركات.',
  pages: (n: number) => `${n} ${n >= 3 && n <= 10 ? 'صفحات' : 'صفحة'}`,
  printLede: ['قوائم طعام وبروشورات ومطويات —', (n: string) => `${n} أعمال صُمّمت للورق.`],
  posts: (n: string) => `${n} منشورات`,
  approach: 'المنهج',
  statementLine: 'التصميم هو ما يجعل الفكرة مرئية.',
  invite: ['لنصنع', 'شيئًا', 'له معنى.'],
  startConversation: 'ابدأ محادثة',
  email: 'البريد الإلكتروني',
  phone: 'الجوال · واتساب',
  location: 'الموقع',
  locationValue: 'المملكة العربية السعودية',
  scanToChat: 'امسح للمحادثة',
  copy: 'نسخ',
  copied: 'تم النسخ',
  download: 'تحميل ملف الأعمال',
  pdfMeta: 'PDF · 51 صفحة',
  backToBeginning: 'العودة إلى البداية ↑',
  indexOfWork: 'فهرس الأعمال',
  allWork: 'كل الأعمال',
  archiveSum: (n: number) => `${n} عملًا · ستة أقسام · 2026`,
  all: 'الكل',
  filterLabel: 'تصفية الأعمال حسب القسم',
  showing: (n: number) => `يُعرض ${n} عملًا`,
  sector: 'القطاع',
  format: 'الصيغة',
  length: 'الحجم',
  chapter: 'القسم',
  inTheBook: 'في الملف',
  pagesLabel: (a: string, b?: string) => (b ? `الصفحات ${a}–${b}` : `الصفحة ${a}`),
  brandStory: 'قصة العلامة',
  theProduct: 'المنتج',
  theDocument: 'المستند',
  palette: 'لوحة الألوان',
  clickToCopy: 'اضغط على اللون لنسخ رمزه',
  applications: 'التطبيقات',
  images: (n: string) => `${n} صور`,
  interactiveScreens: 'شاشات تفاعلية',
  interactiveNote: 'مرّر القائمة، أو اضغط على سطر، أو اسحب الجوال',
  allScreens: 'كل الشاشات المختارة',
  screens: (n: string) => `${n} شاشة`,
  completeDocument: 'المستند كاملًا',
  viewFullSize: 'عرض بالحجم الكامل',
  laidFlat: 'مفرودة',
  pagesTitle: 'الصفحات',
  allPages: 'كل الصفحات',
  feedPosts: 'الحساب والمنشورات',
  of: 'من',
  ofPortfolio: 'من ملف الأعمال',
  nextProject: 'المشروع التالي',
  allWorkLink: 'كل الأعمال',
  viewer: 'عارض الصور',
  prev: 'السابق',
  next: 'التالي',
  cursor: { view: 'عرض', explore: 'استكشف', open: 'افتح', drag: 'اسحب', next: 'التالي', close: 'إغلاق', copy: 'نسخ' },
  portfolio2026: 'ملف أعمال — 2026',
  languageName: 'العربية',
  languageKicker: 'اللغة',
  title: 'علي الجيلاني — مصمم جرافيك وواجهات مستخدم أول',
  runningDefault: 'ملف أعمال',
};

export const DICTS: Record<Lang, Dict> = { en, ar };

function initial(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'ar' || v === 'en') return v;
  } catch {
    /* storage may be unavailable */
  }
  return 'ar';
}

interface Ctx {
  lang: Lang;
  t: Dict;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
}
const LangCtx = createContext<Ctx>({ lang: 'ar', t: ar, dir: 'rtl', setLang: () => {} });
export const useLang = () => useContext(LangCtx);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial);
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.classList.toggle('is-ar', lang === 'ar');
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);
  const t = DICTS[lang];
  return <LangCtx.Provider value={{ lang, t, dir: t.dir, setLang }}>{children}</LangCtx.Provider>;
}
