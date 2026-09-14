import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900 mt-20">
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Car className="w-5 h-5 text-ink-950" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-sm block leading-none">
                  EliteDrive
                </span>
                <span className="text-[10px] text-brand-400 font-medium">MotorGrants</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The world's #1 electric vehicle grant program. Giving away brand new BYD electric
              cars to participants worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Models', to: '/models' },
                { label: 'Claim Your Car', to: '/claim' },
                { label: 'Sign In', to: '/signin' },
                { label: 'Sign Up', to: '/signup' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Vehicles</h4>
            <ul className="space-y-2">
              {['BYD Seal 2025', 'BYD Han EV 2025', 'BYD Dolphin 2025', 'BYD Atto 3 2025', 'BYD Tang EV 2025'].map(
                (car) => (
                  <li key={car}>
                    <Link
                      to="/models"
                      className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                    >
                      {car}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: 'Facebook', href: '#' },
                { Icon: Twitter, label: 'Twitter', href: '#' },
                { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/bestautomotorhome?stkn=a29qMm80MTlxcWFx' },
                { Icon: Youtube, label: 'YouTube', href: '#' },
                { Icon: Linkedin, label: 'LinkedIn', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  onClick={href === '#' ? (e) => e.preventDefault() : undefined}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-brand-500/20 hover:border-brand-400/50 transition-all"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2025 EliteDrive MotorGrants. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Delivering electric vehicles worldwide · 7-14 business days
          </p>
        </div>
      </div>
    </footer>
  );
}
