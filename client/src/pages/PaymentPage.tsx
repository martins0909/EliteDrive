import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bitcoin, Copy, CheckCircle2, AlertCircle, Car, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const BTC_WALLET = 'bc1qelitedrive99motorgrants2025bydev';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, car, fee } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [showReviewMsg, setShowReviewMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txid, setTxid] = useState('');
  const [error, setError] = useState('');

  const copyWallet = () => {
    navigator.clipboard.writeText(BTC_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaid = async () => {
    setError('');
    setSubmitting(true);
    try {
      if (orderId) {
        await api.post('/payments', {
          orderId,
          amount: fee ?? 299,
          paymentMethod: 'bitcoin',
          walletAddress: BTC_WALLET,
          txid: txid || null,
        });
      }

      setShowContactSupport(true);
      setTimeout(() => {
        setShowContactSupport(false);
        setShowReviewMsg(true);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 pt-24 pb-20">
      <div className="section-padding max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <Bitcoin className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-400 font-semibold">Bitcoin Payment</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-gray-400">Pay the one-time delivery fee to claim your electric car.</p>
        </div>

        {error && (
          <div className="glass-card p-4 mb-6 border-red-500/30 bg-red-500/10">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-brand-400" /> Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vehicle</span>
              <span className="text-white font-medium">{car || 'BYD Electric Car'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vehicle Price</span>
              <span className="text-brand-400 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Delivery Fee</span>
              <span className="text-white font-medium">${fee ?? 299}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping & Customs</span>
              <span className="text-brand-400">Included</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between">
              <span className="font-bold text-white">Total Due</span>
              <span className="font-bold text-gold-400 text-lg">${fee ?? 299}</span>
            </div>
          </div>
        </div>

        {/* Bitcoin Payment */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pay with Bitcoin</h3>
              <p className="text-xs text-gray-400">Send the exact amount to the wallet below</p>
            </div>
          </div>

          <div className="glass p-4 rounded-xl mb-4">
            <p className="text-xs text-gray-400 mb-1">Amount to pay</p>
            <p className="text-2xl font-bold text-gold-400">${fee ?? 299}</p>
            <p className="text-xs text-gray-500 mt-1">≈ {((fee ?? 299) / 65000).toFixed(6)} BTC</p>
          </div>

          <div className="glass p-4 rounded-xl mb-4">
            <p className="text-xs text-gray-400 mb-1">Bitcoin wallet address</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-brand-400 break-all flex-1 font-mono">{BTC_WALLET}</code>
              <button
                onClick={copyWallet}
                className="shrink-0 glass px-3 py-2 rounded-lg hover:bg-brand-500/20 transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction ID (optional, for faster confirmation)
            </label>
            <input
              type="text"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none"
              placeholder="Paste your Bitcoin transaction hash"
            />
          </div>

          <div className="glass p-3 rounded-xl mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400">
              After sending the payment, click "I've Paid" below. Our admin team will confirm your
              payment and process your delivery. You can also contact support for assistance.
            </p>
          </div>

          <button
            onClick={handlePaid}
            disabled={submitting}
            className="w-full btn-primary text-base py-4 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "I've Paid — Confirm Payment"}
          </button>
        </div>

        {/* Contact Support Popup */}
        {showContactSupport && (
          <div className="glass-card p-6 text-center border-gold-400/30 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7 text-gold-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-1">Contact Support</h3>
            <p className="text-sm text-gray-400">
              Our team is reviewing your payment. Please contact support to confirm your delivery.
            </p>
          </div>
        )}

        {/* Review Message */}
        {showReviewMsg && (
          <div className="glass-card p-6 text-center border-brand-400/30 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-brand-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-1">Your order will be reviewed</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your payment is being processed. You can view your receipt and track your order status.
            </p>
            <button
              onClick={() => navigate('/checkout', { state: { orderId, car, fee } })}
              className="btn-outline"
            >
              View Receipt / Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
