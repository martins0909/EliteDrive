import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
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
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  carModel: { type: String, required: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  idType: { type: String, required: true },
  idDocumentUrl: { type: String },
  deliveryFee: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'confirmed', 'delivered'], default: 'pending' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

export default mongoose.model<IOrder>('Order', OrderSchema);
