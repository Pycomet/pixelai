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
  Divider,
  Progress,
  Badge,
  Spinner,
} from "@nextui-org/react";
import { PageLayout } from "@/components/layouts/pageLayout";
import { useUser } from "@/contexts/userContext";
import { useMessage } from "@/contexts/messageContext";
import { title, subtitle, button } from "@/components/primitives";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatedDiv } from "@/components/motion";
import { SearchIcon, RightArrowIcon } from "@/components/icons";
import { motion } from "framer-motion";
import { Cpu, Clock, AlertCircle, RefreshCw } from "lucide-react";

type ThumbnailStyle = "tech" | "gaming" | "tutorial" | "lifestyle";

interface GenerationResult {
  imageUrl: string;
  prompt: string;
  style: string;
  model: string;
  parameters: {
    steps: number;
    guidance_scale: number;
    negative_prompt: string;
  };
  timestamp: string;
}

// Error types for better error handling
interface ErrorInfo {
  type: "validation" | "network" | "api" | "quota" | "model" | "unknown";
  message: string;
  suggestion?: string;
  retryable: boolean;
}

// Error categorization helper
const categorizeError = (error: any): ErrorInfo => {
  const errorMessage = error?.message || error?.toString() || "Unknown error";
  const errorLower = errorMessage.toLowerCase();

  // Network errors
  if (
    errorLower.includes("network") ||
    errorLower.includes("fetch") ||
    errorLower.includes("connection")
  ) {
    return {
      type: "network",
      message: "Unable to connect to our servers",
      suggestion: "Please check your internet connection and try again",
      retryable: true,
    };
  }

  // API quota errors
  if (
    errorLower.includes("quota") ||
    errorLower.includes("limit") ||
    errorLower.includes("rate")
  ) {
    return {
      type: "quota",
      message: "Generation limit reached",
      suggestion: "Please try again in a few minutes or consider upgrading",
      retryable: true,
    };
  }

  // Model errors
  if (
    errorLower.includes("model") ||
    errorLower.includes("unavailable") ||
    errorLower.includes("loading")
  ) {
    return {
      type: "model",
      message: "AI model is temporarily unavailable",
      suggestion: "Try switching to a different model or wait a moment",
      retryable: true,
    };
  }

  // Validation errors
  if (
    errorLower.includes("invalid") ||
    errorLower.includes("required") ||
    errorLower.includes("validation")
  ) {
    return {
      type: "validation",
      message: errorMessage,
      suggestion: "Please check your input and try again",
      retryable: false,
    };
  }

  // API errors
  if (
    errorLower.includes("api") ||
    errorLower.includes("server") ||
    errorLower.includes("500")
  ) {
    return {
      type: "api",
      message: "Server error occurred",
      suggestion: "Our servers are experiencing issues. Please try again shortly",
      retryable: true,
    };
  }

  // Unknown errors
  return {
    type: "unknown",
    message: "Something went wrong",
    suggestion: "Please try again or contact support if the problem persists",
    retryable: true,
  };
};

const styleOptions = [
  {
    key: "tech",
    label: "Tech Review",
    description: "Modern, clean, professional",
    gradient: "from-blue-500 to-cyan-500",
    icon: "💻",
  },
  {
    key: "gaming",
    label: "Gaming",
    description: "Intense, dramatic, neon colors",
    gradient: "from-purple-500 to-pink-500",
    icon: "🎮",
  },
  {
    key: "tutorial",
    label: "Tutorial",
    description: "Educational, clear, step-by-step",
    gradient: "from-green-500 to-teal-500",
    icon: "📚",
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    description: "Warm, personal, authentic",
    gradient: "from-orange-500 to-red-500",
    icon: "✨",
  },
];

const modelOptions = [
  {
    value: "sdxl",
    label: "Stable Diffusion XL",
    description: "Best balance of quality and speed",
    icon: "⚡",
    recommended: true,
  },
  {
    value: "flux",
    label: "FLUX Schnell",
    description: "Latest model with superior quality",
    icon: "🚀",
    recommended: false,
  },
  {
    value: "realistic",
    label: "Realistic SD",
    description: "More photorealistic outputs",
    icon: "📸",
    recommended: false,
  },
];

const qualityOptions = [
  {
    value: "fast",
    label: "Fast",
    description: "Quick generation (~15s)",
    icon: "⚡",
    recommended: false,
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Good quality (~25s)",
    icon: "⚖️",
    recommended: true,
  },
  {
    value: "high",
    label: "High",
    description: "Best quality (~40s)",
    icon: "💎",
    recommended: false,
  },
];

