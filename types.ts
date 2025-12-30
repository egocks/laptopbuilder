
export enum Category {
  CHASSIS = 'Chassis',
  CPU = 'CPU',
  GPU = 'GPU',
  RAM = 'RAM',
  STORAGE = 'Storage',
  DISPLAY = 'Display',
  WIFI = 'WiFi Card'
}

export interface Part {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  specs: Record<string, string | number>;
  image: string;
  description: string;
}

export interface Build {
  parts: Partial<Record<Category, Part>>;
}

export interface CompatibilityReport {
  status: 'Compatible' | 'Incompatible' | 'Warning';
  message: string;
  details: string[];
}
