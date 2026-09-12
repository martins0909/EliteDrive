import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
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

const VehicleSchema = new Schema<IVehicle>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, required: true },
  range: { type: String, required: true },
  power: { type: String, required: true },
  topSpeed: { type: String, required: true },
  acceleration: { type: String, required: true },
  battery: { type: String, required: true },
  price: { type: String, default: 'Free' },
  tag: { type: String },
  image: { type: String, required: true },
  description: { type: String, required: true },
  deliveryFee: { type: Number, required: true },
  specs: [{ label: String, value: String }],
}, {
  timestamps: true,
});

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);
