import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import Vehicle from './models/Vehicle.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bydVehicles = [
  {
    id: 'seal',
    brand: 'BYD',
    name: 'BYD Seal',
    year: 2025,
    type: 'Electric Sedan',
    range: '530 km',
    power: '523 hp',
    topSpeed: '180 km/h',
    acceleration: '3.8s (0-100)',
    battery: '82.5 kWh',
    price: 'Free',
    tag: 'Most Popular',
    image: 'https://images.pexels.com/photos/35733269/pexels-photo-35733269.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'The BYD Seal is a premium electric sedan combining sports car performance with everyday practicality. Featuring blade battery technology and an ultra-fast charging system.',
    deliveryFee: 299,
    specs: [
      { label: 'Range', value: '530 km' },
      { label: 'Power', value: '523 hp' },
      { label: '0-100 km/h', value: '3.8s' },
      { label: 'Top Speed', value: '180 km/h' },
      { label: 'Battery', value: '82.5 kWh' },
      { label: 'Drive', value: 'AWD Dual Motor' },
    ],
  },
  {
    id: 'han',
    brand: 'BYD',
    name: 'BYD Han EV',
    year: 2025,
    type: 'Electric Sedan',
    range: '605 km',
    power: '517 hp',
    topSpeed: '200 km/h',
    acceleration: '3.9s (0-100)',
    battery: '85.4 kWh',
    price: 'Free',
    tag: 'New Arrival',
    image: 'https://images.pexels.com/photos/29802105/pexels-photo-29802105.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'The flagship BYD Han EV redefines luxury electric mobility with its elegant design, cutting-edge technology, and impressive range that rivals any competitor.',
    deliveryFee: 399,
    specs: [
      { label: 'Range', value: '605 km' },
      { label: 'Power', value: '517 hp' },
      { label: '0-100 km/h', value: '3.9s' },
      { label: 'Top Speed', value: '200 km/h' },
      { label: 'Battery', value: '85.4 kWh' },
      { label: 'Drive', value: 'AWD Dual Motor' },
    ],
  },
  {
    id: 'dolphin',
    brand: 'BYD',
    name: 'BYD Dolphin',
    year: 2025,
    type: 'Electric Hatchback',
    range: '410 km',
    power: '204 hp',
    topSpeed: '160 km/h',
    acceleration: '7.0s (0-100)',
    battery: '60.4 kWh',
    price: 'Free',
    image: 'https://images.pexels.com/photos/10029873/pexels-photo-10029873.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'The BYD Dolphin is a compact electric hatchback perfect for city driving. Efficient, stylish, and packed with smart technology for the modern urban lifestyle.',
    deliveryFee: 359,
    specs: [
      { label: 'Range', value: '410 km' },
      { label: 'Power', value: '204 hp' },
      { label: '0-100 km/h', value: '7.0s' },
      { label: 'Top Speed', value: '160 km/h' },
      { label: 'Battery', value: '60.4 kWh' },
      { label: 'Drive', value: 'FWD' },
    ],
  },
  {
    id: 'atto3',
    brand: 'BYD',
    name: 'BYD Atto 3',
    year: 2025,
    type: 'Electric SUV',
    range: '480 km',
    power: '201 hp',
    topSpeed: '175 km/h',
    acceleration: '7.3s (0-100)',
    battery: '60.5 kWh',
    price: 'Free',
    image: 'https://images.pexels.com/photos/17792327/pexels-photo-17792327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'The BYD Atto 3 is a versatile electric SUV offering the perfect balance of space, comfort, and efficiency. Ideal for families and adventure seekers alike.',
    deliveryFee: 349,
    specs: [
      { label: 'Range', value: '480 km' },
      { label: 'Power', value: '201 hp' },
      { label: '0-100 km/h', value: '7.3s' },
      { label: 'Top Speed', value: '175 km/h' },
      { label: 'Battery', value: '60.5 kWh' },
      { label: 'Drive', value: 'FWD' },
    ],
  },
  {
    id: 'tang',
    brand: 'BYD',
    name: 'BYD Tang EV',
    year: 2025,
    type: 'Electric SUV',
    range: '570 km',
    power: '517 hp',
    topSpeed: '180 km/h',
    acceleration: '4.6s (0-100)',
    battery: '90.3 kWh',
    price: 'Free',
    tag: 'Premium',
    image: 'https://images.pexels.com/photos/33027402/pexels-photo-33027402.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'The BYD Tang EV is a 7-seater premium electric SUV with dual-motor AWD, delivering exceptional performance and luxury for the whole family.',
    deliveryFee: 449,
    specs: [
      { label: 'Range', value: '570 km' },
      { label: 'Power', value: '517 hp' },
      { label: '0-100 km/h', value: '4.6s' },
      { label: 'Top Speed', value: '180 km/h' },
      { label: 'Battery', value: '90.3 kWh' },
      { label: 'Drive', value: 'AWD Dual Motor' },
    ],
  },
];

