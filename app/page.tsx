"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo className="w-16 h-16 transform rotate-3 hover:rotate-6 transition-transform duration-300" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Synthetic datasets,{" "}
              <span className="bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                made simple
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Generate AI-ready data with prompts. Store on Filecoin. Share
              globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate">
                <Button size="lg" className="group text-lg px-8 py-4">
                  Generate Dataset
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered
              </h3>
              <p className="text-gray-600">
                Create datasets with simple prompts
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Verifiable
              </h3>
              <p className="text-gray-600">Stored securely on Filecoin</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Decentralized
              </h3>
              <p className="text-gray-600">Global marketplace access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-purple-500">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <Link href="/generate">
            <Button
              size="lg"
              className="bg-white !text-teal-700 hover:bg-white/90 hover:!text-teal-600 shadow-xl hover:shadow-lg transition-all duration-200 text-lg px-8 py-4"
            >
              Create Your First Dataset
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
