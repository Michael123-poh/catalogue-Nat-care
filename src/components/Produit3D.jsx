import { useLayoutEffect, useRef } from 'react'
import { Viseur3D } from '../lib/viseur3d'

// Le rendu est fait dans un useLayoutEffect : la première image est déjà dessinée quand le
// navigateur capture la page pour la transition (sinon le produit apparaîtrait vide).
export default function Produit3D({ modele, nom, viseurRef, onErreur }) {
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    let viseur
    try {
      viseur = new Viseur3D(canvasRef.current, modele)
    } catch {
      onErreur() // WebGL indisponible : la page affiche la photo à plat
      return
    }
    viseurRef.current = viseur
    return () => {
      viseur.dispose()
      viseurRef.current = null
    }
  }, [modele, viseurRef, onErreur])

  return (
    <canvas
      ref={canvasRef}
      className="detail__canvas"
      role="img"
      aria-label={nom}
      style={{ aspectRatio: `${modele.largeur} / ${modele.hauteur}` }}
    />
  )
}
