export type Theme = 'light' | 'dark' | 'sepia' | 'high-contrast-light' | 'high-contrast-dark' | 'midnight' | 'ocean' | 'forest' | 'wine' | 'cyberpunk' | 'luxury' | 'retro' | 'lavender' | 'sunset' | 'dracula' | 'nord' | 'coffee' | 'navy' | 'hacker' | 'dim';

export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface TypographySettings {
    fontFamily?: string;
    fontWeight?: string;
    fontSize?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    color?: string;
}

export interface DesignConfig {
    animation?: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none' | 'slide-left' | 'slide-right' | 'zoom' | 'flip' | 'bounce' | 'blur-in' | 'pop' | 'flip-3d' | 'skew' | 'wipe' | 'pulse';
    animationDuration?: 'fast' | 'normal' | 'slow' | 'extra-slow';
    buttonStyle?: 'rounded' | 'pill' | 'square' | 'outline' | 'magnetic' | 'neumorphic' | '3d' | 'glow' | 'ghost';
    buttonEffect?: 'none' | 'lift' | 'scale' | 'glow' | 'shine' | 'ring' | 'press';
    cardStyle?: 'flat' | 'hover-lift' | 'glass' | 'tilt' | 'border' | 'neumorphic' | 'float' | 'glow-border' | 'pressed' | 'skeuomorphic' | 'shadow-stack' | 'outline-offset' | 'gradient-border' | 'none' | 'shadow-sm' | 'shadow-md' | 'shadow-lg' | 'neo' | 'gradient';
    cardHover?: 'none' | 'lift' | 'scale' | 'glow' | '3d';
    scrollWidth?: number;
    scrollRadius?: number;
}

export interface BaseSectionConfig {
    show?: boolean;
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundColor?: string;
    backgroundType?: 'solid' | 'gradient' | 'linear' | 'radial' | 'image';
    gradientStart?: string;
    gradientEnd?: string;
    bgDirection?: string;
    backgroundImage?: string;
    textColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontHeading?: string;
    fontBody?: string;
    enableParallax?: boolean;
    enableGrayscale?: boolean;
    enableSepia?: boolean;
    enableBorder?: boolean;
    enableHoverEffect?: boolean;
    headingTypography?: TypographySettings;
    bodyTypography?: TypographySettings;
    animation?: string;
    cardStyle?: string;
    padding?: string;
    
    // Animation & Order
    animationType?: string;
    animationDuration?: string;
    animationDelay?: string;
    
    // Block-Level Item Typography
    itemTitleSize?: string;
    itemTitleWeight?: string;
    itemTitleSpacing?: string;
    itemTitleGap?: string;
    itemDescSize?: string;
    itemDescWeight?: string;
    itemDescSpacing?: string;
    
    // Block-Level Item Colors
    itemTitleColor?: string;
    itemDescColor?: string;
    cardBackgroundColor?: string;
    
    // Custom Card Style Overrides
    cardShadow?: string;
    cardBorderWidth?: string;
    cardBorderColor?: string;
}

export interface BlockItem {
  title?: string; 
  name?: string; 
  description?: string;
  text?: string; 
  content?: string;
  bio?: string;
  quote?: string;
  author?: string;
  role?: string;
  image?: string;
  avatar?: string;
  url?: string;
  icon?: string;
  date?: string;
  highlight?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  href?: string;
  label?: string;
  actionType?: 'link' | 'lightbox'; 
  showPlayButton?: boolean;
  platform?: string;
  backgroundColor?: string;
  textColor?: string;
  titleFontSize?: string;
  descFontSize?: string;
  titleFontWeight?: string;
  descFontWeight?: string;
  titleLetterSpacing?: string;
  descLetterSpacing?: string;
  titleColor?: string; 
}

