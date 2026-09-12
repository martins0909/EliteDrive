export interface Vehicle {
  _id?: string;
  id: string;
  name: string;
  year: number;
  type: string;
  range: string;
  power: string;
  topSpeed: string;
  acceleration: string;
  battery: string;
  price: string;
  tag?: string;
  image: string;
  description: string;
  deliveryFee: number;
  specs: { label: string; value: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Order {
  _id: string;
  carModel: string;
  firstName: string;
  surname: string;
  country: string;
  zipCode: string;
  city: string;
  address: string;
  phone: string;
  dob: string;
  email: string;
  idType: string;
  idDocumentUrl?: string;
  deliveryFee: number;
  status: 'pending' | 'paid' | 'confirmed' | 'delivered';
  createdAt: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  walletAddress: string;
  txid?: string;
  status: 'pending' | 'confirmed';
  createdAt: string;
}
