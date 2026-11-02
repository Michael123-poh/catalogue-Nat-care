import { useMemo, useSyncExternalStore } from 'react'
import { categories, prixDe } from '../data/categories'

// Numéro qui reçoit les commandes (WhatsApp), au format international sans « + »
export const NUMERO_COMMANDE = '237693613437'

const CLE = 'natcare-commande'
const produits = categories.flatMap((c) => c.produits)

// Espace insécable (code 160) : elle ne se coupe jamais en fin de ligne
const ESPACE_INSECABLE = String.fromCharCode(160)

// Milliers séparés : 10500 devient « 10 500 FCFA »
export const formaterPrix = (prix) =>
  `${String(prix).replace(/\B(?=(\d{3})+(?!\d))/g, ESPACE_INSECABLE)}${ESPACE_INSECABLE}FCFA`

// Le panier ne garde que { id, quantite } : les images et les prix sont relus depuis le catalogue
function lire() {
  try {
    const lignes = JSON.parse(localStorage.getItem(CLE))
    return Array.isArray(lignes) ? lignes.filter((l) => produits.some((p) => p.id === l.id)) : []
  } catch {
    return []
  }
}

let lignes = lire()
const abonnes = new Set()

function ecrire(suivantes) {
  lignes = suivantes
  try {
    localStorage.setItem(CLE, JSON.stringify(lignes))
  } catch {
    // stockage indisponible : la commande reste en mémoire pour la session
  }
  abonnes.forEach((notifier) => notifier())
}

export const panier = {
  ajouter(id) {
    const existe = lignes.some((l) => l.id === id)
    ecrire(
      existe
        ? lignes.map((l) => (l.id === id ? { ...l, quantite: l.quantite + 1 } : l))
        : [...lignes, { id, quantite: 1 }],
    )
  },
  changerQuantite(id, delta) {
    ecrire(
      lignes
        .map((l) => (l.id === id ? { ...l, quantite: l.quantite + delta } : l))
        .filter((l) => l.quantite > 0),
    )
  },
  retirer(id) {
    ecrire(lignes.filter((l) => l.id !== id))
  },
  vider() {
    ecrire([])
  },
}

const abonner = (notifier) => {
  abonnes.add(notifier)
  return () => abonnes.delete(notifier)
}
const instantane = () => lignes

/** Lignes de la commande avec leur produit, le nombre d'articles et le total. */
export function usePanier() {
  const brut = useSyncExternalStore(abonner, instantane)
  return useMemo(() => {
    const detail = brut.map((l) => ({ ...l, produit: produits.find((p) => p.id === l.id) }))
    return {
      lignes: detail,
      nombre: detail.reduce((n, l) => n + l.quantite, 0),
      total: detail.reduce((t, l) => t + l.quantite * prixDe(l.produit), 0),
    }
  }, [brut])
}

/** Lien WhatsApp avec le récapitulatif de la commande. */
export function lienCommande({ lignes: detail, total }) {
  const corps = detail
    .map(
      (l) => `• ${l.quantite} x ${l.produit.nom} — ${formaterPrix(l.quantite * prixDe(l.produit))}`,
    )
    .join('\n')
  const message = `Bonjour Nat'Care, je souhaite commander :\n${corps}\n\nTotal : ${formaterPrix(total)}`
  return `https://wa.me/${NUMERO_COMMANDE}?text=${encodeURIComponent(message)}`
}
