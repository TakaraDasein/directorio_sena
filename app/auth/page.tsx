"use client";

import { AuthFlow } from "@/components/inicio_sesion/auth-flow";

export default function AuthPage() {
  return (
    <div className="min-h-screen pattern-1 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AuthFlow />
      </div>
    </div>
  );
}