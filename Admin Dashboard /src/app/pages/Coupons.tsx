import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  AdminCoupon,
} from '../api/admin';

const defaultForm = {
  code: '',
  discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
  discountValue: 0,
  expiryDate: '',
  usageLimit: undefined as number | undefined,
};

export default function Coupons() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => fetchAdminCoupons(1, 100),
  });

  const coupons: AdminCoupon[] = (data?.data ?? []).filter(
    (c) =>
      !searchTerm ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => createCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      setCreateOpen(false);
      setFormData(defaultForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminCoupon> }) =>
      updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      setEditingCoupon(null);
      setFormData(defaultForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      code: formData.code.trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      expiryDate: formData.expiryDate || undefined,
      usageLimit: formData.usageLimit ?? undefined,
    });
  };

  const handleEdit = (coupon: AdminCoupon) => {
    setEditingCoupon(coupon);
    const end = coupon.expiryDate ?? coupon.endDate;
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      expiryDate: end ? end.slice(0, 10) : '',
      usageLimit: coupon.usageLimit,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      updateMutation.mutate({
        id: editingCoupon.id,
        data: {
          code: formData.code.trim(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          expiryDate: formData.expiryDate || undefined,
          usageLimit: formData.usageLimit ?? undefined,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon? This cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const displayDate = (c: AdminCoupon) => {
    const d = c.expiryDate ?? c.endDate;
    return d ? new Date(d).toLocaleDateString() : '—';
  };

  const displayDiscount = (c: AdminCoupon) =>
    c.discountType === 'PERCENTAGE'
      ? `${c.discountValue}%`
      : `$${Number(c.discountValue).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Coupons</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create and manage discount coupons
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Coupons</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {data?.meta?.total ?? coupons.length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Percentage</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {coupons.filter((c) => c.discountType === 'PERCENTAGE').length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Fixed amount</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {coupons.filter((c) => c.discountType === 'FIXED').length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Loading coupons...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-600 dark:text-red-400">
              Failed to load coupons.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Usage limit</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">
                        {coupon.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.discountType === 'PERCENTAGE' ? 'default' : 'secondary'}>
                        {coupon.discountType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {displayDiscount(coupon)}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {displayDate(coupon)}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {coupon.usageLimit ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(coupon)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(coupon.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && !isError && coupons.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No coupons found. Create one to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              New Coupon
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-code">Code</Label>
              <Input
                id="create-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. SAVE20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-type">Discount type</Label>
              <select
                id="create-type"
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as 'PERCENTAGE' | 'FIXED',
                  })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed amount</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-value">Discount value</Label>
              <Input
                id="create-value"
                type="number"
                min={0}
                step={formData.discountType === 'PERCENTAGE' ? 1 : 0.01}
                value={formData.discountValue || ''}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: e.target.value ? Number(e.target.value) : 0 })
                }
                required
              />
              {formData.discountType === 'PERCENTAGE' && (
                <p className="text-xs text-gray-500">Percentage (e.g. 20 for 20%)</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-expiry">Expiry date</Label>
              <Input
                id="create-expiry"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-limit">Usage limit (optional)</Label>
              <Input
                id="create-limit"
                type="number"
                min={1}
                value={formData.usageLimit ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editingCoupon} onOpenChange={() => setEditingCoupon(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          {editingCoupon && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Discount type</Label>
                <select
                  id="edit-type"
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountType: e.target.value as 'PERCENTAGE' | 'FIXED',
                    })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed amount</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Discount value</Label>
                <Input
                  id="edit-value"
                  type="number"
                  min={0}
                  step={formData.discountType === 'PERCENTAGE' ? 1 : 0.01}
                  value={formData.discountValue || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value ? Number(e.target.value) : 0 })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiry">Expiry date</Label>
                <Input
                  id="edit-expiry"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-limit">Usage limit (optional)</Label>
                <Input
                  id="edit-limit"
                  type="number"
                  min={1}
                  value={formData.usageLimit ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value ? parseInt(e.target.value, 10) : undefined,
                    })
                  }
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingCoupon(null)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
