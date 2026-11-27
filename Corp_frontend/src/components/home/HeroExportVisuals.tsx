'use client';

import React from 'react';
import Image from 'next/image';
import { Ship, Anchor, Navigation, ArrowRight } from 'lucide-react';

export function CountryFlag({
  country,
  className = 'w-6 h-4',
}: {
  country: 'sri-lanka' | 'india' | 'russia' | 'uae' | 'japan';
  className?: string;
}) {
  switch (country) {
    case 'sri-lanka':
      return (
        <svg
          viewBox="0 0 1200 600"
          className={`shrink-0 rounded-none shadow-xs border border-white/20 ${className}`}
          aria-label="National Flag of Sri Lanka"
        >
          {/* Gold Border */}
          <rect width="1200" height="600" fill="#FFBE29" />
          {/* Outer Border Inset */}
          <rect x="25" y="25" width="1150" height="550" fill="#000000" fillOpacity="0.08" />
          {/* Green Stripe */}
          <rect x="50" y="50" width="150" height="500" fill="#005A36" />
          {/* Orange Stripe */}
          <rect x="225" y="50" width="150" height="500" fill="#EB7400" />
          {/* Maroon Panel */}
          <rect x="400" y="50" width="750" height="500" fill="#8D153A" />
          {/* Gold Bo Leaves in 4 corners of Maroon panel */}
          <path d="M430,80 Q460,95 445,125 Q420,110 430,80 Z" fill="#FFBE29" />
          <path d="M1120,80 Q1090,95 1105,125 Q1130,110 1120,80 Z" fill="#FFBE29" />
          <path d="M430,520 Q460,505 445,475 Q420,490 430,520 Z" fill="#FFBE29" />
          <path d="M1120,520 Q1090,505 1105,475 Q1130,490 1120,520 Z" fill="#FFBE29" />
          {/* Stylized Golden Lion with Kastane Sword */}
          <g fill="#FFBE29">
            {/* Sword */}
            <rect x="730" y="200" width="180" height="18" rx="2" transform="rotate(-35 730 200)" />
            <path d="M840,115 L860,135 L825,145 Z" />
            {/* Lion Head & Mane */}
            <circle cx="770" cy="240" r="45" />
            <circle cx="795" cy="225" r="25" />
            <circle cx="815" cy="245" r="16" />
            <path d="M740,240 Q710,210 740,180 Q780,180 770,220 Z" />
            {/* Crown */}
            <polygon points="760,180 775,155 790,180 805,160 820,185" />
            {/* Body */}
            <path d="M720,260 Q660,250 630,300 Q620,380 680,410 Q740,410 760,350 Q770,300 720,260 Z" />
            {/* Front Leg raising sword */}
            <path d="M740,270 L770,210 L790,230 L760,300 Z" />
            {/* Other Legs */}
            <rect x="720" y="360" width="30" height="90" rx="6" />
            <rect x="640" y="360" width="30" height="90" rx="6" />
            {/* Tail looping up over back */}
            <path d="M630,310 Q580,260 620,200 Q660,170 650,210 Q630,230 650,280 Z" />
          </g>
        </svg>
      );

    case 'india':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`shrink-0 rounded-none shadow-xs border border-white/20 ${className}`}
          aria-label="National Flag of India"
        >
          {/* Saffron */}
          <rect width="900" height="200" fill="#FF9933" />
          {/* White */}
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          {/* Green */}
          <rect y="400" width="900" height="200" fill="#138808" />
          {/* Ashoka Chakra */}
          <g transform="translate(450, 300)">
            <circle r="80" fill="none" stroke="#000080" strokeWidth="6" />
            <circle r="16" fill="#000080" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2="-78"
                stroke="#000080"
                strokeWidth="3.5"
                transform={`rotate(${i * 15})`}
              />
            ))}
          </g>
        </svg>
      );

    case 'russia':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`shrink-0 rounded-none shadow-xs border border-white/20 ${className}`}
          aria-label="National Flag of Russia"
        >
          <rect width="900" height="200" fill="#FFFFFF" />
          <rect y="200" width="900" height="200" fill="#0039A6" />
          <rect y="400" width="900" height="200" fill="#D52B1E" />
        </svg>
      );

    case 'uae':
      return (
        <svg
          viewBox="0 0 1200 600"
          className={`shrink-0 rounded-none shadow-xs border border-white/20 ${className}`}
          aria-label="National Flag of the United Arab Emirates"
        >
          {/* Green Top */}
          <rect x="300" y="0" width="900" height="200" fill="#00732F" />
          {/* White Middle */}
          <rect x="300" y="200" width="900" height="200" fill="#FFFFFF" />
          {/* Black Bottom */}
          <rect x="300" y="400" width="900" height="200" fill="#000000" />
          {/* Red Hoist Vertical */}
          <rect x="0" y="0" width="300" height="600" fill="#FF0000" />
        </svg>
      );

    case 'japan':
    default:
      return (
        <svg
          viewBox="0 0 900 600"
          className={`shrink-0 rounded-none shadow-xs border border-white/20 ${className}`}
          aria-label="National Flag of Japan"
        >
          <rect width="900" height="600" fill="#FFFFFF" />
          <circle cx="450" cy="300" r="180" fill="#BC002D" />
        </svg>
      );
  }
}

