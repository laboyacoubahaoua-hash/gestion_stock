"use client"; 
import { useEffect, useState } from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; 
import { Trash2 } from "lucide-react"; 
 
export default function UtilisateursPage() { 
  const [users, setUsers] = useState<any[]>([]); 
 
  useEffect(() => { 
    const saved = localStorage.getItem("mes_utilisateurs"); 
    setUsers(saved ? JSON.parse(saved) : []); 
  }, []); 
 
  const supprimer = (email: string) => { 
    if (!confirm("Tu veux vraiment supprimer " + email + " ?")) return; 
    const nouveau = users.filter((u) => u.email !== email); 
    setUsers(nouveau); 
    localStorage.setItem("mes_utilisateurs", JSON.stringify(nouveau)); 
  }; 
 
  return ( 
    <div className="space-y-4"> 
      <h1 className="text-2xl font-bold">Utilisateurs Inscrits : {users.length}</h1> 
      <p className="text-sm text-muted-foreground">Ce sont les personnes qui ont créé un 
compte dans ta boutique.</p> 
 
      {users.length === 0 && ( 
        <Card><CardContent className="pt-6">Personne ne s'est encore 
inscrit.</CardContent></Card> 
      )} 
 
      {users.map((u) => ( 
        <Card key={u.email}> 
          <CardHeader className="flex flex-row items-center justify-between"> 
            <div> 
              <CardTitle>{u.nom || "Sans nom"}</CardTitle> 
              <p className="text-sm text-muted-foreground">{u.email}</p> 
            </div> 
            <Button variant="destructive" size="sm" onClick={() => supprimer(u.email)}> 
              <Trash2 className="h-4 w-4 mr-1" /> Supprimer 
            </Button> 
          </CardHeader> 
        </Card> 
      ))} 
    </div> 
  ); 
}