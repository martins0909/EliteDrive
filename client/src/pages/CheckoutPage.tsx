import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Car, CheckCircle2, Clock, MapPin, CreditCard, Package } from 'lucide-react';
import api from '@/lib/api';
import type { Order } from '@/types';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, car, fee } = location.state || {};

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        // For now, we don't have a public order fetch endpoint; use passed data
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const carName = order?.carModel || car || 'BYD Electric Car';
  const deliveryFee = order?.deliveryFee ?? fee ?? 299;
  const customerName = order ? `${order.firstName} ${order.surname}` : 'Customer';
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const orderIdShort = (orderId || 'XXXX-XXXX').toString().slice(0, 8).toUpperCase();

  const downloadReceipt = () => {
    const receiptContent = `
============================================
   EliteDrive MotorGrants — Order Receipt
============================================

Order ID: #${orderIdShort}
Date: ${orderDate}
Status: ${order?.status?.toUpperCase() || 'PENDING'}

--- Customer Details ---
Name: ${customerName}
Country: ${order?.country || 'N/A'}
City: ${order?.city || 'N/A'}
Address: ${order?.address || 'N/A'}
ZIP: ${order?.zipCode || 'N/A'}
Phone: ${order?.phone || 'N/A'}
Email: ${order?.email || 'N/A'}

--- Vehicle ---
Model: ${carName}

--- Payment Summary ---
Vehicle Price: FREE
Delivery Fee: $${deliveryFee}
Shipping & Customs: Included
TOTAL: $${deliveryFee}

--- Delivery ---
Estimated Delivery: 7-14 business days
Shipping: Worldwide

Thank you for participating in the EliteDrive
MotorGrants electric vehicle giveaway!

For support, contact our team.
============================================
`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EliteDrive-Receipt-${orderIdShort}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 pt-24 pb-20">
      <div className="section-padding max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-400 font-semibold">Order Receipt</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Checkout Summary</h1>
          <p className="text-gray-400">Your order has been placed successfully.</p>
        </div>

        {/* Status Banner */}
        <div className={`glass-card p-4 mb-6 flex items-center gap-3 ${
          order?.status === 'confirmed' ? 'border-brand-400/30' : 'border-gold-400/30'
        }`}>
          {order?.status === 'confirmed' ? (
            <CheckCircle2 className="w-6 h-6 text-brand-400" />
          ) : (
            <Clock className="w-6 h-6 text-gold-400" />
          )}
          <div>
            <p className="font-semibold text-white">
              {order?.status === 'confirmed' ? 'Payment Confirmed!' : 'Payment Under Review'}
            </p>
            <p className="text-sm text-gray-400">
              {order?.status === 'confirmed'
                ? 'Your car is being prepared for dispatch.'
                : 'Your payment is being reviewed by our admin team.'}
            </p>
          </div>
        </div>

        {/* Receipt */}
        <div className="glass-card p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Car className="w-5 h-5 text-ink-950" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-sm block leading-none">EliteDrive</span>
                <span className="text-[10px] text-brand-400">MotorGrants</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-mono text-sm text-brand-400">#{orderIdShort}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer</h3>
              <p className="text-white font-medium">{customerName}</p>
              {order?.city && <p className="text-sm text-gray-400">{order.city}, {order.zipCode}</p>}
              {order?.address && <p className="text-sm text-gray-400">{order.address}</p>}
              {order?.country && <p className="text-sm text-gray-400">{order.country}</p>}
              {order?.phone && <p className="text-sm text-gray-400">{order.phone}</p>}
              {order?.email && <p className="text-sm text-gray-400">{order.email}</p>}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vehicle</h3>
              <p className="text-white font-medium">{carName}</p>
              <p className="text-sm text-brand-400">Brand New — 2025 Edition</p>
              <p className="text-sm text-gray-400 mt-2">Delivery: 7-14 business days</p>
              <p className="text-sm text-gray-400">Shipping: Worldwide</p>
            </div>
          </div>

          <div className="space-y-2 pt-6 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vehicle Price</span>
              <span className="text-brand-400 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Delivery Fee</span>
              <span className="text-white">${deliveryFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping & Customs</span>
              <span className="text-brand-400">Included</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/10">
              <span className="font-bold text-white">Total Paid</span>
              <span className="font-bold text-gold-400 text-lg">${deliveryFee}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Ships worldwide</span>
            <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Bitcoin payment</span>
            <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> 7-14 days delivery</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={downloadReceipt}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Download Receipt
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-outline flex-1"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
