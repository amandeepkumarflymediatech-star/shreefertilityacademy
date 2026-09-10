"use client";

import { useState, useMemo } from "react";
import { 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  X, 
  TrendingUp, 
  RefreshCw,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "@/actions/admin-actions";
import { toast } from "sonner";

type OrderItem = {
  id: string;
  studentId: string;
  membershipId?: string | null;
  couponId?: string | null;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  student?: {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
    image?: string | null;
  } | null;
  package?: {
    id: string;
    title: string;
    price: number;
  } | null;
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    merchantTransactionId: string;
    phonepeTransactionId?: string | null;
    createdAt: string;
  } | null;
  coupon?: {
    code: string;
    discountValue: number;
    discountType: string;
  } | null;
};

interface Props {
  orders: OrderItem[];
}

export default function PaymentsManagementClient({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status edit modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>("PAID");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "PAID")
      .reduce((sum, o) => sum + (o.amount || 0), 0);
  }, [orders]);

  const paidCount = orders.filter((o) => o.status === "PAID").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const failedCount = orders.filter((o) => o.status === "FAILED").length;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.student?.name?.toLowerCase().includes(q) ||
        order.student?.email.toLowerCase().includes(q) ||
        order.payment?.merchantTransactionId?.toLowerCase().includes(q) ||
        order.payment?.phonepeTransactionId?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenStatusModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsSubmitting(true);
      await updateOrderStatus(selectedOrder.id, newStatus);
      toast.success("Order payment status updated successfully");
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = [
      "Order ID",
      "Student Name",
      "Student Email",
      "Phone",
      "Amount (INR)",
      "Status",
      "PhonePe Txn ID",
      "Merchant Txn ID",
      "Date",
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${o.student?.name || ""}"`,
      `"${o.student?.email || ""}"`,
      `"${o.student?.phone || ""}"`,
      o.amount,
      o.status,
      `"${o.payment?.phonepeTransactionId || ""}"`,
      `"${o.payment?.merchantTransactionId || ""}"`,
      `"${new Date(o.createdAt).toLocaleString("en-US")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payments_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payments CSV exported successfully");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-accent/10 text-accent font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={13} /> Admin Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">
            Payments & Transactions
          </h1>
          <p className="text-primary/70 mt-1 font-sans text-base">
            Review live PhonePe transactions, verify student invoices, and monitor platform revenue.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-secondary/10 hover:bg-primary hover:text-white text-primary font-bold px-5 py-3 rounded-2xl border border-secondary/20 transition-all duration-300 text-sm cursor-pointer shadow-sm"
        >
          <Download size={18} /> Export Payments CSV
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Total Revenue
              </p>
              <h3 className="text-3xl font-black text-accent mt-2 font-playfair">
                ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
              <DollarSign size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <TrendingUp size={14} className="text-accent" /> Completed Purchases
          </p>
        </div>

        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Paid Transactions
              </p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2 font-playfair">
                {paidCount}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <CreditCard size={14} className="text-emerald-500" /> Successful settlements
          </p>
        </div>

        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Pending Orders
              </p>
              <h3 className="text-3xl font-black text-amber-600 mt-2 font-playfair">
                {pendingCount}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
              <Clock size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <RefreshCw size={14} className="text-amber-500" /> Awaiting gateway response
          </p>
        </div>

        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Failed / Expired
              </p>
              <h3 className="text-3xl font-black text-rose-600 mt-2 font-playfair">
                {failedCount}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
              <AlertCircle size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <X size={14} className="text-rose-500" /> Cancelled or gateway drops
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
          <input
            type="text"
            placeholder="Search by student name, email, order ID, or PhonePe Txn ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:border-accent focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter size={18} className="text-primary/40 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-secondary/5 border border-secondary/20 rounded-2xl px-4 py-3 text-xs font-bold text-primary uppercase tracking-widest outline-none focus:border-accent cursor-pointer"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid / Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-secondary/20 rounded-3xl shadow-sm overflow-hidden">
        {paginatedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/5 border-b border-secondary/10">
                  <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    Order / Txn ID
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    Student
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    Package / Item
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    Amount Paid
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    Date & Time
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest text-right">
                    Invoice & Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {paginatedOrders.map((order) => {
                  const txnId = order.payment?.phonepeTransactionId || order.payment?.merchantTransactionId || "N/A";

                  return (
                    <tr key={order.id} className="hover:bg-secondary/5 transition-colors group">
                      {/* Order ID & Txn ID */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-primary bg-secondary/10 px-2 py-0.5 rounded">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <button
                              onClick={() => handleCopy(order.id, `ord-${order.id}`)}
                              className="text-primary/40 hover:text-accent transition-colors"
                              title="Copy Order ID"
                            >
                              {copiedId === `ord-${order.id}` ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            </button>
                          </div>
                          {order.payment && (
                            <p className="text-[10px] text-primary/50 font-mono flex items-center gap-1">
                              <span>Txn: {txnId.slice(0, 16)}...</span>
                              <button
                                onClick={() => handleCopy(txnId, `txn-${order.id}`)}
                                className="text-primary/40 hover:text-accent transition-colors"
                                title="Copy Full Txn ID"
                              >
                                {copiedId === `txn-${order.id}` ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                              </button>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20 shrink-0">
                            {order.student?.name ? order.student.name[0].toUpperCase() : "S"}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm">
                              {order.student?.name || "Student"}
                            </p>
                            <p className="text-xs text-primary/60">{order.student?.email}</p>
                            {order.student?.phone && (
                              <p className="text-[10px] text-primary/40">{order.student.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Package Item */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-primary text-xs bg-secondary/10 px-2.5 py-1 rounded-lg inline-block">
                          {order.package?.title || "Reproductive Medicine Fellowship"}
                        </span>
                        {order.coupon && (
                          <p className="text-[10px] text-emerald-600 font-bold mt-1">
                            Coupon: {order.coupon.code}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-primary">
                          ₹{order.amount.toFixed(2)}
                        </div>
                        <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                          {order.currency || "INR"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6">
                        <div className="text-xs text-primary/80 font-medium">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-[10px] text-primary/50">
                          {new Date(order.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleOpenStatusModal(order)}
                          title="Click to update status"
                          className="cursor-pointer"
                        >
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                              order.status === "PAID"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : order.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                                : order.status === "REFUNDED"
                                ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            } transition-colors`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.status === "PAID"
                                  ? "bg-emerald-500"
                                  : order.status === "PENDING"
                                  ? "bg-amber-500"
                                  : order.status === "REFUNDED"
                                  ? "bg-blue-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {order.status}
                          </span>
                        </button>
                      </td>

                      {/* Actions & Invoice */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/invoice/${order.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white bg-secondary/10 hover:bg-primary px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm"
                            title="View / Print Tax Invoice"
                          >
                            <FileText size={14} className="text-accent" />
                            <span>Invoice</span>
                            <ArrowUpRight size={12} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-primary/30">
              <CreditCard size={32} />
            </div>
            <p className="text-primary/70 font-medium">No payment transactions found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-secondary/10 bg-secondary/5">
            <p className="text-xs text-primary/60">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-white border border-secondary/20 text-primary disabled:opacity-40 hover:bg-secondary/10 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-primary px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-white border border-secondary/20 text-primary disabled:opacity-40 hover:bg-secondary/10 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-secondary/20 relative">
            <button
              onClick={() => {
                setIsStatusModalOpen(false);
                setSelectedOrder(null);
              }}
              className="absolute top-6 right-6 p-2 text-primary/50 hover:text-primary rounded-full hover:bg-secondary/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full inline-block mb-2">
                Admin Controls
              </span>
              <h3 className="text-2xl font-black text-primary font-playfair">
                Update Order Status
              </h3>
              <p className="text-xs text-primary/60 mt-1">
                Order: <strong>#{selectedOrder.id.slice(0, 8).toUpperCase()}</strong> • Amount:{" "}
                <strong>₹{selectedOrder.amount.toFixed(2)}</strong>
              </p>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Select New Payment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-accent"
                >
                  <option value="PAID">PAID (Payment Verified & Completed)</option>
                  <option value="PENDING">PENDING (Payment In Progress)</option>
                  <option value="FAILED">FAILED (Payment Failed / Cancelled)</option>
                  <option value="REFUNDED">REFUNDED (Refund Issued to Student)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary/20 font-bold text-xs text-primary hover:bg-secondary/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-accent font-bold text-xs text-white shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
