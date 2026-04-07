import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-ink-black">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center font-mono text-base font-medium">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
