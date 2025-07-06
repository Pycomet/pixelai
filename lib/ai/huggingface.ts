import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface ThumbnailGenerationOptions {
  prompt: string;
  style?: "tech" | "gaming" | "tutorial" | "lifestyle";
  userId?: string;
  model?: "sdxl" | "flux" | "realistic";
  quality?: "fast" | "balanced" | "high";
}

export interface ThumbnailResult {
  imageBlob: Blob;
  prompt: string;
  style: string;
  model: string;
  parameters: GenerationParameters;
}

interface GenerationParameters {
  model: string;
  steps: number;
  guidance_scale: number;
  negative_prompt: string;
  scheduler?: string;
  width: number;
  height: number;
}

// Available models with their strengths
const models = {
  sdxl: {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    name: "Stable Diffusion XL",
    description: "Best balance of quality and speed",
    recommended: true,
  },
  flux: {
    id: "black-forest-labs/FLUX.1-schnell",
    name: "FLUX Schnell",
    description: "Latest model with superior quality",
    recommended: false, // Often not available in free tier
  },
  realistic: {
    id: "stabilityai/stable-diffusion-2-1",
    name: "Stable Diffusion 2.1",
    description: "More realistic outputs",
    recommended: false,
  },
};

// Quality presets that significantly impact output
const qualityPresets = {
  fast: {
    steps: 15,
    guidance_scale: 7.0,
    description: "Quick generation (~10-15s)",
  },
  balanced: {
    steps: 25,
    guidance_scale: 8.5,
    description: "Good quality (~20-25s)",
  },
  high: {
    steps: 40,
    guidance_scale: 10.0,
    description: "Best quality (~30-40s)",
  },
};

// YouTube-optimized style prompts with negative prompts
const stylePrompts = {
  tech: {
    positive:
      "modern tech aesthetic, clean minimalist design, blue and white colors, professional quality, sharp focus, high contrast, bold typography, sleek gadgets, futuristic elements",
    negative:
      "blurry, low quality, pixelated, oversaturated, cluttered, messy text, poor lighting, amateur, grainy, distorted",
    basePrompt: "YouTube tech review thumbnail:",
  },
  gaming: {
    positive:
      "intense gaming aesthetic, dramatic lighting, neon colors, action-packed, high energy, bold graphics, gaming setup, RGB lighting, epic atmosphere, dynamic composition",
    negative:
      "boring, static, dull colors, poor composition, blurry, low contrast, amateur lighting, pixelated, distorted",
    basePrompt: "YouTube gaming thumbnail:",
  },
  tutorial: {
    positive:
      "educational style, clear typography, step-by-step visual, professional presentation, organized layout, instructional design, clean background, easy to read text",
    negative:
      "confusing layout, cluttered, poor readability, blurry text, amateur design, low quality, messy composition",
    basePrompt: "YouTube tutorial thumbnail:",
  },
  lifestyle: {
    positive:
      "warm personal aesthetic, authentic feel, natural lighting, lifestyle photography, cozy atmosphere, relatable, human-centered, soft colors, inviting mood",
    negative:
      "artificial, fake, oversaturated, poor lighting, low quality, blurry, unprofessional, cluttered background",
    basePrompt: "YouTube lifestyle thumbnail:",
  },
};

// Universal negative prompt for all thumbnails
const universalNegativePrompt = `
low quality, blurry, pixelated, distorted, amateur, poor composition, 
bad lighting, oversaturated, undersaturated, text too small, unreadable text, 
cluttered, messy, unprofessional, low resolution, jpeg artifacts, 
watermark, signature, copyright, nsfw, inappropriate content
`.trim();

export async function generateThumbnail(
  options: ThumbnailGenerationOptions
): Promise<ThumbnailResult> {
  const {
    prompt,
    style = "tech",
    model = "sdxl",
    quality = "balanced",
  } = options;

  // Get model and quality settings
  const selectedModel = models[model];
  const qualitySettings = qualityPresets[quality];
  const styleConfig = stylePrompts[style];

  // Build optimized prompt for YouTube thumbnails
  const optimizedPrompt = `
${styleConfig.basePrompt} ${prompt}, ${styleConfig.positive}, 
YouTube thumbnail design, 16:9 aspect ratio, eye-catching, clickable, 
high contrast, bold elements, professional quality, trending style,
perfect for YouTube, attention-grabbing, viral potential
`.trim();

  // Combine negative prompts
  const negativePrompt = `${styleConfig.negative}, ${universalNegativePrompt}`;

  // Generation parameters optimized for thumbnails
  const parameters: GenerationParameters = {
    model: selectedModel.id,
    width: 1280,
    height: 720,
    steps: qualitySettings.steps,
    guidance_scale: qualitySettings.guidance_scale,
    negative_prompt: negativePrompt,
  };

  try {
    console.log("Generating with parameters:", {
      model: selectedModel.name,
      quality,
      style,
      steps: parameters.steps,
      guidance: parameters.guidance_scale,
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
        // Additional parameters for better quality
        scheduler: "DPMSolverMultistepScheduler", // Better scheduler
        use_karras_sigmas: true, // Better noise scheduling
        clip_skip: 1, // For better prompt following
      },
    });

    return {
      imageBlob: response as unknown as Blob,
      prompt: optimizedPrompt,
      style,
      model: selectedModel.name,
      parameters,
    };
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw new Error(
      `Failed to generate thumbnail: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
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
    await hf.textToImage({
      model: models.sdxl.id,
      inputs: "test connection",
      parameters: { width: 512, height: 512, num_inference_steps: 1 },
    });
    return true;
  } catch (error) {
    console.error("Hugging Face connection test failed:", error);
    return false;
  }
}
