'use client';

import React, { useState } from 'react';
import {
  Car,
  Truck,
  Compass,
  Sparkles,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  Settings,
  CircleDot
} from 'lucide-react';
import { BodyType } from '@/data';

export interface CategoryOption {
  key: string;
  label: string;
  description: string;
}

export const categoryOptions: CategoryOption[] = [
  { key: 'Hybrid', label: 'Hybrid & PHEV', description: 'Petrol/Electric hybrid drive' },
  { key: 'Electric', label: 'Electric Vehicles', description: 'Zero emission pure EV' },
  { key: 'Automatic', label: 'Automatic / Dual-Clutch', description: 'AT, CVT & DCT transmissions' },
  { key: 'Manual', label: 'Manual Transmission', description: 'Stick shift sports & work trucks' },
  { key: 'Right-Hand Drive', label: 'Right-Hand Drive (RHD)', description: 'Standard Japanese domestic spec' },
  { key: 'Left-Hand Drive', label: 'Left-Hand Drive (LHD)', description: 'Export specification European imports' },
  { key: 'Commercial Vehicles', label: 'Commercial & Fleet', description: 'Vans, pick-ups, and haulers' },
];

export const bodyTypeConfigs: Array<{
  type: BodyType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { type: 'SUVs & 4x4', label: 'SUVs & 4x4', icon: Compass },
  { type: 'Luxury & Performance', label: 'Luxury & Sports', icon: Sparkles },
  { type: 'Vans & MPVs', label: 'Vans & Minivans', icon: Layers },
  { type: 'Trucks & Commercial', label: 'Trucks & Haulers', icon: Truck },
  { type: 'Sedans & Hatchbacks', label: 'Sedans & Hatchbacks', icon: Car },
  { type: 'Kei Cars', label: 'Compact & Kei', icon: CircleDot },
];

interface Props {
  makes: string[];
  currentMake: string;
  onSelectMake: (make: string) => void;

  currentBody: string;
  onSelectBody: (body: string) => void;

  currentCategory: string;
  onSelectCategory: (category: string) => void;

  brandCounts: Record<string, number>;
  bodyCounts: Record<string, number>;
  categoryCounts: Record<string, number>;

  onResetAll: () => void;
  activeFiltersCount: number;

  mobileOpen: boolean;
  onCloseMobile: () => void;
  onApplyMobile: () => void;
}

