
export enum Category {
  CPU = 'Processor',
  GPU = 'Graphics',
  RAM = 'RAM',
  STORAGE = 'Storage',
  DISPLAY = 'Display',
  WIFI = 'WiFi Card'
}

// Interface types for compatibility checking
export type RamType = 'DDR4-SODIMM' | 'DDR5-SODIMM' | 'LPDDR5-soldered';
export type StorageInterface = 'M.2-2280-NVME' | 'M.2-2242-NVME' | 'SATA-2.5';
export type WifiInterface = 'M.2-2230-PCIE' | 'M.2-2230-CNVIO2';
export type DisplayInterface = 'eDP-40pin' | 'fixed';
export type CpuSocket = 'BGA-soldered'; // Modern laptops have soldered CPUs
export type GpuType = 'integrated' | 'discrete';

export interface UpgradeSlot {
  category: Category;
  interface: RamType | StorageInterface | WifiInterface | DisplayInterface | string;
  maxCapacity?: number;
  count?: number;
  notes?: string[];
}

export interface BuiltInSpec {
  category: Category;
  partId?: string;
  name: string;
  specs: Record<string, string | number>;
  upgradeable: boolean;
}

export interface LaptopModel {
  id: string;
  name: string;
  brand: string;
  sku: string;
  releaseYear: number;
  upgradeSlots: UpgradeSlot[];
  builtInSpecs: BuiltInSpec[];
  baseSpecs: {
    cpu: string;
    gpu?: string;
    soldered?: { ram?: number };
  };
  image: string;
  notes: string[];
  purchaseUrl?: string; // URL to manufacturer's purchase page
}

export interface Part {
  id: string;
  name: string;
  brand: string;
  category: Category;
  interface: string;
  price: number;
  specs: Record<string, string | number>;
  image: string;
  description: string;
  constraints?: string[];
  isUpgradePart?: boolean;
}

export interface Build {
  id?: string; // For saved builds
  name?: string; // User-given name for saved builds
  laptop?: LaptopModel;
  parts: Partial<Record<Category, Part>>;
  createdAt?: number;
}

export interface SavedBuild {
  id: string;
  name: string;
  laptopId?: string;
  partIds: Record<string, string>;
  createdAt: number;
}

export interface CompatibilityResult {
  compatible: boolean;
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

export interface CompatibilityReport {
  status: 'Compatible' | 'Incompatible' | 'Warning';
  message: string;
  details: string[];
}

export type MatchType = 'built-in' | 'upgradeable' | 'incompatible';

export interface PartMatch {
  matchType: MatchType;
  note?: string;
}

// Chat message for AI assistant
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
