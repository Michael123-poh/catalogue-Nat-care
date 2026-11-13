import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { prixDe } from '../data/categories'
import { FICHES } from '../data/fiches'
import { formaterPrix, panier } from '../lib/panier'
import './FicheProduit.css'

function Section({ type, titre, intro, items, note, ordonne = true }) {
  return (
    <section className="fiche__section">
      {titre && <h3 className="fiche__sous-titre">{titre}</h3>}
      {intro && <p className="fiche__texte">{intro}</p>}

      {type === 'bienfaits' && (
        <ul className="fiche__bienfaits">
          {items.map(({ titre: t, texte }) => (
            <li key={t}>
              <strong>{t}</strong>
              <span>{texte}</span>
            </li>
          ))}
        </ul>
      )}

      {type === 'puces' && (
        <ul className="fiche__puces">
          {items.map((texte) => (
            <li key={texte}>{texte}</li>
          ))}
        </ul>
      )}

      {type === 'etapes' &&
        (() => {
          const Liste = ordonne ? 'ol' : 'ul'
          return (
            <Liste className={ordonne ? 'fiche__etapes' : 'fiche__puces'}>
              {items.map((texte) => (
                <li key={texte}>{texte}</li>
              ))}
            </Liste>
          )
        })()}

      {type === 'texte' &&
        items.map((texte) => (
          <p key={texte} className="fiche__texte">
            {texte}
          </p>
        ))}

      {note && <p className="fiche__note">{note}</p>}
    </section>
  )
}

/** Les produits d'une gamme, avec leur prix séparé et le prix de la gamme. */
function ContenuGamme({ gamme }) {
  const separement = gamme.contenu.reduce((somme, p) => somme + prixDe(p), 0)
  const economie = separement - prixDe(gamme)
  return (
    <section className="fiche__section">
      <h3 className="fiche__sous-titre">Dans cette gamme</h3>
      <ul className="fiche__gamme">
        {gamme.contenu.map((p) => (
          <li key={p.id}>
            <img src={p.image} alt="" />
            <span>{p.nom}</span>
            <strong>{formaterPrix(prixDe(p))}</strong>
          </li>
        ))}
      </ul>
      <p className="fiche__note">
        {economie > 0
          ? `Achetés séparément : ${formaterPrix(separement)}. Avec la gamme, vous économisez ${formaterPrix(economie)}.`
          : `Total des produits : ${formaterPrix(separement)}.`}
      </p>
    </section>
  )
}

/** Fiche complète d'un produit : fenêtre qui monte du bas de l'écran, avec le prix et Acheter. */
export default function FicheProduit({ produit, onFermer }) {
  const fiche = FICHES[produit.id]
  const [ajoute, setAjoute] = useState(false)

  useEffect(() => {
    const surTouche = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  useEffect(() => {
    if (!ajoute) return
    const minuteur = setTimeout(() => setAjoute(false), 1500)
    return () => clearTimeout(minuteur)
  }, [ajoute])

  const acheter = () => {
    panier.ajouter(produit.id)
    setAjoute(true)
  }

  // Rendue dans <body> : la page est mise à l'échelle par transform, ce qui décalerait un élément fixe.
  // Les événements de pointeur ne doivent pas remonter au carrousel (sinon un balayage dans la
  // fiche changerait de produit).
  return createPortal(
    <div className="fiche" onPointerDown={(e) => e.stopPropagation()}>
      <div className="fiche__voile" onClick={onFermer} />
      <article className="fiche__feuille" role="dialog" aria-modal="true" aria-label={produit.nom}>
        <header className="fiche__entete">
          <div>
            <h2 className="fiche__titre">{produit.nom}</h2>
            <p className="fiche__accroche">{fiche.accroche}</p>
          </div>
          <button type="button" className="fiche__fermer" onClick={onFermer} aria-label="Fermer">
            ×
          </button>
        </header>

        <div className="fiche__corps">
          {fiche.intro.map((texte) => (
            <p key={texte} className="fiche__texte">
              {texte}
            </p>
          ))}

          {produit.contenu && <ContenuGamme gamme={produit} />}

          {fiche.sections.map((section, i) => (
            <Section key={i} {...section} />
          ))}

          {fiche.precautions && (
            <aside className="fiche__precautions">
              <strong>Précautions d’emploi</strong>
              <p>{fiche.precautions}</p>
            </aside>
          )}
        </div>

        <footer className="fiche__pied">
          <p className="fiche__prix">{formaterPrix(prixDe(produit))}</p>
          <button type="button" className="fiche__acheter" onClick={acheter}>
            {ajoute ? 'Ajouté ✓' : 'Acheter'}
          </button>
        </footer>
      </article>
    </div>,
    document.body,
  )
}
