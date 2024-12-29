"use client";
import ImageProcessor from "@/components/ImageProcessor";
import { Button } from "@/components/ui/button";
import { Command, Github, Package } from "lucide-react";

export default function Home() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Hero Section */}
      <div className="w-full bg-black/30 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-6 py-8">
            <h1 className="text-6xl font-bold text-white">
              Sharp<span className="text-purple-400">ify</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              A powerful image processing library for Node.js built on top of
              Sharp, designed for high-performance image transformations at
              scale.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() =>
                  window.open("https://github.com/yassinemontassar/Sharpify")
                }>
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
              <Button
                className="bg-gray-800 hover:bg-gray-900"
                onClick={() =>
                  window.open("https://www.npmjs.com/package/sharpify")
                }>
                <Package className="mr-2 h-5 w-5" />
                npm
              </Button>
              {/* <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => window.open('https://sharpify-docs.yoursite.com')}
              >
                <Book className="mr-2 h-5 w-5" />
                Docs
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Installation Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Installation
          </h2>
          <div className="space-y-4">
            <div className="bg-black rounded-lg p-4 flex justify-between items-center">
              <code className="text-purple-400">npm install sharpify</code>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => copyToClipboard("npm install sharpify")}>
                <Command className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-black rounded-lg p-4 flex justify-between items-center">
              <code className="text-purple-400">yarn add sharpify</code>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => copyToClipboard("yarn add sharpify")}>
                <Command className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "High Performance",
              description:
                "Built on Sharp.js for blazing-fast image processing",
              icon: "⚡",
            },
            {
              title: "Batch Processing",
              description: "Process multiple images simultaneously with ease",
              icon: "🔄",
            },
            {
              title: "Format Conversion",
              description: "Convert between WebP, JPEG, PNG, and more",
              icon: "🎨",
            },
            {
              title: "Image Analysis",
              description: "Get detailed image statistics and dominant colors",
              icon: "📊",
            },
            {
              title: "Watermarking",
              description: "Add customizable text watermarks to your images",
              icon: "💧",
            },
            {
              title: "Enhancement",
              description: "Adjust brightness, contrast, and saturation",
              icon: "✨",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
              Live Demo
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Try out Sharpify&apos;s powerful image processing capabilities
            </p>
            <ImageProcessor />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Sharpify. Built with ❤️ for the open-source community.</p>
        </div>
      </footer>
    </main>
  );
}
