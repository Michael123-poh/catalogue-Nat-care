import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { tutoriel, useEtapesVues } from '../lib/tutoriel'
import { vol } from '../lib/volProduit'
import './Tutoriel.css'

// Tutoriel en plusieurs étapes, jamais toutes d'un coup : une bulle à la fois, chaque étape une seule
// fois. Les étapes 1, 2 et 4 (categorie, glisser, vues) arrivent à mesure qu'on découvre les pages ;
// monter et acheter après 5 s sans activité sur un produit ; commande juste après acheter (ou au
// retour sur la home). Elle n'est jamais montrée avant « monter ».
const INACTIF_PRODUIT = 5_000
const PAUSE_ENTRE_ETAPES = 900
const SEUIL_GESTE = 50

// Le panneau du produit affiché est toujours le dernier du carrousel (le sortant est avant lui)
const ACCUEIL = '/catalogue'
const estDetail = (chemin) => chemin.startsWith('/catalogue/')

const PRODUIT = '.detail__carrousel > .panneau:last-child'

const ETAPES = {
  categorie: {
    cible: '.categorie',
    texte: 'Touche une catégorie pour découvrir ses produits.',
  },
  glisser: {
    cible: `${PRODUIT} .detail__scene`,
    geste: 'horizontal',
    texte: 'Glisse vers la gauche ou la droite pour passer au produit suivant.',
  },
  vues: {
    cible: `${PRODUIT} .detail__miniatures`,
    texte: 'Touche une vue pour faire tourner le produit.',
  },
  monter: {
    cible: `${PRODUIT} .detail__scene`,
    geste: 'vertical',
    texte: 'Glisse vers le haut pour voir la description et le prix.',
    bouton: 'Voir les infos',
  },
  acheter: {
    cible: `${PRODUIT} .detail__acheter`,
    texte: 'Appuie sur Acheter pour ajouter le produit à ta commande.',
  },
  commande: {
    cible: '.header__menu',
    texte: 'Retrouve ici tes produits et envoie ta commande sur WhatsApp.',
  },
}

/** Prochaine étape à montrer d'après la page, l'activité et ce qui a déjà été vu (ou null). */
function choisir(c, vues) {
  const maintenant = Date.now()
  const depuis = maintenant - c.entree
  const inactif = maintenant - c.activite
  const vu = (etape) => vues.includes(etape)

  if (document.querySelector('.panier--ouvert, .fiche')) return null
  if (maintenant - c.fin < PAUSE_ENTRE_ETAPES) return null

  if (c.pathname === ACCUEIL) {
    if (!vu('categorie') && depuis > 1200) return 'categorie'
    if (c.retourAccueil && vu('monter') && !vu('commande') && depuis > 1500) return 'commande'
  } else if (estDetail(c.pathname) && !vol.enCours && depuis > 1500) {
    const carrousel = document.querySelector('.detail__carrousel')
    if (!carrousel) return null
    const compact = Boolean(document.querySelector('.panneau--compact'))
    const nbProduits = Number(carrousel.dataset.produits)
    if (!vu('glisser') && nbProduits > 1) return 'glisser'
    // Un produit à une seule image (une gamme) n'a pas de miniatures à montrer
    const aDesVues = Boolean(document.querySelector(`${PRODUIT} .detail__miniatures`))
    if (!vu('vues') && aDesVues) return 'vues'
    if (!vu('monter') && !compact && inactif >= INACTIF_PRODUIT) return 'monter'
    if (
      !vu('acheter') &&
      vu('monter') &&
      compact &&
      (c.apresIndice || inactif >= INACTIF_PRODUIT)
    ) {
      return 'acheter'
    }
    // Le menu de commande est présenté directement après le bouton Acheter
    if (vu('monter') && vu('acheter') && !vu('commande')) return 'commande'
  }

  return null
}

// Main qui pointe (icône « touch_app » de Material Icons, licence Apache 2.0). Le bout du doigt
// est en (11.5, 4) dans la boîte 24 x 24.
const MAIN =
  'M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z'

