// Vol du produit phare de la home vers la page détail.
//
// Le navigateur déplace le produit (view transition "produit-phare"). Pendant ce déplacement, on
// lit sa progression et on fait tourner le modèle 3D en conséquence : la rotation reste ainsi
// parfaitement synchronisée avec le mouvement, avec la même courbe d'accélération.

const GROUPE = '::view-transition-group(produit-phare)'

export const vol = { enCours: false }

const animationsReduites = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// À appeler au clic sur une carte, juste avant la navigation
export function demarrerVol() {
  if (!document.startViewTransition || animationsReduites()) return
  vol.enCours = true
  document.documentElement.classList.add('vol-produit')
}

export function terminerVol() {
  vol.enCours = false
  document.documentElement.classList.remove('vol-produit')
}

// La classe "vol-produit" désactive les fondus par défaut du navigateur. La retirer pendant que
// la transition existe encore relancerait ces fondus et rallongerait la transition : on attend
// donc que ses éléments aient disparu.
function terminerQuandTransitionFinie() {
  const debut = performance.now()
  const verifier = () => {
    const encore = document
      .getAnimations()
      .some((a) => a.effect?.pseudoElement?.startsWith('::view-transition'))
    if (!encore || performance.now() - debut > 3000) return terminerVol()
    requestAnimationFrame(verifier)
  }
  verifier()
}

// Fonction de temps cubic-bezier(x1, y1, x2, y2) de la CSS, résolue par dichotomie
function bezier(x1, y1, x2, y2) {
  const coord = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3
  return (x) => {
    if (x <= 0 || x >= 1) return Math.min(1, Math.max(0, x))
    let bas = 0
    let haut = 1
    for (let i = 0; i < 24; i++) {
      const milieu = (bas + haut) / 2
      if (coord(milieu, x1, x2) < x) bas = milieu
      else haut = milieu
    }
    return coord((bas + haut) / 2, y1, y2)
  }
}

// Reprend la courbe définie en CSS pour le déplacement (index.css), pour rester synchronisé
function lireCourbe() {
  const css = getComputedStyle(document.documentElement, GROUPE).animationTimingFunction
  const valeurs = css.match(/cubic-bezier\(([^)]+)\)/)?.[1].split(',').map(Number)
  return valeurs?.length === 4 && valeurs.every(Number.isFinite) ? bezier(...valeurs) : (t) => t
}

/**
 * Suit le déplacement du produit pendant la transition.
 * surProgression(p) est appelée à chaque image avec p entre 0 et 1, adoucie par la même courbe
 * que le déplacement. Retourne une fonction d'annulation.
 */
export function suivreVol({ surProgression }) {
  const debut = performance.now()
  let raf = 0
  let annule = false
  let courbe = null

  const boucle = () => {
    if (annule) return
    const groupe = document
      .getAnimations()
      .find((a) => a.effect?.pseudoElement === GROUPE)

    if (!groupe) {
      // Pas de transition (navigateur non compatible) : on abandonne proprement
      if (performance.now() - debut > 800) return terminerVol()
      raf = requestAnimationFrame(boucle)
      return
    }

    // La progression lue est linéaire : on applique la même courbe que le déplacement
    courbe ??= lireCourbe()
    const progression = groupe.effect.getComputedTiming().progress ?? 0
    surProgression(courbe(progression))
    if (groupe.playState === 'finished' || progression >= 1) {
      surProgression(1)
      return terminerQuandTransitionFinie()
    }
    raf = requestAnimationFrame(boucle)
  }

  boucle()

  // Ne remet pas l'indicateur à zéro : en développement React relance l'effet juste après
  // le nettoyage (StrictMode) et il a encore besoin de l'indicateur. Il est remis à zéro
  // à la fin du vol, ou au clic sur le logo (retour vers la home).
  return () => {
    annule = true
    cancelAnimationFrame(raf)
  }
}
