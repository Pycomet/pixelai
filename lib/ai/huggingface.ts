import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface ThumbnailGenerationOptions {
  prompt: string;
  style?: "tech" | "gaming" | "tutorial" | "lifestyle";
  userId?: string;
  model?: string;
  quality?: "fast" | "balanced" | "high";
}

export interface ThumbnailResult {
  imageBlob: Blob;
  prompt: string;
  style: string;
  model: string;
  provider: string;
  parameters: GenerationParameters;
}

interface GenerationParameters {
  model: string;
  steps: number;
  guidance_scale: number;
  negative_prompt: string;
  width: number;
  height: number;
}

// FREE TIER WORKING MODELS - No gated access required
const models = {
  sdxl: {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    name: "Stable Diffusion XL",
    description: "Best balance of quality and speed",
    recommended: true,
  },
  sd15: {
    id: "runwayml/stable-diffusion-v1-5",
    name: "Stable Diffusion 1.5",
    description: "Fast and reliable generation",
    recommended: false,
  },
  sd21: {
    id: "stabilityai/stable-diffusion-2-1",
    name: "Stable Diffusion 2.1",
    description: "Good quality output",
    recommended: false,
  },
};

// Optimized quality presets for free tier
const qualityPresets = {
  fast: {
    steps: 15,
    guidance_scale: 7.0,
    description: "Quick generation (~10s)",
  },
  balanced: {
    steps: 25,
    guidance_scale: 7.5,
    description: "Good quality (~20s)",
  },
  high: {
    steps: 35,
    guidance_scale: 8.0,
    description: "Best quality (~30s)",
  },
};

// Simple, effective prompts that work well with free models
const stylePrompts = {
  tech: {
    positive:
      "professional tech product, modern design, clean lighting, high quality",
    negative: "blurry, low quality, amateur",
    basePrompt: "tech thumbnail",
  },
  gaming: {
    positive:
      "gaming setup, colorful lights, exciting atmosphere, high quality",
    negative: "boring, dull, poor lighting",
    basePrompt: "gaming thumbnail",
  },
  tutorial: {
    positive: "educational content, clear presentation, professional layout",
    negative: "confusing, cluttered, messy",
    basePrompt: "tutorial thumbnail",
  },
  lifestyle: {
    positive: "lifestyle photo, natural lighting, authentic, warm",
    negative: "artificial, fake, poor lighting",
    basePrompt: "lifestyle thumbnail",
  },
};

// Minimal negative prompt for better results
const universalNegativePrompt = "low quality, blurry, amateur, watermark";

export async function generateThumbnail(
  options: ThumbnailGenerationOptions
): Promise<ThumbnailResult> {
  const {
    prompt,
    style = "tech",
    model = "sdxl",
    quality = "balanced",
  } = options;

  // Validate API key
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY environment variable is not set");
  }

  // Map model to valid model keys and provide fallback
  const modelKey =
    model && models[model as keyof typeof models]
      ? (model as keyof typeof models)
      : "sdxl";
  const selectedModel = models[modelKey];
  const qualitySettings =
    qualityPresets[quality as keyof typeof qualityPresets] ||
    qualityPresets.balanced;
  const styleConfig =
    stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.tech;

  // Build simple, effective prompt
  const optimizedPrompt = `${styleConfig.basePrompt}, ${prompt}, ${styleConfig.positive}`;

  // Simple negative prompt
  const negativePrompt = `${styleConfig.negative}, ${universalNegativePrompt}`;

  // Generation parameters optimized for free tier
  const parameters: GenerationParameters = {
    model: selectedModel.id,
    width: 768, // Smaller size for free tier
    height: 432, // 16:9 ratio
    steps: qualitySettings.steps,
    guidance_scale: qualitySettings.guidance_scale,
    negative_prompt: negativePrompt,
  };

  try {
    console.log("🎨 Generating with FREE TIER optimized parameters:", {
      model: selectedModel.name,
      prompt: optimizedPrompt.substring(0, 80) + "...",
      quality,
      style,
      steps: parameters.steps,
      guidance: parameters.guidance_scale,
      dimensions: `${parameters.width}x${parameters.height}`,
    });

    const response = await hf.textToImage({
      model: selectedModel.id,
      inputs: optimizedPrompt,
      parameters: {
        width: parameters.width,
        height: parameters.height,
        num_inference_steps: parameters.steps,
        guidance_scale: parameters.guidance_scale,
        negative_prompt: parameters.negative_prompt,
      },
    });

    console.log("✅ Thumbnail generation successful");

    return {
      imageBlob: response as unknown as Blob,
      prompt: optimizedPrompt,
      style,
      model: selectedModel.name,
      provider: "huggingface",
      parameters,
    };
  } catch (error) {
    console.error("❌ HuggingFace API error:", error);

    // Enhanced error handling for common free tier issues
    if (error instanceof Error) {
      if (
        error.message.includes("unauthorized") ||
        error.message.includes("401")
      ) {
        throw new Error(
          "Invalid HuggingFace API key. Please check your API key."
        );
      }
      if (
        error.message.includes("rate") ||
        error.message.includes("limit") ||
        error.message.includes("quota")
      ) {
        throw new Error(
          "HuggingFace quota exceeded. Try again in a few minutes or upgrade your account."
        );
      }
      if (
        error.message.includes("gated") ||
        error.message.includes("restricted") ||
        error.message.includes("access")
      ) {
        throw new Error(
          `Model ${selectedModel.name} requires special access. Using alternative model.`
        );
      }
      if (
        error.message.includes("503") ||
        error.message.includes("unavailable")
      ) {
        throw new Error(
          "HuggingFace service temporarily unavailable. Try again in a few minutes."
        );
      }
    }

    throw new Error(
      `Failed to generate thumbnail: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Get available models for UI
export function getAvailableModels() {
  return Object.entries(models).map(([key, model]) => ({
    key,
    ...model,
  }));
}

// Get quality presets for UI
export function getQualityPresets() {
  return Object.entries(qualityPresets).map(([key, preset]) => ({
    key,
    ...preset,
  }));
}

export async function testConnection(): Promise<boolean> {
  try {
    console.log("🔍 Testing HuggingFace connection with free tier model...");

    const response = await hf.textToImage({
      model: models.sd15.id, // Use SD 1.5 for testing (most reliable)
      inputs: "simple test image",
      parameters: {
        width: 512,
        height: 512,
        num_inference_steps: 10,
        guidance_scale: 7.5,
      },
    });

    console.log("✅ HuggingFace connection test successful");
    return response !== null;
  } catch (error) {
    console.error("❌ HuggingFace connection test failed:", error);
    return false;
  }
}

// Test function optimized for free tier
export async function testThumbnailGeneration(): Promise<void> {
  console.log("🧪 Testing thumbnail generation with free tier settings...");

  try {
    const result = await generateThumbnail({
      prompt: "iPhone review",
      style: "tech",
      model: "sd15", // Use most reliable model
      quality: "fast", // Use fastest setting
    });

    console.log("✅ Test thumbnail generation successful");
    console.log("Prompt used:", result.prompt);
    console.log("Image blob size:", result.imageBlob.size, "bytes");
  } catch (error) {
    console.error("❌ Test thumbnail generation failed:", error);
    throw error;
  }
}
