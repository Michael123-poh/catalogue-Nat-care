import { useCallback, useEffect, useRef, useState } from 'react'
import Produit3D from './Produit3D'
import { chargerModele, modeleEnCache } from '../lib/modele3d'
import { suivreVol, vol } from '../lib/volProduit'
import { DESCRIPTION_PROVISOIRE, prixDe } from '../data/categories'
import { formaterPrix, panier } from '../lib/panier'

// Le nom revient à la ligne entre les mots, jamais au milieu : on réduit la taille quand le
// mot le plus long ne tient pas dans la largeur de l'écran
const TAILLE_NOM = 46
const LARGEUR_NOM = 360
function styleNom(nom) {
  const plusLong = Math.max(...nom.split(' ').map((mot) => mot.length))
  const fontSize = Math.min(TAILLE_NOM, Math.floor(LARGEUR_NOM / (plusLong * 0.7)))
  // La colonne reste étroite (260px, comme la maquette) sauf si un mot est plus large
  return { fontSize, maxWidth: Math.max(260, Math.ceil(plusLong * fontSize * 0.7)) }
}

/**
 * Un produit de la page catégorie : miniatures, produit en 3D, points et nom.
 * role : 'initial' (affiché à l'arrivée), 'entrant' / 'sortant' (pendant un balayage)
 * estPhare : c'est le produit de la carte de la home, celui qui voyage (et revient) avec la transition
 * avecVol : on arrive depuis la home, le produit tourne pendant son déplacement
 * compact : vue réduite (balayage vers le haut) : miniatures sous le produit, infos remontées
 */
export default function ProduitPanneau({ produit, role, sens, estPhare, avecVol, compact }) {
  const { nom, images, hauteurDetail } = produit

  // On démarre sur la face de départ du modèle : le produit phare de la home, ou sa photo de
  // côté de remplacement (facePrincipale)
  const [actif, setActif] = useState(images.indexOf(produit.facePrincipale ?? produit.image))

  // Modèle 3D reconstruit depuis les photos : déjà prêt si la home l'a préparé. Sinon (ou si
  // WebGL est indisponible) on affiche la photo à plat.
  const [modele, setModele] = useState(() => modeleEnCache(produit))
  const [sans3D, setSans3D] = useState(false)
  const viseurRef = useRef(null)
  const passerEnPlat = useCallback(() => setSans3D(true), [])

  useEffect(() => {
    if (modele) return
    let actuel = true
    chargerModele(produit)
      .then((m) => actuel && setModele(m))
      .catch(passerEnPlat)
    return () => {
      actuel = false
    }
  }, [modele, produit, passerEnPlat])

  // Arrivée depuis la home : le produit fait un tour complet pendant son vol, de profil et de dos
  useEffect(() => {
    if (!avecVol || !vol.enCours) return
    return suivreVol({
      surProgression: (p) => viseurRef.current?.definirAngle(-p * 2 * Math.PI),
    })
  }, [avecVol])

  // Miniature ou point choisi : le produit tourne jusqu'à la face correspondante
  useEffect(() => {
    const face = modele?.sources.indexOf(images[actif]) ?? -1
    if (face >= 0) viseurRef.current?.tournerVers(face)
  }, [actif, modele, images])

  // Acheter : le produit rejoint la commande (menu burger). Le bouton confirme un instant.
  const [ajoute, setAjoute] = useState(false)
  useEffect(() => {
    if (!ajoute) return
    const minuteur = setTimeout(() => setAjoute(false), 1500)
    return () => clearTimeout(minuteur)
  }, [ajoute])
  const acheter = () => {
    panier.ajouter(produit.id)
    setAjoute(true)
  }

  const en3D = modele && !sans3D
  // Photo choisie qui n'est pas une face de la rotation (vue du dessus) : affichée à plat
  const surDessus = en3D && modele.sources.indexOf(images[actif]) < 0
  const classes = ['panneau']
  if (role !== 'initial')
    classes.push(`panneau--${role}`, `panneau--${sens > 0 ? 'suivant' : 'precedent'}`)
  if (compact) classes.push('panneau--compact')

  return (
    <section className={classes.join(' ')} aria-hidden={role === 'sortant'} aria-label={nom}>
      <ul className="detail__miniatures">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              className={`detail__miniature${i === actif ? ' detail__miniature--active' : ''}`}
              onClick={() => setActif(i)}
              aria-label={`${nom} — vue ${i + 1}`}
              aria-pressed={i === actif}
            >
              <img src={src} alt="" />
            </button>
          </li>
        ))}
      </ul>

      <div className="detail__scene">
        <div
          className={`detail__produit${surDessus ? ' detail__produit--dessus' : ''}`}
          style={{
            '--h': hauteurDetail,
            // Seul le produit de la carte de la home voyage avec la transition de page
            viewTransitionName: estPhare && role !== 'sortant' ? 'produit-phare' : undefined,
          }}
        >
          {en3D && (
            <Produit3D modele={modele} nom={nom} viseurRef={viseurRef} onErreur={passerEnPlat} />
          )}
          <img
            className={`detail__image${en3D ? ' detail__image--calque' : ''}`}
            src={images[actif]}
            alt={nom}
          />
        </div>
      </div>

      <div className="detail__points" role="tablist">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === actif}
            aria-label={`Vue ${i + 1}`}
            className={`detail__point${i === actif ? ' detail__point--actif' : ''}`}
            onClick={() => setActif(i)}
          />
        ))}
      </div>

      <h2 className="detail__nom" style={styleNom(nom)}>
        {nom}
      </h2>

      {/* Sous le nom : on fait défiler la page vers le haut pour découvrir les infos */}
      <div className="detail__infos">
        <div className="detail__description">
          {(produit.description ?? DESCRIPTION_PROVISOIRE).map((texte, i) => (
            <p key={i}>{texte}</p>
          ))}
        </div>
        <p className="detail__prix">{formaterPrix(prixDe(produit))}</p>
        <button type="button" className="detail__acheter" onClick={acheter}>
          {ajoute ? 'Ajouté ✓' : 'Acheter'}
        </button>
      </div>
    </section>
  )
}
