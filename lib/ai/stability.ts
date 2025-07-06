// Stability AI Provider Implementation
import { ThumbnailGenerationOptions, ThumbnailResult, GenerationParameters } from './providers';

const STABILITY_API_URL = 'https://api.stability.ai/v1/generation';

// Style prompts optimized for Stability AI
const stylePrompts = {
  tech: {
    positive: "professional tech product, modern design, clean lighting, high quality, tech review thumbnail",
    negative: "blurry, low quality, amateur, watermark, text overlay",
    basePrompt: "tech product showcase",
  },
  gaming: {
    positive: "gaming setup, colorful RGB lighting, exciting atmosphere, gaming thumbnail, high energy",
    negative: "boring, dull, poor lighting, low quality",
    basePrompt: "gaming content thumbnail",
  },
  tutorial: {
    positive: "educational content, clear presentation, professional layout, tutorial thumbnail, instructional",
    negative: "confusing, cluttered, messy, poor quality",
    basePrompt: "tutorial content thumbnail",
  },
  lifestyle: {
    positive: "lifestyle photo, natural lighting, authentic, warm, lifestyle thumbnail, personal content",
    negative: "artificial, fake, poor lighting, low quality",
    basePrompt: "lifestyle content thumbnail",
  },
};

const universalNegativePrompt = "low quality, blurry, amateur, watermark, text overlay, logos, copyright";

// Model configurations for Stability AI
const models = {
  'sd-3.5-large': {
    id: 'stable-diffusion-3-5-large',
    name: 'Stable Diffusion 3.5 Large',
    steps: { fast: 20, balanced: 30, high: 50 },
    guidance: { fast: 5.0, balanced: 7.0, high: 8.0 },
  },
  'sd-3.5-turbo': {
    id: 'stable-diffusion-3-5-turbo',
    name: 'Stable Diffusion 3.5 Turbo',
    steps: { fast: 4, balanced: 6, high: 8 },
    guidance: { fast: 3.0, balanced: 5.0, high: 7.0 },
  },
  'sdxl': {
    id: 'stable-diffusion-xl-1024-v1-0',
    name: 'Stable Diffusion XL',
    steps: { fast: 15, balanced: 25, high: 35 },
    guidance: { fast: 6.0, balanced: 7.5, high: 8.5 },
  },
};

export async function generateThumbnail(
  options: ThumbnailGenerationOptions
): Promise<ThumbnailResult> {
  const {
    prompt,
    style = "tech",
    model = "sd-3.5-large",
    quality = "balanced",
    refinementPrompt,
  } = options;

  // Validate API key
  if (!process.env.STABILITY_API_KEY) {
    throw new Error("STABILITY_API_KEY environment variable is not set");
  }

  // Get model configuration
  const selectedModel = models[model as keyof typeof models];
  if (!selectedModel) {
    throw new Error(`Model ${model} not found`);
  }

  const styleConfig = stylePrompts[style];
  
  // Build the prompt with optional refinement
  let finalPrompt = `${styleConfig.basePrompt}, ${prompt}, ${styleConfig.positive}`;
  if (refinementPrompt) {
    finalPrompt += `, ${refinementPrompt}`;
  }

  // Build negative prompt
  const negativePrompt = `${styleConfig.negative}, ${universalNegativePrompt}`;

  // Generation parameters
  const qualitySettings = selectedModel.steps[quality];
  const guidanceSettings = selectedModel.guidance[quality];

  const parameters: GenerationParameters = {
    model: selectedModel.id,
    width: 1024,
    height: 576, // 16:9 aspect ratio
    steps: qualitySettings,
    guidance_scale: guidanceSettings,
    negative_prompt: negativePrompt,
  };

  try {
    console.log("🎨 Generating with Stability AI:", {
      model: selectedModel.name,
      prompt: finalPrompt.substring(0, 80) + "...",
      quality,
      style,
      steps: parameters.steps,
      guidance: parameters.guidance_scale,
      dimensions: `${parameters.width}x${parameters.height}`,
    });

    const response = await fetch(`${STABILITY_API_URL}/${selectedModel.id}/text-to-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: finalPrompt,
            weight: 1.0,
          },
          {
            text: negativePrompt,
            weight: -1.0,
          },
        ],
        cfg_scale: parameters.guidance_scale,
        height: parameters.height,
        width: parameters.width,
        samples: 1,
        steps: parameters.steps,
        style_preset: style === 'tech' ? 'enhance' : 
                      style === 'gaming' ? 'neon-punk' :
                      style === 'tutorial' ? 'digital-art' : 'photographic',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stability API error:", errorText);
      
      if (response.status === 401) {
        throw new Error("Invalid Stability AI API key");
      }
      if (response.status === 429) {
        throw new Error("Stability AI rate limit exceeded. Please try again later.");
      }
      if (response.status === 400) {
        throw new Error("Invalid request to Stability AI. Please check your prompt.");
      }
      
      throw new Error(`Stability AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.artifacts || data.artifacts.length === 0) {
      throw new Error("No image generated by Stability AI");
    }

    // Convert base64 to blob
    const base64Image = data.artifacts[0].base64;
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });

    console.log("✅ Stability AI generation successful");

    return {
      imageBlob,
      prompt: finalPrompt,
      style,
      model: selectedModel.name,
      provider: 'stability',
      parameters,
    };
  } catch (error) {
    console.error("❌ Stability AI error:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Failed to generate thumbnail with Stability AI: ${error}`);
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    if (!process.env.STABILITY_API_KEY) {
      return false;
    }

    console.log("🔍 Testing Stability AI connection...");
    
    const response = await fetch('https://api.stability.ai/v1/user/account', {
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
      },
    });
    
    if (response.ok) {
      console.log("✅ Stability AI connection test successful");
      return true;
    } else {
      console.error("❌ Stability AI connection test failed:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Stability AI connection test failed:", error);
    return false;
  }
}

export async function testThumbnailGeneration(): Promise<void> {
  console.log("🧪 Testing Stability AI thumbnail generation...");
  
  try {
    const result = await generateThumbnail({
      prompt: "iPhone review",
      style: "tech",
      model: "sdxl",
      quality: "fast",
    });
    
    console.log("✅ Stability AI test generation successful");
    console.log("Prompt used:", result.prompt);
    console.log("Image blob size:", result.imageBlob.size, "bytes");
  } catch (error) {
    console.error("❌ Stability AI test generation failed:", error);
    throw error;
  }
} 