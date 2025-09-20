"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Filecoin from "@/components/ui/icons/Filecoin";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "smooth",
    },
  },
};

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center min-h-screen">
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center min-h-screen w-full mx-auto px-4"
      >
        <motion.div variants={itemVariants} className="text-center space-y-8">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <Filecoin />
            <h1 className="text-6xl font-bold uppercase tracking-tighter text-foreground font-heading">
              Synthnet
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-2xl text-muted-foreground max-w-2xl mx-auto font-body"
          >
            Welcome to the decentralized future of data storage and management
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/datasets"
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg transition-colors hover:bg-primary/90"
              >
                Explore Datasets
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
}
