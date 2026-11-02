import { Link, useViewTransitionState } from 'react-router-dom'
import { demarrerVol } from '../lib/volProduit'
import './CategorieCard.css'

function Fleche({ sens }) {
  return (
    <svg
      className="categorie__fleche"
      viewBox="0 0 18 10"
      width="18"
      height="10"
      aria-hidden="true"
    >
      {sens === 'droite' ? (
        <path d="M0 5h16M12 1l4 4-4 4" />
      ) : (
        <path d="M18 5H2M6 1L2 5l4 4" />
      )}
    </svg>
  )
}

export default function CategorieCard({ categorie }) {
  const { id, titre, cote, produits, hauteur, bas } = categorie
  const produit = produits[0] // produit phare : celui qui s'affiche sur la carte
  const lien = `/catalogue/${id}`

  // Seule la carte concernée porte le nom de transition : le produit phare
  // "voyage" jusqu'au centre de la page détail (et revient au retour).
  const enTransition = useViewTransitionState(lien)

  return (
    <Link
      className={`categorie categorie--${cote}`}
      to={lien}
      viewTransition
      onClick={demarrerVol}
      style={{ '--img-h': `${hauteur}px`, '--img-bas': `${bas}px` }}
    >
      <img
        className="categorie__image"
        src={produit.image}
        alt={produit.nom}
        style={enTransition ? { viewTransitionName: 'produit-phare' } : undefined}
      />
      <div className="categorie__texte">
        <h2 className="categorie__titre">{titre}</h2>
        <span className="categorie__lien">
          {cote === 'droite' && <Fleche sens="gauche" />}
          voir plus
          {cote === 'gauche' && <Fleche sens="droite" />}
        </span>
      </div>
    </Link>
  )
}
