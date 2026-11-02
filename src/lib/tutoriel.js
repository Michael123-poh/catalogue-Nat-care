import { useSyncExternalStore } from 'react'

// Étapes du tutoriel, chacune montrée une seule fois (le navigateur retient celles déjà vues) :
//   categorie : home, toucher une catégorie
//   glisser   : page produit, balayer à gauche/droite pour changer de produit
//   vues      : page produit, toucher une miniature pour faire tourner le produit
//   monter    : après 10 s sans activité sur un produit, balayer vers le haut pour les infos
//   acheter   : juste après, le bouton Acheter
//   commande  : après 40 s sans activité, ou au retour sur la home, le menu burger
export const ETAPES = ['categorie', 'glisser', 'vues', 'monter', 'acheter', 'commande']

const CLE = 'natcare-tutoriel'

function lire() {
  try {
    const vus = JSON.parse(localStorage.getItem(CLE))
    return Array.isArray(vus) ? vus.filter((e) => ETAPES.includes(e)) : []
  } catch {
    return []
  }
}

let vus = lire()
const abonnes = new Set()

function ecrire(suivants) {
  vus = suivants
  try {
    localStorage.setItem(CLE, JSON.stringify(vus))
  } catch {
    // stockage indisponible : le tutoriel ne se répète pas pendant la session
  }
  abonnes.forEach((notifier) => notifier())
}

export const tutoriel = {
  marquerVu(etape) {
    if (!vus.includes(etape)) ecrire([...vus, etape])
  },
  toutMarquer() {
    ecrire([...ETAPES])
  },
  reinitialiser() {
    ecrire([])
  },
}

const abonner = (notifier) => {
  abonnes.add(notifier)
  return () => abonnes.delete(notifier)
}
const instantane = () => vus

/** Étapes déjà vues (tableau, nouvelle valeur à chaque changement). */
export function useEtapesVues() {
  return useSyncExternalStore(abonner, instantane)
}
