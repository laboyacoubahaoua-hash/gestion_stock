"use client" 
import { useState, useEffect } from "react" 
 
type Product = { 
  id: string 
  name: string 
  price: number 
  stock: number 
  category: string 
} 
 
export default function ProductsPage() { 
  const [products, setProducts] = useState<Product[]>([]) 
  const [name, setName] = useState("") 
  const [price, setPrice] = useState("") 
  const [stock, setStock] = useState("") 
  const [category, setCategory] = useState("") 
  const [editingId, setEditingId] = useState<string | null>(null) 
  const [search, setSearch] = useState("") 
 const[loaded ,setLoaded]=useState(false)
  // Charger depuis l'ordinateur 
  useEffect(() => { 
    const saved = localStorage.getItem("mes_produits") 
    if (saved) setProducts(JSON.parse(saved)) 
      setLoaded(true)
  }, []) 
 
  // Sauvegarder dans l'ordinateur 
  useEffect(() => { 
    if(loaded){
      localStorage.setItem("mes_produits", JSON.stringify(products)) 
    }
  }, [products,loaded]) 
  const resetForm = () => { 
    setName(""); setPrice(""); setStock(""); setCategory(""); setEditingId(null) 
  } 
 
  const handleSave = () => { 
    if (!name || !price) { 
      alert("Mets au moins le nom et le prix") 
      return 
    } 
    if (editingId) { 
      setProducts(products.map(p => p.id === editingId ? { ...p, name, price: Number(price), 
stock: Number(stock) || 0, category } : p)) 
    } else { 
      setProducts([...products, { id: Date.now().toString(), name, price: Number(price), stock: 
Number(stock) || 0, category }]) 
    } 
    resetForm() 
  } 
 
  const handleEdit = (p: Product) => { 
    setName(p.name); setPrice(String(p.price)); setStock(String(p.stock)); 
setCategory(p.category); setEditingId(p.id) 
    window.scrollTo({ top: 0, behavior: "smooth" }) 
  } 
 
  const handleDelete = (id: string) => { 
    if (confirm("Tu veux vraiment supprimer ce produit ?")) { 
      setProducts(products.filter(p => p.id !== id)) 
    } 
  } 
 
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) 
 
  return ( 
    <div style={{ padding: 20 }}> 
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Produits</h1> 
      <p>Gérer votre catalogue - Marche SANS connexion</p> 
 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16, display: 
"flex", flexDirection: "column", gap: 10 }}> 
        <h3>{editingId ? "Modifier le produit" : "Ajouter un produit"}</h3> 
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du 
produit ex: Jus d'orange" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }} /> 
        <input value={category} onChange={e => setCategory(e.target.value)} 
placeholder="Catégorie ex: Boissons" style={{ padding: 12, border: "1px solid #ddd", 
borderRadius: 8 }} /> 
        <input value={price} onChange={e => setPrice(e.target.value)} type="number" 
placeholder="Prix ex: 500" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }} 
/> 
        <input value={stock} onChange={e => setStock(e.target.value)} type="number" 
placeholder="Stock ex: 20" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }} 
/> 
        <div style={{ display: "flex", gap: 10 }}> 
          <button onClick={handleSave} style={{ background: "black", color: "white", padding: 
"12px 20px", borderRadius: 8, flex: 1 }}>{editingId ? "ENREGISTRER LA MODIFICATION" : 
"+ AJOUTER LE PRODUIT"}</button> 
          {editingId && <button onClick={resetForm} style={{ padding: "12px 20px", 
borderRadius: 8 }}>Annuler</button>} 
        </div> 
      </div> 
 
      <input value={search} onChange={e => setSearch(e.target.value)} 
placeholder="Rechercher un produit..." style={{ padding: 12, border: "1px solid #ddd", 
borderRadius: 8, width: "100%", marginTop: 20 }} /> 
 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16 }}> 
        {filtered.length === 0 ? <p>Aucun produit trouvé</p> : filtered.map(p => ( 
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: 
"center", padding: "12px 0", borderBottom: "1px solid #eee" }}> 
            <div><b>{p.name}</b><br /><span>{p.category} - {p.price} FCFA - Stock: 
{p.stock}</span></div> 
            <div style={{ display: "flex", gap: 8 }}> 
              <button onClick={() => handleEdit(p)} style={{ background: "#f59e0b", color: "white", 
padding: "8px 12px", borderRadius: 6 }}>Modifier</button> 
              <button onClick={() => handleDelete(p.id)} style={{ background: "#ef4444", color: 
"white", padding: "8px 12px", borderRadius: 6 }}>Supprimer</button> 
            </div> 
          </div> 
        ))} 
      </div> 
      <p style={{ marginTop: 10, fontSize: 12, color: "green" }}>
✅
 Sauvegardé dans cet 
ordinateur, même sans internet</p> 
    </div> 
  ) 
}