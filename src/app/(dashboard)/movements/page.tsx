"use client" 
import { parse } from "path";
import { useState, useEffect } from "react" 
import { useFormState } from "react-dom";
type Mov = { id: string; product: string; type: string; qty: number; date: string;heure ?:string;utilisateur ?:string;fournisseur?:string } 
export default function MovementsPage() { 
  const [list, setList] = useState<Mov[]>([]) 
  const [products, setProducts] = useState<any[]>([]) 
  const [product, setProduct] = useState("") 
  const [type, setType] = useState("Entrée") 
  const [qty, setQty] = useState("") 
  const[utilisateur,setUtilisateur]=useState("Sans connexion")
  const[fournisseur,setFournisseur]=useState("")
  const[loaded ,setLoaded]=useState(false)
  useEffect(() => { 
      const s = localStorage.getItem("mes_mouvements");
      if (s) setList(JSON.parse(s)); 
      const p = localStorage.getItem("mes_produits");
      if (p) setProducts(JSON.parse(p));
        const u=localStorage.getItem("utilisateur_connecte");
      if(u){try{ const obj = JSON.parse(u); setUtilisateur(obj.nom || obj.name || obj.email || u); }catch{ setUtilisateur(u); } } 
       setLoaded(true)
       }, []) 
  useEffect(() => { 
    if(loaded) {localStorage.setItem("mes_mouvements", JSON.stringify(list))
     }
    }, [list,loaded])
  const save = () => { 
    if (!product || !qty) { alert("Choisis le produit et la quantité"); return } 
    const prod=products.find((pr: any)=>pr.nom==product);
const newMov = { id: Date.now().toString(), product, type, qty: Number(qty), date: new 
Date().toLocaleDateString(), heure: new Date().toLocaleTimeString([], { hour: '2-digit', 
minute: '2-digit' }), utilisateur: utilisateur, fournisseur: prod?.fournisseur || prod?.supplier || 
"Non précisé" }
    setList([newMov, ...list]) 
    // Mettre à jour le stock du produit 
    const updated = products.map(pr => pr.name === product ? { ...pr, stock: type === 
"Entrée" ? pr.stock + Number(qty) : pr.stock - Number(qty) } : pr) 
    localStorage.setItem("mes_produits", JSON.stringify(updated)) 
    setProduct(""); setQty("") 
  } 
  return ( 
    <div style={{ padding: 20 }}> 
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Mouvements de stock</h1> 
      <p>Entrée / Sortie - Sans connexion</p> 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16, display: 
"flex", flexDirection: "column", gap: 10 }}> 
        <select value={product} onChange={e => setProduct(e.target.value)} style={{ padding: 
12, border: "1px solid #ddd", borderRadius: 8 }}> 
          <option value="">-- Choisir un produit --</option> 
          {products.map((p: any) => <option key={p.id} value={p.name}>{p.name} - Stock: 
{p.stock}</option>)} 
        </select> 
        <select value={type} onChange={e => setType(e.target.value)} style={{ padding: 12, 
border: "1px solid #ddd", borderRadius: 8 }}> 
          <option>Entrée</option><option>Sortie</option> 
        </select> 
        <input value={qty} onChange={e => setQty(e.target.value)} type="number" 
placeholder="Quantité" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }} /> 
        <button onClick={save} style={{ background: "black", color: "white", padding: "12px 20px", borderRadius: 8 }}>+ AJOUTER LE MOUVEMENT</button> 
      <input value={fournisseur}onChange={e=> setFournisseur(e.target.value)}placeholder="Fournisseur ex:moussa"style={{width:"100%",padding:12,marginBottom:10,border:"1px solid #ddd"}}/>
      </div> 
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16 }}> 
        {list.length === 0 ? <p>Aucun mouvement</p> : list.map(m => ( 
          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: 
"center", padding: "12px 0", borderBottom: "1px solid #eee" }}> 
            <div><b>{m.product}</b><br /><span>{m.type} - {m.qty} - {m.date}</span><span >par:{m.utilisateur} | fournisseur:{m.fournisseur}</span></div> 
            <button onClick={() => { if (confirm("Supprimer ce mouvement ?")) setList(list.filter(x => x.id !== m.id)) }} style={{ background: "#ef4444", color: "white", padding: "8px 12px", 
borderRadius: 6 }}>Supprimer</button> 
          </div> 
        ))} 
      </div> 
    </div> 
  ) 
}