export interface ContentBlock extends BaseSectionConfig {
  id: string;
  type: string;
  image?: string;
  imageSize?: string;
  imageAspectRatio?: string;
  imageEffect?: string;
  imageBorder?: boolean;
  imagePosition?: string;
  imageWidth?: string;
  imageAlignment?: 'left' | 'center' | 'right';
  imageCustomBorderRadius?: string;
  imageShadow?: string;
  enableFloatingAnimation?: boolean;
  imageAnimation?: 'none' | 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out' | 'blur-in';
  imageAnimationDuration?: 'fast' | 'normal' | 'slow';
  showButton?: boolean;
  ctaText?: string;
  ctaLink?: string;
  logoText?: string;
  logoImage?: string;
  hideThemeToggle?: boolean;
  hideLangToggle?: boolean;
  buttonText?: string; 
  buttonLink?: string;
  buttonUrl?: string;
  supportedLanguages?: string[];
  position?: 'fixed' | 'absolute' | 'relative';
  links?: BlockItem[];
  behavior?: 'static' | 'sticky' | 'smart';
  glassEffect?: boolean;
  transparentOnTop?: boolean;
  layout?: string; 
  galleryCardBg?: string;
  galleryCardText?: string;
  galleryCardPadding?: string;
  galleryHoverEffect?: string;
  galleryHoverColor?: string;
  galleryArrowShow?: string;
  galleryArrowColor?: string;
  galleryArrowIconColor?: string;
  galleryArrowShape?: string;
  galleryBtnStyle?: string;
  galleryBtnBg?: string;
  galleryBtnText?: string;
  galleryBtnRadius?: string;
  galleryBtnSize?: string;
  galleryBtnAlign?: string;
  galleryBtnSpeed?: string;
  enableLightbox?: boolean;
  hover_reveal_title?: boolean;
  galleryTitleTypography?: TypographySettings;
  galleryDescTypography?: TypographySettings;
  formLayout?: 'split_left' | 'split_right' | 'centered' | 'minimal' | 'inline' | 'grid_2_col';
  formContainerWidth?: 'boxed' | 'full';
  formInputHeight?: 'small' | 'medium' | 'large';
  formGridGap?: 'small' | 'medium' | 'large';
  formWidth?: 'narrow' | 'medium' | 'full';
  formInputShadow?: 'none' | 'sm' | 'md' | 'inner';
  formInputRadiusClass?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  formBtnLetterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  formBtnPaddingClass?: 'small' | 'medium' | 'large';
  formBtnTextSize?: 'sm' | 'base' | 'lg' | 'xl';
  formContainerShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  formBtnRadiusValue?: number;
  formBtnActiveBg?: string;
  showNameField?: boolean;
  showPhoneField?: boolean;
  showSubjectField?: boolean;
  showMap?: boolean;
  mapEmbedUrl?: string;
  formInputStyle?: string;
  formInputBg?: string;
  formLabelColor?: string;
  formTextColor?: string;
  formInputBorderColor?: string;
  formInputBorderWidth?: string;
  formInputRadius?: string;
  buttonAlign?: string;
  formBtnBg?: string;
  formBtnText?: string;
  formBtnHoverBg?: string;
  formBtnHoverText?: string;
  formBtnRadius?: string;
  formBtnWeight?: string;
  formBtnSpacing?: string;
  formBtnFontSize?: string;
  formBtnPadding?: string;
  formBtnShadow?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  phonePlaceholder?: string;
  subjectPlaceholder?: string;
  messagePlaceholder?: string;
  formAction?: string;
  successMessage?: string;
  address?: string;
  phone?: string;
  email?: string;
  hideLabels?: boolean;
  socialLinks?: BlockItem[];
  tickerSpeed?: string;
  tickerDirection?: string;
  tickerSeparator?: string;
  tickerBg?: string;
  tickerText?: string;
  tickerFontSize?: string;
  tickerSpacing?: string;
  tickerGap?: string;
  tickerFontFamily?: string;
  tickerFontWeight?: string;
  tickerTransform?: string;
  companyName?: string;
  copyright?: string;
  items?: BlockItem[];
  [key: string]: any;
}

export type NavbarConfig = ContentBlock;
export type HeroConfig = ContentBlock;
export type PersonalHeroConfig = ContentBlock;
export type FeaturesConfig = ContentBlock;
export type GalleryConfig = ContentBlock;
export type TestimonialsConfig = ContentBlock;
export type CTAConfig = ContentBlock;
export type ContactFormConfig = ContentBlock;
export type FooterConfig = ContentBlock;
export type TimelineConfig = ContentBlock;
export type TeamConfig = ContentBlock;
export type ProcessConfig = ContentBlock;
export type StepsConfig = ContentBlock;
export type TwoColumnInfoConfig = ContentBlock;
export type ManifestoConfig = ContentBlock;
export type ValuePropositionConfig = ContentBlock;
export type PhilosophyConfig = ContentBlock;
export type PullQuotesConfig = ContentBlock;

export interface LandingPageConfig {
    theme: Theme;
    primaryColor: string;
    secondaryColor: string;
    buttonTextColor: string;
    backgroundColor: string;
    backgroundType?: string;
    gradientStart?: string;
    gradientEnd?: string;
    surfaceColor: string;
    fontHeading: string;
    fontBody: string;
    borderRadius: BorderRadius;
    enableAnimations: boolean;
    scrollBehavior?: 'smooth' | 'auto';
    design: DesignConfig;
    sectionOrder: string[];
    navbar: NavbarConfig;
    hero: HeroConfig;
    personalHero: PersonalHeroConfig;
    features: FeaturesConfig;
    gallery: GalleryConfig;
    testimonials: TestimonialsConfig;
    cta: CTAConfig;
    contactForm: ContactFormConfig;
    footer: FooterConfig;
    timeline: TimelineConfig;
    team: TeamConfig;
    twoColumnInfo: TwoColumnInfoConfig;
    steps: StepsConfig;
    process: ProcessConfig;
    manifesto: ManifestoConfig;
    valueProposition: ValuePropositionConfig;
    philosophy: PhilosophyConfig;
    pullQuotes: PullQuotesConfig;
    contentBlocks: ContentBlock[];
}

