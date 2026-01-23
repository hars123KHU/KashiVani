"use client";

import { motion } from "motion/react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 🔊 Enable sound on user interaction
  const enableSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      onClick={enableSound} // 👈 FIRST CLICK ENABLES AUDIO
    >
      {/* 🎬 Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          onEnded={() => setShowButton(true)}
        >
          <source src="/hero-bg1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🌫️ Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      <Navbar />

      {/* 🎯 Center CTA after video */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        {showButton && (
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
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-10 text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-[#f5e6c8]"
            >
              जीवन के वर्णन में अंत का सार काशी।
            </motion.p>

           

            {/* ✨ CTA Button */}
            <Link href="/dashboard">
              <button
                className="relative rounded-2xl border-2 border-orange-400 bg-white/10 px-16 py-6 text-2xl font-semibold text-[#f5e6c8] backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 hover:border-orange-500 hover:bg-white/20"
              >
                Begin Exploration
              </button>
            </Link>
          </motion.div>
        )}
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
          <button
            className="relative rounded-2xl border-2 border-orange-400 bg-white/10 px-10 py-3 text-lg font-semibold text-[#f5e6c8] backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 hover:border-orange-500 hover:bg-white/20"
          >
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
