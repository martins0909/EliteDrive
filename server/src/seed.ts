import Vehicle from './models/Vehicle.js';

const defaultVehicles = [
  {
    id: 'seal',
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

export const seedVehicles = async () => {
  try {
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      await Vehicle.insertMany(defaultVehicles);
      console.log('Default vehicles seeded');
    }
  } catch (error) {
    console.error('Seed error:', error);
  }
};
