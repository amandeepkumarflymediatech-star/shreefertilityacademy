import { CheckCircle2 } from "lucide-react";
import PhonePeCheckoutButton from "@/components/student/PhonePeCheckoutButton";

export const metadata = {
  title: "Enroll in IVF Mentorship | Shree Fertility Academy",
};

export default function EnrollPage() {
  const packagePrice = 60000;
  
  return (
    <div className="min-h-screen pt-32 pb-24 font-sans bg-secondary-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-primary font-playfair tracking-tight mb-6">
            Begin Your Career in IVF
          </h1>
          <p className="text-primary/70 text-lg md:text-xl font-medium leading-relaxed">
            Join the most comprehensive mentorship program led by expert doctors and technicians.
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent font-bold uppercase tracking-widest text-xs rounded-full mb-4">
              Premium Package
            </span>
            <h2 className="text-3xl font-black text-primary font-playfair mb-2">1 Year Membership</h2>
            <div className="flex items-end gap-2 text-primary">
              <span className="text-5xl font-black font-playfair tracking-tight">₹{packagePrice.toLocaleString()}</span>
              <span className="text-primary/50 font-bold uppercase tracking-widest text-sm mb-1">/ year</span>
            </div>
          </div>

          <div className="space-y-4 mb-10 border-t border-border pt-8">
            {[
              "1 Year Full Membership Access",
              "12 Exclusive Scheduled Classes",
              "Mentorship from Top IVF Doctors",
              "Dynamic Class Reminders via Email",
              "Direct Q&A and Case Discussions",
              "Certificate of Completion"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                <p className="font-bold text-primary/80">{feature}</p>
              </div>
            ))}
          </div>

          <PhonePeCheckoutButton 
            amount={packagePrice} 
            label="Enroll Now via PhonePe" 
          />
          
          <p className="text-center text-xs font-bold text-primary/40 uppercase tracking-widest mt-6">
            Secure payment powered by PhonePe V2
          </p>
        </div>
      </div>
    </div>
  );
}
