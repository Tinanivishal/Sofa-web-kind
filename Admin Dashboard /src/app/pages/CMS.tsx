import React, { useState } from 'react';
import { Save, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const banners = [
  { id: 1, title: 'Winter Sale', subtitle: '50% Off on All Sofas', image: '🛋️', link: '/products/sofas' },
  { id: 2, title: 'New Arrivals', subtitle: 'Premium Curtains Collection', image: '🪟', link: '/products/curtains' },
];

const featuredProducts = [
  { id: 1, name: 'Premium Velvet Sofa Fabric', price: 299.99 },
  { id: 2, name: 'Luxury Blackout Curtains', price: 149.99 },
  { id: 3, name: 'Decorative Cushion Set', price: 79.99 },
];

const blogPosts = [
  { id: 1, title: '10 Tips for Choosing the Perfect Sofa', date: '2026-02-20', status: 'Published' },
  { id: 2, title: 'How to Clean and Maintain Your Curtains', date: '2026-02-15', status: 'Published' },
  { id: 3, title: 'Guide to DIY Furniture Repair', date: '2026-02-10', status: 'Draft' },
];

export default function CMS() {
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">CMS Pages</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage website content and pages</p>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Homepage */}
        <TabsContent value="homepage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input id="heroTitle" defaultValue="Transform Your Home with Premium Décor" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Input id="heroSubtitle" defaultValue="Quality furniture repair and home décor solutions" />
              </div>

              <div className="space-y-2">
                <Label>Hero Image</Label>
                <div className="flex gap-4 items-center">
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-4xl">
                    🏠
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Image
                  </Button>
                </div>
              </div>

              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Hero Section
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Featured Products</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-gray-900 dark:text-white">{product.name}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">${product.price}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banners */}
        <TabsContent value="banners" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Homepage Banners</CardTitle>
                <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Banner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Banner</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="bannerTitle">Banner Title</Label>
                        <Input id="bannerTitle" placeholder="e.g., Winter Sale" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bannerSubtitle">Subtitle</Label>
                        <Input id="bannerSubtitle" placeholder="e.g., 50% Off on All Sofas" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bannerLink">Link URL</Label>
                        <Input id="bannerLink" placeholder="/products/sofas" />
                      </div>

                      <div className="space-y-2">
                        <Label>Banner Image</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload banner image</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => setIsBannerDialogOpen(false)} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                        <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                          Save Banner
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                        {banner.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{banner.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{banner.subtitle}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Link: {banner.link}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog */}
        <TabsContent value="blog" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Blog Articles</CardTitle>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Article
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium text-gray-900 dark:text-white">{post.title}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{post.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          post.status === 'Published' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {post.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
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
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footerAbout">About Text</Label>
                <Textarea
                  id="footerAbout"
                  rows={4}
                  defaultValue="DecorHome is your trusted partner for premium home décor and professional furniture repair services."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="footerEmail">Contact Email</Label>
                  <Input id="footerEmail" type="email" defaultValue="contact@decorhome.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerPhone">Contact Phone</Label>
                  <Input id="footerPhone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerAddress">Address</Label>
                <Textarea
                  id="footerAddress"
                  rows={2}
                  defaultValue="123 Main Street, Suite 100, New York, NY 10001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input id="copyright" defaultValue="© 2026 DecorHome. All rights reserved." />
              </div>

              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Footer Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
