import type { Metadata } from "next";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMS AI Hackathon Gallery",
  description: "A gallery showcasing 8 hackathon web-based games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scanlines="false" data-grid-bg="true" data-starfield="false" data-crt-curve="false" data-theme="synthwave">
      <body className="min-h-screen antialiased" style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>
        <ThemeProvider>
          <Header />
          <main className="relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
