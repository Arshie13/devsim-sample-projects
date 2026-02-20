"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, Headphones, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCitizenLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/support");
    }, 500);
  };

  const handleAgentLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/agent/login");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center min-h-[80vh]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            City Hall Support
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to the City Hall Customer Support Portal
          </p>
        </div>

        {/* Login Options */}
        <Card className="w-full">
          <CardContent className="p-6">
            <h2 className="mb-4 text-center text-lg font-semibold text-foreground">
              How can we help you today?
            </h2>

            <div className="space-y-4">
              {/* Citizen Option */}
              <button
                onClick={handleCitizenLogin}
                disabled={isLoading}
                className="flex w-full items-center gap-4 p-4 h-auto justify-start text-left border-2 rounded-xl border-border bg-background hover:bg-accent hover:border-blue-300 transition-all disabled:opacity-50"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">I'm a Citizen</h3>
                  <p className="text-sm text-muted-foreground">
                    I have a question or complaint for City Hall
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-400 flex-shrink-0" />
              </button>

              {/* Agent Option */}
              <button
                onClick={handleAgentLogin}
                disabled={isLoading}
                className="flex w-full items-center gap-4 p-4 h-auto justify-start text-left border-2 rounded-xl border-border bg-background hover:bg-accent hover:border-green-300 transition-all disabled:opacity-50"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-green-500">
                  <Headphones className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">I'm a Support Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    I need to access the agent dashboard
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-green-400 flex-shrink-0" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>City Hall Customer Support</p>
          <p className="mt-1">(555) 123-4567 • support@cityhall.gov</p>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20">
            <Card className="shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-foreground">Redirecting...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}