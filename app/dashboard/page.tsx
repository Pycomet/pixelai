"use client";
import { useState, useEffect, Suspense } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Image,
  Chip,
  Select,
  SelectItem,
  Progress,
  Spinner,
  RadioGroup,
  Radio,
  Textarea,
} from "@nextui-org/react";
import { PageLayout } from "@/components/layouts/pageLayout";
import { useUser } from "@/contexts/userContext";
import { useMessage } from "@/contexts/messageContext";
import { title, subtitle, button } from "@/components/primitives";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatedDiv } from "@/components/motion";
import { SearchIcon, RightArrowIcon, Download, Sparkles, Zap, Shield } from "lucide-react";

type ThumbnailStyle = "tech" | "gaming" | "tutorial" | "lifestyle";

interface GenerationResult {
  success: boolean;
  imageUrl: string;
  prompt: string;
  style: string;
  model: string;
  provider: string;
  parameters: {
    steps: number;
    guidance_scale: number;
    width: number;
    height: number;
  };
}

interface ErrorInfo {
  type: "validation" | "api" | "network" | "quota" | "model";
  message: string;
  retryable: boolean;
}

const authDisabled = process.env.NODE_ENV === "development";

// Simplified style options with visual indicators
const styleOptions = [
  {
    key: "tech",
    label: "Tech & Reviews",
    icon: "💻",
    description: "Modern, clean tech product presentations",
    color: "primary" as const,
  },
  {
    key: "gaming",
    label: "Gaming",
    icon: "🎮",
    description: "Vibrant gaming content with energy",
    color: "secondary" as const,
  },
  {
    key: "tutorial",
    label: "Tutorial",
    icon: "📚",
    description: "Educational and instructional content",
    color: "success" as const,
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    icon: "✨",
    description: "Personal and lifestyle content",
    color: "warning" as const,
  },
];

// Simplified provider options
const providerOptions = [
  {
    id: "stability",
    name: "Stability AI",
    description: "Best Quality • Free",
    icon: <Shield className="w-5 h-5" />,
    badge: "Recommended",
    badgeColor: "success" as const,
  },
  {
    id: "huggingface",
    name: "HuggingFace",
    description: "Good Quality • Free with limits",
    icon: <Zap className="w-5 h-5" />,
    badge: "Backup",
    badgeColor: "primary" as const,
  },
];

// Simplified quality options
const qualityOptions = [
  { value: "fast", label: "Fast", description: "Quick generation (~10s)" },
  { value: "balanced", label: "Balanced", description: "Good quality (~20s)" },
  { value: "high", label: "High", description: "Best quality (~30s)" },
];

// Quick prompt suggestions
const promptSuggestions = [
  "iPhone 15 Pro Max review with surprised reaction",
  "Gaming setup tour with RGB lighting",
  "How to cook perfect pasta tutorial",
  "Morning routine lifestyle content",
  "Unboxing the latest tech gadget",
  "Minecraft building tutorial castle",
];

function categorizeError(error: any): ErrorInfo {
  const errorMessage = error?.message || error?.toString() || "Unknown error";
  const lowerMessage = errorMessage.toLowerCase();

  if (lowerMessage.includes("enter a video description")) {
    return {
      type: "validation",
      message: "Please enter a description for your content",
      retryable: false,
    };
  }

  if (lowerMessage.includes("rate") || lowerMessage.includes("quota")) {
    return {
      type: "quota",
      message: "Too many requests. Please wait a moment and try again.",
      retryable: true,
    };
  }

  if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
    return {
      type: "network",
      message: "Network error. Please check your connection and try again.",
      retryable: true,
    };
  }

  if (lowerMessage.includes("api key") || lowerMessage.includes("unauthorized")) {
    return {
      type: "api",
      message: "AI service not configured. Please try a different provider.",
      retryable: false,
    };
  }

  return {
    type: "api",
    message: "Something went wrong. Please try again.",
    retryable: true,
  };
}

