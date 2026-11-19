
"use client" 
import { useState, useEffect } from "react" 
 
type Category = { id: string; name: string } 
 
export default function CategoriesPage() { 
  const [categories, setCategories] = useState<Category[]>([]) 
  const [name, setName] = useState("") 
  const [editingId, setEditingId] = useState<string | null>(null) 
 const[loaded ,setLoaded]=useState(false)
  useEffect(() => { 
    const saved = localStorage.getItem("mes_categories") 
    if (saved) setCategories(JSON.parse(saved)) 
       setLoaded(true)
  }, []) 
 
  useEffect(() => { 
    if(loaded){
localStorage.setItem("mes_categories", JSON.stringify(categories)) 
    }
  }, [categories,loaded]) 
 
  const handleSave = () => { 
    if (!name) { alert("Mets le nom de la catégorie"); return } 
    if (editingId) { 
      setCategories(categories.map(c => c.id === editingId ? { ...c, name } : c)) 
    } else { 
      setCategories([...categories, { id: Date.now().toString(), name }]) 
    } 
    setName(""); setEditingId(null) 
  } 
 
  const handleDelete = (id: string) => { 
    if (confirm("Supprimer cette catégorie ?")) setCategories(categories.filter(c => c.id !== id)) 
  } 
 
  return ( 
    <div style={{ padding: 20 }}> 
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Catégories</h1> 
      <p>Marche SANS connexion</p> 
 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16, display: 
"flex", flexDirection: "column", gap: 10 }}> 
        <h3>{editingId ? "Modifier la catégorie" : "Ajouter une catégorie"}</h3> 
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: 
Boissons, Alimentaire..." style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }} /> 
        <button onClick={handleSave} style={{ background: "black", color: "white", padding: 
"12px 20px", borderRadius: 8 }}>{editingId ? "ENREGISTRER LA MODIFICATION" : "+ AJOUTER LA CATÉGORIE"}</button> 
        {editingId && <button onClick={() => { setName(""); setEditingId(null) 
}}>Annuler</button>} 
      </div> 
 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16 }}> 
        {categories.length === 0 ? <p>Aucune catégorie trouvée</p> : categories.map(c => ( 
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: 
"center", padding: "12px 0", borderBottom: "1px solid #eee" }}> 
            <b>{c.name}</b> 
            <div style={{ display: "flex", gap: 8 }}> 
              <button onClick={() => { setName(c.name); setEditingId(c.id) }} style={{ background: 
"#f59e0b", color: "white", padding: "8px 12px", borderRadius: 6 }}>Modifier</button> 
              <button onClick={() => handleDelete(c.id)} style={{ background: "#ef4444", color: 
"white", padding: "8px 12px", borderRadius: 6 }}>Supprimer</button> 
            </div> 
          </div> 
        ))} 
      </div> 
      <p style={{ marginTop: 10, fontSize: 12, color: "green" }}>
✅
 Sauvegardé dans cet 
ordinateur</p> 
    </div> 
  ) 
} 