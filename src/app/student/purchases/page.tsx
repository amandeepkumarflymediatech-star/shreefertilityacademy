import { Order, PricingPackage } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight, CreditCard } from "lucide-react";

export default async function StudentPurchasesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch paid orders for invoices
  const paidOrders = await Order.findAll({
    where: { studentId: session.user.id, status: 'PAID' },
    order: [['createdAt', 'DESC']],
    include: [{
      model: PricingPackage,
      as: 'package'
    }]
  });


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div>
        <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Purchase History</h1>
        <p className="text-primary/70 mt-2 text-lg">View your past transactions and download invoices.</p>
      </div>

      <div className="bg-white border border-secondary/20 flex flex-col rounded-[2rem] shadow-[0_10px_40px_rgba(36,16,79,0.03)] overflow-hidden">
        <div className="flex justify-between items-center p-8 border-b border-secondary/10 bg-white/50 backdrop-blur-sm">
          <h3 className="text-2xl font-black text-primary font-playfair tracking-tight flex items-center gap-3">
            <FileText className="text-accent" size={24} /> Invoices
          </h3>
        </div>
        <div className="p-6">
          {paidOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-secondary/10">
                    <th className="py-3 px-4 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Order ID</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Item</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Date</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Amount</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-primary/50 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paidOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-secondary/5 hover:bg-secondary/5 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-primary bg-secondary/10 px-2 py-1 rounded-md">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-primary">
                        {order.membership ? 'Reproductive Medicine Fellowship' : 'Course Enrollment'}
                      </td>
                      <td className="py-4 px-4 text-sm text-primary/70">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-accent">
                        ₹{order.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link 
                          href={`/invoice/${order.id}`}
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-primary hover:bg-accent px-4 py-2 rounded-lg transition-colors"
                        >
                          View Invoice <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center text-primary/20">
                <CreditCard size={32} />
              </div>
              <p className="text-primary/50 text-sm font-medium">No purchase history found.</p>
              <Link href="/pricing" className="text-accent font-bold text-sm hover:underline">View Pricing Plans</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
