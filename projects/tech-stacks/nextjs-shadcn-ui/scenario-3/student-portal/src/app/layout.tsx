import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "School student portal for viewing grades, schedules, fees, and academic standing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
