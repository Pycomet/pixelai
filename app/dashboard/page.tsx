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
<<<<<<< HEAD
import { Cpu, Clock, AlertCircle, RefreshCw } from "lucide-react";
=======
import { Cpu, Clock, AlertCircle, RefreshCw, Globe } from "lucide-react";
import { getAvailableProviders, getModelsForProvider, type AIProvider, type AIModel } from "@/lib/ai";
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)

type ThumbnailStyle = "tech" | "gaming" | "tutorial" | "lifestyle";

interface GenerationResult {
  imageUrl: string;
  prompt: string;
  style: string;
  model: string;
<<<<<<< HEAD
=======
  provider: string;
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
    value: "flux",
    label: "FLUX Schnell",
    description: "Latest model with superior quality",
=======
    value: "sd15",
    label: "Stable Diffusion 1.5",
    description: "Fast and reliable generation",
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
    icon: "🚀",
    recommended: false,
  },
  {
<<<<<<< HEAD
    value: "realistic",
    label: "Realistic SD",
    description: "More photorealistic outputs",
=======
    value: "sd21",
    label: "Stable Diffusion 2.1",
    description: "Good quality output",
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
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
=======
  const inputLower = input.toLowerCase();
  const suggestions: string[] = [];

  // Content type suggestions
  if (inputLower.includes("review") || inputLower.includes("unboxing")) {
    suggestions.push("Tech product review with shocked reaction");
    suggestions.push("Unboxing video with surprised face");
  }
  if (inputLower.includes("tutorial") || inputLower.includes("how to")) {
    suggestions.push("Step-by-step tutorial with clear instructions");
    suggestions.push("Easy tutorial for beginners");
  }
  if (inputLower.includes("gaming") || inputLower.includes("game")) {
    suggestions.push("Epic gaming moment with intense action");
    suggestions.push("Gaming highlight reel compilation");
  }
  if (inputLower.includes("lifestyle") || inputLower.includes("vlog")) {
    suggestions.push("Daily lifestyle vlog with authentic moments");
    suggestions.push("Personal story with emotional journey");
  }

  // Generic suggestions if no specific content detected
  if (suggestions.length === 0) {
    suggestions.push("Exciting content with dramatic reveal");
    suggestions.push("Before and after transformation");
    suggestions.push("Top 10 list with numbered items");
    suggestions.push("Challenge video with surprising outcome");
  }

  return suggestions.slice(0, 3);
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
};

function DashboardContent() {
  const { user, loading: userLoading } = useUser();
  const { message } = useMessage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ThumbnailStyle>("tech");
<<<<<<< HEAD
=======
  const [provider, setProvider] = useState("huggingface");
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
  const [model, setModel] = useState("sdxl");
  const [quality, setQuality] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
<<<<<<< HEAD
=======
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [hasRefined, setHasRefined] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>([]);
  const [currentModels, setCurrentModels] = useState<AIModel[]>([]);

  // Load available providers on component mount
  useEffect(() => {
    const providers = getAvailableProviders();
    setAvailableProviders(providers);
    
    // Set default provider based on availability
    if (providers.length > 0) {
      setProvider(providers[0].id);
    }
  }, []);

  // Update models when provider changes
  useEffect(() => {
    if (provider) {
      const models = getModelsForProvider(provider);
      setCurrentModels(models);
      
      // Set default model for the provider
      if (models.length > 0) {
        const recommendedModel = models.find(m => m.recommended) || models[0];
        setModel(recommendedModel.id);
      }
    }
  }, [provider]);
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)

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
<<<<<<< HEAD
    if (loading) {
=======
    if (loading || isRefining) {
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }
<<<<<<< HEAD
  }, [loading]);
=======
  }, [loading, isRefining]);
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)

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
<<<<<<< HEAD
=======
    setHasRefined(false);
    setRefinementPrompt("");
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)

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
<<<<<<< HEAD
=======
          provider,
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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

