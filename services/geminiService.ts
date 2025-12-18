
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LandingPageConfig, DEFAULT_CONFIG } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const landingPageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    theme: { type: Type.STRING },
    primaryColor: { type: Type.STRING },
    secondaryColor: { type: Type.STRING },
    buttonTextColor: { type: Type.STRING },
    backgroundColor: { type: Type.STRING },
    surfaceColor: { type: Type.STRING },
    fontHeading: { type: Type.STRING },
    fontBody: { type: Type.STRING },
    borderRadius: { type: Type.STRING },
    sectionOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
    navbar: {
      type: Type.OBJECT,
      properties: {
        logoText: { type: Type.STRING },
        links: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              href: { type: Type.STRING }
            }
          }
        },
        show: { type: Type.BOOLEAN },
        showLanguageSwitcher: { type: Type.BOOLEAN },
        showThemeToggle: { type: Type.BOOLEAN }
      }
    },
    hero: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        ctaText: { type: Type.STRING },
        ctaLink: { type: Type.STRING },
        showButton: { type: Type.BOOLEAN },
        image: { type: Type.STRING },
        show: { type: Type.BOOLEAN },
        backgroundColor: { type: Type.STRING },
        textColor: { type: Type.STRING }
      }
    },
    personalHero: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          bio: { type: Type.STRING },
          image: { type: Type.STRING },
          imageStyle: { type: Type.STRING, enum: ['circle', 'rounded', 'square'] },
          primaryCtaText: { type: Type.STRING },
          primaryCtaLink: { type: Type.STRING },
          secondaryCtaText: { type: Type.STRING },
          secondaryCtaLink: { type: Type.STRING },
          show: { type: Type.BOOLEAN },
          backgroundColor: { type: Type.STRING },
          textColor: { type: Type.STRING }
        },
    },
    features: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING }
            }
          }
        },
        show: { type: Type.BOOLEAN },
        backgroundColor: { type: Type.STRING },
        textColor: { type: Type.STRING }
      }
    },
    gallery: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    url: { type: Type.STRING },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING }
                }
            }
        },
        show: { type: Type.BOOLEAN },
        backgroundColor: { type: Type.STRING },
        textColor: { type: Type.STRING }
      }
    },
    testimonials: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                content: { type: Type.STRING },
                avatar: { type: Type.STRING }
              }
            }
          },
          show: { type: Type.BOOLEAN },
          backgroundColor: { type: Type.STRING },
          textColor: { type: Type.STRING }
        }
    },
    cta: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          buttonText: { type: Type.STRING },
          show: { type: Type.BOOLEAN },
          backgroundColor: { type: Type.STRING },
          textColor: { type: Type.STRING }
        }
    },
    contactForm: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          buttonText: { type: Type.STRING },
          show: { type: Type.BOOLEAN },
          backgroundColor: { type: Type.STRING },
          textColor: { type: Type.STRING }
        }
    },
    footer: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          copyright: { type: Type.STRING },
          links: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                href: { type: Type.STRING }
              }
            }
          },
          show: { type: Type.BOOLEAN },
          backgroundColor: { type: Type.STRING },
          textColor: { type: Type.STRING }
        }
    },
    // We allow dynamic blocks to be returned as part of a generic object structure if needed, 
    // but the schema above covers standard sections. Dynamic blocks are usually handled via contentBlocks array.
    contentBlocks: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                backgroundColor: { type: Type.STRING },
                textColor: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            text: { type: Type.STRING },
                            name: { type: Type.STRING },
                            role: { type: Type.STRING },
                            date: { type: Type.STRING },
                            icon: { type: Type.STRING }
                        }
                    }
                }
            }
        }
    }
  }
};

