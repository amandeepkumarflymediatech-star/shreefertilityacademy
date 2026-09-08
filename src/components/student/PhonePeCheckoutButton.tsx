"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";

export default function PhonePeCheckoutButton({ 
  amount, 
  label, 
  variant = "default" 
}: { 
  amount: number, 
  label: string, 
  variant?: "default" | "dark" 
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, membershipPlanId: "IVF_MENTORSHIP" }),
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error(data.error || "Failed to initiate payment");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const btnClasses = variant === "dark"
    ? "w-full py-4 bg-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2"
    : "w-full py-4 bg-accent text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent/90 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-accent/40 hover:-translate-y-1";

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className={btnClasses}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <CreditCard size={18} />
      )}
      {loading ? "Processing..." : label}
    </button>
  );
}
