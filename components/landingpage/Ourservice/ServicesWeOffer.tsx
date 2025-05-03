// components/ServicesWeOffer.tsx

"use client";

import { motion } from "framer-motion";
import {
  IconStethoscope,
  IconHeart,
  IconTool,
  IconBrain,
  IconUserCheck,
  IconHospital,
} from "@tabler/icons-react";

const services = [
  {
    title: "General Consultation",
    description: "Get professional advice for your health concerns from certified physicians.",
    icon: IconStethoscope,
  },
  {
    title: "Cardiology",
    description: "Heart health assessments, ECGs, and specialist referrals at your fingertips.",
    icon: IconHeart,
  },
  {
    title: "Dental Care",
    description: "Routine checkups, cleanings, and cosmetic dentistry from top dentists.",
    icon: IconTool,
  },
  {
    title: "Neurology",
    description: "Advanced diagnosis and treatment for neurological disorders.",
    icon: IconBrain,
  },
  {
    title: "Family Medicine",
    description: "Holistic care for every member of your family, all in one place.",
    icon: IconUserCheck,
  },
  {
    title: "Emergency Services",
    description: "Round-the-clock urgent care and emergency response facilities.",
    icon: IconHospital,
  },
];

// Reusable card component
const ServiceCard = ({ icon: Icon, title, description, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
    className="rounded-xl border border-black/10 bg-white shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/5 text-black">
      <Icon size={24} stroke={1.5} />
    </div>
    <h3 className="text-lg font-semibold text-black">{title}</h3>
    <p className="text-sm text-black/70">{description}</p>
  </motion.div>
);

export default function ServicesWeOffer() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-black mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          Services We Offer
        </motion.h2>
        <motion.p
          className="text-black/60 mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
        >
          We provide a wide range of services to keep you and your family healthy, safe, and informed.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={i} {...service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
