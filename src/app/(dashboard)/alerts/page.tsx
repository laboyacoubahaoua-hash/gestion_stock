'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AlertProduct {
  id: string;
  reference: string;
  name: string;
  quantity_in_stock: number;
  min_stock_level: number;
  unit: string;
  categories?: { name: string };
  suppliers?: { name: string };
}

export default function AlertsPage() {
  const [lowStockProducts, setLowStockProducts] = useState<AlertProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name), suppliers(name)')
        .lte('quantity_in_stock', supabase.rpc('min_stock_level').select('min_stock_level'))
        .or('quantity_in_stock.lt.min_stock_level')
        .order('quantity_in_stock', { ascending: true });

      if (error) {
        const { data: fallbackData } = await supabase
          .from('products')
          .select('*, categories(name), suppliers(name)')
          .order('quantity_in_stock', { ascending: true })
          .limit(50);
        setLowStockProducts(fallbackData?.filter((p) => p.quantity_in_stock <= p.min_stock_level) || []);
      } else {
        setLowStockProducts(data?.filter((p) => p.quantity_in_stock <= p.min_stock_level) || []);
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockLevel = (product: AlertProduct) => {
    const percentage = (product.quantity_in_stock / product.min_stock_level) * 100;
    if (percentage <= 25) return { color: 'text-red-500', label: 'Critique' };
    if (percentage <= 50) return { color: 'text-orange-500', label: 'Bas' };
    return { color: 'text-yellow-500', label: 'Attention' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alertes de Stock</h1>
        <p className="text-muted-foreground">Produits nécessitant une réapprovision</p>
      </div>

      <div className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <span className="text-orange-700">
          {lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's' : ''} en stock bas
        </span>
      </div>

      {lowStockProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium text-green-600">Tout va bien !</p>
            <p className="text-muted-foreground">Aucun produit en stock bas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lowStockProducts.map((product) => {
            const stockLevel = getStockLevel(product);
            return (
              <Card key={product.id} className={`border-l-4 ${stockLevel.color.replace('text-', 'border-l-')}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-5 w-5 ${stockLevel.color}`} />
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Réf: {product.reference} | {product.categories?.name || 'Non catégorisé'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={stockLevel.color}>
                      {stockLevel.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Stock actuel</p>
                      <p className={`text-xl font-bold ${stockLevel.color}`}>
                        {product.quantity_in_stock} {product.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stock minimum</p>
                      <p className="text-xl font-bold">{product.min_stock_level} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fournisseur</p>
                      <p className="text-lg">{product.suppliers?.name || '-'}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <Link
                        href="/dashboard/movements"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        Réapprovisionner
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
