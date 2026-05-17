// App entry point: boots ClerkProvider when configured, falls back to plain App if Clerk crashes or is absent.
import { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { isClerkConfigured, clerkPublishableKey, markClerkProviderFailed } from "./lib/clerkConfig.js";

// Error boundary that catches ClerkProvider render errors and lets the app run without auth.
class AuthBootBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(err) {
    // Record the failure so the rest of the app knows Clerk is unavailable.
    markClerkProviderFailed();
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.error("[boot] Auth provider crashed, falling back without auth:", err);
  }

  render() {
    if (this.state.hasError) {
      return <App />;
    }
    return this.props.children;
  }
}

async function boot() {
  let Root;

  if (isClerkConfigured) {
    try {
      // Dynamically import Clerk so the bundle stays lean when Clerk is not configured.
      const { ClerkProvider } = await import("@clerk/clerk-react");
      const { ClerkBridge } = await import("./components/auth/ClerkBridge.jsx");

      Root = () => (
        <AuthBootBoundary>
          <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
            <ClerkBridge>
              <App />
            </ClerkBridge>
          </ClerkProvider>
        </AuthBootBoundary>
      );
    } catch (err) {
      console.error("[boot] Clerk failed, running without auth:", err);
      Root = () => <App />;
    }
  } else {
    Root = () => <App />;
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Root />
    </StrictMode>
  );
}

// Last-resort handler: show an Arabic error message if boot() itself throws.
boot().catch((err) => {
  console.error("[boot] Fatal error:", err);
  document.getElementById("root").innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#666">حدث خطأ أثناء التشغيل. يرجى إعادة تحميل الصفحة.</div>';
});