const teslaVehicles = [
  {
    id: 'tesla-model-s-plaid',
    brand: 'Tesla',
    name: 'Tesla Model S Plaid',
    year: 2025,
    type: 'Electric Sedan',
    range: '600 km',
    power: '1020 hp',
    topSpeed: '322 km/h',
    acceleration: '1.99s (0-100)',
    battery: '100 kWh',
    price: 'Free',
    tag: 'Fastest',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    description: 'The Tesla Model S Plaid delivers mind-bending acceleration, premium luxury, and industry-leading range in a sleek electric sedan.',
    deliveryFee: 499,
    specs: [
      { label: 'Range', value: '600 km' },
      { label: 'Power', value: '1020 hp' },
      { label: '0-100 km/h', value: '1.99s' },
      { label: 'Top Speed', value: '322 km/h' },
      { label: 'Battery', value: '100 kWh' },
      { label: 'Drive', value: 'AWD Tri Motor' },
    ],
    localImage: 'Tesla model S plaid.jpg',
  },
  {
    id: 'tesla-model-s-stealth',
    brand: 'Tesla',
    name: 'Tesla Model S Plaid Stealth Gray',
    year: 2024,
    type: 'Electric Sedan',
    range: '590 km',
    power: '1020 hp',
    topSpeed: '322 km/h',
    acceleration: '1.99s (0-100)',
    battery: '100 kWh',
    price: 'Free',
    tag: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    description: 'The 2024 Tesla Model S Plaid in Stealth Gray combines stunning aesthetics with record-breaking performance and cutting-edge technology.',
    deliveryFee: 499,
    specs: [
      { label: 'Range', value: '590 km' },
      { label: 'Power', value: '1020 hp' },
      { label: '0-100 km/h', value: '1.99s' },
      { label: 'Top Speed', value: '322 km/h' },
      { label: 'Battery', value: '100 kWh' },
      { label: 'Drive', value: 'AWD Tri Motor' },
    ],
    localImage: 'This 2024 Tesla Model S Plaid in Stealth Gray.jpg',
  },
  {
    id: 'tesla-model-3-ultra-red',
    brand: 'Tesla',
    name: 'Tesla Model 3 Ultra Red',
    year: 2025,
    type: 'Electric Sedan',
    range: '520 km',
    power: '510 hp',
    topSpeed: '262 km/h',
    acceleration: '3.1s (0-100)',
    battery: '82 kWh',
    price: 'Free',
    tag: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
    description: 'The Tesla Model 3 in Ultra Red offers exceptional efficiency, sporty handling, and a refined minimalist interior with advanced autopilot features.',
    deliveryFee: 399,
    specs: [
      { label: 'Range', value: '520 km' },
      { label: 'Power', value: '510 hp' },
      { label: '0-100 km/h', value: '3.1s' },
      { label: 'Top Speed', value: '262 km/h' },
      { label: 'Battery', value: '82 kWh' },
      { label: 'Drive', value: 'AWD Dual Motor' },
    ],
    localImage: 'Ultra Red color on the Tesla Model 3.jpg',
  },
];

