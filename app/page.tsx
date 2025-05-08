"use client";

import ClinicSearch from "@/components/landingpage/clinclistings/clinclisting";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import ServicesWeOffer from "@/components/landingpage/Ourservice/ServicesWeOffer";
import FooterSection from "@/components/landingpage/footer/footer";
import HeroSection from "@/components/landingpage/hero/Hero";
import SearchBar from "@/components/landingpage/searchbar/searchbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
        <svg
          className="absolute top-1/4 -right-32 sm:-right-40 w-[400px] h-[400px] md:w-[500px] md:h-[500px] text-blue-100"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>
        <svg
          className="absolute -left-20 top-1/3 w-56 h-56 text-indigo-100 opacity-70"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <path
            d="M0,50 C20,30 40,70 60,50 C80,30 100,70 120,50"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 hidden md:block">
          <svg width="100%" height="100%" aria-hidden>
            <pattern
              id="dots-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#BFDBFE" />
            </pattern>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#dots-pattern)"
            />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <NavbarDemo />

      <main className="z-10">
        {/* Hero Section */}
        <section className="min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center items-center px-4 pt-16 sm:pt-24 relative overflow-hidden">
          <div className="mx-auto">
            <HeroSection />
          </div>
          <SearchBar />
        </section>

        {/* Clinic Listing Section */}
        <section className="w-full bg-gradient-to-br from-white to-blue-50 px-4 sm:px-6 pt-12 pb-20">
          <div className="max-w-screen-xl mx-auto">
            <ClinicSearch />
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 w-full h-10 overflow-hidden">
            <svg
              className="absolute bottom-0 w-full h-10 sm:h-12"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86
                 c82.39-16.72,168.19-17.73,250.45-.39
                 C823.78,31,906.67,72,985.66,92.83
                 c70.05,18.48,146.53,26.09,214.34,3V120H0
                 V95.8C59.71,118.92,146.86,111.31,217.19,94.6
                 C283.1,79.07,258.87,67.16,321.39,56.44Z"
                fill="#EFF6FF"
              />
            </svg>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative">
            <ServicesWeOffer />
            <svg
              className="absolute top-0 left-4 w-12 h-12 sm:w-16 sm:h-16 text-blue-100 hidden md:block"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <polygon points="50,0 100,100 0,100" fill="currentColor" />
            </svg>
          </div>
        </section>

        {/* Footer Section */}
        <section className="bg-white px-4 sm:px-6 pt-6 pb-12">
          <div className="max-w-screen-xl mx-auto">
            <FooterSection />
          </div>
        </section>
      </main>
    </div>
  );
}