"use client"; 
import { useState, useEffect } from "react"; 
 
type entrepot={
    id:number;
    nom:string;
    lieu:string;
    telephone:string
}
export default function EntrepotsPage() { 
  const [nom, setNom] = useState(""); 
  const [lieu, setLieu] = useState(""); 
  const [telephone, setTelephone] = useState(""); 
  const [entrepots, setEntrepots] = useState<entrepot[]>([
    {id:1,nom:"magasin A",lieu:"",telephone:""}
  ]); 
  const [indexAModifier, setIndexAModifier] = useState<number | null>(null); 
 
  useEffect(() => { 
    const data = localStorage.getItem("mes_entrepots"); 
    if (data) setEntrepots(JSON.parse(data)); 
  }, []); 
 
  const sauvegarder = (liste: any[]) => { 
    setEntrepots(liste); 
    localStorage.setItem("mes_entrepots", JSON.stringify(liste)); 
  }; 
 
  const ajouter = () => { 
    if (!nom.trim()) {
         alert("Mets le nom de l'entrepôt");
         return;
    }
    if (indexAModifier !== null) { 
      const copie = [...entrepots]; 
      copie[indexAModifier] = {...copie[indexAModifier], nom, lieu, telephone }; 
      sauvegarder(copie); 
      setIndexAModifier(null); 
    } else { 
      sauvegarder([...entrepots, {id:Date.now(), nom, lieu, telephone }]); 
    } 
    setNom(""); setLieu(""); setTelephone(""); 
  }; 
 
  const supprimer = (i: number) => { 
    if (!confirm("Tu veux vraiment supprimer ?")) return; 
    const copie = entrepots.filter((_, index) => index !== i); 
    sauvegarder(copie); 
  }; 
 
  const modifier = (i: number) => { 
    setNom(entrepots[i].nom); 
    setLieu(entrepots[i].lieu); 
    setTelephone(entrepots[i].telephone); 
    setIndexAModifier(i); 
  }; 
 
   return ( 
    <div className="p-6"> 
      <h1 className="text-2xl font-bold">Entrepôts</h1> 
      <p className="text-gray-500 mb-6">Marché SANS connexion</p> 
 
      {/* FORMULAIRE - comme Fournisseurs */} 
      <div className="bg-white rounded-xl shadow p-6 mb-6"> 
        <h2 className="font-bold text-lg mb-4"> 
          {indexAModifier === null ? "Ajouter un entrepôt" : "Modifier un entrepôt"} 
        </h2> 
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
          <div> 
            <label className="text-sm text-gray-600">Nom de l'entrepôt</label> 
            <input 
              placeholder="Nom de l'entrepôt ex: Magasin A" 
              value={nom} 
              onChange={(e) => setNom(e.target.value)} 
              className="w-full border rounded-lg p-3 mt-1" 
            /> 
          </div> 
          <div> 
            <label className="text-sm text-gray-600">Lieu</label> 
            <input 
              placeholder="Lieu ex: Niamey - Marché" 
              value={lieu} 
              onChange={(e) => setLieu(e.target.value)} 
              className="w-full border rounded-lg p-3 mt-1" 
            /> 
          </div> 
          <div> 
            <label className="text-sm text-gray-600">Téléphone</label> 
            <input 
              placeholder="Téléphone ex: 90 00 00 00" 
              value={telephone} 
              onChange={(e) => setTelephone(e.target.value)} 
              className="w-full border rounded-lg p-3 mt-1" 
            /> 
          </div> 
        </div> 
 
        <button 
          onClick={ajouter} 
          className="mt-5 w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg
slate-900" 
        > 
          {indexAModifier === null ? "+ AJOUTER L'ENTREPÔT" : "MODIFIER L'ENTREPÔT"} 
        </button> 
      </div> 
 
      {/* LISTE - comme Fournisseurs */} 
      <div className="bg-white rounded-xl shadow p-6"> 
        <h2 className="font-bold text-lg mb-4"> 
          Liste des entrepôts ({entrepots.length}) 
        </h2> 
 
        {entrepots.map((e, i) => ( 
          <div 
            key={i} 
            className="flex justify-between items-center border-b py-3 last:border-0" 
          > 
            <div> 
              <p className="font-bold">{e.nom}</p> 
              <p className="text-sm text-gray-500"> 
                {e.lieu} • {e.telephone} 
              </p> 
            </div> 
            <div className="flex gap-2"> 
              <button 
                onClick={() => modifier(i)} 
                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font
bold" 
style={{ background: "#f59e0b", color: "white", padding: "8px 12px", borderRadius: 6}} 
        > 
                Modifier 
              </button> 
              <button 
                onClick={() => supprimer(i)} 
                className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold" 
              style={{ background: "#ef4444", color: "white", padding: "8px 12px", borderRadius: 6}}
              > 
                Supprimer 
              </button> 
            </div> 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
}