export function MakersCeylonBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#111111]/90 backdrop-blur-md border border-[#ff6a00]/60 rounded-none shadow-sm">
      <div className="relative w-6 h-6 shrink-0">
        <Image
          src="/images/makers-mark.png"
          alt="Makers Ceylon Mark"
          fill
          sizes="24px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[11px] font-black tracking-widest text-white uppercase leading-none">
          MAKERS CEYLON
        </span>
        <span className="text-[9px] font-bold tracking-wider text-[#ff6a00] uppercase mt-0.5">
          Official Sri Lanka Export Entity
        </span>
      </div>
    </div>
  );
}

export function ExportRoutePlaque({
  destinationName,
  destinationPort,
  transitDays,
  flag,
  shippingType = 'Direct Ro-Ro & Dedicated Container',
}: {
  destinationName: string;
  destinationPort: string;
  transitDays: string;
  flag: 'sri-lanka' | 'india' | 'russia' | 'uae';
  shippingType?: string;
}) {
  return (
    <div className="bg-[#111111]/85 backdrop-blur-md border border-neutral-700 p-3 sm:p-3.5 rounded-none text-left max-w-md w-full shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2">
        <div className="flex items-center gap-2">
          <CountryFlag country="japan" className="w-5 h-3.5" />
          <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase">
            Tokyo / Yokohama Hub
          </span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#ff6a00]" />
        <div className="flex items-center gap-2">
          <CountryFlag country={flag} className="w-5 h-3.5" />
          <span className="text-[10px] font-mono font-bold text-white uppercase">
            {destinationPort}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <span className="text-neutral-400 block font-medium">Estimated Ocean Transit:</span>
          <span className="text-white font-bold">{transitDays}</span>
        </div>
        <div>
          <span className="text-neutral-400 block font-medium">Service Method:</span>
          <span className="text-[#ff6a00] font-bold">{shippingType}</span>
        </div>
      </div>
    </div>
  );
}