// Intelligent suggestion system - creates short, punchy suggestions
const generateSmartSuggestions = (input: string): string[] => {
  const trimmedInput = input.trim().toLowerCase();

  if (trimmedInput.length < 3) return [];

  // Keywords and patterns for different types of content
  const patterns = {
    tech: [
      "iphone",
      "android",
      "laptop",
      "pc",
      "review",
      "unboxing",
      "setup",
      "build",
      "coding",
      "app",
      "software",
      "hardware",
      "gadget",
      "phone",
      "computer",
      "tech",
      "ai",
      "robot",
    ],
    gaming: [
      "game",
      "gaming",
      "play",
      "stream",
      "twitch",
      "fps",
      "rpg",
      "minecraft",
      "fortnite",
      "valorant",
      "league",
      "cod",
      "setup",
      "build",
      "pc gaming",
      "console",
    ],
    tutorial: [
      "how to",
      "tutorial",
      "guide",
      "learn",
      "teach",
      "explain",
      "step",
      "beginner",
      "advanced",
      "tips",
      "tricks",
      "method",
      "way to",
    ],
    lifestyle: [
      "morning",
      "routine",
      "day in",
      "vlog",
      "life",
      "travel",
      "food",
      "cooking",
      "workout",
      "fitness",
      "home",
      "room",
      "outfit",
      "style",
    ],
    entertainment: [
      "funny",
      "comedy",
      "react",
      "reaction",
      "challenge",
      "prank",
      "story",
      "storytime",
      "drama",
      "expose",
      "truth",
    ],
  };

  // Detect content type
  let contentType = "general";

  for (const [type, keywords] of Object.entries(patterns)) {
    const matches = keywords.filter((keyword) =>
      trimmedInput.includes(keyword)
    );
    if (matches.length > 0) {
      contentType = type;
      break;
    }
  }

  const suggestions: string[] = [];

  // Generate shorter, punchier suggestions based on content type
  switch (contentType) {
    case "tech":
      if (trimmedInput.includes("iphone") || trimmedInput.includes("phone")) {
        suggestions.push(
          "iPhone camera test results",
          "Phone battery life review",
          "iPhone vs Android comparison"
        );
      } else if (trimmedInput.includes("review")) {
        suggestions.push(
          "Tech review honest verdict",
          "Gadget review pros cons",
          "Review after 30 days"
        );
      } else if (trimmedInput.includes("unbox")) {
        suggestions.push(
          "Unboxing first impressions setup",
          "Unboxing hidden features revealed",
          "Unboxing build quality test"
        );
      } else {
        suggestions.push(
          "Tech tutorial complete guide",
          "Tech breakdown analysis",
          "Tech secrets exposed"
        );
      }
      break;

    case "gaming":
      if (trimmedInput.includes("setup") || trimmedInput.includes("build")) {
        suggestions.push(
          "Gaming setup complete guide",
          "Budget gaming build guide",
          "Max FPS gaming setup"
        );
      } else if (trimmedInput.includes("review")) {
        suggestions.push(
          "Game review honest verdict",
          "Gaming gear review test",
          "Game worth buying"
        );
      } else {
        suggestions.push(
          "Gaming highlights epic moments",
          "Gaming pro strategies tips",
          "Gaming skills showcase"
        );
      }
      break;

    case "tutorial":
      suggestions.push(
        "Complete beginner tutorial guide",
        "Advanced techniques made simple",
        "Expert secrets tutorial"
      );
      break;

    case "lifestyle":
      if (trimmedInput.includes("routine")) {
        suggestions.push(
          "Morning routine that works",
          "Life routine for success",
          "Routine secrets revealed"
        );
      } else if (
        trimmedInput.includes("vlog") ||
        trimmedInput.includes("day")
      ) {
        suggestions.push(
          "Day in life vlog",
          "Behind scenes moments",
          "Real life unfiltered"
        );
      } else {
        suggestions.push(
          "Lifestyle transformation results",
          "Life journey lessons",
          "Lifestyle experience insights"
        );
      }
      break;

    case "entertainment":
      suggestions.push(
        "Funny moments hilarious reactions",
        "Reaction video genuine emotions",
        "Entertainment content results"
      );
      break;

    default:
      // Generic suggestions that work for any content
      suggestions.push(
        "Complete step by step",
        "Honest review results",
        "Detailed analysis secrets"
      );
  }

  // Return unique suggestions, max 3
  return suggestions
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s, index, arr) => arr.indexOf(s) === index)
    .slice(0, 3);
};

