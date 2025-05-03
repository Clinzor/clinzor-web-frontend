"use client";

import ClinicSearch from "@/components/landingpage/clinclistings/clinclisting";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import SearchHero from "@/components/landingpage/searchbar/searchbar";
import ServicesWeOffer from "@/components/landingpage/Ourservice/ServicesWeOffer";
import FooterSection from "@/components/landingpage/footer/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background SVG Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="absolute top-1/4 -right-56 w-[600px] h-[600px] text-blue-100" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>
        <svg className="absolute -left-32 top-1/3 w-64 h-64 text-indigo-100 opacity-70" viewBox="0 0 100 100">
          <path d="M0,50 C20,30 40,70 60,50 C80,30 100,70 120,50" stroke="currentColor" strokeWidth="12" fill="none" />
        </svg>
        <div className="absolute inset-0">
          <svg width="100%" height="100%">
            <pattern id="dots-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#BFDBFE" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-pattern)" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <NavbarDemo />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-4 relative">
          {/* Decorative Hero Icons */}
          <svg className="absolute top-24 left-16 w-16 h-16 text-blue-200 hidden md:block" viewBox="0 0 100 100">
            <path d="M50 0L65 35H100L70 60L80 95L50 75L20 95L30 60L0 35H35L50 0Z" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-24 right-16 w-12 h-12 text-indigo-200 hidden md:block" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" />
          </svg>

          <SearchHero />
        </section>

        {/* Clinic Listings */}
        <section className="w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-4 relative bg-gradient-to-br from-white to-blue-50">
          <ClinicSearch />

          {/* Wave Divider */}
          <div className="mtabsolute bottom-0 left-0 w-full h-16 overflow-hidden">
            <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
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
        <section className="relative z-10 bg-white">
          <ServicesWeOffer />
          {/* Decorative Triangles */}
          <svg className="absolute top-0 left-4 w-20 h-20 text-blue-100 hidden md:block" viewBox="0 0 100 100">
            <polygon points="50,0 100,100 0,100" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-0 right-4 w-24 h-24 text-indigo-100 hidden md:block" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
          </svg>
        </section>
        <section className="relative z-10 bg-white">
          <FooterSection />
          {/* Decorative Triangles */}
          <svg className="absolute top-0 left-4 w-20 h-20 text-blue-100 hidden md:block" viewBox="0 0 100 100">
            <polygon points="50,0 100,100 0,100" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-0 right-4 w-24 h-24 text-indigo-100 hidden md:block" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
          </svg>
        </section>
      </main>
    </div>
  );
}
