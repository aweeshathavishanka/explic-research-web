import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site-content";
import "./globals.css";

/*
 * Self-hosted fonts (SIL Open Font License 1.1, see /licenses/):
 * - Google Sans v14.000, github.com/googlefonts/googlesans (variable wght 400-700 + opsz, GRAD pinned to 0)
 * - JetBrains Mono v2.304, github.com/JetBrains/JetBrainsMono (variable wght 100-800)
 * Both are subset to Latin, Greek and common symbols and converted to WOFF2.
 * No metric-adjusted fallback face is generated, so only these two families are used.
 */
const googleSans = localFont({
  src: "./fonts/GoogleSans-Latin-Variable.woff2",
  variable: "--font-google-sans",
  weight: "400 700",
  display: "block",
  adjustFontFallback: false,
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Latin-Variable.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "block",
  adjustFontFallback: false,
});

const title = "Explic: Detecting and Explaining AI-Generated Voice and Text";

export const metadata: Metadata = {
  ...(site.siteUrl ? { metadataBase: new URL(site.siteUrl) } : {}),
  title,
  description: site.description,
  applicationName: "Explic",
  keywords: [
    "Explic",
    "SLIIT",
    "deepfake voice detection",
    "AI-generated text detection",
    "explainable AI",
    "anti-spoofing",
    "synthetic media",
  ],
  authors: [{ name: "Explic Research Group" }],
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: "Explic",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e13" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${googleSans.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
