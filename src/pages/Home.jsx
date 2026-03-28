import React from "react";

function Home() {
  return (
    <div className="bg-black h-screen" id="main">
      <h1 className="header">
        Welcome to <span className="bol">The Bazaar</span>
      </h1>
      <p className="p-tag">
        Interweaving Art, Assets, and Accurate Data. Discover, Collect, and
        Trade Unique NFTs with Confidence.
      </p>

      {/* Optional CTA Button - Uncomment when ready */}
      <button className="cta-button">Explore Marketplace →</button>
    </div>
  );
}

export default Home;
