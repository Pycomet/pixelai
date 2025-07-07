import { NextRequest, NextResponse } from "next/server";
import { generateThumbnail, ThumbnailGenerationOptions } from "@/lib/ai";

// Enhanced error response helper
function createErrorResponse(
  message: string,
  status: number = 500,
  type?: string
) {
  return NextResponse.json(
    {
      error: message,
      type: type || "api",
      success: false,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      style = "tech",
      model = "sdxl",
      quality = "balanced",
      provider = "huggingface",
      userId,
      refinementPrompt,
    } = body;

    // Enhanced input validation
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return createErrorResponse(
        "Please enter a video description",
        400,
        "validation"
      );
    }

    if (prompt.length > 500) {
      return createErrorResponse(
        "Description must be less than 500 characters",
        400,
        "validation"
      );
    }

    if (prompt.trim().length < 5) {
      return createErrorResponse(
        "Description must be at least 5 characters long",
        400,
        "validation"
      );
    }

    // Validate parameters
    const validProviders = ["huggingface", "stability", "fal"];
    const validQualities = ["fast", "balanced", "high"];
    const validStyles = ["tech", "gaming", "tutorial", "lifestyle"];

    if (!validProviders.includes(provider)) {
      return createErrorResponse(
        "Invalid AI provider selected. Please choose a valid provider.",
        400,
        "validation"
      );
    }

    if (!validQualities.includes(quality)) {
      return createErrorResponse(
        "Invalid quality setting selected. Please choose a valid quality level.",
        400,
        "validation"
      );
    }

    if (!validStyles.includes(style)) {
      return createErrorResponse(
        "Invalid style selected. Please choose a valid style.",
        400,
        "validation"
      );
    }

    // Check for API key based on provider
    let apiKeyMissing = false;
    let apiKeyName = "";

    switch (provider) {
      case "huggingface":
        apiKeyMissing = !process.env.HUGGINGFACE_API_KEY;
        apiKeyName = "HUGGINGFACE_API_KEY";
        break;
      case "stability":
        apiKeyMissing = !process.env.STABILITY_API_KEY;
        apiKeyName = "STABILITY_API_KEY";
        break;
      case "fal":
        apiKeyMissing = !process.env.FAL_KEY;
        apiKeyName = "FAL_KEY";
        break;
    }

    if (apiKeyMissing) {
      return createErrorResponse(
        `AI service is not configured (${apiKeyName} missing). Please contact support.`,
        500,
        "api"
      );
    }

    // Generate thumbnail with enhanced error handling
    const options: ThumbnailGenerationOptions = {
      prompt: prompt.trim(),
      style,
      model,
      quality,
      provider,
      userId,
      refinementPrompt: refinementPrompt?.trim(),
    };

    console.log("Generating thumbnail with options:", {
      prompt: prompt.substring(0, 50) + "...",
      style,
      model,
      quality,
      provider,
      userId: userId ? "***" : "none",
      refinement: refinementPrompt ? "yes" : "no",
    });

    const result = await generateThumbnail(options);

    // Convert blob to base64 for response
    const arrayBuffer = await result.imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      prompt: result.prompt,
      style: result.style,
      model: result.model,
      provider: result.provider,
      parameters: result.parameters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error);

    // Enhanced error categorization
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      // Network/connection errors
      if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
        return createErrorResponse(
          "Unable to connect to AI service. Please check your internet connection.",
          503,
          "network"
        );
      }

      // Rate limiting errors
      if (
        errorMessage.includes("rate") ||
        errorMessage.includes("limit") ||
        errorMessage.includes("quota")
      ) {
        return createErrorResponse(
          "Too many requests. Please wait a moment before trying again.",
          429,
          "quota"
        );
      }

      // Model-specific errors
      if (errorMessage.includes("model") || errorMessage.includes("loading")) {
        return createErrorResponse(
          "AI model is currently unavailable. Try switching to a different model or wait a moment.",
          503,
          "model"
        );
      }

      // Authentication errors
      if (
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("forbidden")
      ) {
        return createErrorResponse(
          "AI service authentication failed. Please contact support.",
          401,
          "api"
        );
      }

      // Timeout errors
      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("aborted")
      ) {
        return createErrorResponse(
          "Request timed out. Please try again with a shorter description.",
          408,
          "network"
        );
      }

      // Return the actual error message for debugging
      return createErrorResponse(
        `Generation failed: ${error.message}`,
        500,
        "api"
      );
    }

    // Fallback for unknown errors
    return createErrorResponse(
      "An unexpected error occurred. Please try again.",
      500,
      "unknown"
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "PixelAI Thumbnail Generation API",
    version: "1.0.0",
    status: "online",
    supportedStyles: ["tech", "gaming", "tutorial", "lifestyle"],
    supportedModels: ["sdxl", "flux", "realistic"],
    supportedQualities: ["fast", "balanced", "high"],
    limits: {
      maxPromptLength: 500,
      minPromptLength: 5,
    },
    timestamp: new Date().toISOString(),
  });
}
