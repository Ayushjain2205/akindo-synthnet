"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="w-full flex flex-col justify-center min-h-screen">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen w-full mx-auto px-4"
      >
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <ShoppingBag className="w-16 h-16 text-teal-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              Marketplace
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and trade datasets in our decentralized marketplace
          </p>
          
          <div className="mt-8">
            <p className="text-gray-500">Coming soon...</p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
