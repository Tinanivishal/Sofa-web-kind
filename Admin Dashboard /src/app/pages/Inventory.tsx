import React from 'react';
import { AlertCircle, TrendingDown, Package, Edit } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const inventoryData = [
  {
    id: 1,
    product: 'Premium Velvet Sofa Fabric',
    sku: 'VEL-001',
    stock: 45,
    reorderLevel: 20,
    lastRestocked: '2026-02-15',
    status: 'In Stock'
  },
  {
    id: 2,
    product: 'Luxury Blackout Curtains',
    sku: 'CUR-002',
    stock: 28,
    reorderLevel: 25,
    lastRestocked: '2026-02-10',
    status: 'In Stock'
  },
  {
    id: 3,
    product: 'Decorative Cushion Set',
    sku: 'CUSH-003',
    stock: 12,
    reorderLevel: 15,
    lastRestocked: '2026-02-18',
    status: 'Low Stock'
  },
  {
    id: 4,
    product: 'Leather Repair Kit',
    sku: 'REP-004',
    stock: 3,
    reorderLevel: 10,
    lastRestocked: '2026-01-28',
    status: 'Critical'
  },
  {
    id: 5,
    product: 'Cotton Blend Fabric',
    sku: 'FAB-005',
    stock: 67,
    reorderLevel: 30,
    lastRestocked: '2026-02-20',
    status: 'In Stock'
  },
  {
    id: 6,
    product: 'Silk Curtain Fabric',
    sku: 'FAB-006',
    stock: 0,
    reorderLevel: 20,
    lastRestocked: '2026-01-15',
    status: 'Out of Stock'
  },
];

const stockHistory = [
  { date: '2026-02-25', product: 'Premium Velvet Sofa Fabric', type: 'Sale', quantity: -2, stock: 45 },
  { date: '2026-02-24', product: 'Luxury Blackout Curtains', type: 'Sale', quantity: -1, stock: 28 },
  { date: '2026-02-23', product: 'Decorative Cushion Set', type: 'Sale', quantity: -3, stock: 12 },
  { date: '2026-02-20', product: 'Cotton Blend Fabric', type: 'Restock', quantity: +50, stock: 67 },
  { date: '2026-02-18', product: 'Decorative Cushion Set', type: 'Restock', quantity: +15, stock: 15 },
];

export default function Inventory() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">In Stock</Badge>;
      case 'Low Stock':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Low Stock</Badge>;
      case 'Critical':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Critical</Badge>;
      case 'Out of Stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const lowStockItems = inventoryData.filter(item => item.stock <= item.reorderLevel);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  {inventoryData.length}
                </h3>
              </div>
              <Package className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
                <h3 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1">
                  {lowStockItems.filter(item => item.status === 'Low Stock').length}
                </h3>
              </div>
              <TrendingDown className="w-10 h-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Critical Stock</p>
                <h3 className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                  {lowStockItems.filter(item => item.status === 'Critical').length}
                </h3>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
                <h3 className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                  {inventoryData.filter(item => item.status === 'Out of Stock').length}
                </h3>
              </div>
              <Package className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-200">Low Stock Alert</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  {lowStockItems.length} products need restocking. Please review inventory levels below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-medium text-gray-900 dark:text-white">Current Stock Levels</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">{item.product}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{item.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={item.stock}
                        className="w-20"
                        readOnly
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{item.reorderLevel} units</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{item.lastRestocked}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock History */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-medium text-gray-900 dark:text-white">Recent Stock Activity</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity Change</TableHead>
                <TableHead>Stock After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockHistory.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-gray-700 dark:text-gray-300">{entry.date}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{entry.product}</TableCell>
                  <TableCell>
                    <Badge variant={entry.type === 'Restock' ? 'default' : 'secondary'}>
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={entry.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-white">{entry.stock} units</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
