"use client";

import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { decreaseFromCart, increaseCartItem } from "./action";
import { useState } from "react";

interface QuantityControlProps {
  itemId: number;
  quantity: number;
}

export default function QuantityControl({ itemId, quantity }: QuantityControlProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Triggered by the Left Arrow
  const handleDecrease = async () => {
    setIsUpdating(true);
    await decreaseFromCart(itemId);
    window.dispatchEvent(new Event("cart-updated"));
    setIsUpdating(false);
  };

  // Triggered by the Right Arrow
  const handleIncrease = async () => {
    setIsUpdating(true);
    await increaseCartItem(itemId);
    window.dispatchEvent(new Event("cart-updated"));
    setIsUpdating(false);
  };

  return (
    <div className="d-flex align-items-center bg-dark border border-secondary rounded-3 shadow-sm overflow-hidden" style={{ maxWidth: '120px' }}>
      
      {/* Left Arrow / Delete Button */}
      <button 
        onClick={handleDecrease}
        disabled={isUpdating}
        className="btn btn-dark border-0 px-2 py-1 text-warning hover-bg-secondary transition-all"
        title={quantity === 1 ? "Delete Item" : "Decrease Quantity"}
      >
        {quantity === 1 ? <Trash2 size={16} className="text-danger" /> : <ChevronLeft size={16} />}
      </button>

      {/* Current Quantity Display */}
      <div className="flex-grow-1 text-center text-white fw-bold px-2" style={{ fontSize: '0.9rem' }}>
        {isUpdating ? "..." : quantity}
      </div>

      {/* Right Arrow Button */}
      <button 
        onClick={handleIncrease}
        disabled={isUpdating}
        className="btn btn-dark border-0 px-2 py-1 text-info hover-bg-secondary transition-all"
        title="Increase Quantity"
      >
        <ChevronRight size={16} />
      </button>

    </div>
  );
}