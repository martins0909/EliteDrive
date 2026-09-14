import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Car,
  BadgeCheck,
  Heart,
  MessageCircle,
  Repeat2,
  ChevronDown,
  MapPin,
  CreditCard,
  PackageCheck,
  Truck,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Clock,
  Users,
  Zap,
  Battery,
  Gauge,
  Loader2,
} from 'lucide-react';
import DeliveryFeed from '@/components/DeliveryFeed';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import api from '@/lib/api';
import type { Vehicle, Video } from '@/types';
import michaelR from '@/assets/Michael R.jpg';
import priyaS from '@/assets/Priya S.jpg';
import jamesO from '@/assets/James O.jpg';
import sofiaL from '@/assets/Sofia L.jpg';
import wangChuanfu from '@/assets/Wang Chuanfu 1.jpg';

const youtubeVideos = [
  'https://youtube.com/shorts/8FrVADUwlwc?si=GefxwBtD7RM-6_KH',
  'https://youtube.com/shorts/-mwZ7JXOtMc?si=7OJOyUvj51VekUlQ',
  'https://youtube.com/shorts/3PFJqZ8QXho?si=MrrcMsUd8Y-ChcZT',
];

const commentsData = [
  { name: 'Mj Mike Johnson', time: '2 days ago', pinned: true, text: 'just received my BYD Seal 2024!! I paid the delivery fee and within 9 days the car was at my door. This is real!', likes: '56.2k', avatar: 'M' },
  { name: 'Sarah Williams', time: '1 day ago', pinned: false, text: 'I was skeptical at first but my BYD Han EV arrived yesterday. Absolutely incredible experience!', likes: '42.1k', avatar: 'S' },
  { name: 'David Chen', time: '5 hours ago', text: 'The process was so simple. Filled the form, paid delivery, got my car in 10 days. Thank you EliteDrive!', likes: '38.5k', avatar: 'D' },
  { name: 'Aisha Patel', time: '3 hours ago', pinned: false, text: 'Just got my BYD Atto 3! The delivery was smooth and the car is amazing. Highly recommend!', likes: '29.3k', avatar: 'A' },
  { name: 'Tom Anderson', time: '1 hour ago', pinned: false, text: 'My BYD Dolphin arrived today. I cannot believe this is real. Best day of my life!', likes: '24.7k', avatar: 'T' },
  { name: 'Leila Hassan', time: '45 min ago', pinned: false, text: 'Received my BYD Tang EV in Dubai. The car is absolutely stunning. Thank you EliteDrive!', likes: '18.2k', avatar: 'L' },
  { name: 'Carlos Gomez', time: '20 min ago', pinned: false, text: 'Just filled my form and paid. Can\'t wait for my BYD Seal to arrive!', likes: '12.4k', avatar: 'C' },
  { name: 'Emma Brown', time: '8 min ago', pinned: false, text: 'My brother got his car last week and now I\'m claiming mine. This is legit!', likes: '8.9k', avatar: 'E' },
  { name: 'Yuki Tanaka', time: '3 min ago', pinned: false, text: 'BYD Dolphin delivered to Tokyo! The whole process was professional and fast.', likes: '5.1k', avatar: 'Y' },
  { name: 'Olivia Martinez', time: 'just now', pinned: false, text: 'Just submitted my form for the BYD Han EV. So excited to get my new car!', likes: '2.3k', avatar: 'O' },
];

