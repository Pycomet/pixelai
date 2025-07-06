// fal.ai Provider Implementation
import { ThumbnailGenerationOptions, ThumbnailResult, GenerationParameters } from './providers';

// Note: fal.ai client should be installed: npm install @fal-ai/client
// For now, we'll use fetch directly to avoid adding dependencies

const FAL_API_URL = 'https://fal.run/fal-ai';

// Style prompts optimized for fal.ai models
const stylePrompts = {
  tech: {
    positive: "professional tech product, modern design, clean lighting, high quality, tech review thumbnail, sharp focus",
    negative: "blurry, low quality, amateur, watermark, text overlay",
    basePrompt: "tech product showcase",
  },
  gaming: {
    positive: "gaming setup, colorful RGB lighting, exciting atmosphere, gaming thumbnail, high energy, dramatic",
    negative: "boring, dull, poor lighting, low quality",
    basePrompt: "gaming content thumbnail",
  },
  tutorial: {
    positive: "educational content, clear presentation, professional layout, tutorial thumbnail, instructional, clean",
    negative: "confusing, cluttered, messy, poor quality",
    basePrompt: "tutorial content thumbnail",
  },
  lifestyle: {
    positive: "lifestyle photo, natural lighting, authentic, warm, lifestyle thumbnail, personal content, candid",
    negative: "artificial, fake, poor lighting, low quality",
    basePrompt: "lifestyle content thumbnail",
  },
};

const universalNegativePrompt = "low quality, blurry, amateur, watermark, text overlay, logos, copyright, distorted";

// Model configurations for fal.ai
const models = {
  'flux-schnell': {
    id: 'flux/schnell',
    name: 'FLUX.1 Schnell',
    steps: { fast: 1, balanced: 2, high: 4 },
    guidance: { fast: 3.0, balanced: 5.0, high: 7.0 },
  },
  'flux-dev': {
    id: 'flux/dev',
    name: 'FLUX.1 Dev',
    steps: { fast: 20, balanced: 30, high: 50 },
    guidance: { fast: 5.0, balanced: 7.0, high: 8.0 },
  },
  'hidream-fast': {
    id: 'hidream-i1-fast',
    name: 'HiDream I1 Fast',
    steps: { fast: 8, balanced: 16, high: 25 },
    guidance: { fast: 3.0, balanced: 5.0, high: 7.0 },
  },
};

export async function generateThumbnail(
  options: ThumbnailGenerationOptions
): Promise<ThumbnailResult> {
  const {
    prompt,
    style = "tech",
    model = "flux-schnell",
    quality = "balanced",
    refinementPrompt,
  } = options;

  // Validate API key
  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY environment variable is not set");
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
    console.log("🎨 Generating with fal.ai:", {
      model: selectedModel.name,
      prompt: finalPrompt.substring(0, 80) + "...",
      quality,
      style,
      steps: parameters.steps,
      guidance: parameters.guidance_scale,
      dimensions: `${parameters.width}x${parameters.height}`,
    });

    // Prepare request body based on model
    let requestBody: any = {
      prompt: finalPrompt,
      negative_prompt: negativePrompt,
      image_size: {
        width: parameters.width,
        height: parameters.height,
      },
      num_images: 1,
      enable_safety_checker: true,
      output_format: "jpeg",
    };

    // Add model-specific parameters
    if (model === 'flux-schnell') {
      requestBody.num_inference_steps = parameters.steps;
    } else if (model === 'flux-dev') {
      requestBody.num_inference_steps = parameters.steps;
      requestBody.guidance_scale = parameters.guidance_scale;
    } else if (model === 'hidream-fast') {
      requestBody.num_inference_steps = parameters.steps;
      requestBody.guidance_scale = parameters.guidance_scale;
    }

    const response = await fetch(`${FAL_API_URL}/${selectedModel.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fal.ai API error:", errorText);
      
      if (response.status === 401) {
        throw new Error("Invalid fal.ai API key");
      }
      if (response.status === 429) {
        throw new Error("fal.ai rate limit exceeded. Please try again later.");
      }
      if (response.status === 400) {
        throw new Error("Invalid request to fal.ai. Please check your prompt.");
      }
      if (response.status === 402) {
        throw new Error("fal.ai payment required. Please add credits to your account.");
      }
      
      throw new Error(`fal.ai API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.images || data.images.length === 0) {
      throw new Error("No image generated by fal.ai");
    }

    // Download the image from the URL
    const imageUrl = data.images[0].url;
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error("Failed to download generated image");
    }

    const imageBlob = await imageResponse.blob();

    console.log("✅ fal.ai generation successful");

    return {
      imageBlob,
      prompt: finalPrompt,
      style,
      model: selectedModel.name,
      provider: 'fal',
      parameters,
    };
  } catch (error) {
    console.error("❌ fal.ai error:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Failed to generate thumbnail with fal.ai: ${error}`);
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    if (!process.env.FAL_KEY) {
      return false;
    }

    console.log("🔍 Testing fal.ai connection...");
    
    // Test with a simple request to flux-schnell (fastest model)
    const response = await fetch(`${FAL_API_URL}/flux/schnell`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "test image",
        image_size: {
          width: 512,
          height: 512,
        },
        num_images: 1,
        num_inference_steps: 1,
      }),
    });
    
    if (response.ok) {
      console.log("✅ fal.ai connection test successful");
      return true;
    } else if (response.status === 402) {
      console.log("⚠️ fal.ai connection OK but requires payment");
      return true; // Connection works, just needs credits
    } else {
      console.error("❌ fal.ai connection test failed:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ fal.ai connection test failed:", error);
    return false;
  }
}

export async function testThumbnailGeneration(): Promise<void> {
  console.log("🧪 Testing fal.ai thumbnail generation...");
  
  try {
    const result = await generateThumbnail({
      prompt: "iPhone review",
      style: "tech",
      model: "flux-schnell",
      quality: "fast",
    });
    
    console.log("✅ fal.ai test generation successful");
    console.log("Prompt used:", result.prompt);
    console.log("Image blob size:", result.imageBlob.size, "bytes");
  } catch (error) {
    console.error("❌ fal.ai test generation failed:", error);
    throw error;
  }
} 