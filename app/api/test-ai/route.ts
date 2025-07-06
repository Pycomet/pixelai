import { NextRequest, NextResponse } from "next/server";
import { testConnection, testThumbnailGeneration } from "@/lib/ai/huggingface";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Starting AI service test...");
    
    // Check if API key is available
    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "HUGGINGFACE_API_KEY environment variable is not set",
        type: "configuration",
      }, { status: 500 });
    }
    
    // Test basic connection
    console.log("Testing basic connection...");
    const connectionTest = await testConnection();
    
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        error: "HuggingFace API connection failed",
        type: "connection",
      }, { status: 503 });
    }
    
    // Test thumbnail generation
    console.log("Testing thumbnail generation...");
    await testThumbnailGeneration();
    
    return NextResponse.json({
      success: true,
      message: "AI service is working correctly",
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error("❌ AI service test failed:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      type: "test_failed",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AI Test API",
    usage: "Send a POST request to test the AI service",
  });
} 