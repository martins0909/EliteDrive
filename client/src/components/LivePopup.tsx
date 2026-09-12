import { useEffect, useState } from 'react';

interface PopupData {
  name: string;
  country: string;
  countryCode: string;
  carModel: string;
  fee: number;
}

const popupData: PopupData[] = [
  { name: 'James Wilson', country: 'United Kingdom', countryCode: 'GB', carModel: 'BYD Han EV 2025', fee: 399 },
  { name: 'Maria Santos', country: 'Philippines', countryCode: 'PH', carModel: 'BYD Seal 2025', fee: 399 },
  { name: 'Aisha Mohammed', country: 'Egypt', countryCode: 'EG', carModel: 'BYD Atto 3 2025', fee: 349 },
  { name: 'Chen Wei', country: 'Singapore', countryCode: 'SG', carModel: 'BYD Tang EV 2025', fee: 449 },
  { name: 'Robert Brown', country: 'United States', countryCode: 'US', carModel: 'BYD Seal 2025', fee: 399 },
  { name: 'Fatima Al-Zahra', country: 'UAE', countryCode: 'AE', carModel: 'BYD Han EV 2025', fee: 399 },
  { name: 'Diego Ramirez', country: 'Mexico', countryCode: 'MX', carModel: 'BYD Dolphin 2025', fee: 359 },
  { name: 'Sophie Martin', country: 'France', countryCode: 'FR', carModel: 'BYD Tang EV 2025', fee: 449 },
  { name: 'Kwame Asante', country: 'Ghana', countryCode: 'GH', carModel: 'BYD Han EV 2025', fee: 399 },
  { name: 'Lars Andersen', country: 'Denmark', countryCode: 'DK', carModel: 'BYD Seal 2025', fee: 399 },
  { name: 'Priya Sharma', country: 'India', countryCode: 'IN', carModel: 'BYD Atto 3 2025', fee: 349 },
  { name: 'Carlos Eduardo', country: 'Brazil', countryCode: 'BR', carModel: 'BYD Dolphin 2025', fee: 359 },
];

function FlagEmoji({ code }: { code: string }) {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0));
  return <span className="text-lg">{String.fromCodePoint(...codePoints)}</span>;
}

export default function LivePopup() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    showPopup();
    const interval = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % popupData.length;
        return next;
      });
      showPopup();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const data = popupData[current];

  return (
    <div
      className={`fixed top-20 left-4 z-40 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-32 opacity-0 pointer-events-none'
      }`}
    >
      <div className="glass-card p-4 max-w-xs shadow-2xl border-brand-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-ink-950" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div className="flex items-center gap-1.5">
            <FlagEmoji code={data.countryCode} />
            <span className="font-semibold text-sm text-white">{data.name}</span>
            <span className="text-xs text-gray-400">{data.country}</span>
          </div>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          just paid delivery fee for <span className="text-brand-400 font-semibold">{data.carModel}</span>
        </p>
        <p className="text-xs text-brand-400 font-semibold mt-1">
          Car confirmed &amp; dispatched! (${data.fee} fee paid)
        </p>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-semibold bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full">
            Official Event
          </span>
          <span className="text-[10px] font-semibold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
