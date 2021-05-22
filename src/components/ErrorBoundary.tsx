import React, { Component, ErrorInfo } from 'react';
import { ErrorScreen } from './molecules/ErrorScreen';

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = Record<string, unknown>;

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // TODO: Actually send this log..
  // eslint-disable-next-line no-console
  logError = console.error;

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
    this.logError(error, info);
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
