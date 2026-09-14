import { useState } from 'react';
import { Battery, Zap, Gauge, Clock, Car } from 'lucide-react';
import type { Vehicle } from '@/types';

interface BrandSectionsProps {
  id?: string;
  brand: string;
  vehicles: Vehicle[];
  countdown: { days: number; hours: number; mins: number; secs: number };
  liveCount: number;
  onClaim: (vehicle: Vehicle) => void;
  onPay: (vehicle: Vehicle) => void;
}

const brandConfig: Record<string, { label: string; description: string; color: string }> = {
  BYD: {
    label: 'BYD Electric Car',
    description: 'World-leading blade battery technology and ultra-fast charging.',
    color: 'from-brand-900/30 via-ink-900 to-accent-500/10',
  },
  Tesla: {
    label: 'Tesla Electric Car',
    description: 'Record-breaking acceleration, premium luxury, and cutting-edge autopilot.',
    color: 'from-red-900/20 via-ink-900 to-brand-900/20',
  },
  RV: {
    label: 'RV Vehicle',
    description: 'Spacious motorhomes built for adventure and comfortable road living.',
    color: 'from-accent-900/20 via-ink-900 to-gold-900/20',
  },
};

export default function BrandSections({ id, brand, vehicles, countdown, liveCount, onClaim, onPay }: BrandSectionsProps) {
  const [showAll, setShowAll] = useState(false);
  const config = brandConfig[brand];
  const displayed = showAll ? vehicles : vehicles.slice(0, 4);

  if (vehicles.length === 0) return null;

  return (
    <div id={id} className="scroll-mt-24">
      {/* All [Brand] Electric Models */}
      <section className="section-padding py-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            All {brand} {brand === 'RV' ? 'Models' : 'Electric Models'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse every available {brand} {brand === 'RV' ? 'vehicle' : 'electric car'} in our giveaway lineup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onClaim={() => onClaim(vehicle)} />
          ))}
        </div>
      </section>

      {/* Choose Your Preferred [Brand] Electric Car */}
      <section className="section-padding py-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Choose Your Preferred {config.label}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayed.map((vehicle) => (
            <VehicleCard key={`preferred-${vehicle.id}`} vehicle={vehicle} onClaim={() => onClaim(vehicle)} />
          ))}
        </div>

        {!showAll && vehicles.length > 4 && (
          <div className="text-center mt-8">
            <button onClick={() => setShowAll(true)} className="btn-outline">
              View All {brand} Models
            </button>
          </div>
        )}
      </section>

      {/* Choose Your [Brand] Electric Car Banner */}
      <section className="section-padding py-12">
        <div className="glass-card overflow-hidden">
          <div className={`p-8 text-center bg-gradient-to-r ${config.color}`}>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Choose Your {config.label}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              EliteDrive MotorGrants is gifting brand new {brand} {brand === 'RV' ? 'vehicles' : 'electric cars'} to participants worldwide.
            </p>

            <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl mb-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span className="text-sm text-gray-300">Event ends in:</span>
              <div className="flex items-center gap-2 font-display font-bold text-white">
                <span className="bg-brand-500/20 px-2 py-1 rounded text-brand-400">{countdown.days}d</span>
                <span className="bg-brand-500/20 px-2 py-1 rounded text-brand-400">{countdown.hours}h</span>
                <span className="bg-brand-500/20 px-2 py-1 rounded text-brand-400">{countdown.mins}m</span>
                <span className="bg-brand-500/20 px-2 py-1 rounded text-brand-400">{countdown.secs}s</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {(72345 + liveCount).toLocaleString()} participants already
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/10">
            {vehicles.slice(0, 4).map((car) => (
              <BannerCarCard key={`banner-${car.id}`} car={car} onClaim={() => onPay(car)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function VehicleCard({ vehicle, onClaim }: { vehicle: Vehicle; onClaim: () => void }) {
  return (
    <div className="glass-card overflow-hidden group hover:border-brand-400/30 transition-all">
      {vehicle.tag && (
        <div className="absolute top-3 right-3 z-10 bg-brand-500 text-ink-950 text-xs font-bold px-3 py-1 rounded-full">
          {vehicle.tag}
        </div>
      )}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-white text-lg">{vehicle.name} {vehicle.year}</h3>
        <p className="text-sm text-gray-400 mb-3">{vehicle.type}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-brand-400" /> {vehicle.range}</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-brand-400" /> {vehicle.power}</span>
        </div>
        <button onClick={onClaim} className="w-full btn-primary text-sm py-2.5">
          {vehicle.price}
        </button>
      </div>
    </div>
  );
}

function BannerCarCard({ car, onClaim }: { car: Vehicle; onClaim: () => void }) {
  return (
    <div className="p-6 border-r border-b border-white/5 last:border-r-0">
      <div className="aspect-video rounded-xl overflow-hidden mb-4">
        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-display font-bold text-white text-lg mb-2">{car.name} {car.year}</h3>
      <div className="space-y-1.5 mb-4">
        {car.specs.map((spec) => (
          <div key={spec.label} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{spec.label}</span>
            <span className="text-gray-200 font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
      <div className="glass px-3 py-2 rounded-lg mb-3">
        <p className="text-xs text-gray-400">One-time delivery fee</p>
        <p className="text-lg font-bold text-brand-400">${car.deliveryFee}</p>
        <p className="text-[10px] text-gray-500">Covers shipping, customs & logistics</p>
      </div>
      <button onClick={onClaim} className="w-full btn-primary text-sm py-2.5">
        Claim This {car.brand === 'RV' ? 'Vehicle' : 'Electric Car'}
      </button>
    </div>
  );
}
