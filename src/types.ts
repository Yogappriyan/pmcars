export type VehicleCategory = 'private' | 'commercial';
export type RegistrationType = 'Own Board' | 'T-Board';
export type VehicleStatus = 'available' | 'reserved' | 'sold';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic';
export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Commercial' | 'Pickup';
export type SellRequestStatus = 'new' | 'contacted' | 'closed';

export interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  priceDisplay: string;
  kilometers: number;
  owners: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType?: BodyType;
  vehicleCategory: VehicleCategory;
  registrationType: RegistrationType;
  condition: string;
  description: string;
  features: string[];
  images: string[];
  thumbnail: string;
  insuranceStatus: string;
  insuranceExpiry: string;
  serviceHistory: string;
  location: string;
  color?: string;
  negotiable?: boolean;
  status: VehicleStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellRequest {
  id: string;
  name: string;
  phone: string;
  vehicleBrand: string;
  vehicleModel: string;
  year: number;
  kilometers: number;
  fuelType: FuelType | string;
  expectedPrice: number | string;
  registrationType: RegistrationType | string;
  message?: string;
  imageURL?: string;
  status: SellRequestStatus;
  createdAt: string;
}

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: 'admin' | 'user';
  active: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: 'admin';
  active: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface NormalUser {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: 'user';
  active: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  locationAddress: string;
  landmark: string;
  pincode: string;
  businessHoursWeekdays: string;
  businessHoursFriday: string;
  businessHoursWeekend: string;
  facebookUrl: string;
  instagramUrl: string;
  heroHeadline: string;
  heroDescription: string;
}

export interface FilterState {
  search: string;
  brand: string; // 'all' | 'Maruti Suzuki' | 'Hyundai' | 'Tata' | 'Toyota' | 'Mahindra' | 'Ashok Leyland' | 'Honda' | 'Renault' etc.
  category: string; // 'all' | 'private' | 'commercial'
  bodyType: string; // 'all' | 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Commercial'
  fuel: string; // 'all' | 'Petrol' | 'Diesel' | 'CNG' | 'Electric'
  priceRange: string; // 'all' | 'under3' | '3to5' | '5to8' | '8to15' | 'above15'
  transmission: string; // 'all' | 'Manual' | 'Automatic'
  year: string; // 'all' | specific year
  owners: string; // 'all' | '1' | '2' | '3plus'
  kmRange: string; // 'all' | 'under50k' | 'under100k'
  sortBy: 'newest' | 'price-low' | 'price-high' | 'km-low' | 'year-high';
}
