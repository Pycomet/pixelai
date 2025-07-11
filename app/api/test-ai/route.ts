import { NextResponse } from "next/server";
import { testAllProviders, getProviderStatus } from "@/lib/ai";

export async function GET() {
  try {
    console.log("🧪 Testing AI Providers...");

    // Test environment variables
    const envStatus = {
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY ? "Set" : "Not Set",
      STABILITY_API_KEY: process.env.STABILITY_API_KEY ? "Set" : "Not Set",
    };

    console.log("Environment variables:", envStatus);

    // Test all providers
    const providerResults = await testAllProviders();
    console.log("Provider test results:", providerResults);

    // Get detailed provider status
    const providerStatus = await getProviderStatus();
    console.log("Provider status:", providerStatus);

    return NextResponse.json({
      success: true,
      environmentVariables: envStatus,
      providerResults,
      providerStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
