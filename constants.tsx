
import { LaptopModel, Part, Category } from './types';

// =============================================================================
// LAPTOP MODELS - Real laptops with their built-in specs and upgrade options
// =============================================================================

export const LAPTOP_MODELS: LaptopModel[] = [
  {
    id: 'thinkpad-t480',
    name: 'ThinkPad T480',
    brand: 'Lenovo',
    sku: '20L5',
    releaseYear: 2018,
    upgradeSlots: [
      { category: Category.RAM, interface: 'DDR4-SODIMM', maxCapacity: 64, count: 2, notes: ['DDR4-2400 officially, DDR4-2666 works'] },
      { category: Category.STORAGE, interface: 'M.2-2280-NVME', count: 1, notes: ['PCIe Gen3 x4', 'Can also use 2.5" SATA in second bay'] },
      { category: Category.WIFI, interface: 'M.2-2230-PCIE', count: 1, notes: ['BIOS whitelist on some SKUs'] }
    ],
    builtInSpecs: [
      { category: Category.CPU, name: 'Intel Core i7-8550U', specs: { Cores: 4, Threads: 8, Base: '1.8 GHz', Boost: '4.0 GHz', TDP: '15W' }, upgradeable: false },
      { category: Category.GPU, name: 'Intel UHD 620 + MX150', specs: { Type: 'Hybrid', VRAM: '2GB', Performance: 'Light Gaming' }, upgradeable: false },
      { category: Category.RAM, name: '8GB DDR4-2400', specs: { Capacity: '8GB', Speed: '2400MHz', Type: 'DDR4' }, upgradeable: true },
      { category: Category.STORAGE, name: '256GB NVMe SSD', specs: { Capacity: '256GB', Type: 'NVMe' }, upgradeable: true },
      { category: Category.DISPLAY, name: '14" FHD IPS', specs: { Resolution: '1920x1080', Type: 'IPS', Size: '14"', Brightness: '250 nits' }, upgradeable: false },
      { category: Category.WIFI, name: 'Intel Wireless-AC 8265', specs: { Standard: 'Wi-Fi 5', Speed: '867 Mbps' }, upgradeable: true }
    ],
    baseSpecs: { cpu: 'Intel Core i7-8550U', gpu: 'NVIDIA MX150' },
    image: '/assets/images/thinkpad_t480.jpg',
    notes: ['Excellent upgradeability', '2 RAM slots (no soldered)', 'Discrete GPU option'],
    purchaseUrl: 'https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadt/thinkpad-t480'
  },
  {
    id: 'thinkpad-t14-gen3',
    name: 'ThinkPad T14 Gen 3',
    brand: 'Lenovo',
    sku: '21AH',
    releaseYear: 2022,
    upgradeSlots: [
      { category: Category.RAM, interface: 'DDR4-SODIMM', maxCapacity: 40, count: 1, notes: ['8GB soldered + 1 slot'] },
      { category: Category.STORAGE, interface: 'M.2-2280-NVME', count: 1, notes: ['PCIe Gen4 x4'] },
      { category: Category.WIFI, interface: 'M.2-2230-CNVIO2', count: 1, notes: ['CNVio2 interface'] }
    ],
    builtInSpecs: [
      { category: Category.CPU, name: 'Intel Core i7-1255U', specs: { Cores: 10, Threads: 12, Base: '1.7 GHz', Boost: '4.7 GHz', TDP: '15W' }, upgradeable: false },
      { category: Category.GPU, name: 'Intel Iris Xe', specs: { Type: 'Integrated', ExecutionUnits: 96, Performance: 'Good Integrated' }, upgradeable: false },
      { category: Category.RAM, name: '16GB DDR4', specs: { Capacity: '16GB', Speed: '3200MHz', Type: 'DDR4', Soldered: '8GB' }, upgradeable: true },
      { category: Category.STORAGE, name: '512GB NVMe SSD', specs: { Capacity: '512GB', Type: 'PCIe Gen4' }, upgradeable: true },
      { category: Category.DISPLAY, name: '14" 2.8K OLED', specs: { Resolution: '2880x1800', Type: 'OLED', Size: '14"', Brightness: '400 nits' }, upgradeable: false },
      { category: Category.WIFI, name: 'Intel Wi-Fi 6E AX211', specs: { Standard: 'Wi-Fi 6E', Speed: '2.4 Gbps' }, upgradeable: true }
    ],
    baseSpecs: { cpu: 'Intel Core i7-1255U', gpu: 'Intel Iris Xe', soldered: { ram: 8 } },
    image: '/assets/images/thinkpad_t14_gen3.jpg',
    notes: ['8GB RAM soldered', 'Gorgeous OLED display option', '12th gen Intel'],
    purchaseUrl: 'https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadt/thinkpad-t14-gen-3'
  },
  {
    id: 'framework-13-amd',
    name: 'Framework Laptop 13 (AMD)',
    brand: 'Framework',
    sku: 'FL13-AMD-7040',
    releaseYear: 2023,
    upgradeSlots: [
      { category: Category.RAM, interface: 'DDR5-SODIMM', maxCapacity: 96, count: 2, notes: ['DDR5-5600 supported'] },
      { category: Category.STORAGE, interface: 'M.2-2280-NVME', count: 1, notes: ['PCIe Gen4 x4'] },
      { category: Category.WIFI, interface: 'M.2-2230-PCIE', count: 1, notes: ['No BIOS whitelist'] },
      { category: Category.DISPLAY, interface: 'eDP-40pin', count: 1, notes: ['User-replaceable'] }
    ],
    builtInSpecs: [
      { category: Category.CPU, name: 'AMD Ryzen 7 7840U', specs: { Cores: 8, Threads: 16, Base: '3.3 GHz', Boost: '5.1 GHz', TDP: '28W' }, upgradeable: false },
      { category: Category.GPU, name: 'AMD Radeon 780M', specs: { Type: 'Integrated', ComputeUnits: 12, Performance: 'Best Integrated' }, upgradeable: false },
      { category: Category.RAM, name: 'Configurable (DIY)', specs: { Capacity: 'User choice', Type: 'DDR5' }, upgradeable: true },
      { category: Category.STORAGE, name: 'Configurable (DIY)', specs: { Capacity: 'User choice', Type: 'NVMe' }, upgradeable: true },
      { category: Category.DISPLAY, name: '13.5" 2256x1504 IPS', specs: { Resolution: '2256x1504', Type: 'IPS', Size: '13.5"', AspectRatio: '3:2' }, upgradeable: true },
      { category: Category.WIFI, name: 'Intel Wi-Fi 6E AX210', specs: { Standard: 'Wi-Fi 6E', Speed: '2.4 Gbps' }, upgradeable: true }
    ],
    baseSpecs: { cpu: 'AMD Ryzen 7 7840U', gpu: 'AMD Radeon 780M' },
    image: '/assets/images/thinkpad_t480.jpg',
    notes: ['Fully modular design', 'Best-in-class upgradeability', 'No BIOS restrictions'],
    purchaseUrl: 'https://frame.work/products/laptop-diy-13-gen-amd'
  },
  {
    id: 'thinkpad-x1-carbon-gen11',
    name: 'ThinkPad X1 Carbon Gen 11',
    brand: 'Lenovo',
    sku: '21HM',
    releaseYear: 2023,
    upgradeSlots: [
      { category: Category.STORAGE, interface: 'M.2-2280-NVME', count: 1, notes: ['PCIe Gen4 x4'] },
      { category: Category.WIFI, interface: 'M.2-2230-CNVIO2', count: 1, notes: ['CNVio2 interface'] }
    ],
    builtInSpecs: [
      { category: Category.CPU, name: 'Intel Core i7-1365U', specs: { Cores: 10, Threads: 12, Base: '1.8 GHz', Boost: '5.2 GHz', TDP: '15W' }, upgradeable: false },
      { category: Category.GPU, name: 'Intel Iris Xe', specs: { Type: 'Integrated', ExecutionUnits: 96, Performance: 'Good Integrated' }, upgradeable: false },
      { category: Category.RAM, name: '16GB LPDDR5', specs: { Capacity: '16GB', Speed: '6400MHz', Type: 'LPDDR5' }, upgradeable: false },
      { category: Category.STORAGE, name: '512GB NVMe SSD', specs: { Capacity: '512GB', Type: 'PCIe Gen4' }, upgradeable: true },
      { category: Category.DISPLAY, name: '14" 2.8K OLED', specs: { Resolution: '2880x1800', Type: 'OLED', Size: '14"', HDR: 'Yes' }, upgradeable: false },
      { category: Category.WIFI, name: 'Intel Wi-Fi 6E AX211', specs: { Standard: 'Wi-Fi 6E', Speed: '2.4 Gbps' }, upgradeable: true }
    ],
    baseSpecs: { cpu: 'Intel Core i7-1365U', gpu: 'Intel Iris Xe', soldered: { ram: 16 } },
    image: '/assets/images/thinkpad_x1_carbon.jpg',
    notes: ['RAM fully soldered', 'Ultra-thin premium', 'Premium OLED display'],
    purchaseUrl: 'https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadx1/thinkpad-x1-carbon-gen-11'
  }
];

