import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sharpify-demo.vercel.app/'),
  title: {
    default: "Sharpify - High Performance Image Processing for Node.js",
    template: "%s | Sharpify"
  },
  description: "Sharpify is a powerful Node.js image processing library built on Sharp.js, offering high-performance image transformations, batch processing, and advanced optimization features.",
  keywords: [
    "image processing",
    "node.js",
    "sharp.js",
    "image optimization",
    "webp conversion",
    "image compression",
    "watermark",
    "batch processing",
    "typescript",
    "npm package"
  ],
  authors: [
    { name: "Yassine Montassar", url: "https://github.com/yassinemontassar" }
  ],
  creator: "Yassine Montassar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sharpify-demo.vercel.app/",
    siteName: "Sharpify",
    title: "Sharpify - High Performance Image Processing for Node.js",
    description: "Transform and optimize your images at scale with Sharpify, the powerful Node.js image processing library.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sharpify - Image Processing Library"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sharpify - High Performance Image Processing for Node.js",
    description: "Transform and optimize your images at scale with Sharpify, the powerful Node.js image processing library.",
    creator: "@yourtwitterhandle",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sharpify-demo.vercel.app/",
    types: {
      "application/json+ld": "https://sharpify-demo.vercel.app//json-ld",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
};

// JSON-LD structured data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sharpify",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Node.js",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  description: "A high-performance image processing library for Node.js built on Sharp.js",
  author: {
    "@type": "Person",
    name: "Yassine Montassar",
    url: "https://github.com/yassinemontassar"
  },
  softwareVersion: "1.0.3",
  programmingLanguage: "TypeScript",
  license: "MIT"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://sharpify-demo.vercel.app/" />
        <meta name="theme-color" content="#4F46E5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}