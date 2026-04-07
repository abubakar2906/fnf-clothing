import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Adjusted padding-top to account for fixed navbar height */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
