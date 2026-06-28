// NOTE PENANDA: Login / Register Page
// Halaman untuk autentikasi pengguna (login dan register).

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageWrapper } from '@/components/PageWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { XCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push('/');
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage('Pendaftaran berhasil! Mohon cek email Anda untuk konfirmasi akun.');
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">
              {isLogin ? 'Masuk ke Hermes OS' : 'Daftar Akun Baru'}
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              {isLogin ? 'Gunakan akun Anda untuk melanjutkan.' : 'Buat akun baru untuk memulai.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="dashboard.agent@gmail.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 rounded-md bg-red-900/50 border border-red-500/50 p-3 text-xs text-red-300">
                <XCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="flex items-center space-x-2 rounded-md bg-green-900/50 border border-green-500/50 p-3 text-xs text-green-300">
                <span>{message}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size={20} /> : (isLogin ? 'Masuk' : 'Daftar')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 font-semibold text-blue-500 hover:underline"
            >
              {isLogin ? 'Daftar Sekarang' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
