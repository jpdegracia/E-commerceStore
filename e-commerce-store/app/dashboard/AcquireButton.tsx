"use client";

import { ShoppingCart } from "lucide-react";
import { addToCart } from "../cart/action";

interface AcquireButtonProps {
  productId: number;
}

export default function AcquireButton({ productId }: AcquireButtonProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent full page reload
    
    try {
      // 1. Run our backend action
      await addToCart(productId, 1);
      
      // 2. Shout to the Navbar to update the count instantly!
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (error) {
      console.error("Failed to queue item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-auto">
      <button 
        type="submit"
        className="btn btn-outline-info w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
      >
        <ShoppingCart size={16} /> 
        Acquire Unit
      </button>
    </form>
  );
}