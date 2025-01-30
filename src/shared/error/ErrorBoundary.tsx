import React from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button
} from "../ui";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("에러 발생:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4">
          <CardHeader>
            <CardTitle>오류가 발생했습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-500">{this.state.error?.message}</p>
            <Button onClick={() => window.location.reload()}>
              페이지 새로고침
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}