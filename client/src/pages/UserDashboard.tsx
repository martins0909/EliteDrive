import { useEffect, useState } from 'react';
import type { Vehicle } from '@/types';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import BrandSections from '@/components/BrandSections';
import { Loader2 } from 'lucide-react';

const youtubeVideos = [
  'https://youtube.com/shorts/8FrVADUwlwc?si=GefxwBtD7RM-6_KH',
  'https://youtube.com/shorts/-mwZ7JXOtMc?si=7OJOyUvj51VekUlQ',
  'https://youtube.com/shorts/3PFJqZ8QXho?si=MrrcMsUd8Y-ChcZT',
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown] = useState({ days: 4, hours: 12, mins: 42, secs: 44 });
  const [liveCount] = useState(72345);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        setVehicles(res.data);
      } catch (err) {
        setError('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const bydVehicles = vehicles.filter((v) => v.brand === 'BYD');
  const teslaVehicles = vehicles.filter((v) => v.brand === 'Tesla');
  const rvVehicles = vehicles.filter((v) => v.brand === 'RV');

  return (
    <div className="min-h-screen bg-ink-950 pt-24 pb-20">
      <div className="section-padding">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore all BYD, Tesla, and RV models and claim your preferred vehicle today.
          </p>
        </div>

        {error && (
          <div className="glass-card p-4 mb-8 border-red-500/30 bg-red-500/10">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <BrandSections
          id="user-brand-byd"
          brand="BYD"
          vehicles={bydVehicles}
          countdown={countdown}
          liveCount={liveCount}
          onClaim={(v) => { window.location.href = `/claim`; }}
          onPay={(v) => { window.location.href = `/payment`; }}
        />
        <BrandSections
          id="user-brand-tesla"
          brand="Tesla"
          vehicles={teslaVehicles}
          countdown={countdown}
          liveCount={liveCount}
          onClaim={(v) => { window.location.href = `/claim`; }}
          onPay={(v) => { window.location.href = `/payment`; }}
        />
        <BrandSections
          id="user-brand-rv"
          brand="RV"
          vehicles={rvVehicles}
          countdown={countdown}
          liveCount={liveCount}
          onClaim={(v) => { window.location.href = `/claim`; }}
          onPay={(v) => { window.location.href = `/payment`; }}
        />

        {/* YouTube Section */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">BYD, TESLA, RV Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {youtubeVideos.map((url, idx) => (
              <YouTubeEmbed key={idx} url={url} title={`Video ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
