'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { markets, Market, SupportedPort } from '@/data';

type DisplayCurrency = 'USD' | 'JPY' | 'INR' | 'LKR';

interface MarketContextType {
  destinationSlug: string | null;
  market: Market | null;
  selectedPortId: string | null;
  selectedPort: SupportedPort | null;
  displayCurrency: DisplayCurrency;
  exchangeRates: Record<DisplayCurrency, number>;
  setDestination: (slug: string | null) => void;
  setPortId: (portId: string | null) => void;
  setDisplayCurrency: (curr: DisplayCurrency) => void;
  clearDestination: () => void;
  formatPrice: (
    amountUSD: number,
    options?: {
      overrideCurrency?: DisplayCurrency;
      showCurrencyLabel?: boolean;
    }
  ) => { formatted: string; isConverted: boolean; currency: DisplayCurrency };
}

const EXCHANGE_RATES: Record<DisplayCurrency, number> = {
  USD: 1,
  JPY: 155.0,
  INR: 84.5,
  LKR: 300.0
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [destinationSlug, setDestinationSlugState] = useState<string | null>(null);
  const [selectedPortId, setSelectedPortIdState] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrencyState] = useState<DisplayCurrency>('USD');
  const [isInitialized, setIsInitialized] = useState(false);

  // Synchronize from URL if on dedicated destination page: /destinations/.../[country]
  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith('/destinations/asia/india')) {
      setDestinationSlugState('india');
    } else if (pathname.startsWith('/destinations/asia/sri-lanka')) {
      setDestinationSlugState('sri-lanka');
    } else if (pathname.startsWith('/destinations/asia/pakistan')) {
      setDestinationSlugState('pakistan');
    } else if (pathname.startsWith('/destinations/africa/kenya')) {
      setDestinationSlugState('kenya');
    } else if (pathname.startsWith('/destinations/africa/tanzania')) {
      setDestinationSlugState('tanzania');
    } else if (!isInitialized) {
      // Restore from localStorage only once on initial client mount if not on explicit URL
      try {
        const savedDest = localStorage.getItem('mcj_destination');
        const savedPort = localStorage.getItem('mcj_port');
        const savedCurr = localStorage.getItem('mcj_currency') as DisplayCurrency;

        if (savedDest && markets.some((m) => m.slug === savedDest)) {
          setDestinationSlugState(savedDest);
        }
        if (savedPort) {
          setSelectedPortIdState(savedPort);
        }
        if (savedCurr && ['USD', 'JPY', 'INR', 'LKR'].includes(savedCurr)) {
          setDisplayCurrencyState(savedCurr);
        }
      } catch (e) {
        // local storage unavailable
      }
      setIsInitialized(true);
    }
  }, [pathname, isInitialized]);

  const market = useMemo(() => {
    if (!destinationSlug) return null;
    return markets.find((m) => m.slug === destinationSlug) || null;
  }, [destinationSlug]);

  const selectedPort = useMemo(() => {
    if (!market || !selectedPortId) return null;
    return market.supportedPorts.find((p) => p.id === selectedPortId) || null;
  }, [market, selectedPortId]);

  // Set destination and validate / reset port
  const setDestination = useCallback((slug: string | null) => {
    setDestinationSlugState(slug);
    try {
      if (slug) {
        localStorage.setItem('mcj_destination', slug);
      } else {
        localStorage.removeItem('mcj_destination');
      }
    } catch {}

    if (!slug) {
      setSelectedPortIdState(null);
      try {
        localStorage.removeItem('mcj_port');
      } catch {}
      return;
    }

    // Check if current port is valid for new destination
    const targetMarket = markets.find((m) => m.slug === slug);
    if (targetMarket) {
      const primaryPort = targetMarket.supportedPorts.find((p) => p.isPrimary) || targetMarket.supportedPorts[0];
      const newPortId = primaryPort ? primaryPort.id : null;
      setSelectedPortIdState(newPortId);
      try {
        if (newPortId) localStorage.setItem('mcj_port', newPortId);
        else localStorage.removeItem('mcj_port');
      } catch {}
    } else {
      setSelectedPortIdState(null);
      try {
        localStorage.removeItem('mcj_port');
      } catch {}
    }
  }, []);

  const setPortId = useCallback((portId: string | null) => {
    setSelectedPortIdState(portId);
    try {
      if (portId) localStorage.setItem('mcj_port', portId);
      else localStorage.removeItem('mcj_port');
    } catch {}
  }, []);

  const setDisplayCurrency = useCallback((curr: DisplayCurrency) => {
    setDisplayCurrencyState(curr);
    try {
      localStorage.setItem('mcj_currency', curr);
    } catch {}
  }, []);

  const clearDestination = useCallback(() => {
    setDestination(null);
  }, [setDestination]);

  const formatPrice = useCallback(
    (
      amountUSD: number,
      options?: {
        overrideCurrency?: DisplayCurrency;
        showCurrencyLabel?: boolean;
      }
    ) => {
      const targetCurrency = options?.overrideCurrency || displayCurrency;
      const rate = EXCHANGE_RATES[targetCurrency] || 1;
      const converted = amountUSD * rate;
      const isConverted = targetCurrency !== 'USD';

      let formattedNumber: string;
      if (targetCurrency === 'JPY') {
        formattedNumber = Math.round(converted).toLocaleString('ja-JP');
      } else if (targetCurrency === 'INR') {
        formattedNumber = Math.round(converted).toLocaleString('en-IN');
      } else if (targetCurrency === 'LKR') {
        formattedNumber = Math.round(converted).toLocaleString('en-US');
      } else {
        formattedNumber = Math.round(converted).toLocaleString('en-US');
      }

      const label = options?.showCurrencyLabel !== false ? `${targetCurrency} ` : '';
      return {
        formatted: `${label}${formattedNumber}`,
        isConverted,
        currency: targetCurrency
      };
    },
    [displayCurrency]
  );

  return (
    <MarketContext.Provider
      value={{
        destinationSlug,
        market,
        selectedPortId,
        selectedPort,
        displayCurrency,
        exchangeRates: EXCHANGE_RATES,
        setDestination,
        setPortId,
        setDisplayCurrency,
        clearDestination,
        formatPrice
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
