export const metadata = {
  title: 'Refund Policy | Shree Fertility Academy',
  description: 'Refund and cancellation policy for Shree Fertility Academy',
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-black text-primary font-playfair tracking-tight mb-8">Refund Policy</h1>
        
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-secondary/20 prose prose-slate max-w-none prose-headings:font-playfair prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80">
          <p className="text-sm text-primary/60 font-bold uppercase tracking-widest mb-8">Last Updated: September 2026</p>
          
          <h2>1. Overview</h2>
          <p>
            At Shree Fertility Academy, we strive to provide the highest quality clinical education and fellowship training. Due to the digital and intensive nature of our programs, our refund policy is designed to be fair to both our students and our faculty.
          </p>

          <h2>2. Digital Courses & Fellowships</h2>
          <p>
            For digital-only courses and online fellowship modules:
          </p>
          <ul>
            <li><strong>7-Day Guarantee:</strong> If you are completely unsatisfied with the course content, you may request a full refund within 7 days of purchase, provided you have completed less than 20% of the course material.</li>
            <li>Requests made after 7 days, or if more than 20% of the course has been accessed, will not be eligible for a refund.</li>
          </ul>

          <h2>3. Offline / Hands-on Training</h2>
          <p>
            For offline clinical attachments and hands-on training programs:
          </p>
          <ul>
            <li>Cancellations made <strong>30 days or more</strong> before the start date of the program will receive a full refund minus a 10% administrative fee.</li>
            <li>Cancellations made between <strong>14 and 29 days</strong> before the start date will receive a 50% refund.</li>
            <li>No refunds will be issued for cancellations made <strong>less than 14 days</strong> before the start date, as clinical slots and faculty time have been firmly allocated.</li>
          </ul>

          <h2>4. Exceptional Circumstances</h2>
          <p>
            We understand that medical professionals may face unexpected emergencies. In documented cases of medical emergencies or unavoidable professional obligations, Shree Fertility Academy may, at its sole discretion, offer a credit voucher for future courses instead of a refund.
          </p>

          <h2>5. How to Request a Refund</h2>
          <p>
            To request a refund or cancellation, please email our support team at <a href="mailto:info@shreefertilityacademy.com">info@shreefertilityacademy.com</a> with your full name, order number, and reason for the request. We aim to process all approved refunds within 7-10 business days.
          </p>
        </div>
      </div>
    </main>
  );
}
