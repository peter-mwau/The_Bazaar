import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Home() {
  const { scrollYProgress } = useScroll();

  // 1. Move "Welcome to" to the LEFT
  const xWelcome = useTransform(scrollYProgress, [0, 0.5], [0, -150]);

  // 2. Move "The Bazaar" to the RIGHT
  const xBazaar = useTransform(scrollYProgress, [0, 0.5], [0, 150]);

  // 3. Shrink/Fade the strikethrough line
  const strikeWidth = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"]);
  const strikeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    // Increased height to 200vh so you actually have room to scroll and see the effect
    <div className="bg-black h-[300vh] overflow-x-hidden" id="main">
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
      >
        <img
          src="/hero.png"
          alt="Hero"
          className="w-full h-full object-cover pt-10"
        />
      </motion.div>
      <div className="flex flex-col mx-auto w-[100%] sticky top-0 h-screen justify-center">
        <div className="flex flex-col gap-1 mt-20 left-5 ml-10 items-start mb-[150px]">
          {/* MOVING LEFT */}
          <motion.h1
            style={{ x: xWelcome }}
            className="text-6xl font-custom font-bold mb-4 underline decoration-double decoration-gray-500 underline-offset-[18px] text-white uppercase pt-5"
          >
            Welcome to
          </motion.h1>

          {/* MOVING RIGHT */}
          <motion.div style={{ x: xBazaar }} className="relative inline-block">
            <span className="font-custom text-[170px] italic font-bold text-transparent [-webkit-text-stroke:1px_white] uppercase">
              The Bazaar
            </span>

            {/* ANIMATED STRIKETHROUGH LINE */}
            <motion.div
              style={{ width: strikeWidth, opacity: strikeOpacity }}
              className="absolute top-[60%] left-0 h-[2px] bg-gray-700 origin-left"
            />
          </motion.div>
        </div>

        <p className="text-lg font-custom text-gray-300 mt-0 max-w-2xl mx-auto text-start underline decoration-wavy underline-offset-4 font-satoshi">
          Interweaving Art, Assets, and Accurate Data. Discover, Collect, and
          Trade Unique NFTs with Confidence.
        </p>

        <span className="absolute text-gray-700/20 hover:text-gray-500 transition-all duration-1000 ml-[32%] mt-0 uppercase text-8xl tracking-[0.1em] font-bold font-serif -z-10 mb-[700px]">
          Veritas
        </span>

        {/* The Star with your custom stroke variable */}
        <span className="text-[900px] ml-[40%] absolute -z-10 text-transparent [-webkit-text-stroke:2px_theme(colors.gray.700/30%)] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] font-bold">
          ★
        </span>
      </div>
    </div>
  );
}

export default Home;
