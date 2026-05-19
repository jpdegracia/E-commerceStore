"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Category = {
  id: number;
  name: string;
  image: string;
};

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Smooth scroll logic for the arrows
  const scroll = (direction: "left" | "right") => {
    if (trackRef.current) {
      // Scrolls by roughly 80% of the visible container width
      const scrollAmount = trackRef.current.clientWidth * 0.8; 
      trackRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (categories.length === 0) {
    return <div className="text-muted text-center py-4 border border-secondary rounded">No classifications available.</div>;
  }

  return (
    <div className="position-relative slider-wrapper">
      
      {/* Left Scroll Arrow */}
      <button 
        onClick={() => scroll("left")} 
        className="btn btn-dark border border-secondary rounded-circle position-absolute top-50 translate-middle-y shadow-lg slider-btn z-2 d-none d-md-flex align-items-center justify-content-center"
        style={{ left: "-20px", width: "45px", height: "45px" }}
      >
        <ChevronLeft className="text-info" size={24} />
      </button>

      {/* The 2-Row Grid Track */}
      <div ref={trackRef} className="category-track py-2 px-1">
        {categories.map((cat) => (
          <div key={cat.id} className="category-slide">
            <Link href={`/dashboard/category/${cat.id}`} className="text-decoration-none">
              <div className="card crm-hover-lift bg-secondary border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="card-img-top" 
                  style={{ height: '110px', objectFit: 'cover' }} 
                />
                <div className="card-body bg-dark text-center py-2 px-1 d-flex align-items-center justify-content-center">
                  <h6 className="mb-0 fw-bold text-white small text-truncate px-2 w-100">{cat.name}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Right Scroll Arrow */}
      <button 
        onClick={() => scroll("right")} 
        className="btn btn-dark border border-secondary rounded-circle position-absolute top-50 translate-middle-y shadow-lg slider-btn z-2 d-none d-md-flex align-items-center justify-content-center"
        style={{ right: "-20px", width: "45px", height: "45px" }}
      >
        <ChevronRight className="text-info" size={24} />
      </button>

      {/* 🚀 Pure CSS for the 2-Row Sliding Grid */}
      <style dangerouslySetInnerHTML={{__html: `
        .category-track {
          display: grid;
          grid-template-rows: repeat(2, 1fr); /* Forces exactly 2 rows! */
          grid-auto-flow: column; /* Fills top, then bottom, then moves right */
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none; /* Hides scrollbar in Firefox */
        }
        .category-track::-webkit-scrollbar {
          display: none; /* Hides scrollbar in Chrome/Safari */
        }
        .category-slide {
          scroll-snap-align: start;
        }
        
        /* 💻 Desktop: Shows 5 columns (10 items total visible) */
        @media (min-width: 992px) {
          .category-track { grid-auto-columns: calc((100% - 4rem) / 5); }
        }
        /* 📱 Tablet: Shows 3 columns (6 items total visible) */
        @media (min-width: 576px) and (max-width: 991px) {
          .category-track { grid-auto-columns: calc((100% - 2rem) / 3); }
        }
        /* 📱 Mobile: Shows 2 columns (4 items total visible) */
        @media (max-width: 575px) {
          .category-track { grid-auto-columns: calc((100% - 1rem) / 2); }
        }
        
        .slider-btn {
          transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.2s;
        }
        .slider-btn:hover {
          transform: translateY(-50%) scale(1.1);
          background-color: #1a1d20 !important;
        }
      `}} />
    </div>
  );
}