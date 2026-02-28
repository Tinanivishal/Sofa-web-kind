import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const mockCategories = [
  { id: 1, name: 'Sofa Materials', slug: 'sofa-materials', products: 45, description: 'Premium fabrics and materials for sofas' },
  { id: 2, name: 'Curtains', slug: 'curtains', products: 28, description: 'Curtains and window treatments' },
  { id: 3, name: 'Cushions', slug: 'cushions', products: 35, description: 'Decorative cushions and pillows' },
  { id: 4, name: 'Fabrics', slug: 'fabrics', products: 52, description: 'Various fabric types and materials' },
  { id: 5, name: 'Repair Materials', slug: 'repair-materials', products: 18, description: 'Tools and materials for repairs' },
];

export default function Categories() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage product categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input id="categoryName" placeholder="e.g., Sofa Materials" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="e.g., sofa-materials" />
                <p className="text-xs text-gray-500 dark:text-gray-400">URL-friendly version of the name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter category description" rows={3} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                  Save Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Categories</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{mockCategories.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {mockCategories.reduce((sum, cat) => sum + cat.products, 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Products/Category</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {Math.round(mockCategories.reduce((sum, cat) => sum + cat.products, 0) / mockCategories.length)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">{category.name}</TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 max-w-xs">{category.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category.products} products</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
