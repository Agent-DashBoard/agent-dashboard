// # NOTE PENANDA: Halaman Home, versi final dengan detail di panel Subscriptions.

import { PageWrapper } from "@/components/PageWrapper";
import { StatCard } from "@/components/StatCard";
import { DollarSign, Zap, BarChart, CreditCard, PieChart } from "lucide-react";

// # NOTE PENANDA: Data bohongan untuk daftar langganan.
// Nanti ini akan kita ambil dari database.
const subscriptions = [
  { name: "Claude Pro Max", cost: 200, logo: "A" },
  { name: "ChatGPT Plus", cost: 20, logo: "G" },
  { name: "Gemini Advanced", cost: 20, logo: "G" },
];
const flatMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);

export default function HomePage() {
  return (
    <PageWrapper
      title="Home"
      subtitle="Ringkasan aktivitas hari ini."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="SPENT ON AI" value="$174.40" icon={DollarSign} colorClassName="text-red-500" />
        <StatCard title="SKILLS SAVED" value="$241,600" icon={Zap} colorClassName="text-blue-500" />
        <StatCard title="NET ROI" value="+$241,426" icon={BarChart} colorClassName="text-green-500" />
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Kolom Kiri - Subscriptions */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-zinc-400" />
              <h2 className="text-xl font-semibold">Subscriptions</h2>
            </div>
            <div className="text-sm text-zinc-400">
              Flat monthly spend: <span className="font-semibold text-white">${flatMonthlySpend}</span>
            </div>
          </div>

          {/* # NOTE PENANDA: Looping untuk menampilkan setiap item langganan */}
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub.name} className="flex items-center justify-between p-3 rounded-md bg-zinc-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center font-bold">
                    {sub.logo}
                  </div>
                  <span className="font-medium">{sub.name}</span>
                </div>
                <span className="font-mono text-lg">${sub.cost}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Kolom Kanan - Live Usage */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <PieChart className="h-5 w-5 text-zinc-400" />
            <h2 className="text-xl font-semibold">Live Usage</h2>
          </div>
          <p className="text-zinc-400">Konten grafik penggunaan akan ada di sini...</p>
        </div>
      </div>
    </PageWrapper>
  );
}