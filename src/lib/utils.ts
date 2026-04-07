export function formatPrice(amount: number): string {
  return `\u20A6${amount.toLocaleString('en-NG')}`;
}

export function calculateSavings(price: number, salePrice: number): number {
  return Math.round(((price - salePrice) / price) * 100);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}