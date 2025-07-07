"use client";

import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.FC<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack ?? null,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={this.handleReset}
          />
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-danger-50/50 border-2 border-danger-200 dark:bg-danger-100/10 dark:border-danger-800">
            <CardBody className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-danger-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-danger-700 dark:text-danger-400 mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-sm text-danger-600 dark:text-danger-300">
                      An unexpected error occurred while loading this page.
                    </p>
                  </div>

                  {process.env.NODE_ENV === "development" &&
                    this.state.error && (
                      <div className="bg-danger-100 dark:bg-danger-900/20 p-3 rounded-lg">
                        <p className="text-xs text-danger-600 dark:text-danger-400 font-mono">
                          {this.state.error.message}
                        </p>
                      </div>
                    )}

                  <div className="flex gap-2">
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      onClick={this.handleReset}
                      startContent={<RefreshCw className="w-4 h-4" />}
                    >
                      Try Again
                    </Button>
                    <Button
                      color="danger"
                      variant="light"
                      size="sm"
                      onClick={() => (window.location.href = "/")}
                    >
                      Go Home
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

export default ErrorBoundary;
