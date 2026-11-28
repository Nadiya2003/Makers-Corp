'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Car,
  Layers,
  Sparkles,
  Truck,
  Compass
} from 'lucide-react';
import { VehicleCard } from '@/components/VehicleCard';
import { VehicleBrowseSidebar, categoryOptions } from '@/components/vehicles/VehicleBrowseSidebar';
import { vehicles, Vehicle, BodyType, FuelType, SteeringType } from '@/data';
import { fetchLiveVehicles } from '@/lib/api';
import { useMarket } from '@/context/MarketContext';
import { getReviewState } from '@/data/reviews';
import { markets } from '@/data';

function VehiclesCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { destinationSlug, setDestination, market } = useMarket();

  // Dynamic live vehicles state initialized with static catalog for instant render
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(vehicles);

  useEffect(() => {
    let isMounted = true;
    fetchLiveVehicles().then((live) => {
      if (isMounted && live && live.length > 0) {
        setAllVehicles(live);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [makeFilter, setMakeFilter] = useState(searchParams.get('make') || 'All');
  const [modelFilter, setModelFilter] = useState(searchParams.get('model') || 'All');
  const [bodyFilter, setBodyFilter] = useState(searchParams.get('body') || 'All');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [fuelFilter, setFuelFilter] = useState(searchParams.get('fuel') || 'All');
  const [steeringFilter, setSteeringFilter] = useState(searchParams.get('steering') || 'All');
  const [transmissionFilter, setTransmissionFilter] = useState(searchParams.get('trans') || 'All');
  const [availabilityFilter, setAvailabilityFilter] = useState(searchParams.get('status') || 'Available');
  const [maxMileage, setMaxMileage] = useState(searchParams.get('mileage') || 'All');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync destination filter from URL or context
  const currentDestination = searchParams.get('destination') !== null
    ? searchParams.get('destination') || ''
    : destinationSlug || '';

  // Synchronize internal state whenever searchParams changes (e.g. back/forward navigation or search from header)
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setMakeFilter(searchParams.get('make') || 'All');
    setModelFilter(searchParams.get('model') || 'All');
    setBodyFilter(searchParams.get('body') || 'All');
    setCategoryFilter(searchParams.get('category') || 'All');
    setFuelFilter(searchParams.get('fuel') || 'All');
    setSteeringFilter(searchParams.get('steering') || 'All');
    setTransmissionFilter(searchParams.get('trans') || 'All');
    setAvailabilityFilter(searchParams.get('status') || 'Available');
    setMaxMileage(searchParams.get('mileage') || 'All');
    setPriceRange(searchParams.get('price') || 'All');
    setSortBy(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Synchronize URL query params whenever filters change
  const updateUrl = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'All') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    router.replace(`/vehicles?${current.toString()}`, { scroll: false });
  };

  // Extract available makes and dependent models
  const availableMakes = useMemo(() => {
    const set = new Set<string>();
    allVehicles.forEach((v) => set.add(v.make));
    return ['All', ...Array.from(set).sort()];
  }, [allVehicles]);

  const availableModels = useMemo(() => {
    if (makeFilter === 'All') return ['All'];
    const set = new Set<string>();
    allVehicles.filter((v) => v.make === makeFilter).forEach((v) => set.add(v.model));
    return ['All', ...Array.from(set).sort()];
  }, [makeFilter, allVehicles]);

  // Reset model filter if make changes
  const handleMakeChange = (newMake: string) => {
    setMakeFilter(newMake);
    setModelFilter('All');
    updateUrl({ make: newMake, model: null });
  };

  const handleBodyChange = (newBody: string) => {
    setBodyFilter(newBody);
    updateUrl({ body: newBody });
  };

  const handleCategoryChange = (newCat: string) => {
    setCategoryFilter(newCat);
    updateUrl({ category: newCat });
  };

  // Reset all filters in one action
  const handleResetFilters = () => {
    setSearchTerm('');
    setMakeFilter('All');
    setModelFilter('All');
    setBodyFilter('All');
    setCategoryFilter('All');
    setFuelFilter('All');
    setSteeringFilter('All');
    setTransmissionFilter('All');
    setAvailabilityFilter('Available');
    setMaxMileage('All');
    setPriceRange('All');
    setSortBy('newest');
    router.replace('/vehicles', { scroll: false });
  };

  // Helper function to check if a vehicle matches the category filter
  const matchesCategory = (v: Vehicle, cat: string) => {
    if (cat === 'All') return true;
    if (cat === 'Hybrid') return v.fuel === 'Hybrid' || v.fuel === 'Plug-in Hybrid';
    if (cat === 'Electric') return v.fuel === 'Electric';
    if (cat === 'Automatic') return v.transmission === 'Automatic' || v.transmission === 'Dual-Clutch' || v.transmission === 'CVT';
    if (cat === 'Manual') return v.transmission === 'Manual';
    if (cat === 'Right-Hand Drive') return v.steering === 'RHD';
    if (cat === 'Left-Hand Drive') return v.steering === 'LHD';
    if (cat === 'Commercial Vehicles') return v.bodyType === 'Trucks & Commercial' || v.bodyType === 'Vans & MPVs';
    return true;
  };

  // Calculate Accurate Dynamic Counts for Brands (respecting destination, body, and category)
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableMakes.forEach((m) => {
      if (m === 'All') return;
      counts[m] = allVehicles.filter((v) => {
        if (v.availability === 'Sold' && availabilityFilter === 'Available') return false;
        if (currentDestination) {
          const review = getReviewState(v.stockId, currentDestination);
          if (review === 'not_offered') return false;
        }
        if (bodyFilter !== 'All' && v.bodyType !== bodyFilter) return false;
        if (!matchesCategory(v, categoryFilter)) return false;
        return v.make === m;
      }).length;
    });
    return counts;
  }, [availableMakes, currentDestination, bodyFilter, categoryFilter, availabilityFilter, allVehicles]);

  // Calculate Accurate Dynamic Counts for Body Types (respecting destination, make, and category)
  const bodyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const allBodies: BodyType[] = [
      'SUVs & 4x4',
      'Luxury & Performance',
      'Vans & MPVs',
      'Trucks & Commercial',
      'Sedans & Hatchbacks',
      'Kei Cars',
    ];
    allBodies.forEach((b) => {
      counts[b] = allVehicles.filter((v) => {
        if (v.availability === 'Sold' && availabilityFilter === 'Available') return false;
        if (currentDestination) {
          const review = getReviewState(v.stockId, currentDestination);
          if (review === 'not_offered') return false;
        }
        if (makeFilter !== 'All' && v.make !== makeFilter) return false;
        if (!matchesCategory(v, categoryFilter)) return false;
        return v.bodyType === b;
      }).length;
    });
    return counts;
  }, [currentDestination, makeFilter, categoryFilter, availabilityFilter, allVehicles]);

  // Calculate Accurate Dynamic Counts for Categories (respecting destination, make, and body)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryOptions.forEach((opt) => {
      counts[opt.key] = allVehicles.filter((v) => {
        if (v.availability === 'Sold' && availabilityFilter === 'Available') return false;
        if (currentDestination) {
          const review = getReviewState(v.stockId, currentDestination);
          if (review === 'not_offered') return false;
        }
        if (makeFilter !== 'All' && v.make !== makeFilter) return false;
        if (bodyFilter !== 'All' && v.bodyType !== bodyFilter) return false;
        return matchesCategory(v, opt.key);
      }).length;
    });
    return counts;
  }, [currentDestination, makeFilter, bodyFilter, availabilityFilter, allVehicles]);

  // Filter and sort the vehicles
  const filteredVehicles = useMemo(() => {
    return allVehicles
      .filter((v) => {
        // 1. Keyword / Stock ID / Model code search
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim();
          const matchTitle = `${v.year} ${v.make} ${v.model} ${v.grade}`.toLowerCase().includes(query);
          const matchStock = v.stockId.toLowerCase().includes(query);
          const matchCode = v.modelCode.toLowerCase().includes(query);
          if (!matchTitle && !matchStock && !matchCode) return false;
        }

        // 2. Make & Model
        if (makeFilter !== 'All' && v.make !== makeFilter) return false;
        if (modelFilter !== 'All' && v.model !== modelFilter) return false;

        // 3. Body Type
        if (bodyFilter !== 'All' && v.bodyType !== bodyFilter) return false;

        // 4. Category
        if (!matchesCategory(v, categoryFilter)) return false;

        // 5. Fuel
        if (fuelFilter !== 'All' && v.fuel !== fuelFilter) return false;

        // 6. Steering
        if (steeringFilter !== 'All' && v.steering !== steeringFilter) return false;

        // 7. Transmission
        if (transmissionFilter !== 'All' && v.transmission !== transmissionFilter) return false;

        // 8. Availability status
        if (availabilityFilter !== 'All' && v.availability !== availabilityFilter) return false;

        // 9. Mileage
        if (maxMileage !== 'All') {
          const maxKm = parseInt(maxMileage, 10);
          if (v.mileageKm > maxKm) return false;
        }

        // 10. Price (FOB USD)
        if (priceRange !== 'All') {
          const amount = v.priceFOB.amount;
          if (priceRange === 'under_20k' && amount >= 20000) return false;
          if (priceRange === '20k_50k' && (amount < 20000 || amount > 50000)) return false;
          if (priceRange === '50k_100k' && (amount < 50000 || amount > 100000)) return false;
          if (priceRange === 'over_100k' && amount <= 100000) return false;
        }

        // 11. Destination eligibility filter (respect destination, never silently switch to global)
        if (currentDestination) {
          const review = getReviewState(v.stockId, currentDestination);
          // Exclude units explicitly "Not Offered" for that destination
          if (review === 'not_offered') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return b.year - a.year || b.stockId.localeCompare(a.stockId);
        }
        if (sortBy === 'price_asc') {
          return a.priceFOB.amount - b.priceFOB.amount;
        }
        if (sortBy === 'price_desc') {
          return b.priceFOB.amount - a.priceFOB.amount;
        }
        if (sortBy === 'mileage_asc') {
          return a.mileageKm - b.mileageKm;
        }
        return 0;
      });
  }, [
    searchTerm,
    makeFilter,
    modelFilter,
    bodyFilter,
    categoryFilter,
    fuelFilter,
    steeringFilter,
    transmissionFilter,
    availabilityFilter,
    maxMileage,
    priceRange,
    currentDestination,
    sortBy,
    allVehicles,
  ]);

  const activeFiltersCount = [
    searchTerm.trim() !== '',
    makeFilter !== 'All',
    modelFilter !== 'All',
    bodyFilter !== 'All',
    categoryFilter !== 'All',
    fuelFilter !== 'All',
    steeringFilter !== 'All',
    transmissionFilter !== 'All',
    availabilityFilter !== 'Available',
    maxMileage !== 'All',
    priceRange !== 'All',
    currentDestination !== '',
  ].filter(Boolean).length;

  const currentMarketObj = markets.find((m) => m.slug === currentDestination);

  return (
    <div className="bg-white min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-xs text-neutral-500 mb-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-neutral-400">Showroom</span> /{' '}
            <span className="font-bold text-neutral-800">Global Inventory</span>
            {currentDestination && (
              <>
                {' '}/
                <span className="font-bold text-[#ff6a00] uppercase bg-[#fff4eb] px-1.5 py-0.2 rounded-none border border-[#ffd1ad]">
                  {currentMarketObj ? currentMarketObj.name : currentDestination} Reviewed
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                Japan Vehicle Inventory Catalog
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Showing{' '}
                <strong className="text-[#111111] font-extrabold">{filteredVehicles.length}</strong> physical vehicles
                inspected in Tokyo, Yokohama, Kobe & Nagoya yards.
              </p>
            </div>

            {/* Destination Mode Indicator */}
            {currentDestination && (
              <div className="inline-flex items-center gap-2 bg-[#fff4eb] border border-[#ffd1ad] px-3.5 py-2 rounded-none text-xs shadow-xs">
                <Globe className="w-4 h-4 text-[#ff6a00] shrink-0" />
                <span className="text-neutral-700">
                  Market: <strong className="text-[#111111] font-black">{currentMarketObj ? currentMarketObj.name : currentDestination.toUpperCase()}</strong>
                </span>
                <button
                  onClick={() => {
                    setDestination(null);
                    updateUrl({ destination: null });
                  }}
                  className="text-[11px] font-bold text-[#e55f00] hover:text-[#b34a00] hover:underline ml-1.5 pl-1.5 border-l border-[#ffd1ad]"
                >
                  Clear to Global
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Primary Search & Fast Filter Bar */}
        <div className="bg-white border border-neutral-200 rounded-none p-3.5 sm:p-4 mb-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateUrl({ q: e.target.value || null });
                }}
                placeholder="Search by Keyword, Model, or Stock ID (e.g. MCJ-2024-8801, GT-R, LX 600)..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none pl-9 pr-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#ff6a00] focus:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    updateUrl({ q: null });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Destination Selector */}
            <div>
              <select
                value={currentDestination}
                onChange={(e) => {
                  const val = e.target.value;
                  setDestination(val || null);
                  updateUrl({ destination: val || null });
                }}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 font-semibold focus:outline-none focus:border-[#ff6a00] focus:bg-white"
              >
                <option value="">Global Showroom (All)</option>
                <option value="india">India (Nhava Sheva / Chennai)</option>
                <option value="sri-lanka">Sri Lanka (Colombo Port)</option>
                <option value="kenya">Kenya (Mombasa Port)</option>
                <option value="tanzania">Tanzania (Dar es Salaam)</option>
                <option value="pakistan">Pakistan (Inquiry Only)</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateUrl({ sort: e.target.value });
                }}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-[#ff6a00] focus:bg-white font-bold"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Price: Low to High (FOB)</option>
                <option value="price_desc">Price: High to Low (FOB)</option>
                <option value="mileage_asc">Mileage: Low to High</option>
              </select>
            </div>
          </div>

          {/* Removable Active Filter Chips & Mobile Filter Button */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-neutral-500 text-[11px] font-bold">Active Filters:</span>
              {activeFiltersCount === 0 && (
                <span className="text-neutral-400 text-[11px] italic">None (Showing all active stock)</span>
              )}

              {/* Destination Chip */}
              {currentDestination && (
                <span className="inline-flex items-center gap-1 bg-[#ffe8d6] text-[#b34a00] border border-[#ffd1ad] px-2 py-0.5 rounded-none text-[11px] font-bold">
                  <span>Destination: {currentMarketObj ? currentMarketObj.name : currentDestination}</span>
                  <button onClick={() => { setDestination(null); updateUrl({ destination: null }); }}>
                    <X className="w-3 h-3 text-[#ff6a00] hover:text-[#993f00]" />
                  </button>
                </span>
              )}

              {/* Search Query Chip */}
              {searchTerm.trim() !== '' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-none text-[11px] font-medium border border-neutral-200">
                  <span>Query: &quot;{searchTerm}&quot;</span>
                  <button onClick={() => { setSearchTerm(''); updateUrl({ q: null }); }}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </span>
              )}

              {/* Make Chip */}
              {makeFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-none text-[11px] font-medium border border-neutral-200">
                  <span>Brand: {makeFilter}</span>
                  <button onClick={() => handleMakeChange('All')}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </span>
              )}

              {/* Model Chip */}
              {modelFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-none text-[11px] font-medium border border-neutral-200">
                  <span>Model: {modelFilter}</span>
                  <button onClick={() => { setModelFilter('All'); updateUrl({ model: null }); }}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </span>
              )}

              {/* Body Type Chip */}
              {bodyFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-none text-[11px] font-medium border border-neutral-200">
                  <span>Body: {bodyFilter}</span>
                  <button onClick={() => handleBodyChange('All')}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </span>
              )}

              {/* Category Chip */}
              {categoryFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-none text-[11px] font-medium border border-neutral-200">
                  <span>Category: {categoryFilter}</span>
                  <button onClick={() => handleCategoryChange('All')}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </span>
              )}

              {/* Steering Chip */}
              {steeringFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-none text-[11px] font-medium border border-neutral-200">
                  <span>Steering: {steeringFilter}</span>
                  <button onClick={() => { setSteeringFilter('All'); updateUrl({ steering: null }); }}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </span>
              )}

              {/* Price Range Chip */}
              {priceRange !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-none text-[11px] font-medium border border-neutral-200">
                  <span>Price: {priceRange.replace('_', ' ')}</span>
                  <button onClick={() => { setPriceRange('All'); updateUrl({ price: null }); }}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                </span>
              )}

              {/* Reset All Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#ff6a00] hover:text-[#e55f00] font-extrabold ml-1 flex items-center gap-1 px-1.5 py-0.5 rounded-none hover:bg-[#fff4eb] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-none border border-neutral-200 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#ff6a00] text-white text-[10px] font-black w-4 h-4 rounded-none flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Catalog Main Layout: Connected Sidebar + Vehicle Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Connected Vehicle Browse Sidebar */}
          <div className="lg:col-span-1">
            <VehicleBrowseSidebar
              makes={availableMakes}
              currentMake={makeFilter}
              onSelectMake={handleMakeChange}
              currentBody={bodyFilter}
              onSelectBody={handleBodyChange}
              currentCategory={categoryFilter}
              onSelectCategory={handleCategoryChange}
              brandCounts={brandCounts}
              bodyCounts={bodyCounts}
              categoryCounts={categoryCounts}
              onResetAll={handleResetFilters}
              activeFiltersCount={activeFiltersCount}
              mobileOpen={mobileFilterOpen}
              onCloseMobile={() => setMobileFilterOpen(false)}
              onApplyMobile={() => setMobileFilterOpen(false)}
            />
          </div>

          {/* Results Listings Grid */}
          <div className="lg:col-span-3">
            {filteredVehicles.length === 0 ? (
              /* Honest No-Results State respecting selected destination */
              <div className="bg-white border border-neutral-200 rounded-none p-8 sm:p-12 text-center shadow-xs">
                <div className="w-14 h-14 rounded-none bg-[#ffe8d6] text-[#ff6a00] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-[#111111] mb-2">
                  No Matching Vehicles Found
                  {currentDestination && ` for ${currentMarketObj ? currentMarketObj.name : currentDestination.toUpperCase()}`}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-6 leading-relaxed">
                  {currentDestination ? (
                    <>
                      We could not find active inventory matching your specific filters that is reviewed for{' '}
                      <strong>{currentMarketObj ? currentMarketObj.name : currentDestination}</strong>.
                      We strictly do not substitute unverified global inventory for destination-restricted markets.
                    </>
                  ) : (
                    'We could not find any active units matching your selected combination of brand, body type, and filters.'
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 bg-[#111111] text-white text-xs font-bold px-4 py-2.5 rounded-none hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>

                  <button
                    onClick={() => router.push('/request-a-vehicle')}
                    className="inline-flex items-center gap-1.5 bg-[#ff6a00] text-white text-xs font-bold px-4 py-2.5 rounded-none hover:bg-[#e55f00] transition-colors shadow-xs"
                  >
                    <span>Request Custom Sourcing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredVehicles.map((vehicle, idx) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    destinationOverride={currentDestination || undefined}
                    priority={idx < 6}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VehiclesClient() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading catalog...</div>}>
      <VehiclesCatalogContent />
    </Suspense>
  );
}
