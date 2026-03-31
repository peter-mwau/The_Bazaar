import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronRight, Cpu } from "lucide-react";

const FilterSidebar = ({ isOpen, setIsOpen }) => {
  const categories = ["Cybernetic", "Samurai", "Wasteland", "Neural"];
  const MotionDiv = motion.div;
  const MotionAside = motion.aside;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* The Sidebar */}
          <MotionAside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-24 h-[calc(100vh-6rem)] w-80 bg-black/60 backdrop-blur-2xl border-l border-white/10 z-50 p-8 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-white" />
                <h2 className="text-xl font-custom italic font-bold text-white uppercase tracking-tighter">
                  Filters
                </h2>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="space-y-10 grow">
              {/* Category Filter */}
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mb-4">
                  {"//"} Sector_Class
                </p>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className="w-full flex justify-between items-center px-4 py-3 rounded border border-white/5 hover:border-white/40 hover:bg-white/5 group transition-all text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest"
                    >
                      {cat}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mb-4">
                  {"//"} Value_Range (ETH)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="MIN"
                    className="bg-white/5 border border-white/10 p-3 rounded text-[10px] text-white outline-none focus:border-white/40 font-mono"
                  />
                  <input
                    type="number"
                    placeholder="MAX"
                    className="bg-white/5 border border-white/10 p-3 rounded text-[10px] text-white outline-none focus:border-white/40 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 opacity-30">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-mono text-white uppercase">
                  Terminal_Sync: Active
                </span>
              </div>
            </div>
          </MotionAside>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
