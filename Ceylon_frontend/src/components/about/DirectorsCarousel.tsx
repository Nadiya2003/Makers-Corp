'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Linkedin, Mail, Globe, Twitter, X } from 'lucide-react';

interface Director {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
}

interface DirectorsCarouselProps {
  directors: Director[];
}

// ─── Reusable Director Card ────────────────────────────────────────────────────
function DirectorCard({ director, onClick }: { director: Director; onClick: () => void }) {
  const emailLink = director.email ? `mailto:${director.email}` : null;
  const linkedinLink = director.linkedin || null;
  const twitterLink = director.twitter || null;
  const websiteLink = director.website || null;

  return (
    <div 
      onClick={onClick}
      className="relative flex flex-col h-full bg-white/80 hover:bg-white/95 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/40 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
    >
      {/* Photo Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 flex-shrink-0">
        {director.image ? (
          <Image
            src={director.image}
            alt={director.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 font-medium text-sm">No Photo</span>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity" />
        
        {/* View Profile Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-10 pointer-events-none">
          <span className="bg-primary backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-lg shadow-primary/30 whitespace-nowrap">
            View Profile
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <h3 className="font-display font-bold text-lg sm:text-xl text-dark mb-1 group-hover:text-primary transition-colors duration-300 leading-snug">
          {director.name}
        </h3>
        <p className="text-primary font-bold text-[11px] uppercase tracking-widest mb-3">
          {director.role}
        </p>
        <p className="text-gray-500 leading-relaxed text-sm flex-1 mb-5 line-clamp-3 whitespace-pre-line group-hover:text-gray-700 transition-colors">
          {director.bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100/60 flex-wrap">
          {linkedinLink && (
            <a
              href={linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-primary hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {twitterLink && (
            <a
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-primary hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110"
              title="Twitter Profile"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
          )}
          {emailLink && (
            <a
              href={emailLink}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-primary hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {websiteLink && (
            <a
              href={websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-primary hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110"
              title="Website"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
          {!linkedinLink && !twitterLink && !emailLink && !websiteLink && (
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Makers Ceylon Executive</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Carousel ─────────────────────────────────────────────────────────────
export function DirectorsCarousel({ directors }: DirectorsCarouselProps) {
  // ── HOOKS ────────────────────────────────────────────────────────────────
  const [visibleCount, setVisibleCount] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

  const dragStartX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Detect screen size
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1280) setVisibleCount(4);
      else if (w >= 1024) setVisibleCount(3);
      else if (w >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(visibleCount);
  }, [visibleCount]);

  const n = directors.length;

  // Build clones
  const clonesBefore: Director[] = [];
  for (let i = 0; i < visibleCount; i++) {
    const idx = ((n - visibleCount + i) % n + n) % n;
    clonesBefore.push(directors[idx]);
  }
  const clonesAfter: Director[] = [];
  for (let i = 0; i < visibleCount; i++) {
    clonesAfter.push(directors[i % n]);
  }
  const extendedDirectors = [...clonesBefore, ...directors, ...clonesAfter];

  // Controls
  const nextSlide = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };
  const prevSlide = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  };

  // Loop boundary jump
  useEffect(() => {
    if (!isTransitioning) return;
    if (currentIndex >= n + visibleCount) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(visibleCount);
      }, 520);
      return () => clearTimeout(t);
    } else if (currentIndex < visibleCount) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(n + visibleCount - 1);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [currentIndex, isTransitioning, n, visibleCount]);

  // Re-enable transition
  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => setIsTransitioning(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  // Auto-play (pause if modal is open)
  useEffect(() => {
    if (n <= 1 || isHovered || isDragging || selectedDirector) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }
    autoPlayTimer.current = setInterval(nextSlide, 4000);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [n, isHovered, isDragging, currentIndex, isTransitioning, selectedDirector]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (selectedDirector) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedDirector]);

  // Drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - dragStartX.current);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 60) prevSlide();
    else if (dragOffset < -60) nextSlide();
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX.current);
  };
  const handleMouseUp = () => handleTouchEnd();

  // ── EARLY RETURNS ────────────────────────────────────────────────────────
  if (!directors || n === 0) return null;

  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="animate-pulse flex gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 rounded-[2.5rem] overflow-hidden">
              <div className="aspect-square bg-gray-200 w-full" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const trackWidth = trackRef.current ? trackRef.current.offsetWidth : 1200;
  const dragOffsetPercent = (dragOffset / trackWidth) * 100;
  const translationPercent = -(currentIndex * (100 / extendedDirectors.length)) + dragOffsetPercent;
  const activeIndex = ((currentIndex - visibleCount) % n + n) % n;

  return (
    <>
      {n === 1 ? (
        // Single director view
        <div className="flex justify-center py-4">
          <div className="w-full max-w-sm">
            <DirectorCard 
              director={directors[0]} 
              onClick={() => setSelectedDirector(directors[0])} 
            />
          </div>
        </div>
      ) : (
        // Slider view
        <div
          className="relative w-full py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsDragging(false);
            setDragOffset(0);
          }}
        >
          {/* Slider Viewport */}
          <div className="relative w-full overflow-hidden py-10 -my-10 px-2 -mx-2">
            <div
              ref={trackRef}
              className="flex select-none cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate3d(${translationPercent}%, 0, 0)`,
                transition: (isDragging || !isTransitioning) ? 'none' : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)',
                width: `${(extendedDirectors.length / visibleCount) * 100}%`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {extendedDirectors.map((director, index) => (
                <div
                  key={index}
                  style={{ width: `${100 / extendedDirectors.length}%` }}
                  className="px-3 sm:px-4 flex flex-col"
                >
                  <DirectorCard 
                    director={director} 
                    onClick={() => {
                      if (!isDragging && Math.abs(dragOffset) < 10) {
                        setSelectedDirector(director);
                      }
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-[40%] -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-20 px-0">
            <button
              onClick={prevSlide}
              className="w-12 h-12 -ml-6 rounded-full bg-white hover:bg-primary hover:text-white text-dark flex items-center justify-center shadow-xl border border-gray-100 hover:border-primary transition-all duration-300 pointer-events-auto hover:scale-105 active:scale-95"
              title="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 -mr-6 rounded-full bg-white hover:bg-primary hover:text-white text-dark flex items-center justify-center shadow-xl border border-gray-100 hover:border-primary transition-all duration-300 pointer-events-auto hover:scale-105 active:scale-95"
              title="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2.5 mt-8">
            {directors.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index + visibleCount);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-8 bg-primary shadow-sm' : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedDirector && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDirector(null)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedDirector(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full z-20 transition-all duration-300 group shadow-md hover:shadow-lg active:scale-95"
                title="Close"
              >
                <X className="w-5 h-5 text-dark group-hover:rotate-90 transition-transform duration-300" />
              </button>
              
              {/* Image Side */}
              <div className="relative w-full md:w-2/5 h-72 md:h-auto bg-gray-100 flex-shrink-0 order-1 md:order-none">
                 {selectedDirector.image ? (
                   <Image 
                     src={selectedDirector.image} 
                     alt={selectedDirector.name} 
                     fill 
                     className="object-cover" 
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                     <span className="text-gray-400 font-medium">No Photo</span>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
              </div>
              
              {/* Content Side */}
              <div className="p-6 sm:p-10 md:p-12 flex-1 overflow-y-auto custom-scrollbar order-2 md:order-none bg-white">
                <div className="flex flex-col mb-6">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-dark leading-none tracking-tight mb-2">
                    {selectedDirector.name}
                  </h2>
                  <p className="text-primary font-black text-xs sm:text-sm uppercase tracking-[0.2em]">
                    {selectedDirector.role}
                  </p>
                </div>
                
                <div className="w-12 h-1.5 bg-gray-100 mb-8 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-primary rounded-full" />
                </div>
                
                <div className="prose prose-sm sm:prose-base prose-gray max-w-none text-gray-600 mb-10 whitespace-pre-line leading-relaxed font-medium">
                  {selectedDirector.bio || "No biography provided."}
                </div>
                
                {/* Modal Social Links */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 flex-wrap">
                  {selectedDirector.linkedin && (
                    <a
                      href={selectedDirector.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-[#0077b5] hover:text-white text-gray-500 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {selectedDirector.twitter && (
                    <a
                      href={selectedDirector.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-[#1DA1F2] hover:text-white text-gray-500 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Twitter className="w-4 h-4" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {selectedDirector.email && (
                    <a
                      href={`mailto:${selectedDirector.email}`}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-primary hover:text-white text-gray-500 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </a>
                  )}
                  {selectedDirector.website && (
                    <a
                      href={selectedDirector.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-dark hover:text-white text-gray-500 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

