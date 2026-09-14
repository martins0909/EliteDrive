import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Clock, Car, Search, XCircle, PackageCheck, Truck,
  Plus, Pencil, Trash2, Loader2, LogOut, Gift, Video, Upload, Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import type { Order, Payment, Vehicle, Video as VideoType } from '@/types';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'vehicles' | 'videos'>('orders');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  // Videos state
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchVehicles();
    fetchVideos();
  }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const [ordersRes, paymentsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/payments'),
      ]);
      setOrders(ordersRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      // ignore
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchVehicles = async () => {
    setVehiclesLoading(true);
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data);
    } catch (err) {
      // ignore
    } finally {
      setVehiclesLoading(false);
    }
  };

  const fetchVideos = async () => {
    setVideosLoading(true);
    try {
      const res = await api.get('/videos');
      setVideos(res.data);
    } catch (err) {
      // ignore
    } finally {
      setVideosLoading(false);
    }
  };

  const uploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;
    setUploadingVideo(true);
    try {
      const data = new FormData();
      data.append('video', videoFile);
      data.append('data', JSON.stringify({ title: videoTitle || videoFile.name }));
      await api.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVideoTitle('');
      setVideoFile(null);
      fetchVideos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.delete(`/videos/${id}`);
      fetchVideos();
    } catch (err) {
      alert('Failed to delete video');
    }
  };

  const confirmPayment = async (orderId: string, paymentId: string) => {
    try {
      await api.patch(`/payments/${paymentId}/confirm`);
      fetchOrders();
    } catch (err) {
      // ignore
    }
  };

  const markDelivered = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'delivered' });
      fetchOrders();
    } catch (err) {
      // ignore
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert('Failed to delete vehicle');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.firstName.toLowerCase().includes(search.toLowerCase()) ||
      o.surname.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.carModel.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    paid: orders.filter((o) => o.status === 'paid').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  const getOrderPayments = (orderId: string) => payments.filter((p) => p.orderId === orderId);

  return (
    <div className="min-h-screen bg-ink-950 pt-24 pb-20">
      <div className="section-padding">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage orders, vehicles, videos, and track deliveries.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <button
              onClick={() => { logout(); navigate('/admin'); }}
              className="btn-outline text-sm py-2 px-4 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['orders', 'vehicles', 'videos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-brand-500 text-ink-950'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Orders', value: stats.total, color: 'text-white', icon: Car },
                { label: 'Pending', value: stats.pending, color: 'text-gray-400', icon: Clock },
                { label: 'Paid', value: stats.paid, color: 'text-gold-400', icon: Clock },
                { label: 'Confirmed', value: stats.confirmed, color: 'text-brand-400', icon: CheckCircle2 },
                { label: 'Delivered', value: stats.delivered, color: 'text-accent-400', icon: PackageCheck },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-gray-500">{stat.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or car model..."
                  className="w-full glass pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'paid', 'confirmed', 'delivered'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      filter === f
                        ? 'bg-brand-500 text-ink-950'
                        : 'glass text-gray-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {ordersLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Car className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No orders found. Orders will appear here when customers submit the delivery form.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const orderPayments = getOrderPayments(order._id);
                  const hasPayment = orderPayments.length > 0;

                  return (
                    <div key={order._id} className="glass-card p-5">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              order.status === 'confirmed' ? 'bg-brand-500/20 text-brand-400' :
                              order.status === 'paid' ? 'bg-gold-500/20 text-gold-400' :
                              order.status === 'delivered' ? 'bg-accent-500/20 text-accent-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              #{order._id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">Customer</p>
                              <p className="text-white font-medium">{order.firstName} {order.surname}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Car Model</p>
                              <p className="text-brand-400 font-medium">{order.carModel}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Country</p>
                              <p className="text-white">{order.country}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-white truncate">{order.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-white">{order.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Delivery Fee</p>
                              <p className="text-gold-400 font-semibold">${order.deliveryFee}</p>
                            </div>
                            <div className="col-span-2 sm:col-span-3">
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="text-white">{order.address}, {order.city}, {order.zipCode}</p>
                            </div>
                          </div>

                          {order.idDocumentUrl && (
                            <div className="mt-3">
                              <a
                                href={order.idDocumentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent-400 hover:text-accent-500 underline"
                              >
                                View ID Document ({order.idType || 'document'})
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Payment Actions */}
                        <div className="lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-4">
                          {hasPayment ? (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-500 mb-1">Payments</p>
                              {orderPayments.map((pay) => (
                                <div key={pay._id} className="glass p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      {pay.paymentMethod === 'giftcard' ? <Gift className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                      {pay.paymentMethod.toUpperCase()} ${pay.amount}
                                    </span>
                                    <span className={`text-xs font-semibold ${
                                      pay.status === 'confirmed' ? 'text-brand-400' : 'text-gold-400'
                                    }`}>
                                      {pay.status.toUpperCase()}
                                    </span>
                                  </div>
                                  {pay.txid && (
                                    <p className="text-[10px] text-gray-500 font-mono truncate mb-2">
                                      TX: {pay.txid}
                                    </p>
                                  )}
                                  {pay.giftCardUrl && (
                                    <div className="mb-2">
                                      <img
                                        src={pay.giftCardUrl}
                                        alt="Gift card"
                                        className="w-full h-24 object-contain rounded-lg bg-ink-900 mb-1"
                                      />
                                      <a
                                        href={pay.giftCardUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-500"
                                      >
                                        <Download className="w-3 h-3" /> Download Gift Card
                                      </a>
                                    </div>
                                  )}
                                  {pay.status !== 'confirmed' && (
                                    <button
                                      onClick={() => confirmPayment(order._id, pay._id)}
                                      className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Payment
                                    </button>
                                  )}
                                  {pay.status === 'confirmed' && order.status !== 'delivered' && (
                                    <button
                                      onClick={() => markDelivered(order._id)}
                                      className="w-full btn-outline text-xs py-2 flex items-center justify-center gap-1"
                                    >
                                      <Truck className="w-3.5 h-3.5" /> Mark Delivered
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-4">
                              <XCircle className="w-6 h-6 text-gray-600 mb-2" />
                              <p className="text-xs text-gray-500">No payment yet</p>
                              <p className="text-xs text-gray-600">Waiting for customer to pay</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'vehicles' && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => { setEditingVehicle(null); setShowVehicleForm(true); }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Vehicle
              </button>
            </div>

            {showVehicleForm && (
              <VehicleForm
                vehicle={editingVehicle}
                onClose={() => { setShowVehicleForm(false); setEditingVehicle(null); }}
                onSuccess={() => { fetchVehicles(); setShowVehicleForm(false); setEditingVehicle(null); }}
              />
            )}

            {vehiclesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="glass-card overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-bold text-white">{vehicle.name} {vehicle.year}</h3>
                          <p className="text-sm text-gray-400">{vehicle.type}</p>
                        </div>
                        <p className="text-lg font-bold text-brand-400">${vehicle.deliveryFee}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{vehicle.description}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => { setEditingVehicle(vehicle); setShowVehicleForm(true); }}
                          className="flex-1 glass py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center justify-center gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deleteVehicle(vehicle.id)}
                          className="flex-1 glass py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'videos' && (
          <>
            <div className="glass-card p-6 mb-8 border-brand-500/20">
              <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" /> Upload Home Page Video
              </h2>
              <form onSubmit={uploadVideo} className="space-y-4">
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Video title"
                  className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none"
                />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-500 file:text-ink-950 hover:file:bg-brand-400"
                />
                <button
                  type="submit"
                  disabled={!videoFile || uploadingVideo}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                </button>
              </form>
            </div>

            {videosLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : videos.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No videos uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="glass-card overflow-hidden">
                    <video className="w-full aspect-video object-cover" controls src={video.url} />
                    <div className="p-4 flex items-center justify-between">
                      <h3 className="font-semibold text-white text-sm">{video.title}</h3>
                      <button
                        onClick={() => deleteVideo(video._id)}
                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function VehicleForm({ vehicle, onClose, onSuccess }: { vehicle: Vehicle | null; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    brand: vehicle?.brand || 'BYD',
    name: vehicle?.name || '',
    year: vehicle?.year || 2025,
    type: vehicle?.type || '',
    range: vehicle?.range || '',
    power: vehicle?.power || '',
    topSpeed: vehicle?.topSpeed || '',
    acceleration: vehicle?.acceleration || '',
    battery: vehicle?.battery || '',
    price: vehicle?.price || 'Free',
    tag: vehicle?.tag || '',
    description: vehicle?.description || '',
    image: vehicle?.image || '',
    deliveryFee: vehicle?.deliveryFee || 299,
    specs: vehicle?.specs?.length ? vehicle.specs : [
      { label: 'Range', value: '' },
      { label: 'Power', value: '' },
      { label: '0-100 km/h', value: '' },
      { label: 'Top Speed', value: '' },
      { label: 'Battery', value: '' },
      { label: 'Drive', value: '' },
    ],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(vehicle?.image || '');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'year' || name === 'deliveryFee' ? Number(value) : value });
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    if (!imageFile) {
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('data', JSON.stringify({
        ...formData,
        id: vehicle?.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
      }));
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (vehicle) {
        await api.put(`/vehicles/${vehicle.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/vehicles', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-8 border-brand-500/20">
      <h2 className="font-display text-xl font-bold text-white mb-6">
        {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full glass px-4 py-3 rounded-xl text-white focus:border-brand-400/50 focus:outline-none"
          >
            {['BYD', 'Tesla', 'RV'].map((b) => (
              <option key={b} value={b} className="bg-ink-900">{b}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Vehicle Name" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
          <input type="text" name="type" value={formData.type} onChange={handleChange} required placeholder="Type (e.g. Electric Sedan)" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="number" name="year" value={formData.year} onChange={handleChange} required placeholder="Year" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
          <input type="text" name="range" value={formData.range} onChange={handleChange} required placeholder="Range" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
          <input type="text" name="power" value={formData.power} onChange={handleChange} required placeholder="Power" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="text" name="topSpeed" value={formData.topSpeed} onChange={handleChange} required placeholder="Top Speed" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
          <input type="text" name="acceleration" value={formData.acceleration} onChange={handleChange} required placeholder="Acceleration" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
          <input type="text" name="battery" value={formData.battery} onChange={handleChange} required placeholder="Battery" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
          <input type="text" name="tag" value={formData.tag} onChange={handleChange} placeholder="Tag (optional)" className="glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
        </div>
        <input type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} required placeholder="Delivery Fee" className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none" />
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Description" className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none resize-none" />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Vehicle Image</label>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full max-w-xs rounded-xl mb-3 object-cover aspect-video" />
          )}
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleImageUrlChange}
            placeholder="Or paste an image URL (e.g. https://example.com/car.jpg)"
            className="w-full glass px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none mb-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-500 file:text-ink-950 hover:file:bg-brand-400"
          />
          <p className="text-xs text-gray-500 mt-2">
            Upload a file to store it on Cloudinary, or paste an image URL. If both are provided, the uploaded file will be used.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Specifications</label>
          <div className="space-y-2">
            {formData.specs.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                  placeholder="Label"
                  className="glass px-4 py-2 rounded-xl text-sm text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  placeholder="Value"
                  className="glass px-4 py-2 rounded-xl text-sm text-white placeholder-gray-500 focus:border-brand-400/50 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  );
}