const rvVehicles = [
  {
    id: 'winnebago-vista-31',
    brand: 'RV',
    name: "2022 31′ Winnebago Vista",
    year: 2022,
    type: 'Class A Motorhome',
    range: '800 km/tank',
    power: '350 hp',
    topSpeed: '120 km/h',
    acceleration: '12s (0-100)',
    battery: 'House Battery',
    price: 'Free',
    tag: 'Spacious',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
    description: 'The 2022 31′ Winnebago Vista offers a perfect home on wheels with a spacious floorplan, modern amenities, and reliable Ford chassis performance.',
    deliveryFee: 899,
    specs: [
      { label: 'Length', value: "31′" },
      { label: 'Sleeps', value: '6' },
      { label: 'Engine', value: 'Ford V8' },
      { label: 'Fuel', value: 'Gasoline' },
      { label: 'Slides', value: '1' },
      { label: 'Mileage', value: 'Low' },
    ],
    localImage: "2022 31' Winnebago Vista.jpg",
  },
  {
    id: 'winnebago-adventurer-36z',
    brand: 'RV',
    name: '2022 Winnebago Adventurer 36Z',
    year: 2022,
    type: 'Class A Motorhome',
    range: '900 km/tank',
    power: '380 hp',
    topSpeed: '125 km/h',
    acceleration: '11s (0-100)',
    battery: 'House Battery',
    price: 'Free',
    tag: 'Luxury',
    image: 'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?auto=format&fit=crop&w=800&q=80',
    description: 'The 2022 Winnebago Adventurer 36Z delivers luxury Class A living with multiple slide-outs, residential appliances, and premium finishes throughout.',
    deliveryFee: 999,
    specs: [
      { label: 'Length', value: '36′' },
      { label: 'Sleeps', value: '8' },
      { label: 'Engine', value: 'Ford V8' },
      { label: 'Fuel', value: 'Gasoline' },
      { label: 'Slides', value: '3' },
      { label: 'Mileage', value: 'Low' },
    ],
    localImage: '2022 WINNEBAGO ADVENTURER 36Z.jpg',
  },
  {
    id: 'winnebago-adventurer-36z-alt',
    brand: 'RV',
    name: '2022 Winnebago Adventurer 36Z Premium',
    year: 2022,
    type: 'Class A Motorhome',
    range: '900 km/tank',
    power: '380 hp',
    topSpeed: '125 km/h',
    acceleration: '11s (0-100)',
    battery: 'House Battery',
    price: 'Free',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1533874301698-9a25a68f1e07?auto=format&fit=crop&w=800&q=80',
    description: 'A premium variant of the Winnebago Adventurer 36Z featuring upgraded interiors, enhanced entertainment systems, and extended storage capacity.',
    deliveryFee: 999,
    specs: [
      { label: 'Length', value: '36′' },
      { label: 'Sleeps', value: '8' },
      { label: 'Engine', value: 'Ford V8' },
      { label: 'Fuel', value: 'Gasoline' },
      { label: 'Slides', value: '3' },
      { label: 'Mileage', value: 'Low' },
    ],
    localImage: '2022 WINNEBAGO ADVENTURER 36Z_.jpg',
  },
];

const uploadLocalImage = async (filename: string): Promise<string | null> => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.log(`Skipping local image upload for ${filename}: Cloudinary not configured`);
    return null;
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const filePath = path.join(__dirname, '../../client/src/assets', filename);
  if (!fs.existsSync(filePath)) {
    console.log(`Local image not found: ${filePath}`);
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'elitecarautos/vehicles',
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${filename}:`, error);
    return null;
  }
};

export const seedVehicles = async () => {
  try {
    const count = await Vehicle.countDocuments();
    if (count > 0) {
      console.log('Vehicles already seeded');
      return;
    }

    // Seed BYD vehicles
    await Vehicle.insertMany(bydVehicles);
    console.log('BYD vehicles seeded');

    // Seed Tesla vehicles with local images if Cloudinary is configured
    const teslaWithImages = await Promise.all(
      teslaVehicles.map(async (v) => {
        const { localImage, ...rest } = v as any;
        const uploadedUrl = await uploadLocalImage(localImage);
        return { ...rest, image: uploadedUrl || rest.image };
      })
    );
    await Vehicle.insertMany(teslaWithImages);
    console.log('Tesla vehicles seeded');

    // Seed RV vehicles with local images if Cloudinary is configured
    const rvWithImages = await Promise.all(
      rvVehicles.map(async (v) => {
        const { localImage, ...rest } = v as any;
        const uploadedUrl = await uploadLocalImage(localImage);
        return { ...rest, image: uploadedUrl || rest.image };
      })
    );
    await Vehicle.insertMany(rvWithImages);
    console.log('RV vehicles seeded');
  } catch (error) {
    console.error('Seed error:', error);
  }
};
