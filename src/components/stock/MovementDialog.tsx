'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Product {
  id: string;
  reference: string;
  name: string;
}

interface Movement {
  product_id: string;
  movement_type: string;
  quantity: number;
  unit_price: number;
  reference: string;
  notes: string;
}

interface MovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (movement: Movement) => Promise<void>;
}

export function MovementDialog({ open, onOpenChange, onSave }: MovementDialogProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Movement>({
    product_id: '',
    movement_type: 'in',
    quantity: 1,
    unit_price: 0,
    reference: '',
    notes: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase.from('products').select('id, reference, name');
      setProducts(data || []);
    };
    if (open) {
      fetchProducts();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setForm({
        product_id: '',
        movement_type: 'in',
        quantity: 1,
        unit_price: 0,
        reference: '',
        notes: '',
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const total_value = form.quantity * form.unit_price;
      await onSave({
        ...form,
        total_value,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving movement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un mouvement</DialogTitle>
          <DialogDescription>
            Ajoutez une entrée ou sortie de stock
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Type de mouvement</Label>
              <Select
                value={form.movement_type}
                onValueChange={(value) => setForm({ ...form, movement_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Entrée de stock</SelectItem>
                  <SelectItem value="out">Sortie de stock</SelectItem>
                  <SelectItem value="return">Retour</SelectItem>
                  <SelectItem value="adjustment">Ajustement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Produit</Label>
              <Select
                value={form.product_id}
                onValueChange={(value) => setForm({ ...form, product_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.reference} - {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_price">Prix unitaire (EUR)</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={form.unit_price}
                  onChange={(e) => setForm({ ...form, unit_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Référence (optionnel)</Label>
              <Input
                id="reference"
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="N° de commande, facture..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Informations complémentaires"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !form.product_id}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