<<<<<<< HEAD
=======
  const handleRefine = async () => {
    if (!refinementPrompt.trim()) {
      const validationError = {
        type: "validation" as const,
        message: "Please enter a refinement prompt",
        retryable: false
      };
      setError(validationError);
      return;
    }

    setIsRefining(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 800);

    try {
      const userId = authDisabled ? "demo-user" : user?.uid;
      const refinedPrompt = `${prompt} ${refinementPrompt}`.trim();
      
      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: refinedPrompt,
          style,
          model,
          quality,
          provider,
          userId,
          refinementPrompt,
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
        setHasRefined(true);
        setRefinementPrompt("");
        message("Thumbnail refined successfully!", "success");
      } else {
        const errorInfo = categorizeError(data.error);
        setError(errorInfo);
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorInfo = categorizeError(err);
      setError(errorInfo);
      console.error("Refinement error:", err);
    } finally {
      setIsRefining(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
          <h1 className={title({ size: "lg" })}>Create Your Perfect&nbsp;</h1>
          <h1 className={title({ color: "base", size: "lg" })}>
            YouTube Thumbnail
          </h1>
          <p className={subtitle({ class: "mt-4 mx-auto" })}>
            Transform your video ideas into eye-catching thumbnails that boost
            clicks and views
=======
          <h1 className={title({ size: "lg" })}>
            Create Your Perfect&nbsp;
          </h1>
          <h1 className={title({ color: "base", size: "lg" })}>
            Thumbnail
          </h1>
          <p className={subtitle({ class: "mt-4 mx-auto" })}>
            Transform your video ideas into eye-catching thumbnails that boost
            clicks and engagement
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
                      Describe Your Video
                    </h2>
                    <p className="text-default-600 text-sm">
                      Tell us what your video is about and we&apos;ll create the
=======
                      Describe Your Content
                    </h2>
                    <p className="text-default-600 text-sm">
                      Tell us what your content is about and we&apos;ll create the
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
                      perfect thumbnail
                    </p>
                  </div>

                  <Input
                    size="lg"
<<<<<<< HEAD
                    label="Video Description"
=======
                    label="Content Description"
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
                    <h2 className="text-2xl font-semibold">Choose Your Style</h2>
=======
                    <h2 className="text-2xl font-semibold">
                      Choose Your Style
                    </h2>
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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

<<<<<<< HEAD
=======
            {/* AI Provider Selection */}
            <AnimatedDiv>
              <Card className="p-6 shadow-xl bg-default-50/50 dark:bg-default-100/50 backdrop-blur-md">
                <CardBody className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                      Choose AI Provider
                    </h2>
                    <p className="text-default-600 text-sm">
                      Select your preferred AI service for generating thumbnails
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableProviders.map((providerOption) => (
                      <motion.div
                        key={providerOption.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          isPressable
                          className={`cursor-pointer transition-all h-full ${
                            provider === providerOption.id
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 bg-gradient-to-br from-primary/10 to-secondary/10"
                              : "hover:scale-102 bg-default-100/50 hover:bg-default-200/50"
                          }`}
                          onClick={() => setProvider(providerOption.id)}
                        >
                          <CardBody className="p-4 text-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                provider === providerOption.id
                                  ? "bg-gradient-to-br from-primary to-secondary text-white"
                                  : "bg-gradient-to-br from-gray-400 to-gray-600 text-white"
                              }`}
                            >
                              <Globe className="w-6 h-6" />
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <h3 className="font-semibold text-sm">
                                {providerOption.name}
                              </h3>
                              <Badge 
                                color={
                                  providerOption.pricing === 'FREE' ? 'success' : 
                                  providerOption.pricing.includes('FREE') ? 'warning' : 'primary'
                                }
                                size="sm"
                                variant="flat"
                              >
                                {providerOption.pricing}
                              </Badge>
                            </div>
                            <p className="text-xs text-default-500 mb-2">
                              {providerOption.description}
                            </p>
                            <p className="text-xs text-default-400">
                              {providerOption.models.length} model{providerOption.models.length !== 1 ? 's' : ''}
                            </p>
                          </CardBody>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </AnimatedDiv>

>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
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
=======
                        {currentModels.map((option) => (
                                                      <motion.div
                              key={option.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                isPressable
                                className={`cursor-pointer transition-all ${
                                  model === option.id
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 scale-105"
                                    : "bg-default-200/50 hover:bg-default-300/50"
                                }`}
                                onClick={() => setModel(option.id)}
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
                            >
                              <CardBody className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-default-700 font-medium">
<<<<<<< HEAD
                                        {option.label}
=======
                                        {option.name}
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
                  !loading && (
                    <RightArrowIcon className="w-5 h-5 text-white" />
                  )
=======
                  !loading && <RightArrowIcon className="w-5 h-5 text-white" />
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
                }
              >
                {loading ? "Creating Your Thumbnail..." : "Generate Thumbnail"}
              </Button>
            </AnimatedDiv>

            {/* Progress Bar */}
<<<<<<< HEAD
            {loading && (
=======
            {(loading || isRefining) && (
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
              <AnimatedDiv>
                <Card className="p-4 shadow-lg bg-default-50/50 dark:bg-default-100/50 backdrop-blur-md">
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
<<<<<<< HEAD
                        <p className="text-sm font-medium">Generating...</p>
=======
                        <p className="text-sm font-medium">
                          {isRefining ? "Refining..." : "Generating..."}
                        </p>
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
                        Using {modelOptions.find((m) => m.value === model)?.label} • {qualityOptions.find((q) => q.value === quality)?.label} quality
=======
                        Using{" "}
                        {currentModels.find((m) => m.id === model)?.name} •{" "}
                        {qualityOptions.find((q) => q.value === quality)?.label}{" "}
                        quality • {availableProviders.find((p) => p.id === provider)?.name}
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
                          <span className="text-sm font-medium">
                            Parameters:
                          </span>
                          <Chip size="sm" variant="flat" color="primary">
                            {result.parameters.steps} steps, {result.parameters.guidance_scale} guidance
=======
                          <span className="text-sm font-medium">Parameters:</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {result.parameters.steps} steps,{" "}
                            {result.parameters.guidance_scale} guidance
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
<<<<<<< HEAD
=======

                      {/* Refinement Section */}
                      {!hasRefined && (
                        <div className="space-y-3 mt-4 pt-4 border-t border-default-200">
                          <div className="space-y-1">
                            <h3 className="text-sm font-medium text-default-700">
                              Refine Your Thumbnail
                            </h3>
                            <p className="text-xs text-default-500">
                              Make one improvement to your thumbnail
                            </p>
                          </div>
                          <Input
                            size="sm"
                            placeholder="e.g., make it more colorful, add text, change lighting..."
                            value={refinementPrompt}
                            onChange={(e) => setRefinementPrompt(e.target.value)}
                            maxLength={200}
                            description={`${refinementPrompt.length}/200 characters`}
                            classNames={{
                              inputWrapper: [
                                "bg-default-100",
                                "border-1",
                                "border-default-200",
                                "hover:border-default-300",
                                "focus:border-primary",
                              ],
                            }}
                          />
                          <Button
                            onClick={handleRefine}
                            isLoading={isRefining}
                            size="sm"
                            className="w-full"
                            color="secondary"
                            variant="flat"
                            isDisabled={!refinementPrompt.trim()}
                          >
                            {isRefining ? "Refining..." : "Refine Thumbnail"}
                          </Button>
                        </div>
                      )}

                      {hasRefined && (
                        <div className="mt-4 pt-4 border-t border-default-200">
                          <div className="flex items-center justify-center gap-2 text-sm text-success-600">
                            <span className="text-success-500">✓</span>
                            <span>Thumbnail refined</span>
                          </div>
                        </div>
                      )}
>>>>>>> cde6b69 (feat: add dashboard navigation and search functionality)
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
