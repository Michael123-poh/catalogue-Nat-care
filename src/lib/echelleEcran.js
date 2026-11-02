import { useLayoutEffect, useRef, useState } from 'react'

// Largeur de la maquette mobile. Chaque page est agrandie ou réduite pour tenir entièrement dans la
// fenêtre, sans défilement, quelle que soit la taille de l'écran
export const LARGEUR_MAQUETTE = 430
// Hauteur de l'en-tête (logo + menu), fixe et identique sur toutes les pages. Doit correspondre à
// .header dans Header.css : la page occupe la place restante, en dessous
export const HAUTEUR_ENTETE = 54
const ECHELLE_MIN = 0.4
const ECHELLE_MAX = 1.6

/**
 * Mesure la hauteur naturelle de la colonne (sans transformation) et calcule l'échelle qui la fait
 * tenir dans la fenêtre. La largeur limite aussi l'échelle : la colonne ne déborde jamais.
 * Retourne la ref à poser sur la colonne, l'échelle, la hauteur finale (pour la boîte extérieure) et
 * la largeur à donner à la colonne pour qu'elle couvre la fenêtre une fois mise à l'échelle.
 */
export function useEchelleEcran() {
  const colonne = useRef(null)
  const [dimensions, setDimensions] = useState({ echelle: 1, hauteur: null, largeur: null })

  useLayoutEffect(() => {
    const ajuster = () => {
      const hauteurNaturelle = colonne.current.offsetHeight
      const parHauteur = (window.innerHeight - HAUTEUR_ENTETE) / hauteurNaturelle
      const parLargeur = window.innerWidth / LARGEUR_MAQUETTE
      const echelle = Math.min(ECHELLE_MAX, Math.max(ECHELLE_MIN, Math.min(parHauteur, parLargeur)))
      setDimensions({
        echelle,
        // arrondi vers le bas : évite une barre de défilement d'un pixel
        hauteur: Math.floor(hauteurNaturelle * echelle),
        largeur: window.innerWidth / echelle,
      })
    }
    ajuster()
    window.addEventListener('resize', ajuster)
    return () => window.removeEventListener('resize', ajuster)
  }, [])

  return { colonne, ...dimensions }
}
