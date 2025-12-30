
import { Part, Category } from './types';

export const MOCK_PARTS: Part[] = [
  // Chassis
  {
    id: 'c1',
    name: 'Neo 15 Barebone',
    brand: 'XMG',
    category: Category.CHASSIS,
    price: 499,
    description: 'High-performance 15-inch magnesium alloy chassis with mechanical keyboard support.',
    image: 'https://picsum.photos/seed/laptop1/400/300',
    specs: { Weight: '1.9kg', Material: 'Magnesium', Ports: '3x USB-A, 1x TB4' }
  },
  {
    id: 'c2',
    name: 'Precision 14 Ultra',
    brand: 'CustomBuild',
    category: Category.CHASSIS,
    price: 350,
    description: 'Ultra-portable 14-inch aluminum chassis for professionals.',
    image: 'https://picsum.photos/seed/laptop2/400/300',
    specs: { Weight: '1.4kg', Material: 'Aluminum', Ports: '2x USB-C, 1x HDMI' }
  },
  // CPUs (Mobile)
  {
    id: 'cpu1',
    name: 'Intel Core i9-13980HX',
    brand: 'Intel',
    category: Category.CPU,
    price: 580,
    description: 'Extreme performance laptop processor with 24 cores.',
    image: 'https://picsum.photos/seed/cpu1/400/300',
    specs: { Cores: 24, Threads: 32, 'Max Clock': '5.6 GHz' }
  },
  {
    id: 'cpu2',
    name: 'AMD Ryzen 9 7945HX',
    brand: 'AMD',
    category: Category.CPU,
    price: 520,
    description: 'High-efficiency 16-core beast for gaming and multitasking.',
    image: 'https://picsum.photos/seed/cpu2/400/300',
    specs: { Cores: 16, Threads: 32, 'Max Clock': '5.4 GHz' }
  },
  // GPUs (Mobile)
  {
    id: 'gpu1',
    name: 'NVIDIA RTX 4090 Mobile',
    brand: 'NVIDIA',
    category: Category.GPU,
    price: 850,
    description: 'Top-tier mobile graphics with 16GB VRAM.',
    image: 'https://picsum.photos/seed/gpu1/400/300',
    specs: { VRAM: '16GB GDDR6', TGP: '175W' }
  },
  {
    id: 'gpu2',
    name: 'NVIDIA RTX 4070 Mobile',
    brand: 'NVIDIA',
    category: Category.GPU,
    price: 450,
    description: 'Excellent performance-to-value for 1440p gaming.',
    image: 'https://picsum.photos/seed/gpu2/400/300',
    specs: { VRAM: '8GB GDDR6', TGP: '115W' }
  },
  // RAM (SO-DIMM)
  {
    id: 'ram1',
    name: 'Crucial 32GB DDR5-5600',
    brand: 'Crucial',
    category: Category.RAM,
    price: 120,
    description: 'High-speed SO-DIMM memory for modern laptops.',
    image: 'https://picsum.photos/seed/ram1/400/300',
    specs: { Size: '32GB', Speed: '5600MHz', Slots: 1 }
  },
  {
    id: 'ram2',
    name: 'Kingston FURY 64GB Kit',
    brand: 'Kingston',
    category: Category.RAM,
    price: 210,
    description: 'Massive capacity for workstations.',
    image: 'https://picsum.photos/seed/ram2/400/300',
    specs: { Size: '64GB (2x32)', Speed: '4800MHz', Slots: 2 }
  },
  // Storage
  {
    id: 'st1',
    name: 'Samsung 990 Pro 2TB',
    brand: 'Samsung',
    category: Category.STORAGE,
    price: 180,
    description: 'Lightning fast PCIe Gen4 SSD.',
    image: 'https://picsum.photos/seed/ssd1/400/300',
    specs: { Capacity: '2TB', Interface: 'NVMe Gen4', Read: '7450MB/s' }
  }
];
