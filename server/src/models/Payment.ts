import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  walletAddress: string;
  txid?: string;
  giftCardUrl?: string;
  status: 'pending' | 'confirmed';
}

const PaymentSchema = new Schema<IPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'bitcoin' },
  walletAddress: { type: String, required: true },
  txid: { type: String },
  giftCardUrl: { type: String },
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
}, {
  timestamps: true,
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
