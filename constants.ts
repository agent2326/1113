import { 
  Settings, Globe, Menu, LayoutTemplate, Sparkles, Images, 
  MessageSquare, Clock, Workflow, Users, Columns, ListOrdered, 
  FileText, TrendingUp, Lightbulb, Quote, Megaphone, Mail, AlignJustify,
  Type, Video, Layers, MousePointer, Zap, Award
} from 'lucide-react';
import { LandingPageConfig } from './types';

// --- DATA PRESETS FOR NEW BLOCKS ---
export const PREFILLED_DATA: Record<string, any> = {
  features: {
    title: "Наши преимущества",
    description: "Мы предлагаем лучшие решения на рынке, объединяя технологии и дизайн.",
    items: [
      { title: "Высокая скорость", description: "Мгновенная загрузка и оптимизация ресурсов.", icon: "Zap" },
      { title: "Безопасность", description: "Ваши данные под надежной защитой шифрования.", icon: "Shield" },
      { title: "Поддержка 24/7", description: "Наша команда всегда готова помочь вам.", icon: "LifeBuoy" },
      { title: "Масштабируемость", description: "Растите без ограничений вместе с нами.", icon: "TrendingUp" }
    ]
  },
  "features-gradient": {
    title: "Premium Features",
    subtitle: "Experience the next level of design with glassmorphism and vibrant gradients.",
    backgroundType: "linear",
    gradientStart: "#4f46e5",
    gradientEnd: "#9333ea",
    bgDirection: "135",
    textColor: "#ffffff",
    cardStyle: "glass",
    itemTitleColor: "#ffffff",
    itemDescColor: "rgba(255,255,255,0.8)",
    items: [
      { title: "Glass UI", description: "Elegant semi-transparent cards that blend perfectly with the background.", icon: "Layers" },
      { title: "Vibrant Style", description: "Dynamic linear gradients for high visual impact and modern look.", icon: "Zap" },
      { title: "Precision", description: "Clean typography optimized for high-contrast dark environments.", icon: "Award" }
    ]
  },
  gallery: {
    title: "Наши работы",
    description: "Взгляните на визуализацию наших последних проектов.",
    layout: "grid",
    items: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", title: "Офис" },
      { url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80", title: "Команда" },
      { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", title: "Встреча" },
      { url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80", title: "Природа" },
      { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80", title: "Идеи" },
      { url: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80", title: "Бизнес" }
    ]
  },
  testimonials: {
    title: "Отзывы клиентов",
    description: "Что говорят о нас лидеры индустрии.",
    items: [
      { name: "Алексей Петров", role: "CEO, TechCorp", content: "Это лучший инструмент, который мы использовали. Продуктивность выросла на 200%.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
      { name: "Мария Иванова", role: "CMO", content: "Потрясающий дизайн и удобство использования.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
      { name: "Джон Смит", role: "Dev", content: "Код чистый, документация отличная. Рекомендую.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" }
    ]
  },
  timeline: {
    title: "История успеха",
    description: "Как мы развивались на протяжении последних лет.",
    items: [
      { title: "Основание", date: "2021", description: "Мы начали с маленького офиса и большой мечты." },
      { title: "Первый миллион", date: "2022", description: "Достигли знаковой отметки пользователей." },
      { title: "Глобальная экспансия", date: "2023", description: "Открыли офисы в Европе и Азии." },
      { title: "Запуск AI", date: "2024", description: "Внедрили передовые технологии." }
    ]
  },
  process: {
    title: "Как мы работаем",
    description: "Простой и прозрачный процесс.",
    items: [
      { title: "Анализ", description: "Изучаем ваши цели.", icon: "Search" },
      { title: "Стратегия", description: "Строим план действий.", icon: "Map" },
      { title: "Реализация", description: "Создаем продукт.", icon: "Cpu" },
      { title: "Запуск", description: "Выводим на рынок.", icon: "Rocket" }
    ]
  },
  team: {
    title: "Наша команда",
    description: "Эксперты, стоящие за успехом.",
    items: [
      { name: "Дмитрий Волков", role: "Основатель", bio: "Визионер с 15-летним опытом.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
      { name: "Елена Соколова", role: "Арт-директор", bio: "Создает вдохновляющие стили.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
      { name: "Макс Громов", role: "CTO", bio: "Архитектор сложных систем.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" },
      { name: "Анна Ким", role: "Product Manager", bio: "Связь бизнеса и разработки.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  steps: {
    title: "Шаги к успеху",
    description: "Простые действия отделяют вас от цели.",
    items: [
      { title: "Регистрация", description: "Создайте аккаунт за 30 секунд." },
      { title: "Настройка", description: "Укажите свои предпочтения." },
      { title: "Результат", description: "Получите готовое решение." }
    ]
  },
  manifesto: {
    title: "Наш манифест",
    items: [
      { text: "Мы верим в простоту.", highlight: true },
      { text: "Quality over quantity.", highlight: false },
      { text: "Innovation is key.", highlight: true },
      { text: "Customer first.", highlight: false }
    ]
  },
  "value-proposition": {
    title: "Почему мы?",
    description: "Ценность для вашего бизнеса.",
    items: [
      { text: "Save time up to 40%", icon: "Clock" },
      { text: "2x conversion growth", icon: "TrendingUp" },
      { text: "Process automation", icon: "Zap" },
      { text: "Result guarantee", icon: "CheckCircle" }
    ]
  },
  philosophy: {
    title: "Our Philosophy",
    description: "Principles we live by.",
    items: [
      { title: "Transparency", content: "Openness in everything.", icon: "Sun", backgroundColor: "#FEF3C7", titleColor: "#92400E", textColor: "#92400E" },
      { title: "Growth", content: "Continuous learning.", icon: "TrendingUp", backgroundColor: "#DBEAFE", titleColor: "#1E40AF", textColor: "#1E40AF" },
      { title: "Empathy", content: "We value people.", icon: "Heart", backgroundColor: "#FCE7F3", titleColor: "#9D174D", textColor: "#9D174D" }
    ]
  },
  "pull-quotes": {
    title: "Quote",
    items: [
      { quote: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs", role: "Visionary" }
    ]
  },
  "two-column-info": {
     title: "About Project",
     description: "Mission details.",
     content: "We build the tools of the future today. Join thousands of satisfied users.",
     image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
     imagePosition: "right"
  },
  "content": {
      title: "Text Block",
      content: "Add any content here. Easily editable and formatable.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
  },
  ticker: {
      tickerSpeed: "20",
      tickerDirection: "left",
      tickerSeparator: "•",
      tickerBg: "#000000",
      tickerText: "#ffffff",
      tickerFontSize: "24",
      items: [
          { title: "BREAKING NEWS" },
          { title: "SPECIAL OFFER" },
          { title: "LIMITED TIME ONLY" },
          { title: "SUBSCRIBE NOW" }
      ]
  },
  cta: {
      title: "Ready to Start?",
      subtitle: "Join today",
      ctaText: "Get Started Free",
      ctaLink: "#"
  },
  contactForm: {
      title: "Contact Us",
      subtitle: "We will respond within an hour"
  },
  "hero-video": {
      title: "Cinematic Experience",
      subtitle: "Captivate your audience with stunning high-quality video backgrounds.",
      layout: "video",
      backgroundImage: "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-over-a-calm-lake-4315-large.mp4",
      ctaText: "Explore More",
      ctaLink: "#",
      show: true
  }
};

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ua', label: 'Ukrainian' },
  { code: 'ru', label: 'Russian' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

export const AVAILABLE_FONTS = [
  'Inter', 
  'Playfair Display', 
  'Space Mono', 
  'Open Sans', 
  'Montserrat', 
  'Lato', 
  'Roboto', 
  'Oswald', 
  'Poppins', 
  'Raleway', 
  'Merriweather', 
  'Nunito', 
  'Rubik'
];

export const AI_AVAILABLE_BLOCKS = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'hero-video', label: 'Video Hero' },
    { id: 'features', label: 'Features' },
    { id: 'features-gradient', label: 'Gradient Features' },
    { id: 'valueProposition', label: 'Value Prop' },
    { id: 'twoColumnInfo', label: 'Two Column Info' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'team', label: 'Team' },
    { id: 'process', label: 'Process' },
    { id: 'steps', label: 'Steps' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'manifesto', label: 'Manifesto' },
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'pullQuotes', label: 'Pull Quotes' },
    { id: 'ticker', label: 'Marquee / Ticker' },
    { id: 'contactForm', label: 'Contact Form' },
    { id: 'cta', label: 'Call to Action' },
];

export const THEME_PRESETS: Record<string, Partial<LandingPageConfig>> = {
  light: { backgroundColor: '#ffffff', surfaceColor: '#f3f4f6', primaryColor: '#2563eb', secondaryColor: '#4f46e5', buttonTextColor: '#ffffff' },
  dark: { backgroundColor: '#111827', surfaceColor: '#1f2937', primaryColor: '#3b82f6', secondaryColor: '#6366f1', buttonTextColor: '#ffffff' },
  sepia: { backgroundColor: '#fdf6e3', surfaceColor: '#eee8d5', primaryColor: '#d33682', secondaryColor: '#b58900', buttonTextColor: '#fdf6e3' },
  midnight: { backgroundColor: '#0f172a', surfaceColor: '#1e293b', primaryColor: '#38bdf8', secondaryColor: '#0ea5e9', buttonTextColor: '#ffffff' },
  ocean: { backgroundColor: '#0f172a', surfaceColor: '#1e293b', primaryColor: '#0ea5e9', secondaryColor: '#0284c7', buttonTextColor: '#ffffff' },
  forest: { backgroundColor: '#052e16', surfaceColor: '#064e3b', primaryColor: '#22c55e', secondaryColor: '#16a34a', buttonTextColor: '#ffffff' },
  cyberpunk: { backgroundColor: '#09090b', surfaceColor: '#18181b', primaryColor: '#f472b6', secondaryColor: '#22d3ee', buttonTextColor: '#000000' },
  luxury: { backgroundColor: '#000000', surfaceColor: '#1c1917', primaryColor: '#fbbf24', secondaryColor: '#d97706', buttonTextColor: '#000000' },
};

export const getSectionIcon = (id: string, type?: string) => {
  if (id === 'global') return Settings;
  if (id === 'navbar') return Globe;
  if (id === 'footer') return Menu;
  if (id === 'hero' || type === 'hero-video') return Video;
  if (id === 'hero') return LayoutTemplate;
  if (id === 'features' || type === 'features' || type === 'features-gradient') return Sparkles;
  if (type === 'features-gradient') return Layers;
  if (id === 'gallery' || type === 'gallery') return Images;
  if (id === 'testimonials' || type === 'testimonials') return MessageSquare;
  if (id === 'timeline' || type === 'timeline') return Clock;
  if (id === 'process' || type === 'process') return Workflow;
  if (id === 'team' || type === 'team') return Users;
  if (id === 'twoColumnInfo' || type === 'two-column-info') return Columns;
  if (id === 'steps' || type === 'steps') return ListOrdered;
  if (id === 'manifesto' || type === 'manifesto') return FileText;
  if (id === 'valueProposition' || type === 'value-proposition') return TrendingUp;
  if (id === 'philosophy' || type === 'philosophy') return Lightbulb;
  if (id === 'pullQuotes' || type === 'pull-quotes') return Quote;
  if (id === 'ticker' || type === 'ticker') return Type;
  if (id === 'cta' || type === 'cta') return Megaphone;
  if (id === 'contactForm') return Mail;
  return AlignJustify;
};