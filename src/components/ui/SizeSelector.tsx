import clsx from "clsx";

interface SizeSelectorProps {
  sizes: { size: string; inStock: boolean }[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {sizes.map(({ size, inStock }) => (
        <button
          key={size}
          type="button"
          onClick={() => inStock && onSelectSize(size)}
          disabled={!inStock}
          className={clsx(
            "min-w-[44px] min-h-[44px] flex items-center justify-center border text-sm font-sans uppercase",
            inStock
              ? selectedSize === size
                ? "bg-ink-black text-white border-ink-black"
                : "bg-white text-ink-black border-ink-black hover:bg-pale-grey"
              : "bg-light-grey text-mid-grey border-light-grey cursor-not-allowed line-through"
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
