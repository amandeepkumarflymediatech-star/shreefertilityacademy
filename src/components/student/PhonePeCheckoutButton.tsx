"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import CheckoutModal from "@/components/pricing/CheckoutModal";

export default function PhonePeCheckoutButton({ 
  amount, 
  label, 
  packageId,
  variant = "default" 
}: { 
  amount: number, 
  label: string, 
  packageId?: string,
  variant?: "default" | "dark" 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const btnClasses = variant === "dark"
    ? "w-full py-4 bg-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2"
    : "w-full py-4 bg-accent text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-accent/40 hover:-translate-y-1 cursor-pointer";

  const pkg = {
    id: packageId || "IVF_MENTORSHIP",
    title: "1 Year IVF Fellowship Mentorship",
    price: amount,
    classCount: 12,
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={btnClasses}
      >
        <CreditCard size={18} />
        {label}
      </button>

      <CheckoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pkg={pkg}
      />
    </>
  );
}
