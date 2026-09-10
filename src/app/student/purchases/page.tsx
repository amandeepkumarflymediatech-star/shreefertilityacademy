import { Order, PricingPackage, Coupon, Payment } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight, CreditCard, CheckCircle, Tag } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudentPurchasesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch all completed/paid orders for this student
  const rawOrders = await Order.findAll({
    where: { 
      studentId: session.user.id, 
      status: "PAID" 
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: PricingPackage,
        as: 'package'
      },
      {
        model: Coupon,
        as: 'coupon'
      },
      {
        model: Payment,
        as: 'payment'
      }
    ]
  });

  const paidOrders = JSON.parse(JSON.stringify(rawOrders));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div>
        <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Purchase History</h1>
        <p className="text-primary/70 mt-2 text-lg">View your past transactions, enrolled packages, and download tax invoices.</p>
      </div>

      <div className="bg-white border border-secondary/20 flex flex-col rounded-[2rem] shadow-[0_10px_40px_rgba(36,16,79,0.03)] overflow-hidden">
        <div className="flex justify-between items-center p-8 border-b border-secondary/10 bg-secondary/5">
          <h3 className="text-2xl font-black text-primary font-playfair tracking-tight flex items-center gap-3">
            <FileText className="text-accent" size={24} /> Official Invoices & Packages
          </h3>
          <span className="text-xs font-bold uppercase tracking-widest text-primary/60 bg-white border border-secondary/20 px-3 py-1.5 rounded-xl">
            {paidOrders.length} {paidOrders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        <div className="p-6">
          {paidOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-secondary/20 text-primary/50 text-[11px] font-bold uppercase tracking-widest">
                    <th className="py-4 px-4">Order ID</th>
                    <th className="py-4 px-4">Package / Course</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {paidOrders.map((order: any) => {
                    const packageTitle = order.package?.title || "Reproductive Medicine Fellowship Mentorship";
                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    });

                    return (
                      <tr key={order.id} className="border-b border-secondary/10 last:border-0 hover:bg-secondary/5 transition-colors">
                        <td className="py-5 px-4">
                          <span className="text-xs font-mono font-bold text-primary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-lg inline-block">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-sm font-bold text-primary">{packageTitle}</p>
                          {order.coupon && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                              <Tag size={10} /> Coupon: {order.coupon.code}
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-4 text-sm text-primary/70 font-medium">
                          {orderDate}
                        </td>
                        <td className="py-5 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            <CheckCircle size={13} /> Paid
                          </span>
                        </td>
                        <td className="py-5 px-4">
                          <span className="text-base font-bold text-primary">
                            ₹{Number(order.amount).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-right">
                          <Link 
                            href={`/invoice/${order.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-primary px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow"
                          >
                            View Invoice <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center text-primary/40 border border-secondary/20">
                <CreditCard size={36} />
              </div>
              <div>
                <h4 className="text-xl font-bold font-playfair text-primary">No purchase history found</h4>
                <p className="text-primary/60 text-sm mt-1 max-w-sm mx-auto">
                  You haven't enrolled in any mentorship packages yet. Choose a package to start learning.
                </p>
              </div>
              <Link 
                href="/pricing" 
                className="px-6 py-3 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-accent/20 inline-flex items-center gap-2 mt-2"
              >
                Browse Packages <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
