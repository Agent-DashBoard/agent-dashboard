// # NOTE PENANDA: Ini adalah komponen pembungkus untuk setiap halaman.
// Tujuannya agar semua halaman punya struktur judul dan header yang sama.

import React from "react";

type PageWrapperProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-zinc-400">{subtitle}</p>}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}