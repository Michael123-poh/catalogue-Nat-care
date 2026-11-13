import { useEffect } from 'react'
import CategorieCard from '../components/CategorieCard'
import { categories } from '../data/categories'
import { useEchelleEcran } from '../lib/echelleEcran'
import { chargerModele } from '../lib/modele3d'
import './Catalogue.css'

export default function Catalogue() {
  const { colonne, echelle, hauteur } = useEchelleEcran()

  // Les modèles 3D sont construits avant le clic : le produit est prêt à tourner dès l'arrivée
  useEffect(() => {
    categories
      .flatMap((c) => c.produits)
      .filter((produit) => !produit.gamme)
      .forEach((produit) => chargerModele(produit).catch(() => {}))
  }, [])

  return (
    <div className="catalogue" style={{ height: hauteur ?? undefined }}>
      <div ref={colonne} className="catalogue__colonne" style={{ transform: `scale(${echelle})` }}>
        <h1 className="catalogue__titre">CATALOGUE</h1>
        <main className="catalogue__liste">
          {categories.map((categorie) => (
            <CategorieCard key={categorie.id} categorie={categorie} />
          ))}
        </main>
      </div>
    </div>
  )
}
