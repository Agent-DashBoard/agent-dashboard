// NOTE PENANDA: LANDING_PAGE_v1.0
// Halaman landing page untuk HERMES JARVIS OS.

import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Komponen Header
const Header = () => (
  <header className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6 md:p-8">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-2xl font-bold text-white">HERMES OS</div>
      <nav className="hidden md:flex space-x-8">
        <Link href="#features" className="text-sm text-zinc-300 hover:text-white transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-sm text-zinc-300 hover:text-white transition-colors">How It Works</Link>
        <Link href="#pricing" className="text-sm text-zinc-300 hover:text-white transition-colors">Pricing</Link>
      </nav>
      <Link href="/auth">
        <Button className="font-semibold bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 hover:opacity-90 transition-opacity">
          Login
        </Button>
      </Link>
    </div>
  </header>
);

// Komponen Hero Section
const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
    {/* Background Effect */}
    <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
    <div className="absolute inset-0 bg-grid-zinc-700/[0.2] z-0"></div>
    
    <div className="relative z-10 px-4">
      <div className="inline-block bg-zinc-800/50 text-xs text-zinc-300 px-3 py-1 rounded-full mb-4 border border-zinc-700">
        Smart AI • Real-Time Assistance
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
        Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">HERMES</span> Assistant
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400">
        Your personal AI operator, ready to build, debug, and accelerate your workflow.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/auth">
          <Button size="lg" className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            Get Started
          </Button>
        </Link>
        <Link href="#features">
          <Button size="lg" variant="outline" className="font-bold text-lg border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  </section>
);


export default function LandingPage() {
  return (
    <div className="bg-black text-white">
      <Header />
      <main>
        <HeroSection />
        {/* Sections for Features, How It Works, Pricing will be added here */}
      </main>
    </div>
  );
}