export const DEFAULT_CONFIG: LandingPageConfig = {
    theme: 'light',
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5',
    buttonTextColor: '#ffffff',
    backgroundColor: '#ffffff',
    backgroundType: 'solid',
    gradientStart: '#ffffff',
    gradientEnd: '#f3f4f6',
    surfaceColor: '#f3f4f6',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    borderRadius: 'lg',
    enableAnimations: true,
    scrollBehavior: 'smooth',
    design: {
        animation: 'slide-up',
        animationDuration: 'normal',
        buttonStyle: 'rounded',
        buttonEffect: 'none',
        cardStyle: 'flat',
        cardHover: 'lift',
        scrollWidth: 10,
        scrollRadius: 10
    },
    sectionOrder: ['navbar', 'hero', 'features', 'gallery', 'testimonials', 'cta', 'contactForm', 'footer'],
    navbar: {
        id: 'navbar', type: 'navbar', show: true,
        logoText: "LandingGen",
        links: [
            { label: "Features", href: "#features" },
            { label: "Gallery", href: "#gallery" },
            { label: "Testimonials", href: "#testimonials" }
        ],
        showLanguageSwitcher: true,
        showThemeToggle: true,
        supportedLanguages: ['en', 'ua', 'ru'],
        behavior: 'sticky',
        glassEffect: true,
        transparentOnTop: false
    },
    hero: {
        id: 'hero', type: 'hero', show: true,
        title: "Build Faster with AI",
        subtitle: "Generate high-converting landing pages in seconds using the power of Gemini.",
        ctaText: "Get Started Free",
        ctaLink: "#",
        showButton: true,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        imageSize: 'large',
        imageAspectRatio: 'auto',
        imageEffect: 'shadow',
        imageBorder: false,
        imagePosition: 'right',
        enableFloatingAnimation: false,
        imageAnimation: 'none',
        imageAnimationDuration: 'normal'
    },
    personalHero: { id: 'personalHero', type: 'personalHero', show: false, items: [] },
    features: {
        id: 'features', type: 'features', show: true,
        title: "Why Choose Us",
        subtitle: "Everything you need to build your website.",
        items: [
            { title: "Fast Performance", description: "Optimized for speed and efficiency.", icon: "Zap" },
            { title: "Secure", description: "Built with security in mind.", icon: "Shield" },
            { title: "Responsive", description: "Looks great on all devices.", icon: "Smartphone" }
        ]
    },
    gallery: {
        id: 'gallery', type: 'gallery', show: true,
        title: "Our Work",
        subtitle: "A glimpse into our recent projects.",
        items: [
            { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", title: "Office Space" },
            { url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80", title: "Team Meeting" },
            { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", title: "Collaboration" }
        ]
    },
    testimonials: {
        id: 'testimonials', type: 'testimonials', show: true,
        title: "What Clients Say",
        items: [
            { name: "John Doe", role: "CEO", content: "Amazing service! Highly recommended.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Jane Smith", role: "Designer", content: "The best tool I've used.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }
        ]
    },
    cta: {
        id: 'cta', type: 'cta', show: true,
        title: "Ready to Start?",
        description: "Join thousands of satisfied users today.",
        buttonText: "Sign Up Now",
        buttonLink: "#signup"
    },
    contactForm: {
        id: 'contactForm', type: 'contactForm', show: true,
        title: "Contact Us",
        subtitle: "We'd love to hear from you.",
        buttonText: "Send Message",
        successMessage: "Thank you! We'll get back to you soon.",
        namePlaceholder: "Your Name",
        emailPlaceholder: "Your Email",
        messagePlaceholder: "Your Message",
        showNameField: true,
        showPhoneField: false,
        showSubjectField: false,
        formLayout: 'centered',
        showMap: false
    },
    footer: {
        id: 'footer', type: 'footer', show: true,
        companyName: "LandingGen",
        copyright: "© 2024 LandingGen. All rights reserved.",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" }
        ]
    },
    timeline: { id: 'timeline', type: 'timeline', show: false, title: "Our Journey", subtitle: "Milestones", items: [] },
    team: { id: 'team', type: 'team', show: false, title: "Meet the Team", subtitle: "Our Experts", items: [] },
    twoColumnInfo: { id: 'twoColumnInfo', type: 'twoColumnInfo', show: false, title: "About Us", subtitle: "Our Mission", description: "Details about our mission.", image: "", imagePosition: 'right' },
    steps: { id: 'steps', type: 'steps', show: false, title: "How It Works", subtitle: "Simple Steps", items: [] },
    process: { id: 'process', type: 'process', show: false, title: "Our Process", subtitle: "Workflow", items: [] },
    manifesto: { id: 'manifesto', type: 'manifesto', show: false, items: [] },
    valueProposition: { id: 'valueProposition', type: 'valueProposition', show: false, title: "Value Prop", description: "Why us?", items: [] },
    philosophy: { id: 'philosophy', type: 'philosophy', show: false, title: "Our Philosophy", description: "Core values", items: [] },
    pullQuotes: { id: 'pullQuotes', type: 'pullQuotes', show: false, items: [] },
    contentBlocks: []
};