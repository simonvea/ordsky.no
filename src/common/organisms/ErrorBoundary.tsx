import React, { Component, ErrorInfo } from "react";
import { logger } from "../core/analytics";
import { ErrorScreen } from "../molecules/ErrorScreen";

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = Record<string, unknown>;

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  logError = logger.logError;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so next render shows fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log the error to an error reporting service
    this.logError({
      description: `Error from ErrorBoundary. Error: ${error}, callstack: ${info}`,
      fatal: true,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onReset(): void {
    window.location.reload();
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <ErrorScreen onReset={this.onReset} />;
    }
    return this.props.children;
  }
}