export function WorldExportMap() {
  return (
    <div className="relative w-full h-full min-h-[260px] flex items-center justify-center p-2">
      <svg
        viewBox="0 0 1000 480"
        className="w-full h-full max-h-[360px] object-contain opacity-90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff9f43" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global Grid Latitude / Longitude lines */}
        <g stroke="#262626" strokeWidth="0.75" strokeDasharray="3 3">
          <line x1="0" y1="120" x2="1000" y2="120" />
          <line x1="0" y1="240" x2="1000" y2="240" />
          <line x1="0" y1="360" x2="1000" y2="360" />
          <line x1="200" y1="0" x2="200" y2="480" />
          <line x1="400" y1="0" x2="400" y2="480" />
          <line x1="600" y1="0" x2="600" y2="480" />
          <line x1="800" y1="0" x2="800" y2="480" />
        </g>

        {/* Simplified Continents Contours */}
        <g fill="#1f1f1f" stroke="#333333" strokeWidth="1">
          {/* Eurasia */}
          <path d="M480,100 Q560,80 660,90 Q760,110 820,130 Q840,160 810,210 Q760,250 710,240 Q670,280 620,270 Q580,240 520,230 Q460,200 460,150 Z" />
          {/* Indian Subcontinent */}
          <path d="M630,220 L680,225 L650,300 Z" fill="#222222" />
          {/* Sri Lanka */}
          <ellipse cx="660" cy="325" rx="8" ry="12" fill="#2a2a2a" stroke="#ff6a00" strokeWidth="1" />
          {/* Middle East & Arabian Peninsula */}
          <path d="M560,200 L610,215 L590,265 L540,245 Z" fill="#222222" />
          {/* Africa */}
          <path d="M480,200 Q540,210 540,280 Q510,380 470,410 Q430,360 440,260 Z" />
          {/* North America */}
          <path d="M140,80 Q240,60 300,110 Q280,190 220,230 Q160,220 130,160 Z" />
          {/* South America */}
          <path d="M230,250 Q310,270 290,380 Q250,440 220,380 Q210,300 230,250 Z" />
          {/* Australia */}
          <path d="M780,310 Q860,300 880,360 Q840,420 780,390 Q760,340 780,310 Z" />
          {/* Japan Archipelago (Sourcing Origin - Highlighted) */}
          <g filter="url(#glow)">
            <path
              d="M840,165 Q855,150 865,140 M835,175 Q850,185 860,180 M825,190 Q835,195 845,190"
              stroke="#ff6a00"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Export Routes Radiating from Japan (Yokohama 850, 175) */}
        <g stroke="url(#routeGradient)" strokeWidth="2" strokeDasharray="6 4" fill="none">
          {/* Japan -> Sri Lanka (Hambantota: 660, 325) */}
          <path d="M850,175 Q780,270 660,325" />
          {/* Japan -> India (Nhava Sheva/Mumbai: 635, 240) */}
          <path d="M850,175 Q760,200 635,240" />
          {/* Japan -> Russia (Vladivostok: 820, 140) */}
          <path d="M850,175 Q830,150 820,140" stroke="#ff9f43" strokeWidth="2.5" />
          {/* Japan -> UAE (Dubai / Jebel Ali: 585, 230) */}
          <path d="M850,175 Q730,180 585,230" />
          {/* Japan -> East Africa (Mombasa: 520, 310) */}
          <path d="M850,175 Q700,320 520,310" strokeOpacity="0.5" />
          {/* Japan -> Europe / Global Pacific */}
          <path d="M850,175 Q920,130 980,110" strokeOpacity="0.4" />
        </g>

        {/* Origin: Japan Pulsing Node */}
        <g transform="translate(850, 175)">
          <circle r="16" fill="#ff6a00" fillOpacity="0.2">
            <animate attributeName="r" values="8;24;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="6" fill="#ff6a00" stroke="#ffffff" strokeWidth="2" />
          <rect x="-45" y="-30" width="90" height="18" fill="#111111" stroke="#ff6a00" strokeWidth="1" rx="0" />
          <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="monospace">
            TOKYO HUB
          </text>
        </g>

        {/* Destination Target Nodes */}
        {/* Sri Lanka (Colombo) */}
        <g transform="translate(660, 325)">
          <circle r="4" fill="#ff6a00" stroke="#ffffff" strokeWidth="1.5" />
          <text x="-4" y="16" textAnchor="end" fill="#ffffff" fontSize="9" fontWeight="800">
            Colombo
          </text>
        </g>

        {/* India (Nhava Sheva) */}
        <g transform="translate(635, 240)">
          <circle r="4" fill="#ff6a00" stroke="#ffffff" strokeWidth="1.5" />
          <text x="-8" y="-6" textAnchor="end" fill="#ffffff" fontSize="9" fontWeight="800">
            Mumbai / JNPT
          </text>
        </g>

        {/* Russia (Vladivostok) */}
        <g transform="translate(820, 140)">
          <circle r="4" fill="#ff6a00" stroke="#ffffff" strokeWidth="1.5" />
          <text x="-8" y="-4" textAnchor="end" fill="#ffffff" fontSize="9" fontWeight="800">
            Vladivostok
          </text>
        </g>

        {/* UAE (Jebel Ali / Dubai) */}
        <g transform="translate(585, 230)">
          <circle r="4" fill="#ff6a00" stroke="#ffffff" strokeWidth="1.5" />
          <text x="-8" y="14" textAnchor="end" fill="#ffffff" fontSize="9" fontWeight="800">
            Dubai
          </text>
        </g>

        {/* Shipping Vessel Icon in transit */}
        <g transform="translate(730, 260) rotate(-25)">
          <rect x="-12" y="-5" width="24" height="10" fill="#111111" stroke="#ff6a00" strokeWidth="1" />
          <polygon points="12,-5 18,0 12,5" fill="#ff6a00" />
          <circle cx="-4" cy="0" r="1.5" fill="#ffffff" />
          <circle cx="2" cy="0" r="1.5" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}
