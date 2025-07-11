import React, { ErrorInfo, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Aquí podrías enviar logs a Sentry, LogRocket, etc.
    console.error("⛔ Unhandled error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-[60vh] items-center justify-center">
          <p className="rounded-md bg-red-50 p-6 text-center text-lg text-red-600 shadow">
            ¡Ups! Algo ha ido mal.<br />
            Intenta recargar la página.
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
