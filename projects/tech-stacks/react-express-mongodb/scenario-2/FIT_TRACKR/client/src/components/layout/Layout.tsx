import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