function DashboardContent() {
  const { user, loading: userLoading } = useUser();
  const { message } = useMessage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Simplified state management
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ThumbnailStyle>("tech");
  const [provider, setProvider] = useState("stability");
  const [quality, setQuality] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);

  // Handle search parameters
  useEffect(() => {
    const searchPrompt = searchParams.get("prompt");
    if (searchPrompt) {
      setPrompt(searchPrompt);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError({
        type: "validation",
        message: "Please enter a description for your content",
        retryable: false,
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 8, 90));
    }, 600);

    try {
      const userId = authDisabled ? "demo-user" : user?.uid;
      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          quality,
          provider,
          userId,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setResult(data);
        message("🎉 Thumbnail generated successfully!", "success");
      } else {
        const errorInfo = categorizeError(data.error);
        setError(errorInfo);
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorInfo = categorizeError(err);
      setError(errorInfo);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setError(null);
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.imageUrl;
    link.download = `thumbnail-${Date.now()}.png`;
    link.click();
  };

  if (userLoading) {
    return (
      <PageLayout showNav={true}>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showNav={true}>
      <div className="container mx-auto max-w-6xl py-6 md:py-10">
        {/* Header */}
        <AnimatedDiv className="text-center mb-8">
          <h1 className={title({ size: "lg" })}>Create Perfect&nbsp;</h1>
          <h1 className={title({ color: "base", size: "lg" })}>Thumbnails</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Generate eye-catching thumbnails in seconds with AI
          </p>
        </AnimatedDiv>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Describe Your Content */}
            <AnimatedDiv>
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <h3 className="text-xl font-semibold">Describe Your Content</h3>
                      <p className="text-sm text-default-600">What's your video about?</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Textarea
                    size="lg"
                    placeholder="e.g., iPhone 15 Pro Max review with surprised reaction"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={200}
                    description={`${prompt.length}/200 characters`}
                    classNames={{
                      inputWrapper: "shadow-sm",
                    }}
                  />
                  
                  {/* Quick Suggestions */}
                  <div className="space-y-2">
                    <p className="text-sm text-default-600">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {promptSuggestions.slice(0, 3).map((suggestion, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="flat"
                          className="text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </AnimatedDiv>

            {/* Step 2: Choose Style */}
            <AnimatedDiv>
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <h3 className="text-xl font-semibold">Choose Style</h3>
                      <p className="text-sm text-default-600">Pick the style that matches your content</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <RadioGroup
                    value={style}
                    onValueChange={(value) => setStyle(value as ThumbnailStyle)}
                    className="gap-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {styleOptions.map((option) => (
                        <div key={option.key} className="relative">
                          <Radio
                            value={option.key}
                            classNames={{
                              base: "hidden",
                            }}
                          />
                          <Card
                            className={`cursor-pointer transition-all ${
                              style === option.key
                                ? "ring-2 ring-primary bg-primary/10"
                                : "hover:bg-default-50"
                            }`}
                            isPressable
                            onPress={() => setStyle(option.key as ThumbnailStyle)}
                          >
                            <CardBody className="p-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{option.icon}</span>
                                <div>
                                  <h4 className="font-semibold">{option.label}</h4>
                                  <p className="text-xs text-default-600">{option.description}</p>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardBody>
              </Card>
            </AnimatedDiv>

            {/* Step 3: Settings */}
            <AnimatedDiv>
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <h3 className="text-xl font-semibold">Settings</h3>
                      <p className="text-sm text-default-600">Choose your AI provider and quality</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Provider Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">AI Provider</label>
                      <RadioGroup
                        value={provider}
                        onValueChange={setProvider}
                        className="gap-2"
                      >
                        {providerOptions.map((option) => (
                          <div key={option.id} className="relative">
                            <Radio
                              value={option.id}
                              classNames={{
                                base: "hidden",
                              }}
                            />
                            <Card
                              className={`cursor-pointer transition-all ${
                                provider === option.id
                                  ? "ring-2 ring-primary bg-primary/10"
                                  : "hover:bg-default-50"
                              }`}
                              isPressable
                              onPress={() => setProvider(option.id)}
                            >
                              <CardBody className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {option.icon}
                                    <div>
                                      <h4 className="font-semibold text-sm">{option.name}</h4>
                                      <p className="text-xs text-default-600">{option.description}</p>
                                    </div>
                                  </div>
                                  <Chip size="sm" color={option.badgeColor} variant="flat">
                                    {option.badge}
                                  </Chip>
                                </div>
                              </CardBody>
                            </Card>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Quality Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quality</label>
                      <Select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        placeholder="Select quality"
                        classNames={{
                          trigger: "shadow-sm",
                        }}
                      >
                        {qualityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-default-600">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </AnimatedDiv>

            {/* Generate Button */}
            <AnimatedDiv>
              <Button
                size="lg"
                className={`${button({ color: "gradient" })} h-14 text-lg`}
                onClick={handleGenerate}
                isLoading={loading}
                fullWidth
                startContent={!loading && <Sparkles className="w-5 h-5" />}
              >
                {loading ? "Creating Your Thumbnail..." : "Generate Thumbnail"}
              </Button>
            </AnimatedDiv>

            {/* Progress */}
            {loading && (
              <AnimatedDiv>
                <Card className="shadow-lg">
                  <CardBody className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Generating...</p>
                        <p className="text-sm text-default-600">{Math.round(progress)}%</p>
                      </div>
                      <Progress value={progress} className="w-full" color="primary" />
                      <p className="text-xs text-center text-default-500">
                        Using {provider === "stability" ? "Stability AI" : "HuggingFace"} • {quality} quality
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </AnimatedDiv>
            )}

            {/* Error Display */}
            {error && (
              <AnimatedDiv>
                <Card className="shadow-lg border-l-4 border-danger">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-danger rounded-full flex items-center justify-center text-white text-sm">!</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-danger">Error</h4>
                        <p className="text-sm text-default-600">{error.message}</p>
                      </div>
                      {error.retryable && (
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onClick={handleGenerate}
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </AnimatedDiv>
            )}
          </div>

          {/* Result Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Preview</h3>
                </CardHeader>
                <CardBody>
                  {result ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <Image
                          src={result.imageUrl}
                          alt="Generated thumbnail"
                          className="w-full rounded-lg shadow-md"
                          radius="md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Provider:</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {result.provider === "stability" ? "Stability AI" : "HuggingFace"}
                          </Chip>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Style:</span>
                          <Chip size="sm" variant="flat" color="secondary">
                            {styleOptions.find(s => s.key === result.style)?.label}
                          </Chip>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Size:</span>
                          <Chip size="sm" variant="flat" color="success">
                            {result.parameters.width}x{result.parameters.height}
                          </Chip>
                        </div>
                      </div>

                      <Button
                        onClick={handleDownload}
                        className="w-full"
                        color="primary"
                        startContent={<Download className="w-4 h-4" />}
                      >
                        Download Thumbnail
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🎨</span>
                      </div>
                      <p className="text-default-500">
                        Your thumbnail will appear here
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
