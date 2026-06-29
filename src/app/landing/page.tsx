// NOTE PENANDA: LANDING_PAGE_v1.1 - dengan Popup Login
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { XCircle, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

// Komponen Login Modal
const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = '/';
  };

  return (
    // Overlay backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-1">
            HERMES OS
          </div>
          <h2 className="text-xl font-bold text-white">Masuk ke Dashboard</h2>
          <p className="text-sm text-zinc-400 mt-1">Gunakan akun Anda untuk melanjutkan</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              required
              className="mt-1 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-purple-500/50"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-purple-500/50"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </div>
  );
};

// Komponen Header
const Header = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <header className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6 md:p-8">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-2xl font-bold text-white">HERMES OS</div>
      <nav className="hidden md:flex space-x-8">
        <Link href="#features" className="text-sm text-zinc-300 hover:text-white transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-sm text-zinc-300 hover:text-white transition-colors">How It Works</Link>
        <Link href="#pricing" className="text-sm text-zinc-300 hover:text-white transition-colors">Pricing</Link>
      </nav>
      <Button
        onClick={onLoginClick}
        className="font-semibold bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 hover:opacity-90 transition-opacity"
      >
        Login
      </Button>
    </div>
  </header>
);

// Komponen Hero Section
const HeroSection = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
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
        <Button
          size="lg"
          onClick={onLoginClick}
          className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          Get Started
        </Button>
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
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="bg-black text-white">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <Header onLoginClick={() => setShowLogin(true)} />
      <main>
        <HeroSection onLoginClick={() => setShowLogin(true)} />
      </main>
    </div>
  );
}