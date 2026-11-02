import { useEffect } from 'react'
import { prixDe } from '../data/categories'
import { formaterPrix, lienCommande, panier, usePanier } from '../lib/panier'
import { tutoriel } from '../lib/tutoriel'
import './PanierMenu.css'

/** Menu du burger : les produits sur lesquels on a cliqué « Acheter », et le bouton Commander. */
export default function PanierMenu({ ouvert, onFermer }) {
  const commande = usePanier()

  useEffect(() => {
    if (!ouvert) return
    const surTouche = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [ouvert, onFermer])

  const revoirTutoriel = () => {
    tutoriel.reinitialiser()
    onFermer()
  }

  return (
    <div className={`panier${ouvert ? ' panier--ouvert' : ''}`} aria-hidden={!ouvert}>
      <div className="panier__voile" onClick={onFermer} />
      <aside className="panier__tiroir" role="dialog" aria-modal="true" aria-label="Ma commande">
        <header className="panier__entete">
          <h2 className="panier__titre">Ma commande</h2>
          <button type="button" className="panier__fermer" onClick={onFermer} aria-label="Fermer">
            ×
          </button>
        </header>

        {commande.lignes.length === 0 ? (
          <p className="panier__vide">
            Aucun produit pour l'instant. Appuie sur « Acheter » pour ajouter un produit à ta
            commande.
          </p>
        ) : (
          <>
            <ul className="panier__liste">
              {commande.lignes.map(({ id, produit, quantite }) => (
                <li key={id} className="panier__ligne">
                  <img className="panier__image" src={produit.image} alt="" />
                  <div className="panier__infos">
                    <p className="panier__nom">{produit.nom}</p>
                    <p className="panier__prix">{formaterPrix(prixDe(produit))}</p>
                    <div className="panier__quantite">
                      <button
                        type="button"
                        onClick={() => panier.changerQuantite(id, -1)}
                        aria-label={`Retirer un ${produit.nom}`}
                      >
                        −
                      </button>
                      <span>{quantite}</span>
                      <button
                        type="button"
                        onClick={() => panier.changerQuantite(id, 1)}
                        aria-label={`Ajouter un ${produit.nom}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="panier__retirer"
                    onClick={() => panier.retirer(id)}
                    aria-label={`Supprimer ${produit.nom}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className="panier__pied">
              <p className="panier__total">
                <span>Total</span>
                <strong>{formaterPrix(commande.total)}</strong>
              </p>
              <a
                className="panier__commander"
                href={lienCommande(commande)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Commander
              </a>
              <button type="button" className="panier__vider" onClick={panier.vider}>
                Vider la commande
              </button>
            </div>
          </>
        )}

        <button type="button" className="panier__tuto" onClick={revoirTutoriel}>
          Revoir le tutoriel
        </button>
      </aside>
    </div>
  )
}