// =============================================================================
// PARTS / SPECS - Components users can browse
// =============================================================================

export const PARTS: Part[] = [
  // -----------------------------------------------------------------------------
  // CPU OPTIONS (for filtering - not upgradeable)
  // -----------------------------------------------------------------------------
  {
    id: 'cpu-i5-8th',
    name: 'Intel Core i5 (8th Gen)',
    brand: 'Intel',
    category: Category.CPU,
    interface: 'BGA-soldered',
    price: 0,
    description: '4 cores, 8 threads. Good for basic productivity.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Cores: 4, Threads: 8, Generation: '8th', Performance: 'Entry' },
    isUpgradePart: false
  },
  {
    id: 'cpu-i7-8th',
    name: 'Intel Core i7 (8th Gen)',
    brand: 'Intel',
    category: Category.CPU,
    interface: 'BGA-soldered',
    price: 100,
    description: '4 cores, 8 threads with higher boost clocks.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Cores: 4, Threads: 8, Generation: '8th', Performance: 'Mainstream' },
    isUpgradePart: false
  },
  {
    id: 'cpu-i7-12th',
    name: 'Intel Core i7 (12th Gen)',
    brand: 'Intel',
    category: Category.CPU,
    interface: 'BGA-soldered',
    price: 200,
    description: '10 cores (P+E), 12 threads. Excellent multitasking.',
    image: '/assets/images/thinkpad_t14_gen3.jpg',
    specs: { Cores: 10, Threads: 12, Generation: '12th', Performance: 'High' },
    isUpgradePart: false
  },
  {
    id: 'cpu-ryzen7-7840u',
    name: 'AMD Ryzen 7 7840U',
    brand: 'AMD',
    category: Category.CPU,
    interface: 'BGA-soldered',
    price: 250,
    description: '8 cores, 16 threads. Best mobile efficiency.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Cores: 8, Threads: 16, Generation: 'Zen 4', Performance: 'High' },
    isUpgradePart: false
  },

  // -----------------------------------------------------------------------------
  // GPU OPTIONS (for filtering - not upgradeable)
  // -----------------------------------------------------------------------------
  {
    id: 'gpu-intel-uhd',
    name: 'Intel UHD Graphics',
    brand: 'Intel',
    category: Category.GPU,
    interface: 'integrated',
    price: 0,
    description: 'Basic integrated graphics for office work.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Type: 'Integrated', Performance: 'Basic', Gaming: 'No' },
    isUpgradePart: false
  },
  {
    id: 'gpu-intel-iris-xe',
    name: 'Intel Iris Xe',
    brand: 'Intel',
    category: Category.GPU,
    interface: 'integrated',
    price: 50,
    description: 'Good integrated graphics. Light gaming capable.',
    image: '/assets/images/thinkpad_t14_gen3.jpg',
    specs: { Type: 'Integrated', ExecutionUnits: 96, Performance: 'Good', Gaming: 'Light' },
    isUpgradePart: false
  },
  {
    id: 'gpu-amd-780m',
    name: 'AMD Radeon 780M',
    brand: 'AMD',
    category: Category.GPU,
    interface: 'integrated',
    price: 100,
    description: 'Best integrated graphics. Can handle most games at 1080p.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Type: 'Integrated', ComputeUnits: 12, Performance: 'Excellent', Gaming: 'Yes' },
    isUpgradePart: false
  },
  {
    id: 'gpu-nvidia-mx150',
    name: 'NVIDIA GeForce MX150',
    brand: 'NVIDIA',
    category: Category.GPU,
    interface: 'discrete',
    price: 150,
    description: 'Entry-level discrete GPU for light gaming and acceleration.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Type: 'Discrete', VRAM: '2GB', Performance: 'Entry Discrete', Gaming: 'Light' },
    isUpgradePart: false
  },

  // -----------------------------------------------------------------------------
  // RAM OPTIONS
  // -----------------------------------------------------------------------------
  {
    id: 'ram-8gb-ddr4',
    name: '8GB DDR4',
    brand: 'Various',
    category: Category.RAM,
    interface: 'DDR4-SODIMM',
    price: 0,
    description: 'Standard 8GB. Good for basic productivity.',
    image: '/assets/images/crucial_ddr4_sodimm.jpg',
    specs: { Capacity: '8GB', Speed: '3200MHz', Type: 'DDR4' },
    isUpgradePart: false
  },
  {
    id: 'ram-16gb-ddr4',
    name: '16GB DDR4',
    brand: 'Various',
    category: Category.RAM,
    interface: 'DDR4-SODIMM',
    price: 35,
    description: 'Sweet spot for most users. Handles multitasking well.',
    image: '/assets/images/crucial_ddr4_sodimm.jpg',
    specs: { Capacity: '16GB', Speed: '3200MHz', Type: 'DDR4' },
    isUpgradePart: false
  },
  {
    id: 'ram-32gb-ddr4',
    name: '32GB DDR4',
    brand: 'Crucial',
    category: Category.RAM,
    interface: 'DDR4-SODIMM',
    price: 70,
    description: 'High-capacity for video editing and VMs.',
    image: '/assets/images/crucial_ddr4_sodimm.jpg',
    specs: { Capacity: '32GB', Speed: '3200MHz', Type: 'DDR4' },
    isUpgradePart: true
  },
  {
    id: 'ram-16gb-ddr5',
    name: '16GB DDR5',
    brand: 'Kingston',
    category: Category.RAM,
    interface: 'DDR5-SODIMM',
    price: 55,
    description: 'Fast DDR5 memory with XMP 3.0 support.',
    image: '/assets/images/kingston_fury_ddr5.jpg',
    specs: { Capacity: '16GB', Speed: '5600MHz', Type: 'DDR5' },
    isUpgradePart: false
  },
  {
    id: 'ram-32gb-ddr5',
    name: '32GB DDR5',
    brand: 'Kingston',
    category: Category.RAM,
    interface: 'DDR5-SODIMM',
    price: 95,
    description: 'High-capacity DDR5 for workstations.',
    image: '/assets/images/kingston_fury_ddr5.jpg',
    specs: { Capacity: '32GB', Speed: '5600MHz', Type: 'DDR5' },
    isUpgradePart: true
  },
  {
    id: 'ram-16gb-lpddr5',
    name: '16GB LPDDR5 (Soldered)',
    brand: 'Integrated',
    category: Category.RAM,
    interface: 'LPDDR5-soldered',
    price: 0,
    description: 'Ultra-fast soldered memory. Power efficient.',
    image: '/assets/images/kingston_fury_ddr5.jpg',
    specs: { Capacity: '16GB', Speed: '6400MHz', Type: 'LPDDR5', Upgradeable: 'No' },
    isUpgradePart: false
  },

  // -----------------------------------------------------------------------------
  // STORAGE OPTIONS
  // -----------------------------------------------------------------------------
  {
    id: 'ssd-256gb',
    name: '256GB NVMe SSD',
    brand: 'Various',
    category: Category.STORAGE,
    interface: 'M.2-2280-NVME',
    price: 0,
    description: 'Basic storage. Consider upgrading.',
    image: '/assets/images/samsung_990_pro.jpg',
    specs: { Capacity: '256GB', Type: 'NVMe' },
    isUpgradePart: false
  },
  {
    id: 'ssd-512gb',
    name: '512GB NVMe SSD',
    brand: 'Various',
    category: Category.STORAGE,
    interface: 'M.2-2280-NVME',
    price: 50,
    description: 'Balanced storage for most users.',
    image: '/assets/images/samsung_990_pro.jpg',
    specs: { Capacity: '512GB', Type: 'NVMe' },
    isUpgradePart: false
  },
  {
    id: 'ssd-1tb-990pro',
    name: 'Samsung 990 Pro 1TB',
    brand: 'Samsung',
    category: Category.STORAGE,
    interface: 'M.2-2280-NVME',
    price: 110,
    description: 'Flagship PCIe Gen4 SSD. 7,450 MB/s read.',
    image: '/assets/images/samsung_990_pro.jpg',
    specs: { Capacity: '1TB', Read: '7450 MB/s', Write: '6900 MB/s' },
    isUpgradePart: true
  },
  {
    id: 'ssd-2tb-990pro',
    name: 'Samsung 990 Pro 2TB',
    brand: 'Samsung',
    category: Category.STORAGE,
    interface: 'M.2-2280-NVME',
    price: 180,
    description: 'High-capacity flagship SSD.',
    image: '/assets/images/samsung_990_pro.jpg',
    specs: { Capacity: '2TB', Read: '7450 MB/s', Write: '6900 MB/s' },
    isUpgradePart: true
  },
  {
    id: 'ssd-1tb-sn850x',
    name: 'WD Black SN850X 1TB',
    brand: 'Western Digital',
    category: Category.STORAGE,
    interface: 'M.2-2280-NVME',
    price: 90,
    description: 'High-performance gaming SSD.',
    image: '/assets/images/wd_black_sn850x.jpg',
    specs: { Capacity: '1TB', Read: '7300 MB/s', Write: '6300 MB/s' },
    isUpgradePart: true
  },

  // -----------------------------------------------------------------------------
  // DISPLAY OPTIONS
  // -----------------------------------------------------------------------------
  {
    id: 'display-fhd-ips',
    name: '14" FHD IPS (1920x1080)',
    brand: 'Various',
    category: Category.DISPLAY,
    interface: 'fixed',
    price: 0,
    description: 'Standard Full HD. Good for office work.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Resolution: '1920x1080', Type: 'IPS', Size: '14"', Brightness: '250 nits' },
    isUpgradePart: false
  },
  {
    id: 'display-2k-ips',
    name: '14" 2.5K IPS (2560x1440)',
    brand: 'Various',
    category: Category.DISPLAY,
    interface: 'fixed',
    price: 100,
    description: 'Sharp 2.5K with great color accuracy.',
    image: '/assets/images/thinkpad_t14_gen3.jpg',
    specs: { Resolution: '2560x1440', Type: 'IPS', Size: '14"', Brightness: '300 nits' },
    isUpgradePart: false
  },
  {
    id: 'display-28k-oled',
    name: '14" 2.8K OLED (2880x1800)',
    brand: 'Samsung',
    category: Category.DISPLAY,
    interface: 'fixed',
    price: 200,
    description: 'Stunning OLED with perfect blacks and HDR.',
    image: '/assets/images/thinkpad_t14_gen3.jpg',
    specs: { Resolution: '2880x1800', Type: 'OLED', Size: '14"', HDR: 'Yes', ContrastRatio: 'Infinite' },
    isUpgradePart: false
  },
  {
    id: 'display-3by2-ips',
    name: '13.5" 3:2 IPS (2256x1504)',
    brand: 'BOE',
    category: Category.DISPLAY,
    interface: 'eDP-40pin',
    price: 0,
    description: 'Productivity-focused 3:2 aspect ratio.',
    image: '/assets/images/thinkpad_t480.jpg',
    specs: { Resolution: '2256x1504', Type: 'IPS', Size: '13.5"', AspectRatio: '3:2' },
    isUpgradePart: false
  },

  // -----------------------------------------------------------------------------
  // WIFI OPTIONS
  // -----------------------------------------------------------------------------
  {
    id: 'wifi-ac',
    name: 'Wi-Fi 5 (802.11ac)',
    brand: 'Intel',
    category: Category.WIFI,
    interface: 'M.2-2230-PCIE',
    price: 0,
    description: 'Older standard. Works but consider upgrading.',
    image: '/assets/images/intel_ax200.jpg',
    specs: { Standard: 'Wi-Fi 5', Speed: '867 Mbps' },
    isUpgradePart: false
  },
  {
    id: 'wifi-ax200',
    name: 'Wi-Fi 6 (Intel AX200)',
    brand: 'Intel',
    category: Category.WIFI,
    interface: 'M.2-2230-PCIE',
    price: 15,
    description: 'Wi-Fi 6 with broad compatibility.',
    image: '/assets/images/intel_ax200.jpg',
    specs: { Standard: 'Wi-Fi 6', Speed: '2.4 Gbps', Bluetooth: '5.0' },
    isUpgradePart: true
  },
  {
    id: 'wifi-ax210',
    name: 'Wi-Fi 6E (Intel AX210)',
    brand: 'Intel',
    category: Category.WIFI,
    interface: 'M.2-2230-PCIE',
    price: 20,
    description: 'Wi-Fi 6E with 6GHz band. PCIe interface.',
    image: '/assets/images/intel_ax210.jpg',
    specs: { Standard: 'Wi-Fi 6E', Bands: '2.4/5/6 GHz', Speed: '2.4 Gbps' },
    isUpgradePart: true
  },
  {
    id: 'wifi-ax211',
    name: 'Wi-Fi 6E (Intel AX211)',
    brand: 'Intel',
    category: Category.WIFI,
    interface: 'M.2-2230-CNVIO2',
    price: 25,
    description: 'Wi-Fi 6E with CNVio2. Intel 12th gen+ only.',
    image: '/assets/images/intel_ax210.jpg',
    specs: { Standard: 'Wi-Fi 6E', Bands: '2.4/5/6 GHz', Speed: '2.4 Gbps' },
    constraints: ['CNVio2 - Intel 12th gen or newer ONLY'],
    isUpgradePart: true
  }
];

export const MOCK_PARTS = PARTS;
