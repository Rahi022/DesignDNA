import Link from "next/link";
import Navbar from "./components/Navbar";

const features = [
  {
    title: "🎨 AI Logo Generator",
    description:
      "Generate beautiful, professional logos using AI with customizable styles, colors, and branding.",
  },
  {
    title: "🔍 Logo Analysis",
    description:
      "Upload any logo and receive AI-powered analysis, quality scores, and design recommendations.",
  },
  {
    title: "📊 Design Intelligence",
    description:
      "Understand typography, color harmony, balance, composition, and branding strength.",
  },
  {
    title: "📈 Project History",
    description:
      "Access all your generated logos, analyzed designs, prompts, and downloads anytime.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Hero Section */}

      <section className="max-w-7xl mx-auto px-6 py-28 text-center">

        <p className="uppercase tracking-[0.3em] text-blue-400 font-semibold">
          AI Powered Design Platform
        </p>

        <h1 className="mt-6 text-6xl md:text-7xl font-bold leading-tight">
          Build Better Brands with
          <span className="text-blue-500"> DesignDNA</span>
        </h1>

        <p className="mt-8 max-w-3xl mx-auto text-gray-400 text-xl leading-8">
          Generate AI logos, analyze existing designs, improve branding,
          manage your creative projects, and receive intelligent design
          recommendations—all from one professional platform.
        </p>

        <div className="flex flex-wrap justify-center gap-5 mt-12">

          <Link
            href="/generate-logo"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500 transition"
          >
            Generate Logo
          </Link>

          <Link
            href="/analyze-logo"
            className="rounded-xl border border-gray-700 px-8 py-4 hover:border-blue-500 transition"
          >
            Analyze Logo
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-700 px-8 py-4 hover:border-green-500 transition"
          >
            Dashboard
          </Link>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-7xl mx-auto px-6 pb-24">

        <h2 className="text-4xl font-bold text-center mb-14">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="rounded-2xl border border-gray-800 bg-zinc-900/60 p-8 hover:border-blue-500 transition"
            >

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Platform Overview */}

      <section className="border-y border-gray-800 bg-zinc-950">

        <div className="max-w-7xl mx-auto py-20 px-6">

          <h2 className="text-4xl font-bold text-center">
            One Platform.
            Every Design Tool.
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16">

            <div>

              <h3 className="text-2xl font-bold mb-4">
                For Designers
              </h3>

              <p className="text-gray-400 leading-7">
                Generate logos, improve branding, save projects,
                revisit history, and download professional assets.
              </p>

            </div>

            <div>

              <h3 className="text-2xl font-bold mb-4">
                AI Analysis
              </h3>

              <p className="text-gray-400 leading-7">
                Analyze typography, spacing, contrast,
                composition, readability, color harmony,
                and overall brand quality.
              </p>

            </div>

            <div>

              <h3 className="text-2xl font-bold mb-4">
                Admin Dashboard
              </h3>

              <p className="text-gray-400 leading-7">
                Monitor users, AI generations,
                logo analyses, reports,
                prompt analytics,
                moderation,
                and platform statistics.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24 px-6 text-center">

        <h2 className="text-5xl font-bold">
          Ready to Create Smarter Designs?
        </h2>

        <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
          Join DesignDNA and unlock AI-powered logo generation,
          design analysis, project management, and advanced insights.
        </p>

        <Link
          href="/register"
          className="inline-block mt-10 rounded-xl bg-white px-10 py-4 text-black font-semibold hover:bg-gray-200 transition"
        >
          Get Started Free
        </Link>

      </section>

      {/* Footer */}

      <footer className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between items-center gap-5">

          <p className="text-gray-500">
            © 2026 DesignDNA. All rights reserved.
          </p>

          <div className="flex gap-6 text-gray-400">

            <Link href="/about">About</Link>

            <Link href="/pricing">Pricing</Link>

            <Link href="/contact">Contact</Link>

            <Link href="/privacy">Privacy</Link>

          </div>

        </div>

      </footer>

    </main>
  );
}