export const generateLandingPageConfig = async (
  prompt: string, 
  selectedBlocks: string[], 
  mode: string, 
  language: string
): Promise<LandingPageConfig | null> => {
  try {
    // Fixed: Using gemini-3-flash-preview for standard generation task
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a landing page configuration JSON based on this prompt: "${prompt}". 
      Language: ${language}. 
      Mode: ${mode} (affects length of text).
      Include these sections if possible: ${selectedBlocks.join(', ')}.
      Return ONLY JSON matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: landingPageSchema
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    
    const generatedConfig = JSON.parse(jsonText);
    
    // Merge with default config to ensure all fields exist
    return {
        ...DEFAULT_CONFIG,
        ...generatedConfig,
        // Ensure nested objects are merged correctly if partial
        navbar: { ...DEFAULT_CONFIG.navbar, ...(generatedConfig.navbar || {}) },
        hero: { ...DEFAULT_CONFIG.hero, ...(generatedConfig.hero || {}) },
        personalHero: { ...DEFAULT_CONFIG.personalHero, ...(generatedConfig.personalHero || {}) },
        features: { ...DEFAULT_CONFIG.features, ...(generatedConfig.features || {}) },
        gallery: { ...DEFAULT_CONFIG.gallery, ...(generatedConfig.gallery || {}) },
        testimonials: { ...DEFAULT_CONFIG.testimonials, ...(generatedConfig.testimonials || {}) },
        cta: { ...DEFAULT_CONFIG.cta, ...(generatedConfig.cta || {}) },
        contactForm: { ...DEFAULT_CONFIG.contactForm, ...(generatedConfig.contactForm || {}) },
        footer: { ...DEFAULT_CONFIG.footer, ...(generatedConfig.footer || {}) },
        design: { ...DEFAULT_CONFIG.design, ...(generatedConfig.design || {}) },
        sectionOrder: generatedConfig.sectionOrder || DEFAULT_CONFIG.sectionOrder
    };
  } catch (error) {
    console.error("Gemini generation error:", error);
    return null;
  }
};

