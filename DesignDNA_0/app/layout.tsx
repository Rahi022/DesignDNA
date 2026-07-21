import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://designdna.ai"),

  title: {
    default: "DesignDNA",
    template: "%s | DesignDNA",
  },

  description:
    "Generate AI logos, analyze branding, receive intelligent design feedback, and manage creative projects with DesignDNA.",

  keywords: [
    "AI Logo Generator",
    "Logo Analysis",
    "Design Analysis",
    "Branding",
    "Artificial Intelligence",
    "Graphic Design",
    "DesignDNA",
    "Logo AI",
    "Creative Platform",
  ],

  authors: [
    {
      name: "DesignDNA",
    },
  ],

  creator: "DesignDNA",

  applicationName: "DesignDNA",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "DesignDNA",
    description:
      "Professional AI-powered logo generation and design analysis platform.",

    siteName: "DesignDNA",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "DesignDNA",
    description:
      "Professional AI-powered logo generation and design analysis platform.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className="
          min-h-screen
          bg-black
          text-white
          antialiased
          font-sans
          selection:bg-blue-600
          selection:text-white
        "
      >
        <AuthProvider>
          {children}
        </AuthProvider>

        {/*
        Future Providers (Phase 8.x)

        <ThemeProvider>
        <QueryProvider>
        <SocketProvider>
        <ToastProvider>
        <AnalyticsProvider>
        <AdminProvider>

        */}
      </body>
    </html>
  );
}