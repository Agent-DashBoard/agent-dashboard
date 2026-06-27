// # NOTE PENANDA: Ini adalah komponen Topbar (header) kita.
// Menampilkan status dan info pengguna.

export function Topbar() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-800">
      <div>
        {/* Nanti di sini bisa kita taruh Breadcrumb navigasi */}
        <span className="text-sm text-zinc-500">Operator / local</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-zinc-400">HERMES-AGENT ONLINE</span>
        </div>
        <span className="text-sm font-semibold">Operator: BangBay</span>
      </div>
    </header>
  );
}