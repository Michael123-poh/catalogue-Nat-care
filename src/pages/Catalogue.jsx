import { useEffect } from 'react'
import Header from '../components/Header'
import CategorieCard from '../components/CategorieCard'
import { categories } from '../data/categories'
import { chargerModele } from '../lib/modele3d'
import './Catalogue.css'

export default function Catalogue() {
  // Les modèles 3D sont construits avant le clic : le produit est prêt à tourner dès l'arrivée
  useEffect(() => {
    categories
      .flatMap((c) => c.produits)
      .forEach((produit) => chargerModele(produit).catch(() => {}))
  }, [])

  return (
    <div className="catalogue">
      <Header />
      <h1 className="catalogue__titre">CATALOGUE</h1>
      <main className="catalogue__liste">
        {categories.map((categorie) => (
          <CategorieCard key={categorie.id} categorie={categorie} />
        ))}
      </main>
    </div>
  )
}
