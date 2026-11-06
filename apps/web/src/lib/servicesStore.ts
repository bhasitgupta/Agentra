import { Service } from './types';

const STORAGE_KEY = 'agentra_registered_services';

// Initial empty or real registered services
export function getRegisteredServices(): Service[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read registered services:', err);
    return [];
  }
}

export function saveRegisteredService(service: Service): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRegisteredServices();
    const index = current.findIndex((s) => s.slug === service.slug);
    if (index >= 0) {
      current[index] = service;
    } else {
      current.unshift(service);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('agentra_services_updated'));
  } catch (err) {
    console.error('Failed to save service:', err);
  }
}

export function getServiceBySlug(slug: string): Service | null {
  const services = getRegisteredServices();
  return services.find((s) => s.slug === slug) || null;
}

export function getServicesByProvider(providerAddress: string): Service[] {
  if (!providerAddress) return [];
  const services = getRegisteredServices();
  return services.filter(
    (s) => s.providerAddress?.toLowerCase() === providerAddress.toLowerCase()
  );
}

