interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
}

export type { Coupon };