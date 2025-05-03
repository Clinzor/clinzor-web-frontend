"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch, IconX, IconMapPin, IconHeartbeat, IconStethoscope, IconFilter } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  onDetectLocation?: (location: string) => void;
}

// Animated background component - separated for better performance
const AnimatedBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden rounded-3xl">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-xl"></div>
    
    {/* Animated blobs - sized responsively */}
    <motion.div
      className="absolute w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-blue-400/30 blur-3xl"
      animate={{
        x: [0, 30, 0],
        y: [0, 20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ top: "-20%", left: "10%" }}
    />
    
    <motion.div
      className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full bg-purple-500/20 blur-3xl"
      animate={{
        x: [0, -40, 0],
        y: [0, 30, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
      style={{ bottom: "-10%", right: "15%" }}
    />
    
    <motion.div
      className="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-cyan-400/20 blur-3xl"
      animate={{
        x: [0, 20, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
      style={{ top: "30%", right: "20%" }}
    />
  </div>
));
AnimatedBackground.displayName = "AnimatedBackground";

// Memoized search button to prevent re-renders
const SearchButton = memo(({ onClick }: { onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 px-4 sm:px-5 py-3",
      "bg-blue-600 text-white font-medium",
      "rounded-xl shadow-md hover:shadow-lg transition-all",
      "hover:bg-blue-700",
      "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2",
      "min-w-[88px] sm:min-w-[100px]"
    )}
  >
    <IconSearch size={18} />
    <span className="hidden xs:inline">Search</span>
  </motion.button>
));
SearchButton.displayName = "SearchButton";

// Memoized location button to prevent re-renders
const LocationButton = memo(({ onClick, detecting }: { onClick: () => void, detecting: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    disabled={detecting}
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 py-3",
      "bg-white text-gray-700 border-2 border-gray-200",
      "font-medium rounded-xl shadow-sm hover:shadow-md transition-all",
      "hover:bg-gray-50 hover:border-gray-300",
      "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
      "disabled:opacity-60 disabled:cursor-not-allowed",
      "text-sm sm:text-base w-full sm:w-auto"
    )}
  >
    <IconMapPin 
      size={18} 
      className={detecting ? "animate-pulse text-blue-500" : ""} 
    />
    <span>{detecting ? "Detecting..." : "Detect Location"}</span>
  </motion.button>
));
LocationButton.displayName = "LocationButton";

// Clinic count info component
const ClinicInfo = memo(({ location, count }: { location: string, count: number }) => {
  const clinicTypes = ["General Practice", "Dental", "Pediatric", "Cardiology", "Dermatology"];
  const randomCount = count || Math.floor(Math.random() * 15) + 5;
  
  return location ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-gray-700 text-sm sm:mt-0 mt-1 flex items-center gap-2"
    >
      <IconStethoscope size={16} className="text-blue-600" />
      <span>
        <span className="font-semibold">{randomCount}</span> clinics near <span className="font-semibold">{location}</span>
      </span>
    </motion.div>
  ) : null;
});
ClinicInfo.displayName = "ClinicInfo";

// Featured categories component
const ClinicCategories = memo(() => {
  const categories = [
    { name: "Dentists", icon: "🦷", color: "bg-blue-100 text-blue-800" },
    { name: "Family Practice", icon: "👨‍👩‍👧‍👦", color: "bg-green-100 text-green-800" },
    { name: "Pediatrics", icon: "👶", color: "bg-purple-100 text-purple-800" },
    { name: "Mental Health", icon: "🧠", color: "bg-amber-100 text-amber-800" },
    { name: "Cardiology", icon: "❤️", color: "bg-red-100 text-red-800" }
  ];
  
  return (
    <motion.div 
      className="mt-4 sm:mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h3 className="text-gray-700 font-medium mb-2 sm:mb-3 flex items-center gap-1 text-sm sm:text-base">
        <IconHeartbeat size={16} className="text-blue-600" />
        <span>Popular specialties:</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
            className={`${category.color} px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1`}
          >
            <span>{category.icon}</span>
            <span className="hidden xs:inline">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});
ClinicCategories.displayName = "ClinicCategories";

// Filter button that shows on mobile
const MobileFilterButton = memo(() => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="md:hidden flex items-center justify-center gap-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium text-sm"
  >
    <IconFilter size={16} />
    <span>Filter</span>
  </motion.button>
));
MobileFilterButton.displayName = "MobileFilterButton";

export const SearchBar = ({ className, onSearch, onDetectLocation }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [clinicCount, setClinicCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set a random clinic count whenever location changes
  useEffect(() => {
    if (currentLocation) {
      setClinicCount(Math.floor(Math.random() * 25) + 10);
    }
  }, [currentLocation]);

  // Memoized handlers to prevent re-renders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    if (onSearch) onSearch("");
  }, [onSearch]);

  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const location = data?.address?.city || data?.address?.town || data?.display_name || "Unknown location";

          setSearchQuery(location);
          setCurrentLocation(location);
          if (onSearch) onSearch(location);
          if (onDetectLocation) onDetectLocation(location);
        } catch (err) {
          alert("Failed to fetch location name.");
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        alert("Unable to retrieve your location.");
        console.error(error);
        setDetecting(false);
      }
    );
  }, [onSearch, onDetectLocation]);

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery) {
      setCurrentLocation(searchQuery);
      if (onSearch) onSearch(searchQuery);
    }
  }, [onSearch, searchQuery]);

  return (
    <motion.div
      className={cn("w-full max-w-4xl mx-auto px-3 sm:px-4 relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Text */}
      <motion.div 
        className="text-center mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Find the Right Clinic Near You
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Search from over 10,000 verified clinics and healthcare providers in your area
        </motion.p>
      </motion.div>

      <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 relative z-10">
        <div className="relative flex-grow">
          {/* Animated container background */}
          <div className="absolute inset-0 -z-10 rounded-xl sm:rounded-2xl">
            <AnimatedBackground />
          </div>

          <div className={cn(
            "absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-10",
            isFocused ? "text-blue-600" : "text-gray-400",
            searchQuery ? "text-blue-600" : ""
          )}>
            <motion.div
              animate={isFocused ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              } : {}}
              transition={{ duration: 1.5, repeat: isFocused ? Infinity : 0, repeatType: "reverse" }}
            >
              <IconSearch size={18} stroke={2} className="sm:hidden" />
              <IconSearch size={20} stroke={2} className="hidden sm:block" />
            </motion.div>
          </div>

          <motion.input
            type="text"
            placeholder={isMobile ? "Search clinics..." : "Search by clinic name, specialty, or location..."}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full pl-9 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 focus:outline-none transition-all duration-300",
              "bg-white/95 backdrop-blur-sm placeholder-gray-400 text-gray-800",
              "font-medium text-sm sm:text-base shadow-md sm:shadow-lg",
              isFocused
                ? "border-blue-500 ring-2 sm:ring-4 ring-blue-300/30 shadow-blue-200/50"
                : "border-gray-200 hover:border-gray-300"
            )}
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                onClick={handleClear}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all p-1 hover:bg-gray-100 rounded-full z-10"
              >
                <IconX size={16} className="sm:hidden" />
                <IconX size={18} className="hidden sm:block" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <SearchButton onClick={handleSearchSubmit} />
      </div>

      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="flex sm:flex-1">
          <LocationButton onClick={handleDetectLocation} detecting={detecting} />
        </div>
        
        {/* Mobile filter button */}
        <MobileFilterButton />
        
        {/* Show clinic count when location is detected */}
        <div className="hidden sm:block">
          <ClinicInfo location={currentLocation} count={clinicCount} />
        </div>
      </div>
      
      {/* Mobile clinic count - shown below buttons on small screens */}
      <div className="sm:hidden mt-2">
        <ClinicInfo location={currentLocation} count={clinicCount} />
      </div>

      {/* Category chips */}
      <ClinicCategories />
      
      {/* Clinic availability info */}
      {currentLocation && (
        <motion.div 
          className="mt-4 sm:mt-6 md:mt-8 bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="font-semibold text-blue-800 mb-1 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <IconHeartbeat size={16} className="sm:hidden" />
            <IconHeartbeat size={18} className="hidden sm:block" />
            <span>Healthcare in {currentLocation}</span>
          </h3>
          <p className="text-xs sm:text-sm text-blue-700">
            We've found {clinicCount} healthcare providers accepting new patients in your area. 
            <span className="hidden sm:inline"> Filter by specialty, insurance, ratings, and availability.</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Add custom CSS for extra small screens
const responsiveCSS = `
@media (min-width: 400px) {
  .xs\\:inline {
    display: inline;
  }
  .xs\\:hidden {
    display: none;
  }
}
`;

// Add custom CSS to the head of the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = responsiveCSS;
  document.head.appendChild(style);
}

export default memo(SearchBar);