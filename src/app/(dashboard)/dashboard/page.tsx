'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, TrendingUp,Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Stats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  recentMovements: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    recentMovements: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const[nbUsers,setNbUsers]=useState(0);

 useEffect(() => { 
  const saved = localStorage.getItem("mes_produits") 
  const savedMov = localStorage.getItem("mes_mouvements") 
  const rawProducts = saved ? JSON.parse(saved) : [] 
  const movs = savedMov ? JSON.parse(savedMov) : [] 
  const savedUsers = localStorage.getItem("mes_utilisateurs") 
    const usersList = savedUsers ? JSON.parse(savedUsers) : []
    setNbUsers(usersList.length) 
  // On remet les produits au format que le Tableau de bord comprend 
  const products = rawProducts.map((p: any) => ({ 
    ...p, 
    name: p.name, 
    quantity_in_stock: Number(p.stock ?? p.quantity_in_stock ?? 0), 
    unit_price: Number(p.price ?? p.unit_price ?? 0), 
    min_stock_level: Number(p.minStock ?? p.min_stock_level ?? 5), 
    created_at: p.created_at ?? new Date().toISOString(), 
  })) 
 
  const totalValue = products.reduce((sum: number, p: any) => sum + p.quantity_in_stock * 
p.unit_price, 0) 
  const lowStockCount = products.filter((p: any) => p.quantity_in_stock <= 
p.min_stock_level).length 
 
  setStats({ 
    totalProducts: products.length, 
    totalValue: totalValue, 
    lowStockCount: lowStockCount, 
    recentMovements: movs.length, 
  }) 
 
  setRecentProducts([...products].slice(-5).reverse()) 
  setLoading(false) 
}, [])

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
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre inventaire</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Dans l'inventaire</p>
          </CardContent>
        </Card>
       <Card onClick={() =>router.push("/utilisateurs")} className="cursor-pointer hover:bg-gray-50"> 
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"> 
        <CardTitle className="text-sm font-medium">Utilisateurs Inscrits</CardTitle> 
        <Users className="h-4 w-4 text-muted-foreground" /> 
        </CardHeader> 
        <CardContent> 
        <div className="text-2xl font-bold">{nbUsers}</div> 
        <p className="text-xs text-muted-foreground">Clique pour voir la liste</p> 
        </CardContent> 
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">Valeur du stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Produits à commander</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mouvements (7j)</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentMovements}</div>
            <p className="text-xs text-muted-foreground">Entrées et sorties</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Derniers Produits Ajoutés</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProducts.length > 0 ? (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Réf: {product.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.quantity_in_stock} {product.unit}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.unit_price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun produit</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut du Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stock OK</span>
                <span className="font-medium text-green-500">
                  {stats.totalProducts - stats.lowStockCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Stock Bas</span>
                <span className="font-medium text-orange-500">{stats.lowStockCount}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taux de rotation (simulé)</span>
                  <span>12% / mois</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