const borner = (valeur, min, max) => Math.min(max, Math.max(min, valeur))

export default function Tutoriel() {
  const { pathname } = useLocation()
  const vues = useEtapesVues()
  const vuesRef = useRef(vues)
  // Étape en cours, liée à la page où elle est apparue : elle disparaît quand on change de page
  const [affichee, setAffichee] = useState(null)
  const [rect, setRect] = useState(null)
  const ctx = useRef({
    pathname,
    // renseignés à l'arrivée sur la page (effet ci-dessous)
    entree: 0,
    activite: 0,
    fin: 0,
    retourAccueil: false,
    apresIndice: false,
  })

  const etape = affichee?.pathname === pathname ? affichee.etape : null

  useEffect(() => {
    vuesRef.current = vues
  })

  // Changement de page : on repart de zéro pour l'inactivité, et on note un retour sur la home
  useEffect(() => {
    const c = ctx.current
    if (estDetail(c.pathname) && pathname === ACCUEIL) c.retourAccueil = true
    c.pathname = pathname
    c.entree = Date.now()
    c.activite = Date.now()
  }, [pathname])

  // Chaque étape n'est montrée qu'une fois pour toutes sur cet appareil : on la note comme vue dès
  // qu'elle s'affiche, même si la personne quitte la page sans la fermer
  useEffect(() => {
    if (etape) tutoriel.marquerVu(etape)
  }, [etape])

  const valider = useCallback((fait) => {
    tutoriel.marquerVu(fait)
    ctx.current.fin = Date.now()
    setAffichee((a) => (a?.etape === fait ? null : a))
  }, [])

  // Les gestes et les clics de la personne valident l'étape correspondante, même si elle n'est pas
  // affichée : quelqu'un qui a déjà compris n'a pas besoin qu'on lui explique
  useEffect(() => {
    const activite = () => {
      ctx.current.activite = Date.now()
    }
    const surDetail = () => estDetail(ctx.current.pathname)
    let depart = null

    const surPointeurBas = (e) => {
      activite()
      depart = e.target.closest?.('.detail__carrousel') ? { x: e.clientX, y: e.clientY } : null
    }
    const surPointeurHaut = (e) => {
      if (!depart) return
      const dx = e.clientX - depart.x
      const dy = e.clientY - depart.y
      depart = null
      if (Math.abs(dx) > SEUIL_GESTE && Math.abs(dx) > 1.5 * Math.abs(dy)) valider('glisser')
      else if (dy < -SEUIL_GESTE && Math.abs(dy) > 1.5 * Math.abs(dx)) valider('monter')
    }
    const surClic = (e) => {
      const cible = e.target.closest ? e.target : null
      if (!cible) return
      if (cible.closest('.categorie')) valider('categorie')
      if (cible.closest('.detail__miniature, .detail__point')) valider('vues')
      if (cible.closest('.detail__acheter')) valider('acheter')
      if (cible.closest('.detail__indice')) valider('monter')
      if (cible.closest('.header__menu')) valider('commande')
    }
    const surMolette = (e) => {
      activite()
      if (document.querySelector('.fiche')) return
      if (surDetail() && e.deltaY > 0) valider('monter')
    }
    const surTouche = (e) => {
      activite()
      if (!surDetail() || document.querySelector('.fiche')) return
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') valider('glisser')
      if (e.key === 'ArrowDown') valider('monter')
    }

    window.addEventListener('pointerdown', surPointeurBas)
    window.addEventListener('pointerup', surPointeurHaut)
    window.addEventListener('pointermove', activite)
    window.addEventListener('click', surClic, true)
    window.addEventListener('wheel', surMolette, { passive: true })
    window.addEventListener('keydown', surTouche)
    return () => {
      window.removeEventListener('pointerdown', surPointeurBas)
      window.removeEventListener('pointerup', surPointeurHaut)
      window.removeEventListener('pointermove', activite)
      window.removeEventListener('click', surClic, true)
      window.removeEventListener('wheel', surMolette)
      window.removeEventListener('keydown', surTouche)
    }
  }, [valider])

  // Toutes les 400 ms : si aucune bulle n'est affichée, on regarde si une étape doit apparaître
  useEffect(() => {
    const minuteur = setInterval(() => {
      setAffichee((actuelle) => {
        if (actuelle?.pathname === ctx.current.pathname) return actuelle
        const prochaine = choisir(ctx.current, vuesRef.current)
        return prochaine ? { etape: prochaine, pathname: ctx.current.pathname } : null
      })
    }, 400)
    return () => clearInterval(minuteur)
  }, [])

  // La bulle suit l'élément visé (qui peut bouger : zoom, vue compacte)
  useEffect(() => {
    if (!etape) return
    let image
    const suivre = () => {
      const r = document.querySelector(ETAPES[etape].cible)?.getBoundingClientRect()
      setRect((precedent) => {
        if (!r) return precedent?.etape === etape ? null : precedent
        const suivant = {
          etape,
          x: Math.round(r.left),
          y: Math.round(r.top),
          l: Math.round(r.width),
          h: Math.round(r.height),
        }
        const identique =
          precedent?.etape === etape &&
          precedent.x === suivant.x &&
          precedent.y === suivant.y &&
          precedent.l === suivant.l &&
          precedent.h === suivant.h
        return identique ? precedent : suivant
      })
      image = requestAnimationFrame(suivre)
    }
    image = requestAnimationFrame(suivre)
    return () => cancelAnimationFrame(image)
  }, [etape])

  if (!etape || rect?.etape !== etape) return null

  const def = ETAPES[etape]
  const marge = 8
  const largeurBulle = Math.min(300, window.innerWidth - 32)
  const centre = rect.x + rect.l / 2
  const gaucheBulle = borner(centre - largeurBulle / 2, 16, window.innerWidth - 16 - largeurBulle)
  const placeDessous = window.innerHeight - (rect.y + rect.h) >= 170
  const placeDessus = rect.y >= 170
  // Dessous si possible, sinon dessus ; sinon la bulle se pose sur le bas de l'élément visé
  const positionBulle = placeDessous
    ? { top: rect.y + rect.h + marge + 14 }
    : placeDessus
      ? { bottom: window.innerHeight - rect.y + marge + 14 }
      : { top: rect.y + rect.h - 150 }
  const fleche = placeDessous ? 'haut' : placeDessus ? 'bas' : null

  const compris = () => {
    if (etape === 'monter') {
      // « Voir les infos » : on fait le geste à sa place, puis le bouton Acheter est présenté
      ctx.current.apresIndice = true
      window.dispatchEvent(new CustomEvent('natcare:compacter'))
    }
    valider(etape)
  }

  const passer = () => {
    tutoriel.toutMarquer()
    setAffichee(null)
  }

  return (
    <div className="tuto" key={etape}>
      <div
        className="tuto__trou"
        style={{
          left: rect.x - marge,
          top: rect.y - marge,
          width: rect.l + 2 * marge,
          height: rect.h + 2 * marge,
        }}
      >
        {!def.geste && <span className="tuto__onde" />}
        {/* La main montre le geste : elle glisse (balayage) ou tapote (toucher) */}
        <span className={`tuto__doigt tuto__doigt--${def.geste ?? 'toucher'}`}>
          <svg className="tuto__main" viewBox="0 0 24 24" aria-hidden="true">
            <path d={MAIN} />
          </svg>
        </span>
      </div>

      <div
        className="tuto__bulle"
        role="status"
        style={{ left: gaucheBulle, width: largeurBulle, ...positionBulle }}
      >
        {fleche && (
          <span
            className={`tuto__fleche tuto__fleche--${fleche}`}
            style={{ left: borner(centre - gaucheBulle, 26, largeurBulle - 26) }}
          />
        )}
        <p className="tuto__texte">{def.texte}</p>
        <div className="tuto__actions">
          <button type="button" className="tuto__ok" onClick={compris}>
            {def.bouton ?? 'Compris'}
          </button>
          <button type="button" className="tuto__passer" onClick={passer}>
            Passer le tutoriel
          </button>
        </div>
      </div>
    </div>
  )
}
