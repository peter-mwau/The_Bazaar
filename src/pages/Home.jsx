import React, { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useActiveAccount } from "thirdweb/react";
import { Minimize2, Upload, Box, Image as ImageIcon } from "lucide-react";

function Home() {
  const account = useActiveAccount();
  const isConnected = !!account; // Check if the user is connected
  const [preview, setPreview] = useState(null);
  const [openCreateNFTForm, setOpenCreateNFTForm] = useState(false);

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  //open the form when the user clicks "Join The Vibe" or "Become a Vendor"
  const openForm = () => {
    setOpenCreateNFTForm(true);
  };

  //close the form when the user clicks outside of it or clicks a close button (not implemented here, but you can add it later)
  const closeForm = () => {
    setOpenCreateNFTForm(false);
  };

  const { scrollYProgress } = useScroll();

  // 1. Move "Welcome to" to the LEFT
  const xWelcome = useTransform(scrollYProgress, [0, 0.5], [0, -150]);

  // 2. Move "The Bazaar" to the RIGHT
  const xBazaar = useTransform(scrollYProgress, [0, 0.5], [0, 150]);

  // 3. Shrink/Fade the strikethrough line
  const strikeWidth = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"]);
  const strikeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // 1. Move "Join" further LEFT (-250px)
  const xJoin = useTransform(scrollYProgress, [0.2, 0.4], [0, -150]);
  // 2. Move "Vendor" further RIGHT (250px)
  const xVendor = useTransform(scrollYProgress, [0.2, 0.4], [0, 150]);

  // 3. Make them land on the same Y level (e.g., 60px down from top)
  const yJoin = useTransform(scrollYProgress, [0.2, 0.4], [0, 60]);
  const yVendor = useTransform(scrollYProgress, [0.2, 0.4], [100, 60]); // Starts at 100 (below), moves to 60

  // 4. Fade them in as they move
  const btnOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

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

      <div className="flex flex-col items-center mt-20 relative z-20 h-60 w-full">
        {/* Button 1: Join The Vibe */}
        <motion.button
          style={{ x: xJoin, y: yJoin, opacity: btnOpacity }}
          className="absolute px-10 py-3 bg-transparent rounded-lg text-white font-custom uppercase tracking-widest text-sm border-t border-b border-white/60 hover:border-t-0 hover:border-b-0 hover:border-l hover:border-r hover:border-white hover:translate-y-[-4px] transition-all duration-300 ease-in-out whitespace-nowrap"
        >
          Join The Vibe
        </motion.button>

        {/* Button 2: Become a Vendor */}
        <motion.button
          style={{ x: xVendor, y: yVendor, opacity: btnOpacity }}
          onClick={openForm}
          className="absolute px-10 py-3 bg-white text-black font-custom font-bold uppercase text-sm rounded-lg hover:bg-gray-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 whitespace-nowrap hover:cursor-pointer"
        >
          Become a Vendor
        </motion.button>
      </div>

      {/* form section that appears after the buttons(when the user clicks "Join The Vibe" or "Become a Vendor") */}
      <AnimatePresence>
        {openCreateNFTForm && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden w-[70%] mx-auto mt-10 relative z-30 bg-black"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-lg border-r border-l border-white p-8 shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Box className="text-white w-6 h-6" />
                  <h2 className="text-xl font-custom italic font-bold text-white uppercase tracking-tighter">
                    Asset Deployment
                  </h2>
                </div>
                <button onClick={() => setOpenCreateNFTForm(false)}>
                  <Minimize2 className="text-gray-500 hover:text-white transition-colors" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Upload Section */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Upload Media
                  </label>
                  <div className="relative group h-64 w-full border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center overflow-hidden hover:border-white/40 transition-colors">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover:text-white transition-colors" />
                        <p className="text-gray-500 text-sm">
                          PNG, JPG, GIF (Max 10MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Right Side: Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber Samurai"
                      className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Price (ETH)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Describe the utility of this NFT..."
                      className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all resize-none"
                    />
                  </div>
                </div>
                {/* </div> */}
              </div>

              {/* Action */}
              <button className="w-full mt-8 py-4 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-lg hover:invert transition-all duration-500">
                Execute Transaction
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
