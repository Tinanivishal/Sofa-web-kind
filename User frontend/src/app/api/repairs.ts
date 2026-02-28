import { apiFetch, PaginatedResponse } from './client';
import type { RepairBooking } from '../context/AppContext';

interface ApiRepair {
  id: string;
  userId: string;
  repairType: string;
  description: string;
  bookingDate: string;
  slot: string;
  status: string;
  estimatedCost?: number | string;
}

export const createRepairBooking = async (data: {
  repairType: string;
  description: string;
  bookingDate: string;
  slot: string;
  estimatedCost?: number;
}): Promise<ApiRepair> => {
  return apiFetch<ApiRepair>('/repairs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const fetchMyRepairs = async (): Promise<RepairBooking[]> => {
  const response = await apiFetch<PaginatedResponse<ApiRepair>>(
    '/repairs?page=1&limit=50',
  );

  return response.data.map(booking => ({
    id: booking.id,
    type: booking.repairType,
    date: new Date(booking.bookingDate).toLocaleDateString(),
    time: booking.slot,
    address: '',
    status: booking.status as RepairBooking['status'],
    estimatedCost:
      typeof booking.estimatedCost === 'string'
        ? Number(booking.estimatedCost)
        : booking.estimatedCost ?? 0,
    images: [],
  }));
};

