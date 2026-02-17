"use client";

import { motion } from "motion/react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 🖼️ Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg1.png" // 👉 replace with your image file
          alt="Kashi Background"
          className="h-full w-full object-cover"
        />

        {/* 🌫️ Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      <Navbar />

      {/* 🎯 Center Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* 🕉️ Sanskrit / Hindi Line */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-10 text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-[#f5e6c8]"
          >
            जीवन के वर्णन में अंत का सार काशी।
          </motion.p>

          {/* ✨ CTA Button */}
          <Link href="/dashboard">
            <button className="relative rounded-2xl border-2 border-orange-400 bg-white/10 px-16 py-6 text-2xl font-semibold text-[#f5e6c8] backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 hover:border-orange-500 hover:bg-white/20">
              Begin Exploration
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// ================= NAVBAR =================

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="relative z-20 flex w-full items-center justify-between px-6 py-4">
      {!user ? (
        <Link href="/dashboard">
          <button className="relative rounded-2xl border-2 border-orange-400 bg-white/10 px-10 py-3 text-lg font-semibold text-[#f5e6c8] backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 hover:border-orange-500 hover:bg-white/20">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      )}
    </nav>
  );
};
