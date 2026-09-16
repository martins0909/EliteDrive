import { useEffect, useState } from 'react';

interface FeedItem {
  id: string;
  customer_name: string;
  country: string;
  country_code: string;
  car_model: string;
  amount: number;
  minutes_ago: number;
}

function FlagEmoji({ code }: { code: string }) {
  if (!code || code.length !== 2) return <span className="text-base">🏳️</span>;
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0));
  return <span className="text-base">{String.fromCodePoint(...codePoints)}</span>;
}

const fallbackFeed: FeedItem[] = [
  { id: '1', customer_name: 'Paul Okonkwo', country: 'Nigeria', country_code: 'NG', car_model: 'BYD Dolphin 2025', amount: 359, minutes_ago: 35 },
  { id: '2', customer_name: 'Maria Santos', country: 'Philippines', country_code: 'PH', car_model: 'Tesla Model S Plaid 2025', amount: 399, minutes_ago: 12 },
  { id: '3', customer_name: 'James Wilson', country: 'United Kingdom', country_code: 'GB', car_model: 'BYD Seal 2025', amount: 399, minutes_ago: 47 },
  { id: '4', customer_name: 'Aisha Mohammed', country: 'Egypt', country_code: 'EG', car_model: 'BYD Atto 3 2025', amount: 349, minutes_ago: 8 },
  { id: '5', customer_name: 'Chen Wei', country: 'Singapore', country_code: 'SG', car_model: 'Tesla Model 3 2025', amount: 449, minutes_ago: 23 },
  { id: '6', customer_name: 'Robert Brown', country: 'United States', country_code: 'US', car_model: 'Bob Tiffin Motorhomes Allegro Bus 2025', amount: 599, minutes_ago: 55 },
  { id: '7', customer_name: 'Fatima Al-Zahra', country: 'UAE', country_code: 'AE', car_model: 'BYD Han EV 2025', amount: 399, minutes_ago: 3 },
  { id: '8', customer_name: 'Diego Ramirez', country: 'Mexico', country_code: 'MX', car_model: 'Winnebago Vista 2022', amount: 579, minutes_ago: 19 },
  { id: '9', customer_name: 'Sophie Martin', country: 'France', country_code: 'FR', car_model: 'BYD Atto 3 2025', amount: 349, minutes_ago: 41 },
  { id: '10', customer_name: 'Kwame Asante', country: 'Ghana', country_code: 'GH', car_model: 'Winnebago Adventurer 2022', amount: 599, minutes_ago: 27 },
  { id: '11', customer_name: 'Liam OConnor', country: 'Ireland', country_code: 'IE', car_model: 'Tesla Model S Plaid 2025', amount: 399, minutes_ago: 15 },
  { id: '12', customer_name: 'Yuki Tanaka', country: 'Japan', country_code: 'JP', car_model: 'BYD Tang EV 2025', amount: 449, minutes_ago: 31 },
];

export default function DeliveryFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(fallbackFeed);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => {
        // Shift items and add a new one at the top
        const shuffled = [...prev];
        const last = shuffled.pop();
        if (!last) return prev;
        const newItem = {
          ...last,
          id: Math.random().toString(36).slice(2),
          minutes_ago: Math.floor(Math.random() * 5) + 1,
        };
        return [newItem, ...shuffled];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="font-display font-semibold text-sm text-white">Live Delivery Feed</span>
        <span className="ml-auto text-xs text-gray-500">Real-time dispatches</span>
      </div>
      <div className="divide-y divide-white/5">
        {feed.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors animate-fade-in"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <FlagEmoji code={item.country_code} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.customer_name}</p>
                <p className="text-xs text-gray-400 truncate">
                  <span className="text-brand-400">{item.car_model}</span>
                  <span className="mx-1.5 text-gray-600">·</span>
                  <span className="text-gray-500">Shipment confirmed</span>
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-brand-400">
                ${typeof item.amount === 'number' ? item.amount.toFixed(0) : item.amount}
              </p>
              <p className="text-xs text-gray-500">{item.minutes_ago}min ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