const testimonials = [
  { name: 'Michael R.', country: '🇺🇸 United States', text: 'I received my BYD Seal in just 8 days. The whole process was transparent and professional.', car: 'BYD Seal 2025', image: michaelR },
  { name: 'Priya S.', country: '🇮🇳 India', text: 'Never thought I would own an electric car. EliteDrive made it possible. Thank you!', car: 'BYD Atto 3 2025', image: priyaS },
  { name: 'James O.', country: '🇬🇧 United Kingdom', text: 'The delivery fee was all I paid. My BYD Han EV arrived in 10 days. Incredible!', car: 'BYD Han EV 2025', image: jamesO },
  { name: 'Sofia L.', country: '🇧🇷 Brazil', text: 'Got my BYD Dolphin last week. The car is beautiful and drives perfectly. Best gift ever!', car: 'BYD Dolphin 2025', image: sofiaL },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [liveCount, setLiveCount] = useState(1000);
  const [visibleComments, setVisibleComments] = useState(3);
  const [countdown, setCountdown] = useState({ days: 4, hours: 12, mins: 42, secs: 44 });
  const [showAllModels, setShowAllModels] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    api.get('/vehicles')
      .then((res) => setVehicles(res.data))
      .catch(() => {})
      .finally(() => setVehiclesLoading(false));

    api.get('/videos')
      .then((res) => setVideos(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 7) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 4; hours = 12; mins = 42; secs = 44; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleComments((prev) => {
        if (prev >= commentsData.length) return prev;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayedVehicles = showAllModels ? vehicles : vehicles.slice(0, 4);

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 via-ink-950 to-ink-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px]" />

        <div className="section-padding relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Worldwide Electric Vehicle Grant Program</span>
            </div>

            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500/20 to-brand-500/20 border border-gold-500/30 text-gold-400 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">
                🎉 Congratulations
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Win a Brand New{' '}
              <span className="gradient-text">BYD, Tesla, RV Electric Car</span>
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              {['BYD', 'Tesla', 'RV'].map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1.5 glass px-4 py-1.5 rounded-full"
                >
                  <span className="text-lg font-bold text-white">{brand}</span>
                  <BadgeCheck className="w-4 h-4 text-brand-400" />
                </span>
              ))}
            </div>

            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              The world's #1 electric vehicle manufacturer, is giving away brand new electric cars
              to participants worldwide. Claim your car today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/claim" className="btn-primary text-base px-8 py-4 animate-pulse-glow text-center">
                Claim Your Free Car
              </Link>
              <Link to="/models" className="btn-outline text-base px-8 py-4 text-center">
                View All Models
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-400" />
                <span>{(72345 + liveCount).toLocaleString()} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-400" />
                <span>{vehicles.length} models available</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-400" />
                <span>Ships worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="section-padding py-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Choose Your Preferred BYD Electric Car
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All models are brand new, 2024–2025 editions delivered straight to your door.
          </p>
        </div>

        {vehiclesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onClaim={() => navigate('/claim', { state: { car: `${vehicle.name} ${vehicle.year} - ${vehicle.type}` } })}
                />
              ))}
            </div>

            {!showAllModels && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllModels(true)}
                  className="btn-outline"
                >
                  View All Models
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* How to Claim Section */}
      <section className="section-padding py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-white mb-3">How to Claim Your Car</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Follow these simple steps to receive your brand new electric car giveaway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', icon: MapPin, title: 'Enter Your Delivery Address', text: 'Enter your delivery address and contact information so EliteDrive can ship your car directly to you.' },
            { num: '02', icon: Car, title: 'Choose Your Car', text: 'Select your preferred model from our range of brand new BYD electric vehicles.' },
            { num: '03', icon: CreditCard, title: 'Pay Delivery Fee', text: 'Pay the one-time delivery fee to cover shipping and logistics. This is the only fee required.' },
            { num: '04', icon: PackageCheck, title: 'Receive Your Vehicle', text: 'Your brand new electric car will be delivered to your door within 7–14 business days. Enjoy!' },
          ].map((step) => (
            <div key={step.num} className="glass-card p-6 hover:border-brand-400/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                  <step.icon className="w-5 h-5 text-brand-400" />
                </div>
                <span className="font-display text-2xl font-bold text-white/10">{step.num}</span>
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/claim"
            className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2"
          >
            <Car className="w-5 h-5" />
            Start Claiming Your Car Now
          </Link>
        </div>
      </section>

      {/* Banner: Choose Your Electric Car */}
      <section className="section-padding py-12">
        <div className="glass-card overflow-hidden">
          <div className="p-8 text-center bg-gradient-to-r from-brand-900/30 via-ink-900 to-accent-500/10">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Choose Your Electric Car</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              EliteDrive MotorGrants is gifting brand new electric vehicles to participants worldwide.
            </p>

            {/* Countdown */}
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

          {/* Banner Cars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/10">
            {vehicles.slice(0, 4).map((car) => (
              <BannerCarCard
                key={car.id}
                car={car}
                onClaim={() => navigate('/payment', { state: { car: `${car.name} ${car.year} - ${car.type}`, fee: car.deliveryFee } })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Shorts Section */}
      <section className="section-padding py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">Watch the BYD, TESLA, RV Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {youtubeVideos.map((url, idx) => (
            <YouTubeEmbed key={idx} url={url} title={`BYD Short ${idx + 1}`} />
          ))}
        </div>
      </section>

      {/* Uploaded Videos Section */}
      <section className="section-padding py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-6">More BYD, Tesla & RV Videos</h2>
        {videos.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400">More videos coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="glass-card overflow-hidden">
                <div className="relative aspect-video bg-ink-900">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    poster={video.thumbnail}
                  >
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CEO Post Section */}
      <section className="section-padding py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-6">Message from Our CEO</h2>
        <div className="glass-card p-6 max-w-3xl mx-auto">
          <div className="flex gap-3 mb-4">
            <img
              src={wangChuanfu}
              alt="CEO Wang Chuanfu"
              className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/50 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white">Chuanfu Wang</span>
                <BadgeCheck className="w-4 h-4 text-brand-400" />
                <span className="text-xs text-gray-500">CEO, BYD Company</span>
              </div>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-4">
            "We are thrilled to partner with EliteDrive MotorGrants to bring brand new electric
            vehicles to participants around the world. This is our commitment to a greener future
            and making electric mobility accessible to everyone. Claim your car today and join the
            electric revolution!"
          </p>

          <img
            src={wangChuanfu}
            alt="CEO Wang Chuanfu"
            className="w-full rounded-xl mb-4"
          />

          <div className="flex items-center gap-6 text-sm text-gray-400 pt-4 border-t border-white/5">
            <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" /> 14k
            </button>
            <button className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
              <MessageCircle className="w-4 h-4" /> 3.2k
            </button>
            <button className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
              <Repeat2 className="w-4 h-4" /> Reshare
            </button>
          </div>
        </div>
      </section>

      {/* What Winners Are Saying */}
      <section className="section-padding py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-2">What Winners Are Saying</h2>
        <p className="text-gray-400 mb-8">Real stories from real winners who received their electric cars.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card p-6 hover:border-brand-400/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-500/30"
                />
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">"{t.text}"</p>
              <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-1 rounded-full">{t.car}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Follow Official Social Media */}
      <section className="section-padding py-12">
        <div className="glass-card p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="font-display text-2xl font-bold text-white">Follow EliteDrive MotorGrants Auto</h2>
            <BadgeCheck className="w-5 h-5 text-brand-400" />
          </div>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Official social media account of EliteDrive MotorGrants Auto worldwide.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { Icon: Twitter, name: 'X (Twitter)', handle: '@EliteDriveMG', color: 'hover:bg-gray-700', href: '#' },
              { Icon: Facebook, name: 'Facebook', handle: 'EliteDriveMG', color: 'hover:bg-blue-600', href: '#' },
              { Icon: Instagram, name: 'Instagram', handle: '@bestautomotorhome', color: 'hover:bg-pink-600', href: 'https://www.instagram.com/bestautomotorhome?stkn=a29qMm80MTlxcWFx' },
              { Icon: Youtube, name: 'YouTube', handle: 'EliteDriveMG', color: 'hover:bg-red-600', href: '#' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.href !== '#' ? '_blank' : undefined}
                rel={social.href !== '#' ? 'noopener noreferrer' : undefined}
                onClick={social.href === '#' ? (e) => e.preventDefault() : undefined}
                className={`glass-card p-5 flex flex-col items-center gap-2 transition-all hover:scale-105 ${social.color} hover:border-white/20`}
              >
                <social.Icon className="w-8 h-8 text-white" />
                <span className="text-sm font-semibold text-white">{social.name}</span>
                <span className="text-xs text-gray-400">{social.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Feed */}
      <section className="section-padding py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-6">Live Delivery Feed</h2>
        <DeliveryFeed />
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
        <button
          onClick={onClaim}
          className="w-full btn-primary text-sm py-2.5"
        >
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
        Claim This Electric Car
      </button>
    </div>
  );
}
