import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, ChevronDown, CheckCircle2, Car, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import type { Vehicle } from '@/types';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria',
  'Poland', 'Portugal', 'Ireland', 'Greece', 'Czech Republic', 'Romania', 'Bulgaria', 'Hungary',
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Algeria', 'Tunisia',
  'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon',
  'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Philippines', 'Indonesia',
  'Malaysia', 'Singapore', 'Thailand', 'Vietnam', 'Japan', 'South Korea', 'China',
  'Brazil', 'Argentina', 'Mexico', 'Colombia', 'Chile', 'Peru', 'Ecuador', 'Venezuela',
  'Turkey', 'Russia', 'Ukraine', 'Kazakhstan', 'Uzbekistan', 'Azerbaijan', 'Georgia',
  'New Zealand', 'Fiji', 'Jamaica', 'Trinidad & Tobago', 'Barbados', 'Bahamas',
  'Iceland', 'Luxembourg', 'Malta', 'Cyprus', 'Croatia', 'Slovenia', 'Slovakia',
  'Estonia', 'Latvia', 'Lithuania', 'Serbia', 'Bosnia & Herzegovina', 'Albania',
  'Montenegro', 'North Macedonia', 'Moldova', 'Belarus',
];

const idTypes = [
  { value: 'government_id', label: 'Government ID' },
  { value: 'driving_license', label: 'Driving Licence' },
  { value: 'passport', label: 'Passport' },
  { value: 'other', label: 'Other' },
];

export default function DeliveryForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedCar = location.state?.car as string | undefined;

  const [formData, setFormData] = useState({
    carModel: preselectedCar || '',
    firstName: '',
    surname: '',
    country: '',
    zipCode: '',
    city: '',
    address: '',
    phone: '',
    dob: '',
    email: '',
    idType: 'government_id' as string,
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [modelDropdown, setModelDropdown] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [carModels, setCarModels] = useState<string[]>([]);

  useEffect(() => {
    api.get('/vehicles').then((res) => {
      setVehicles(res.data);
      setCarModels(res.data.map((v: Vehicle) => `${v.name} ${v.year} - ${v.type}`));
    }).catch(() => {
      // ignore
    });
  }, []);

  const selectedVehicle = vehicles.find(
    (v) => `${v.name} ${v.year} - ${v.type}` === formData.carModel
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idFile) {
      setError('Please upload your Government ID or identity document before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('carModel', formData.carModel);
      data.append('firstName', formData.firstName);
      data.append('surname', formData.surname);
      data.append('country', formData.country);
      data.append('zipCode', formData.zipCode);
      data.append('city', formData.city);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('dob', formData.dob);
      data.append('email', formData.email);
      data.append('idType', formData.idType);
      data.append('deliveryFee', String(selectedVehicle?.deliveryFee ?? 299));
      if (idFile) {
        setUploading(true);
        data.append('idDocument', idFile);
      }

      const res = await api.post('/orders', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/payment', {
          state: {
            orderId: res.data.id,
            car: formData.carModel,
            fee: selectedVehicle?.deliveryFee ?? 299,
          },
        });
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 pt-24 pb-20">
      <div className="section-padding max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-400 font-semibold">You have been selected!</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Fill in your delivery details
          </h1>
          <p className="text-gray-400">
            Complete the form below to claim your brand new electric car.
          </p>
        </div>

        {showSuccess && (
          <div className="glass-card p-6 mb-6 text-center border-brand-400/30 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-brand-400 mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-white mb-1">Your information has been received!</h3>
            <p className="text-sm text-gray-400">Redirecting you to the payment page...</p>
          </div>
        )}

        {error && (
          <div className="glass-card p-4 mb-6 border-red-500/30 bg-red-500/10">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
          {/* Car Model Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose your car model
            </label>
            <button
              type="button"
              onClick={() => setModelDropdown(!modelDropdown)}
              className="w-full flex items-center justify-between glass px-4 py-3 rounded-xl text-white hover:border-brand-400/30 transition-colors"
            >
              <span className={formData.carModel ? 'text-white' : 'text-gray-500'}>
                {formData.carModel || 'Select a car model'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${modelDropdown ? 'rotate-180' : ''}`} />
            </button>
            {modelDropdown && (
              <div className="absolute z-20 mt-2 w-full glass-card overflow-hidden max-h-64 overflow-y-auto">
                {carModels.map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, carModel: model });
                      setModelDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-brand-500/10 hover:text-brand-400 transition-colors border-b border-white/5 last:border-0"
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Surname</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full glass px-4 py-3 rounded-xl text-white focus:border-brand-400/50 focus:outline-none transition-colors"
              >
                <option value="" className="bg-ink-900">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c} className="bg-ink-900">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors"
                placeholder="10001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors"
              placeholder="New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors resize-none"
              placeholder="123 Main Street, Apartment 4B"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none transition-colors"
              placeholder="john.doe@email.com"
            />
          </div>

          {/* ID Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Submit Government ID, Driving Licence, Passport or Others
            </label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className="w-full glass px-4 py-3 rounded-xl text-white mb-3 focus:border-brand-400/50 focus:outline-none transition-colors"
            >
              {idTypes.map((t) => (
                <option key={t.value} value={t.value} className="bg-ink-900">{t.label}</option>
              ))}
            </select>
            <label className="flex flex-col items-center justify-center w-full glass border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-brand-400/40 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-400">
                {idFile ? idFile.name : 'Click to upload your document'}
              </span>
              <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</span>
              <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>

          {selectedVehicle && (
            <div className="glass px-4 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-400" />
                <span className="text-sm text-gray-300">Delivery fee for {selectedVehicle.name}</span>
              </div>
              <span className="font-bold text-brand-400">${selectedVehicle.deliveryFee}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading || !idFile}
            className="w-full btn-primary text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : uploading ? 'Uploading document...' : 'Submit / Order Now'}
          </button>
          {!idFile && (
            <p className="text-xs text-center text-red-400 mt-2">
              Government ID upload is required to submit your order.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
