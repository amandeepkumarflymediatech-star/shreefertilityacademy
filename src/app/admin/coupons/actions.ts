'use server';

import { Coupon } from '@/models';
import { Op } from 'sequelize';
import { revalidatePath } from 'next/cache';

export async function createCoupon(data: {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses?: number;
  validUntil?: Date;
}) {
  try {
    const existing = await Coupon.findOne({
      where: { code: data.code.toUpperCase() }
    });

    if (existing) {
      return { success: false, error: 'Coupon code already exists.' };
    }

    await Coupon.create({
      code: data.code.toUpperCase(),
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxUses: data.maxUses || undefined,
      validUntil: data.validUntil || undefined,
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    console.error('Error creating coupon:', error);
    return { success: false, error: 'Failed to create coupon.' };
  }
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
  try {
    await Coupon.update(
      { isActive: !currentStatus },
      { where: { id } }
    );
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status.' };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await Coupon.destroy({
      where: { id }
    });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete coupon.' };
  }
}

export async function updateCoupon(id: string, data: {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses?: number;
  validUntil?: Date;
}) {
  try {
    const existing = await Coupon.findOne({
      where: { code: data.code.toUpperCase(), id: { [Op.ne]: id } }
    });

    if (existing) {
      return { success: false, error: 'Coupon code already exists.' };
    }

    await Coupon.update({
      code: data.code.toUpperCase(),
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxUses: data.maxUses || undefined,
      validUntil: data.validUntil || undefined,
    }, {
      where: { id }
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    console.error('Error updating coupon:', error);
    return { success: false, error: 'Failed to update coupon.' };
  }
}

