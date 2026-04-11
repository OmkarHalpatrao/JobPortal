
import { Component } from "react";
export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("Global Error:", error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-center"><h1 className="text-2xl font-bold text-gray-800">Something went wrong.</h1><button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Reload Page</button></div>;
    }
    return this.props.children;
  }
}
