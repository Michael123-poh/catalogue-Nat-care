import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ProduitPanneau from '../components/ProduitPanneau'
import { categories } from '../data/categories'
import { vol } from '../lib/volProduit'
import './CategoriePage.css'

// Doit correspondre à la durée de l'animation de glissement dans CategoriePage.css
const DUREE_GLISSE = 550
const SEUIL_BALAYAGE = 50
// Largeur de la maquette mobile. La colonne est agrandie ou réduite pour que la page tienne
// entièrement dans la fenêtre, sans défilement, quelle que soit la taille de l'écran
const LARGEUR_MAQUETTE = 430
const ECHELLE_MIN = 0.4
const ECHELLE_MAX = 1.6

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

  // Échelle de la colonne : on prend la hauteur naturelle de la page (mesurée sans transformation)
  // et on l'ajuste à la hauteur de la fenêtre. La largeur de la fenêtre limite aussi l'échelle : la colonne ne déborde jamais.
  const colonne = useRef(null)
  const [dimensions, setDimensions] = useState({ echelle: 1, hauteur: null, largeur: null })
  useLayoutEffect(() => {
    const ajuster = () => {
      const hauteurNaturelle = colonne.current.offsetHeight
      const parHauteur = window.innerHeight / hauteurNaturelle
      const parLargeur = window.innerWidth / LARGEUR_MAQUETTE
      const echelle = Math.min(ECHELLE_MAX, Math.max(ECHELLE_MIN, Math.min(parHauteur, parLargeur)))
      // La colonne couvre toute la largeur de la fenêtre (bandeau et en-tête de bord à bord) ;
      // seul le contenu du produit reste dans la largeur de la maquette
      setDimensions({
        echelle,
        hauteur: hauteurNaturelle * echelle,
        largeur: window.innerWidth / echelle,
      })
    }
    ajuster()
    window.addEventListener('resize', ajuster)
    return () => window.removeEventListener('resize', ajuster)
  }, [])

  // Vue compacte : balayage vers le haut. Les miniatures passent sous le produit et les infos remontent.
  const [compact, setCompact] = useState(false)

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

  // Clavier et molette (ordinateur)
  useEffect(() => {
    const surTouche = (e) => {
      if (e.key === 'ArrowRight') aller(1)
      if (e.key === 'ArrowLeft') aller(-1)
      if (e.key === 'ArrowDown') setCompact(true)
      if (e.key === 'ArrowUp') setCompact(false)
    }
    const surMolette = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) setCompact(e.deltaY > 0)
    }
    window.addEventListener('keydown', surTouche)
    window.addEventListener('wheel', surMolette, { passive: true })
    return () => {
      window.removeEventListener('keydown', surTouche)
      window.removeEventListener('wheel', surMolette)
    }
  }, [aller])

  // Balayage horizontal (doigt ou souris). On suit le pointeur sur la fenêtre pour que le geste
  // soit pris en compte même si le doigt sort de la zone avant d'être relevé.
  const commencerBalayage = (e) => {
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
      } else if (Math.abs(dy) > SEUIL_BALAYAGE && Math.abs(dy) > 1.5 * Math.abs(dx)) {
        setCompact(dy < 0)
      }
    }
    const surRelache = (ev) => terminer(ev)
    const annuler = () => terminer(null)
    window.addEventListener('pointerup', surRelache)
    window.addEventListener('pointercancel', annuler)
  }

  return (
    <div className="detail" style={{ height: dimensions.hauteur ?? undefined }}>
      <div
        ref={colonne}
        className="detail__colonne"
        style={{
          transform: `scale(${dimensions.echelle})`,
          width: dimensions.largeur ?? undefined,
        }}
      >
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
              compact={compact}
            />
          )}
          <ProduitPanneau
            key={produits[vue.courant].id}
            produit={produits[vue.courant]}
            role={vue.sens === 0 ? 'initial' : 'entrant'}
            sens={vue.sens}
            estPhare={vue.courant === 0}
            avecVol={volInitial && vue.sens === 0}
            compact={compact}
          />
        </div>
      </div>
    </div>
  )
}
