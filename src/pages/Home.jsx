import React from "react";

function Home() {
  return (
    <div className="bg-black h-screen" id="main">
      <div className="flex flex-col mx-auto w-[100%]">
        <div className="flex flex-col gap-1 mt-20 left-5 ml-10 items-start">
          <h1 className="text-6xl font-custom font-bold mb-4 underline decoration-double decoration-gray-400 underline-offset-18 text-white text-center uppercase pt-16">
            Welcome to{" "}
          </h1>
          <span className="font-custom text-[170px] line-through decoration-gray-700 decoration-2 italic font-bold text-transparent [-webkit-text-stroke:1px_white]">
            The Bazaar
          </span>
        </div>
        <p className="text-lg font-custom text-gray-300 mt-0 max-w-2xl mx-auto text-start underline decoration-wavy underline-offset-4 font-satoshi">
          Interweaving Art, Assets, and Accurate Data. Discover, Collect, and
          Trade Unique NFTs with Confidence.
        </p>

        <span className="absolute text-gray-700/20 hover:text-gray-500 transition-all duration-1000 ml-[35%] mt-10 uppercase text-8xl tracking-[0.1em] font-bold font-serif">
          Veritas
        </span>

        <span class="text-[900px] ml-[70%] absolute text-transparent [-webkit-text-stroke:2px_white] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          ★
        </span>

        {/* Optional CTA Button - Uncomment when ready */}
        <button className="cta-button">Explore Marketplace →</button>
      </div>
    </div>
  );
}

export default Home;
