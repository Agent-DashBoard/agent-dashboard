// # NOTE PENANDA: File kerangka utama, sekarang dengan Sidebar dan Topbar.

import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar"; // <-- INI YANG KURANG TADI

export const metadata: Metadata = {
  title: "HERMES JARVIS OS",
  description: "Dashboard untuk mengelola alur kerja AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex min-h-screen"> {/* <-- STRUKTUR BARU */}
          <Sidebar />
          <div className="flex-1 flex flex-col"> {/* <-- STRUKTUR BARU */}
            <Topbar /> {/* <-- INI YANG KURANG TADI */}
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}