export const generateFullPageConfig = async (
    topic: string,
    length: string,
    fileContent: string,
    styleVibe: string = 'modern',
    customPalette?: string[]
): Promise<LandingPageConfig | null> => {
    try {
        let paletteInstruction = "";
        if (customPalette && customPalette.length === 5) {
            paletteInstruction = `
            CRITICAL: The user has defined a strict custom color palette. You MUST use EXACTLY these hex codes:
            - Primary Color (Buttons/Highlights): ${customPalette[0]}
            - Secondary Color (Accents/Icons): ${customPalette[1]}
            - Dark Background (Hero/Footer): ${customPalette[2]}
            - Light Background (Content Sections): ${customPalette[3]}
            - Text Color: ${customPalette[4]}

            RULES FOR PALETTE APPLICATION:
            1. Set 'primaryColor' to "${customPalette[0]}".
            2. Set 'secondaryColor' to "${customPalette[1]}".
            3. Set 'backgroundColor' globally to "${customPalette[3]}" (Light BG).
            4. Set 'textColor' globally to "${customPalette[4]}".
            
            IMPORTANT - SECTION BACKGROUNDS:
            5. For the 'hero' and 'footer' objects, you MUST explicitly set the "backgroundColor" property to "${customPalette[2]}" (Dark BG) and "textColor" to "#ffffff" (or a light readable color).
            6. For other sections ('features', 'testimonials', 'cta', 'contactForm') AND all objects inside the 'contentBlocks' array:
               - Explicitly set "backgroundColor" to either "${customPalette[3]}" (Light BG) or "${customPalette[2]}" (Dark BG).
               - Create a rhythm by alternating them (e.g., Light -> Light -> Dark -> Light).
               - If "backgroundColor" is Dark, ensure "textColor" is Light.
            7. Do NOT generate random colors. Stick to this set.
            `;
        }

        const prompt = `
        Act as a professional web designer and UI/UX expert.
        Generate a comprehensive JSON configuration for a landing page.
        
        Topic: "${topic}"
        Length: "${length}" (Short: ~3 sections, Medium: ~5 sections, Long: ~8 sections).
        Visual Style / Vibe: "${styleVibe}" (Use this to determine colors and fonts UNLESS custom palette is provided).
        Additional Context from User File: "${fileContent ? fileContent.substring(0, 15000).replace(/"/g, "'") : "None"}"

        ${paletteInstruction}

        Available Sections to use in 'sectionOrder' and define in config:
        - navbar
        - hero (or personalHero)
        - features
        - gallery
        - testimonials
        - cta
        - contactForm
        - footer
        - contentBlocks (This is an array of dynamic blocks. You can add objects here with 'id' (random string) and 'type'. Valid types: 'timeline', 'team', 'process', 'steps', 'manifesto', 'value-proposition', 'philosophy', 'pull-quotes', 'ticker', 'two-column-info').

        Instructions:
        1. Define the Global Style Settings:
           - 'primaryColor': A hex code.
           - 'secondaryColor': A complementary hex code.
           - 'theme': 'light' or 'dark' (Determine based on palette or vibe).
           - 'fontHeading': Choose a font that matches the vibe (e.g., 'Inter', 'Playfair Display').
           - 'fontBody': Choose a readable matching font (e.g., 'Inter', 'Roboto').
           - 'borderRadius': 'none', 'sm', 'md', 'lg', or 'full'.
        
        2. Create a logical 'sectionOrder'. For 'Short', stick to essentials. For 'Long', include trust signals.
        
        3. INTELLIGENTLY DISTRIBUTE content across sections.
        
        4. Populate the content of each section.
        5. Return ONLY JSON matching the predefined schema. Do not include markdown formatting.
        `;

        // Fixed: Using gemini-3-pro-preview for complex layout and reasoning tasks
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: landingPageSchema
            }
        });

        const jsonText = response.text;
        if (!jsonText) return null;

        const generatedConfig = JSON.parse(jsonText);

        // Merge logic similar to generateLandingPageConfig to ensure safety
        return {
            ...DEFAULT_CONFIG,
            ...generatedConfig,
            navbar: { ...DEFAULT_CONFIG.navbar, ...(generatedConfig.navbar || {}) },
            hero: { ...DEFAULT_CONFIG.hero, ...(generatedConfig.hero || {}) },
            personalHero: { ...DEFAULT_CONFIG.personalHero, ...(generatedConfig.personalHero || {}) },
            features: { ...DEFAULT_CONFIG.features, ...(generatedConfig.features || {}) },
            gallery: { ...DEFAULT_CONFIG.gallery, ...(generatedConfig.gallery || {}) },
            testimonials: { ...DEFAULT_CONFIG.testimonials, ...(generatedConfig.testimonials || {}) },
            cta: { ...DEFAULT_CONFIG.cta, ...(generatedConfig.cta || {}) },
            contactForm: { ...DEFAULT_CONFIG.contactForm, ...(generatedConfig.contactForm || {}) },
            footer: { ...DEFAULT_CONFIG.footer, ...(generatedConfig.footer || {}) },
            design: { ...DEFAULT_CONFIG.design, ...(generatedConfig.design || {}) },
            sectionOrder: generatedConfig.sectionOrder || DEFAULT_CONFIG.sectionOrder,
            contentBlocks: generatedConfig.contentBlocks || []
        };

    } catch (error) {
        console.error("Gemini Full Site generation error:", error);
        return null;
    }
};

export const translateLandingPageConfig = async (
    config: LandingPageConfig, 
    targetLang: string
): Promise<LandingPageConfig | null> => {
     try {
        // Fixed: Using gemini-3-flash-preview for translation tasks
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Translate the following JSON content to ${targetLang}. Preserve the structure keys exactly. Only translate values that are user-visible text (titles, descriptions, labels). JSON: ${JSON.stringify(config)}`,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const jsonText = response.text;
        if (!jsonText) return null;
        return JSON.parse(jsonText);
     } catch (error) {
         console.error("Translation error:", error);
         return null;
     }
}
