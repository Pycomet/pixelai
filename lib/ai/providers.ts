// Provider abstraction for AI image generation services
export interface AIProvider {
  id: string;
  name: string;
  description: string;
  pricing: string;
  models: AIModel[];
  supportsRefinement: boolean;
  generateThumbnail: (
    options: ThumbnailGenerationOptions
  ) => Promise<ThumbnailResult>;
  testConnection: () => Promise<boolean>;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommended: boolean;
  speed: "fast" | "medium" | "slow";
  quality: "good" | "high" | "excellent";
}

export interface ThumbnailGenerationOptions {
  prompt: string;
  style?: "tech" | "gaming" | "tutorial" | "lifestyle";
  userId?: string;
  model?: string;
  quality?: "fast" | "balanced" | "high";
  provider?: string;
  refinementPrompt?: string;
}

export interface ThumbnailResult {
  imageBlob: Blob;
  prompt: string;
  style: string;
  model: string;
  provider: string;
  parameters: GenerationParameters;
}

export interface GenerationParameters {
  model: string;
  steps: number;
  guidance_scale: number;
  negative_prompt: string;
  width: number;
  height: number;
}

// Provider configurations
export const AI_PROVIDERS: Record<string, AIProvider> = {
  stability: {
    id: "stability",
    name: "Stability AI",
    description: "Free for personal & commercial use under $1M revenue",
    pricing: "FREE",
    supportsRefinement: true,
    models: [
      {
        id: "sdxl",
        name: "Stable Diffusion XL",
        description: "Proven quality, reliable",
        icon: "🖼️",
        recommended: true,
        speed: "medium",
        quality: "high",
      },
    ],
    generateThumbnail: async (options: ThumbnailGenerationOptions) => {
      const { generateThumbnail: stabilityGenerate } = await import(
        "./stability"
      );
      return stabilityGenerate(options);
    },
    testConnection: async () => {
      const { testConnection: stabilityTest } = await import("./stability");
      return stabilityTest();
    },
  },

  huggingface: {
    id: "huggingface",
    name: "HuggingFace",
    description: "Free tier with quota limits",
    pricing: "FREE (Limited)",
    supportsRefinement: true,
    models: [
      {
        id: "sdxl",
        name: "Stable Diffusion XL",
        description: "Best balance of quality and speed",
        icon: "⚡",
        recommended: true,
        speed: "medium",
        quality: "high",
      },
      {
        id: "sd15",
        name: "Stable Diffusion 1.5",
        description: "Fast and reliable generation",
        icon: "🚀",
        recommended: false,
        speed: "fast",
        quality: "good",
      },
      {
        id: "sd21",
        name: "Stable Diffusion 2.1",
        description: "Good quality output",
        icon: "📸",
        recommended: false,
        speed: "medium",
        quality: "good",
      },
    ],
    generateThumbnail: async (options: ThumbnailGenerationOptions) => {
      const { generateThumbnail: hfGenerate } = await import("./huggingface");
      return hfGenerate(options);
    },
    testConnection: async () => {
      const { testConnection: hfTest } = await import("./huggingface");
      return hfTest();
    },
  },
};

// Get available providers
export function getAvailableProviders(): AIProvider[] {
  return Object.values(AI_PROVIDERS);
}

// Get provider by ID
export function getProvider(providerId: string): AIProvider | null {
  return AI_PROVIDERS[providerId] || null;
}

// Get models for a specific provider
export function getModelsForProvider(providerId: string): AIModel[] {
  const provider = getProvider(providerId);
  return provider?.models || [];
}

// Check if provider supports refinement
export function providerSupportsRefinement(providerId: string): boolean {
  const provider = getProvider(providerId);
  return provider?.supportsRefinement || false;
}