export function VehicleBrowseSidebar({
  makes,
  currentMake,
  onSelectMake,
  currentBody,
  onSelectBody,
  currentCategory,
  onSelectCategory,
  brandCounts,
  bodyCounts,
  categoryCounts,
  onResetAll,
  activeFiltersCount,
  mobileOpen,
  onCloseMobile,
  onApplyMobile,
}: Props) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllBodies, setShowAllBodies] = useState(false);

  // Priority order for Japanese export brands
  const brandPriority = [
    'Toyota',
    'Lexus',
    'Nissan',
    'Honda',
    'Suzuki',
    'Mazda',
    'Subaru',
    'Daihatsu',
    'Mitsubishi',
    'Mercedes-Benz',
  ];

  const sortedMakes = [...makes]
    .filter((m) => m !== 'All')
    .sort((a, b) => {
      const idxA = brandPriority.indexOf(a);
      const idxB = brandPriority.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

  const visibleMakes = showAllBrands ? sortedMakes : sortedMakes.slice(0, 5);

  const sidebarContent = (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
        <div>
          <h3 className="font-black text-xs uppercase tracking-wider text-[#111111]">
            Browse Directory
          </h3>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Refine stock by brand, body, or category
          </p>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onResetAll}
            className="text-[11px] font-bold text-[#ff6a00] hover:text-[#e55f00] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* SECTION 1: Browse by Brand */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-black text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00]" />
            Browse by Brand
          </h4>
          {currentMake !== 'All' && (
            <button
              onClick={() => onSelectMake('All')}
              className="text-[10px] font-bold text-[#ff6a00] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* "All Brands" option */}
          <button
            onClick={() => onSelectMake('All')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all ${
              currentMake === 'All'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-[#111111]'
            }`}
          >
            <span>All Stock Brands</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold ${
                currentMake === 'All' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {Object.values(brandCounts).reduce((acc, curr) => acc + curr, 0)}
            </span>
          </button>

          {/* Individual Makes */}
          {visibleMakes.map((make) => {
            const count = brandCounts[make] || 0;
            const isSelected = currentMake === make;
            return (
              <button
                key={make}
                onClick={() => onSelectMake(isSelected ? 'All' : make)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all group ${
                  isSelected
                    ? 'bg-[#ff6a00] text-white shadow-xs font-bold'
                    : 'text-neutral-700 hover:bg-[#fff4eb] hover:text-[#b34a00]'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-neutral-300 group-hover:bg-[#ff8a33]'
                    }`}
                  />
                  {make}
                </span>

                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold shrink-0 ml-2 ${
                    isSelected
                      ? 'bg-[#e55f00] text-white'
                      : count > 0
                      ? 'bg-neutral-100 text-neutral-600 group-hover:bg-[#ffe8d6] group-hover:text-[#cc5500]'
                      : 'bg-neutral-50 text-neutral-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Show More / Show Less Toggle */}
        {sortedMakes.length > 5 && (
          <button
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="mt-2 text-[11px] font-bold text-neutral-500 hover:text-[#ff6a00] flex items-center gap-1 px-1 transition-colors"
          >
            {showAllBrands ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Fewer Brands</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Show All {sortedMakes.length} Brands</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* SECTION 2: Browse by Body Type */}
      <div className="pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-black text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00]" />
            Browse by Body Type
          </h4>
          {currentBody !== 'All' && (
            <button
              onClick={() => onSelectBody('All')}
              className="text-[10px] font-bold text-[#ff6a00] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* All Body Types */}
          <button
            onClick={() => onSelectBody('All')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all ${
              currentBody === 'All'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-[#111111]'
            }`}
          >
            <span>All Body Types</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold ${
                currentBody === 'All' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {Object.values(bodyCounts).reduce((acc, curr) => acc + curr, 0)}
            </span>
          </button>

          {bodyTypeConfigs.map((cfg) => {
            const Icon = cfg.icon;
            const count = bodyCounts[cfg.type] || 0;
            const isSelected = currentBody === cfg.type;

            return (
              <button
                key={cfg.type}
                onClick={() => onSelectBody(isSelected ? 'All' : cfg.type)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all group ${
                  isSelected
                    ? 'bg-[#ff6a00] text-white shadow-xs font-bold'
                    : 'text-neutral-700 hover:bg-[#fff4eb] hover:text-[#b34a00]'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-white' : 'text-neutral-400 group-hover:text-[#ff6a00]'
                    }`}
                  />
                  <span className="truncate">{cfg.label}</span>
                </span>

                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold shrink-0 ml-2 ${
                    isSelected
                      ? 'bg-[#e55f00] text-white'
                      : count > 0
                      ? 'bg-neutral-100 text-neutral-600 group-hover:bg-[#ffe8d6] group-hover:text-[#cc5500]'
                      : 'bg-neutral-50 text-neutral-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Browse by Category */}
      <div className="pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-black text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00]" />
            Browse by Category
          </h4>
          {currentCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="text-[10px] font-bold text-[#ff6a00] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* All Categories */}
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all ${
              currentCategory === 'All'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-[#111111]'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold ${
                currentCategory === 'All' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {Object.values(categoryCounts).reduce((acc, curr) => acc + curr, 0)}
            </span>
          </button>

          {categoryOptions.map((opt) => {
            const count = categoryCounts[opt.key] || 0;
            const isSelected = currentCategory === opt.key;

            return (
              <button
                key={opt.key}
                onClick={() => onSelectCategory(isSelected ? 'All' : opt.key)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all group ${
                  isSelected
                    ? 'bg-[#ff6a00] text-white shadow-xs font-bold'
                    : 'text-neutral-700 hover:bg-[#fff4eb] hover:text-[#b34a00]'
                }`}
                title={opt.description}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-neutral-300 group-hover:bg-[#ff8a33]'
                    }`}
                  />
                  <span className="truncate">{opt.label}</span>
                </span>

                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold shrink-0 ml-2 ${
                    isSelected
                      ? 'bg-[#e55f00] text-white'
                      : count > 0
                      ? 'bg-neutral-100 text-neutral-600 group-hover:bg-[#ffe8d6] group-hover:text-[#cc5500]'
                      : 'bg-neutral-50 text-neutral-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block bg-white border border-neutral-200 rounded-none p-4 shadow-sm h-fit sticky top-20">
        {sidebarContent}
      </aside>

      {/* Mobile Modal Drawer / Slide-over Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#111111]/60 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over Container */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
                <span className="font-black text-sm uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#ff6a00]" />
                  Vehicle Filters ({activeFiltersCount})
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-none text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {sidebarContent}
            </div>

            {/* Mobile Actions Footer */}
            <div className="pt-4 mt-6 border-t border-neutral-200 flex items-center gap-3">
              <button
                onClick={() => {
                  onResetAll();
                  onCloseMobile();
                }}
                className="flex-1 py-2.5 px-3 rounded-none border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  onApplyMobile();
                  onCloseMobile();
                }}
                className="flex-1 py-2.5 px-3 rounded-none bg-[#ff6a00] text-xs font-bold text-white hover:bg-[#e55f00] shadow-sm transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}