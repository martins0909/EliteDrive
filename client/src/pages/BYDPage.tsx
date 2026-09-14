import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Battery, Zap, Gauge, Car, Loader2 } from 'lucide-react';
import type { Vehicle } from '@/types';
import api from '@/lib/api';

export default function BYDPage() {
  return <BrandPage brand="BYD" title="All BYD Electric Models" />;
}

function BrandPage({ brand, title }: { brand: string; title: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        setVehicles(res.data.filter((v: Vehicle) => v.brand === brand));
      } catch (err) {
        setError('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [brand]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 pt-24 pb-20">
      <div className="section-padding">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose your preferred {brand} {brand === 'RV' ? 'vehicle' : 'electric car'}. All models are brand new editions delivered straight to your door.
          </p>
        </div>

        {error && (
          <div className="glass-card p-4 mb-8 border-red-500/30 bg-red-500/10">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <ModelCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModelCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="glass-card overflow-hidden group hover:border-brand-400/30 transition-all">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 to-transparent" />
        {vehicle.tag && (
          <div className="absolute top-3 right-3 bg-brand-500 text-ink-950 text-xs font-bold px-3 py-1 rounded-full">
            {vehicle.tag}
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <h3 className="font-display font-bold text-white text-xl">{vehicle.name} {vehicle.year}</h3>
          <p className="text-sm text-gray-300">{vehicle.type}</p>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-400 leading-relaxed mb-4">{vehicle.description}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="glass p-3 rounded-lg text-center">
            <Battery className="w-4 h-4 text-brand-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Range</p>
            <p className="text-sm font-semibold text-white">{vehicle.range}</p>
          </div>
          <div className="glass p-3 rounded-lg text-center">
            <Zap className="w-4 h-4 text-brand-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Power</p>
            <p className="text-sm font-semibold text-white">{vehicle.power}</p>
          </div>
          <div className="glass p-3 rounded-lg text-center">
            <Gauge className="w-4 h-4 text-brand-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">0-100</p>
            <p className="text-sm font-semibold text-white">{vehicle.acceleration.replace(' (0-100)', '')}</p>
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          {vehicle.specs.map((spec) => (
            <div key={spec.label} className="flex justify-between text-xs">
              <span className="text-gray-400">{spec.label}</span>
              <span className="text-gray-200 font-medium">{spec.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Vehicle Price</p>
            <p className="text-lg font-bold text-brand-400">{vehicle.price.toUpperCase()}</p>
            <p className="text-xs text-gray-500">+ ${vehicle.deliveryFee} delivery</p>
          </div>
          <Link
            to="/claim"
            state={{ car: `${vehicle.name} ${vehicle.year} - ${vehicle.type}` }}
            className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
          >
            <Car className="w-4 h-4" /> Claim Now
          </Link>
        </div>
      </div>
    </div>
  );
}
