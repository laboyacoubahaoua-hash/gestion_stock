"use client" 
import { useState, useEffect } from "react" 
type Supplier = { id: string; name: string; phone: string } 
export default function SuppliersPage() { 
  const [list, setList] = useState<Supplier[]>([]) 
  const [name, setName] = useState("") 
  const [phone, setPhone] = useState("") 
  const [editingId, setEditingId] = useState<string | null>(null) 
  const[loaded ,setLoaded]=useState(false)
  useEffect(() => { const s = localStorage.getItem("mes_fournisseurs"); if (s) 
setList(JSON.parse(s)) 
setLoaded(true)
}, []) 
  useEffect(() => {
    if (loaded)
    localStorage.setItem("mes_fournisseurs", JSON.stringify(list)) }, [list,loaded]) 
  const save = () => { 
    if (!name) { alert("Mets le nom du fournisseur"); return } 
    if (editingId) setList(list.map(x => x.id === editingId ? { ...x, name, phone } : x)) 
    else setList([...list, { id: Date.now().toString(), name, phone }]) 
    setName(""); setPhone(""); setEditingId(null) 
  } 
  return ( 
    <div style={{ padding: 20 }}> 
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Fournisseurs</h1> 
      <p>Marche SANS connexion</p> 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16, display: 
"flex", flexDirection: "column", gap: 10 }}> 
        <h3>{editingId ? "Modifier le fournisseur" : "Ajouter un fournisseur"}</h3> 
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom du 
fournisseur" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }} /> 
        <input value={phone} onChange={e => setPhone(e.target.value)} 
placeholder="Téléphone ex: 90 00 00 00" style={{ padding: 12, border: "1px solid #ddd", 
borderRadius: 8 }} /> 
        <button onClick={save} style={{ background: "black", color: "white", padding: "12px 20px", borderRadius: 8 }}>{editingId ? "ENREGISTRER" : "+ AJOUTER LE FOURNISSEUR"}</button> 
        {editingId && <button onClick={() => { setName(""); setPhone(""); setEditingId(null) 
}}>Annuler</button>} 
      </div> 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16 }}> 
        {list.length === 0 ? <p>Aucun fournisseur trouvé</p> : list.map(s => ( 
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: 
"center", padding: "12px 0", borderBottom: "1px solid #eee" }}> 
            <div><b>{s.name}</b><br /><span>{s.phone}</span></div> 
            <div style={{ display: "flex", gap: 8 }}> 
              <button onClick={() => { setName(s.name); setPhone(s.phone); setEditingId(s.id) }} 
style={{ background: "#f59e0b", color: "white", padding: "8px 12px", borderRadius: 6 
}}>Modifier</button> 
              <button onClick={() => { if (confirm("Supprimer ?")) setList(list.filter(x => x.id !== 
s.id)) }} style={{ background: "#ef4444", color: "white", padding: "8px 12px", borderRadius: 6 
}}>Supprimer</button> 
            </div> 
          </div> 
        ))} 
      </div> 
    </div> 
  ) 
} 