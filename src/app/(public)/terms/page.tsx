export const metadata = {
  title: 'Terms of Service | Shree Fertility Academy',
  description: 'Terms of service and conditions for Shree Fertility Academy',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-black text-primary font-playfair tracking-tight mb-8">Terms of Service</h1>
        
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-secondary/20 prose prose-slate max-w-none prose-headings:font-playfair prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80">
          <p className="text-sm text-primary/60 font-bold uppercase tracking-widest mb-8">Last Updated: September 2026</p>
          
          <h2>1. Terms</h2>
          <p>
            By accessing the website at Shree Fertility Academy, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials (information or software) on Shree Fertility Academy's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on the website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by Shree Fertility Academy at any time.
          </p>

          <h2>3. Medical Disclaimer</h2>
          <p>
            The courses, materials, and case studies provided by Shree Fertility Academy are for educational and training purposes only, specifically designed for medical professionals. They do not constitute formal medical advice, diagnosis, or treatment recommendations for specific patients. Practitioners must always use their own clinical judgment.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall Shree Fertility Academy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Shree Fertility Academy's website, even if Shree Fertility Academy or a Shree Fertility Academy authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2>5. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:info@shreefertilityacademy.com">info@shreefertilityacademy.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
