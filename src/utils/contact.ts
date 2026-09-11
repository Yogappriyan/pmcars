import { Vehicle } from '../types';

export const PRIMARY_PHONE = "7868948330";
export const SECONDARY_PHONE = "9655677322";
export const PRIMARY_PHONE_DISPLAY = "78689 48330";
export const SECONDARY_PHONE_DISPLAY = "96556 77322";
export const WHATSAPP_NUMBER = "7868948330"; // Country code 91 for India

/**
 * Generates a WhatsApp direct inquiry link dynamically for a specific vehicle.
 * Formats details accurately including Title, Year, Kilometers, and Price.
 */
export function generateWhatsAppLink(vehicle: Partial<Vehicle>): string {
  const vehicleName = vehicle.title || `${vehicle.brand || ''} ${vehicle.model || ''}`.trim() || 'this vehicle';
  const yearText = vehicle.year ? ` (${vehicle.year} Model)` : '';
  const kmText = vehicle.kilometers ? `, ${vehicle.kilometers.toLocaleString('en-IN')} km` : '';
  const priceText = vehicle.priceDisplay ? `, ${vehicle.priceDisplay}` : (vehicle.price ? `, ₹${vehicle.price.toLocaleString('en-IN')}` : '');
  const idText = vehicle.id ? ` [Ref ID: ${vehicle.id}]` : '';

  const message = `Hello PM Cars Ariyalur, I am interested in the ${vehicleName}${yearText}${kmText}${priceText}${idText}. Please share availability, verified documents, and current offer details.`;
  
  return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates general WhatsApp inquiry link for specific inquiry topics.
 */
export function generateGeneralWhatsAppLink(topic?: string, customText?: string): string {
  if (customText) {
    return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(customText)}`;
  }
  
  let message = "Hello PM Cars Ariyalur, I would like to make an inquiry regarding your pre-owned vehicles and services.";
  if (topic === 'sell') {
    message = "Hello PM Cars Ariyalur, I want to sell my vehicle through your parking sales consultancy. Please guide me with the procedure and valuation.";
  } else if (topic === 'finance') {
    message = "Hello PM Cars Ariyalur, I need assistance with vehicle financing and EMI options for purchasing a pre-owned vehicle.";
  } else if (topic === 'insurance') {
    message = "Hello PM Cars Ariyalur, I would like to inquire about vehicle insurance renewal and documentation verification.";
  } else if (topic === 'commercial') {
    message = "Hello PM Cars Ariyalur, I am looking for commercial / T-Board vehicles (Tata Ace / Ashok Leyland Dost / Pickup). Please share available options.";
  }
  
  return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats tel: link for phone dialers.
 */
export function getPhoneLink(phone: string = PRIMARY_PHONE): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return `tel:+91${cleaned.slice(-10)}`;
}

/**
 * Format phone display with clean spacing
 */
export function formatPhoneDisplay(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
}
