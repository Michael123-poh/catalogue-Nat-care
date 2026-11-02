import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ProduitPanneau from '../components/ProduitPanneau'
import { categories } from '../data/categories'
import { vol } from '../lib/volProduit'
import './CategoriePage.css'

// Doit correspondre à la durée de l'animation de glissement dans CategoriePage.css
const DUREE_GLISSE = 550
const SEUIL_BALAYAGE = 50

export default function CategoriePage() {
  const { categorieId } = useParams()
  const categorie = categories.find((c) => c.id === categorieId)

  if (!categorie) return <Navigate to="/" replace />

  return <CategorieDetail key={categorie.id} categorie={categorie} />
}

function CategorieDetail({ categorie }) {
  const { titre, produits } = categorie
  const nbProduits = produits.length

  // courant : produit affiché. sortant : produit qui quitte l'écran pendant un balayage.
  // sens : +1 = produit suivant (entre par la droite), -1 = précédent (entre par la gauche).
  const [vue, setVue] = useState({ courant: 0, sortant: null, sens: 0 })
  const enGlissement = useRef(false)
  const minuteur = useRef(0)
  const depart = useRef(null)

  // Le vol depuis la home ne concerne que le premier produit, affiché à l'arrivée
  const [volInitial] = useState(() => vol.enCours)

  const aller = useCallback(
    (sens) => {
      if (nbProduits < 2 || enGlissement.current) return
      enGlissement.current = true
      setVue((v) => ({
        courant: (v.courant + sens + nbProduits) % nbProduits,
        sortant: v.courant,
        sens,
      }))
      minuteur.current = setTimeout(() => {
        enGlissement.current = false
        setVue((v) => ({ ...v, sortant: null }))
      }, DUREE_GLISSE)
    },
    [nbProduits],
  )

  useEffect(() => () => clearTimeout(minuteur.current), [])

  // Flèches du clavier (ordinateur)
  useEffect(() => {
    const surTouche = (e) => {
      if (e.key === 'ArrowRight') aller(1)
      if (e.key === 'ArrowLeft') aller(-1)
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [aller])

  // Balayage horizontal (doigt ou souris). On suit le pointeur sur la fenêtre pour que le geste
  // soit pris en compte même si le doigt sort de la zone avant d'être relevé.
  const commencerBalayage = (e) => {
    if (nbProduits < 2) return
    depart.current = { x: e.clientX, y: e.clientY }
    const terminer = (fin) => {
      window.removeEventListener('pointerup', surRelache)
      window.removeEventListener('pointercancel', annuler)
      const debut = depart.current
      depart.current = null
      if (!debut || !fin) return
      const dx = fin.clientX - debut.x
      const dy = fin.clientY - debut.y
      if (Math.abs(dx) > SEUIL_BALAYAGE && Math.abs(dx) > 1.5 * Math.abs(dy)) {
        aller(dx < 0 ? 1 : -1)
      }
    }
    const surRelache = (ev) => terminer(ev)
    const annuler = () => terminer(null)
    window.addEventListener('pointerup', surRelache)
    window.addEventListener('pointercancel', annuler)
  }

  return (
    <div className="detail">
      <Header />

      <h1 className="detail__bandeau">{titre}</h1>

      <div className="detail__carrousel" onPointerDown={commencerBalayage}>
        {vue.sortant !== null && (
          <ProduitPanneau
            key={produits[vue.sortant].id}
            produit={produits[vue.sortant]}
            role="sortant"
            sens={vue.sens}
            estPhare={vue.sortant === 0}
          />
        )}
        <ProduitPanneau
          key={produits[vue.courant].id}
          produit={produits[vue.courant]}
          role={vue.sens === 0 ? 'initial' : 'entrant'}
          sens={vue.sens}
          estPhare={vue.courant === 0}
          avecVol={volInitial && vue.sens === 0}
        />
      </div>
    </div>
  )
}
