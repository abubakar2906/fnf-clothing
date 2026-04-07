import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StorefrontLayout>
      {children}
      <CartDrawer />
    </StorefrontLayout>
  );
}