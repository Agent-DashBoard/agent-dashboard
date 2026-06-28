// NOTE PENANDA: Halaman Activity, sekarang fetch data dari Supabase.
// Menampilkan log timeline aktivitas agent.

'use client'; // Client Component karena butuh useEffect dan useState

import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button'; // Import Button component
import { Search, XCircle, Info } from 'lucide-react'; // Import ikon
import { ActivityItem } from '@/components/ActivityItem'; // Import ActivityItem
import { getActivities, subscribeToActivities } from '@/lib/queries/activities'; // Import getActivities dan subscribeToActivities
import type { Activity } from '@/lib/supabase-client'; // Import Activity interface


export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'success' | 'failed' | 'in_progress'
  >('all');


  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat aktivitas');
      } finally {
        setLoading(false);
      }
    };
    fetchActivitiesData();

    // NOTE PENANDA: Integrasi Realtime Supabase
    const handleRealtimeUpdate = (payload: {eventType: string, new: Activity | null, old: Activity | null, errors: any[] | null}) => {
      setActivities((prevActivities) => {
        switch (payload.eventType) {
          case 'INSERT':
            if (payload.new) {
              const newActivity = payload.new as Activity;
              // Mencegah duplikasi jika sudah dihandle oleh onActivityCreated
              if (!prevActivities.some(act => act.id === newActivity.id)) {
                return [...prevActivities, newActivity];
              }
            }
            break;
          case 'UPDATE':
            if (payload.new) {
              return prevActivities.map((act) =>
                act.id === (payload.new as Activity).id ? (payload.new as Activity) : act
              );
            }
            break;
          case 'DELETE':
            if (payload.old) {
              return prevActivities.filter((act) => act.id !== (payload.old as Activity).id);
            }
            break;
          default:
            break;
        }
        return prevActivities; // Jika tidak ada perubahan atau jenis event tidak dikenal
      });
    };

    const unsubscribe = subscribeToActivities(handleRealtimeUpdate);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.result && JSON.stringify(activity.result).toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === 'all' || activity.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });


  return (
    <PageWrapper
      title="Activity Log"
      subtitle="Jejak digital dari semua yang terjadi di dalam sistem Anda."
    >
      <div className="space-y-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Cari aktivitas berdasarkan aksi, status, atau hasil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all h-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'success', 'failed', 'in_progress'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all h-full ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner text="Memuat aktivitas dari Supabase..." />}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span>Terjadi kesalahan: {error}</span>
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-zinc-500 border border-zinc-800 rounded-lg">
            <Info className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold">Tidak ada aktivitas ditemukan</p>
            <p className="text-sm text-center">Belum ada jejak aktivitas yang direkam.</p>
          </div>
        )}

        {!loading && activities.length > 0 && (
          <div className="mt-8">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="pt-4 border-t border-zinc-800 text-right">
            <p className="text-xs text-zinc-500">
              Menampilkan {filteredActivities.length} dari {activities.length} aktivitas
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
