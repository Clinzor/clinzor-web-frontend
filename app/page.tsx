import { NavbarDemo } from "@/components/landingpage/navbar/navbar";

export default function Home() {
  return (
    <>
      <NavbarDemo />

      <main className="pt-24">
        <section className="w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to Startup
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6">
            Build your clinic listing platform beautifully. Your success starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#get-started" className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Get Started
            </a>
            <a href="#learn-more" className="px-6 py-3 rounded-md bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition">
              Learn More
            </a>
          </div>
        </section>

        <section className="w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Second Section
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6">
            Keep scrolling down!
          </p>
        </section>
      </main>
    </>
  );
}
