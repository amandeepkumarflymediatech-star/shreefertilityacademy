import { Order, Payment, User, PricingPackage, Coupon } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PaymentsManagementClient from "@/components/admin/PaymentsManagementClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Payments & Invoices | Admin Portal",
};

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const orderInstances = await Order.findAll({
    include: [
      {
        model: User,
        as: "student",
        attributes: ["id", "name", "email", "phone", "image"],
      },
      {
        model: Payment,
        as: "payment",
      },
      {
        model: PricingPackage,
        as: "package",
        attributes: ["id", "title", "price"],
      },
      {
        model: Coupon,
        as: "coupon",
        attributes: ["code", "discountValue", "discountType"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const orders = orderInstances.map((o) => {
    const plain = o.get({ plain: true }) as any;
    return {
      ...plain,
      createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : "",
      payment: plain.payment
        ? {
            ...plain.payment,
            createdAt: plain.payment.createdAt
              ? new Date(plain.payment.createdAt).toISOString()
              : "",
          }
        : null,
    };
  });

  return <PaymentsManagementClient orders={orders} />;
}
