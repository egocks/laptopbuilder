
import { LaptopModel, Part, Category, CompatibilityResult, UpgradeSlot } from '../types';

/**
 * Client-side rule-based compatibility engine.
 * Provides instant feedback without AI API calls.
 * AI verification is reserved for final build check.
 */

// =============================================================================
// COMPATIBILITY CHECK: Laptop + Part
// =============================================================================

export function checkPartCompatibility(
    laptop: LaptopModel | undefined,
    part: Part
): CompatibilityResult {
    // If no laptop selected, any part is potentially compatible
    if (!laptop) {
        return {
            compatible: true,
            severity: 'info',
            message: 'Select a laptop to verify compatibility'
        };
    }

    // Find the upgrade slot for this part's category
    const slot = laptop.upgradeSlots.find(s => s.category === part.category);

    // Check if laptop supports this category at all
    if (!slot) {
        return {
            compatible: false,
            severity: 'error',
            message: `${laptop.name} does not support ${part.category} upgrades`
        };
    }

    // Check interface compatibility
    if (slot.interface !== part.interface) {
        return {
            compatible: false,
            severity: 'error',
            message: `Interface mismatch: ${laptop.name} requires ${slot.interface}, but ${part.name} is ${part.interface}`
        };
    }

    // Check RAM capacity limits
    if (part.category === Category.RAM && slot.maxCapacity) {
        const partCapacity = extractCapacity(part.specs.Capacity as string);
        const solderedRam = laptop.baseSpecs.soldered?.ram || 0;
        const totalRam = solderedRam + partCapacity * (slot.count || 1);

        if (partCapacity > slot.maxCapacity - solderedRam) {
            return {
                compatible: false,
                severity: 'error',
                message: `${part.name} (${partCapacity}GB) exceeds max upgradeable RAM. ${laptop.name} supports up to ${slot.maxCapacity}GB total (${solderedRam}GB soldered).`
            };
        }
    }

    // Check for BIOS whitelist warnings
    if (part.category === Category.WIFI && slot.notes?.some(n => n.toLowerCase().includes('whitelist'))) {
        const partConfirmed = part.constraints?.some(c => c.toLowerCase().includes(laptop.name.toLowerCase()));
        if (!partConfirmed) {
            return {
                compatible: true,
                severity: 'warning',
                message: `${laptop.name} may have BIOS WiFi whitelist. ${part.name} compatibility not confirmed.`
            };
        }
    }

    // Check CNVio2 constraints
    if (part.interface === 'M.2-2230-CNVIO2') {
        const constraintWarning = part.constraints?.find(c => c.toLowerCase().includes('cnvio2'));
        if (constraintWarning && slot.interface !== 'M.2-2230-CNVIO2') {
            return {
                compatible: false,
                severity: 'error',
                message: `${part.name} requires CNVio2 interface, but ${laptop.name} has PCIe M.2 slot`
            };
        }
    }

    // All checks passed
    return {
        compatible: true,
        severity: 'success',
        message: `${part.name} is compatible with ${laptop.name}`
    };
}

// =============================================================================
// COMPATIBILITY CHECK: Part → Filter Laptops
// =============================================================================

export function filterCompatibleLaptops(
    laptops: LaptopModel[],
    part: Part
): LaptopModel[] {
    return laptops.filter(laptop => {
        const result = checkPartCompatibility(laptop, part);
        return result.compatible;
    });
}

// =============================================================================
// COMPATIBILITY CHECK: Laptop → Filter Parts
// =============================================================================

export function filterCompatibleParts(
    laptop: LaptopModel | undefined,
    parts: Part[]
): Part[] {
    if (!laptop) return parts;

    return parts.filter(part => {
        const result = checkPartCompatibility(laptop, part);
        return result.compatible || result.severity === 'warning';
    });
}

// =============================================================================
// BUILD VALIDATION: Check entire build
// =============================================================================

export function validateBuild(
    laptop: LaptopModel | undefined,
    selectedParts: Partial<Record<Category, Part>>
): CompatibilityResult[] {
    const results: CompatibilityResult[] = [];

    if (!laptop) {
        results.push({
            compatible: true,
            severity: 'info',
            message: 'Select a laptop model to see full compatibility analysis'
        });
        return results;
    }

    // Check each selected part
    for (const part of Object.values(selectedParts)) {
        if (part) {
            results.push(checkPartCompatibility(laptop, part));
        }
    }

    // Check if any essential slots are unfilled
    const filledCategories = new Set(Object.keys(selectedParts));
    for (const slot of laptop.upgradeSlots) {
        if (!filledCategories.has(slot.category)) {
            results.push({
                compatible: true,
                severity: 'info',
                message: `${slot.category} slot available for upgrade`
            });
        }
    }

    return results;
}

// =============================================================================
// GET OVERALL BUILD STATUS
// =============================================================================

export function getBuildStatus(
    results: CompatibilityResult[]
): 'Compatible' | 'Warning' | 'Incompatible' {
    if (results.some(r => r.severity === 'error')) {
        return 'Incompatible';
    }
    if (results.some(r => r.severity === 'warning')) {
        return 'Warning';
    }
    return 'Compatible';
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function extractCapacity(capacityStr: string): number {
    const match = capacityStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

export function getUpgradableCategories(laptop: LaptopModel): Category[] {
    return laptop.upgradeSlots.map(slot => slot.category);
}
