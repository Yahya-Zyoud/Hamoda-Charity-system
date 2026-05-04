import { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { isClerkConfigured, clerkPublishableKey } from "./lib/clerkConfig.js";

class AuthBootBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
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

boot().catch((err) => {
  console.error("[boot] Fatal error:", err);
  document.getElementById("root").innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#666">حدث خطأ أثناء التشغيل. يرجى إعادة تحميل الصفحة.</div>';
});