function DashboardContent() {
  const { user, loading: userLoading } = useUser();
  const { message } = useMessage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ThumbnailStyle>("tech");
  const [model, setModel] = useState("sdxl");
  const [quality, setQuality] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Handle search parameters
  useEffect(() => {
    const searchPrompt = searchParams.get("prompt");
    if (searchPrompt) {
      setPrompt(searchPrompt);
    }
  }, [searchParams]);

  // Generate suggestions based on user input
  useEffect(() => {
    if (prompt.trim().length >= 3) {
      const newSuggestions = generateSmartSuggestions(prompt);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [prompt]);

  // Simulate progress during generation
  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Show toast notifications for errors
  useEffect(() => {
    if (error) {
      message(error.message, "error");
    }
  }, [error, message]);

  // Redirect if not authenticated (unless auth is disabled)
  const authDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  if (!authDisabled && !userLoading && !user) {
    router.push("/");
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      const validationError = {
        type: "validation" as const,
        message: "Please enter a video description",
        retryable: false
      };
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 800);

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
          model,
          quality,
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
        message("Thumbnail generated successfully!", "success");
        setRetryCount(0);
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

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    setTimeout(() => {
      handleGenerate();
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setSuggestions([]);
    setError(null);
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
      <div className="container mx-auto max-w-7xl py-6 md:py-10">
        {/* Header Section */}
        <AnimatedDiv className="text-center mb-12">
          <h1 className={title({ size: "lg" })}>Create Your Perfect&nbsp;</h1>
          <h1 className={title({ color: "base", size: "lg" })}>
            YouTube Thumbnail
          </h1>
          <p className={subtitle({ class: "mt-4 mx-auto" })}>
            Transform your video ideas into eye-catching thumbnails that boost
            clicks and views
          </p>
        </AnimatedDiv>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Generation Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Input Section */}
            <AnimatedDiv>
              <Card className="p-6 shadow-xl bg-default-50/50 dark:bg-default-100/50 backdrop-blur-md">
                <CardBody className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                      Describe Your Video
                    </h2>
                    <p className="text-default-600 text-sm">
                      Tell us what your video is about and we&apos;ll create the
                      perfect thumbnail
                    </p>
                  </div>

                  <Input
                    size="lg"
                    label="Video Description"
                    placeholder="e.g., iPhone 15 Pro Max review with surprised reaction"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={500}
                    description={`${prompt.length}/500 characters`}
                    startContent={
                      <SearchIcon className="text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    classNames={{
                      inputWrapper: [
                        "shadow-md",
                        "bg-default-200/50",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "hover:bg-default-200/70",
                        "dark:hover:bg-default/70",
                        "group-data-[focus=true]:bg-default-200/50",
                        "dark:group-data-[focus=true]:bg-default/60",
                        "border-2",
                        "border-transparent",
                        "group-data-[focus=true]:border-primary/50",
                      ],
                    }}
                  />

                  {/* Intelligent Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-default-700">
                        Or try these suggestions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <Chip
                            key={index}
                            variant="bordered"
                            className="cursor-pointer hover:bg-primary hover:text-white transition-colors max-w-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                            title={suggestion}
                          >
                            <span className="truncate block max-w-[200px]">
                              {suggestion}
                            </span>
                          </Chip>
                        ))}
                      </div>
                      <p className="text-xs text-default-500">
                        Click a suggestion to use it, or keep typing for more ideas
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </AnimatedDiv>

            {/* Style Selection */}
            <AnimatedDiv>
              <Card className="p-6 shadow-xl bg-default-50/50 dark:bg-default-100/50 backdrop-blur-md">
                <CardBody className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Choose Your Style</h2>
                    <p className="text-default-600 text-sm">
                      Select the aesthetic that matches your content
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {styleOptions.map((option) => (
                      <Card
                        key={option.key}
                        isPressable
                        isHoverable
                        className={`transition-all cursor-pointer ${
                          style === option.key
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                            : "hover:scale-102"
                        }`}
                        onClick={() => setStyle(option.key as ThumbnailStyle)}
                      >
                        <CardBody className="p-4 text-center">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center mx-auto mb-3`}
                          >
                            <span className="text-xl">{option.icon}</span>
                          </div>
                          <h3 className="font-semibold text-sm mb-1">
                            {option.label}
                          </h3>
                          <p className="text-xs text-default-500">
                            {option.description}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </AnimatedDiv>

            {/* Model and Quality Settings */}
            <AnimatedDiv>
              <Card className="p-6 shadow-xl bg-default-50/50 dark:bg-default-100/50 backdrop-blur-md">
                <CardBody className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                      Advanced Settings
                    </h2>
                    <p className="text-default-600 text-sm">
                      Fine-tune your generation parameters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Model Selection */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span className="text-default-700 font-medium">
                          AI Model
                        </span>
                      </div>
                      <div className="space-y-3">
                        {modelOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              isPressable
                              className={`cursor-pointer transition-all ${
                                model === option.value
                                  ? "bg-gradient-to-r from-purple-600 to-blue-600 scale-105"
                                  : "bg-default-200/50 hover:bg-default-300/50"
                              }`}
                              onClick={() => setModel(option.value)}
                            >
                              <CardBody className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-default-700 font-medium">
                                        {option.label}
                                      </span>
                                      {option.recommended && (
                                        <Badge color="success" size="sm">
                                          Recommended
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-default-500 text-sm mt-1">
                                      {option.description}
                                    </p>
                                  </div>
                                  <div className="text-2xl">{option.icon}</div>
                                </div>
                              </CardBody>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Quality Selection */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-pink-400" />
                        <span className="text-default-700 font-medium">
                          Quality
                        </span>
                      </div>
                      <div className="space-y-3">
                        {qualityOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              isPressable
                              className={`cursor-pointer transition-all ${
                                quality === option.value
                                  ? "bg-gradient-to-r from-pink-600 to-purple-600 scale-105"
                                  : "bg-default-200/50 hover:bg-default-300/50"
                              }`}
                              onClick={() => setQuality(option.value)}
                            >
                              <CardBody className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-default-700 font-medium">
                                        {option.label}
                                      </span>
                                      {option.recommended && (
                                        <Badge color="warning" size="sm">
                                          Balanced
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-default-500 text-sm mt-1">
                                      {option.description}
                                    </p>
                                  </div>
                                  <div className="text-2xl">{option.icon}</div>
                                </div>
                              </CardBody>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </AnimatedDiv>

            {/* Generate Button */}
            <AnimatedDiv>
              <Button
                size="lg"
                className={button({ color: "gradient" })}
                onClick={handleGenerate}
                isLoading={loading}
                fullWidth
                endContent={
                  !loading && (
                    <RightArrowIcon className="w-5 h-5 text-white" />
                  )
                }
              >
                {loading ? "Creating Your Thumbnail..." : "Generate Thumbnail"}
              </Button>
            </AnimatedDiv>

            {/* Progress Bar */}
            {loading && (
              <AnimatedDiv>
                <Card className="p-4 shadow-lg bg-default-50/50 dark:bg-default-100/50 backdrop-blur-md">
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Generating...</p>
                        <p className="text-sm text-default-500">
                          {Math.round(progress)}%
                        </p>
                      </div>
                      <Progress
                        value={progress}
                        className="w-full"
                        color="primary"
                        size="sm"
                      />
                      <div className="text-xs text-default-500 text-center">
                        Using {modelOptions.find((m) => m.value === model)?.label} • {qualityOptions.find((q) => q.value === quality)?.label} quality
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </AnimatedDiv>
            )}

            {/* Enhanced Error Display */}
            {error && (
              <AnimatedDiv>
                <Card className="p-4 shadow-lg bg-danger-50/50 border-2 border-danger-200 dark:bg-danger-100/10 dark:border-danger-800">
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-danger-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="font-medium text-danger-700 dark:text-danger-400">
                          {error.message}
                        </div>
                        {error.suggestion && (
                          <div className="text-sm text-danger-600 dark:text-danger-300">
                            {error.suggestion}
                          </div>
                        )}
                        {retryCount > 0 && (
                          <div className="text-xs text-danger-500 dark:text-danger-400">
                            Retry attempt: {retryCount}
                          </div>
                        )}
                      </div>
                      {error.retryable && (
                        <Button
                          color="danger"
                          variant="light"
                          size="sm"
                          onClick={handleRetry}
                          startContent={<RefreshCw className="w-4 h-4" />}
                          isDisabled={loading}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </AnimatedDiv>
            )}
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-xl bg-default-50/50 dark:bg-default-100/50 backdrop-blur-md">
                <CardHeader className="pb-3">
                  <h2 className="text-xl font-semibold">Preview</h2>
                </CardHeader>
                <CardBody>
                  {result ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <Image
                          src={result.imageUrl}
                          alt="Generated thumbnail"
                          className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                          radius="md"
                        />
                      </div>

                      <Divider />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Model:</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {modelOptions.find((m) => m.value === model)?.label}
                          </Chip>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Style:</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {styleOptions.find((s) => s.key === style)?.label}
                          </Chip>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Parameters:
                          </span>
                          <Chip size="sm" variant="flat" color="primary">
                            {result.parameters.steps} steps, {result.parameters.guidance_scale} guidance
                          </Chip>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = result.imageUrl;
                          link.download = "thumbnail.png";
                          link.click();
                        }}
                        className="w-full"
                        color="primary"
                        variant="flat"
                      >
                        Download Thumbnail
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <p className="text-default-500 text-sm">
                        Your generated thumbnail will appear here
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
