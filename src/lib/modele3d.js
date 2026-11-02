// Reconstruction d'un volume 3D à partir des photos d'un produit.
//
// Un pot ou un flacon est un objet de révolution : son contour vu de face (le canal alpha de la
// photo) donne le rayon à chaque hauteur. On en tire un profil que three.js fait pivoter autour de
// l'axe vertical (LatheGeometry), puis on plaque les photos dessus, une par secteur d'angle.
//
// Unités : pixels de la photo du produit phare. x est relatif à l'axe, y est relatif au centre
// de l'image (vers le haut), si bien qu'à angle 0 le rendu 3D se superpose à la photo d'origine.

const SEUIL_ALPHA = 128
const PAS_LIGNES = 2

const modeles = new Map() // src du produit phare -> modèle prêt
const promesses = new Map() // src du produit phare -> Promise du modèle

const estBlanc = (pixels, i) => {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]
  return pixels[i + 3] > 200 && Math.min(r, g, b) > 195 && Math.max(r, g, b) - Math.min(r, g, b) < 45
}

// Bandes blanches [début, fin] de la colonne centrale, dans la moitié haute du produit. Pour un
// pot à couvercle blanc, la dernière est le bord avant du couvercle : en dessous commence le corps.
function bandesBlanches(pixels, w, boite, minY, maxY) {
  const cx = Math.round(boite.cx)
  const colonnes = [-8, -4, 0, 4, 8].map((d) => cx + d)
  const limite = minY + Math.round((maxY - minY) * 0.5)

  const bandes = []
  let debut = -1
  for (let y = minY; y <= limite; y++) {
    const blanc = colonnes.filter((x) => estBlanc(pixels, (y * w + x) * 4)).length >= 4
    if (blanc && debut < 0) debut = y
    if (!blanc && debut >= 0) {
      if (y - debut >= 10) bandes.push([debut, y - 1])
      debut = -1
    }
  }
  if (debut >= 0 && limite - debut >= 10) bandes.push([debut, limite])
  return bandes
}

// Certaines photos sont prises en légère plongée : on y voit le dessus du couvercle (disque
// imprimé), et son bord bas est un arc (plus bas au centre que sur les côtés). Plaqué sur un
// volume, le disque s'enroule autour des côtés du couvercle quand le produit tourne, et l'arc
// laisse apparaître le corps du pot sur les côtés. On remplace donc tout ce qui est au-dessus du
// point le plus bas du couvercle par la couleur du bord blanc : une bande droite, comme sur une
// vue de côté. Le haut de la photo (vide autour de l'ellipse) est comblé aussi, sinon le
// couvercle serait transparent une fois la photo alignée sur le volume.
function effacerDessusCouvercle(pixels, w, boite, minX, maxX, bande) {
  const [debutBord, finBord] = bande
  const milieu = Math.round((debutBord + finBord) / 2)
  const centre = (milieu * w + Math.round(boite.cx)) * 4

  for (let x = minX; x <= maxX; x++) {
    let ref = (milieu * w + x) * 4
    if (!estBlanc(pixels, ref)) ref = centre // bord du couvercle : on garde la couleur du centre
    const [r, g, b] = [pixels[ref], pixels[ref + 1], pixels[ref + 2]]
    for (let y = 0; y <= finBord; y++) {
      const i = (y * w + x) * 4
      pixels[i] = r
      pixels[i + 1] = g
      pixels[i + 2] = b
      pixels[i + 3] = 255
    }
  }
}

// avecDessus : le produit a une vue du dessus, donc ses photos ont un couvercle blanc repérable
// (on s'en sert pour aligner les photos entre elles). effacer : on efface aussi le dessus du couvercle.
async function analyser(src, { avecDessus = false, effacer = false } = {}) {
  const img = new Image()
  img.src = src
  await img.decode()

  const w = img.naturalWidth
  const h = img.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)
  const pixels = ctx.getImageData(0, 0, w, h).data

  // Pour chaque ligne : premier et dernier pixel opaque
  const gauche = new Int32Array(h).fill(-1)
  const droite = new Int32Array(h).fill(-1)
  let minX = w
  let maxX = -1
  let minY = h
  let maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (pixels[(y * w + x) * 4 + 3] > SEUIL_ALPHA) {
        if (gauche[y] < 0) gauche[y] = x
        droite[y] = x
      }
    }
    if (gauche[y] >= 0) {
      minX = Math.min(minX, gauche[y])
      maxX = Math.max(maxX, droite[y])
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
  }

  const boite = {
    cx: (minX + maxX + 1) / 2,
    cy: (minY + maxY + 1) / 2,
    demiL: (maxX - minX + 1) / 2,
    demiH: (maxY - minY + 1) / 2,
  }

  // Repère vertical servant à aligner les photos : par défaut le centre et la demi-hauteur de la
  // boîte ; pour un pot à couvercle, le bas du couvercle et la distance jusqu'au bas du pot (les
  // photos prises sous des angles différents n'ont pas la même hauteur totale, mais leur corps
  // se superpose)
  let repereY = boite.cy
  let echelleY = boite.demiH
  if (avecDessus) {
    const bandes = bandesBlanches(pixels, w, boite, minY, maxY)
    if (bandes.length) {
      const bande = bandes[bandes.length - 1]
      repereY = bande[1] + 1
      echelleY = maxY + 1 - repereY
      if (effacer) effacerDessusCouvercle(pixels, w, boite, minX, maxX, bande)
    }
  }

  // Texture : on prolonge la couleur du bord vers l'extérieur du contour. Sans ça, le filtrage
  // mélange le bord avec des pixels transparents noirs et trace un liseré sombre.
  // Les lignes sont inversées (OpenGL part du bas de l'image).
  const donnees = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) {
    const dest = (h - 1 - y) * w * 4
    donnees.set(pixels.subarray(y * w * 4, (y + 1) * w * 4), dest)
    if (gauche[y] < 0) continue
    const g = (y * w + gauche[y]) * 4
    const d = (y * w + droite[y]) * 4
    for (let x = 0; x < gauche[y]; x++) {
      donnees[dest + x * 4] = pixels[g]
      donnees[dest + x * 4 + 1] = pixels[g + 1]
      donnees[dest + x * 4 + 2] = pixels[g + 2]
    }
    for (let x = droite[y] + 1; x < w; x++) {
      donnees[dest + x * 4] = pixels[d]
      donnees[dest + x * 4 + 1] = pixels[d + 1]
      donnees[dest + x * 4 + 2] = pixels[d + 2]
    }
  }

  return {
    src,
    w,
    h,
    gauche,
    droite,
    donnees,
    boite,
    repereY,
    echelleY,
  }
}

// Moyenne glissante pour effacer les crénelures du contour
function lisser(valeurs, fenetre) {
  const demi = Math.floor(fenetre / 2)
  return valeurs.map((_, i) => {
    let somme = 0
    let n = 0
    for (let j = Math.max(0, i - demi); j <= Math.min(valeurs.length - 1, i + demi); j++) {
      somme += valeurs[j]
      n++
    }
    return somme / n
  })
}

// Profil (rayon, hauteur) de bas en haut, fermé sur l'axe aux deux extrémités
function construireProfil(face) {
  const { w, h, gauche, droite } = face
  const lignes = []
  let sommeCentres = 0
  let nbCentres = 0
  for (let y = 0; y < h; y += PAS_LIGNES) {
    if (gauche[y] < 0) continue
    lignes.push(y)
    sommeCentres += (gauche[y] + droite[y] + 1) / 2
    nbCentres++
  }

  const axeX = nbCentres ? sommeCentres / nbCentres : w / 2
  const rayons = lisser(
    lignes.map((y) => Math.max(0.5, (droite[y] - gauche[y] + 1) / 2)),
    7,
  )

  const points = lignes.map((y, i) => [rayons[i], h / 2 - y]).reverse()
  points.unshift([0, points[0][1]])
  points.push([0, points[points.length - 1][1]])
  return { axeX, points }
}

// Passage des coordonnées de la photo phare à celles d'une autre photo : on aligne les boîtes
// englobantes des deux produits. Retourne (Au, Bu, Av, Bv) tels que uv_k = uv_0 * A + B.
function transformationUV(phare, autre) {
  const sx = autre.boite.demiL / phare.boite.demiL
  const sy = autre.echelleY / phare.echelleY
  return [
    (phare.w * sx) / autre.w,
    (autre.boite.cx - phare.boite.cx * sx) / autre.w,
    (phare.h * sy) / autre.h,
    1 - (autre.repereY - phare.repereY * sy + phare.h * sy) / autre.h,
  ]
}

async function construire(produit) {
  // Face 0 = base du modèle (le produit phare, ou la photo de côté choisie à la place) ; les
  // autres photos se répartissent ensuite autour de l'objet. La vue du dessus (capuchon) n'est
  // pas une face latérale : on ne la plaque pas sur le volume.
  const base = produit.facePrincipale ?? produit.image
  const sources = [
    base,
    ...produit.images.filter((src) => src !== base && src !== produit.dessus),
  ]
  // Un produit qui a une vue du dessus a une photo prise en légère plongée : on y efface le
  // dessus du couvercle, qui s'enroulerait autour du volume
  const avecDessus = Boolean(produit.dessus)
  const faces = await Promise.all(
    sources.map((src, i) => analyser(src, { avecDessus, effacer: avecDessus && i > 0 && src === produit.image })),
  )
  const phare = faces[0]
  const { axeX, points } = construireProfil(phare)

  return {
    sources,
    largeur: phare.w,
    hauteur: phare.h,
    axeX,
    profil: points,
    faces: faces.map((face, i) => ({
      w: face.w,
      h: face.h,
      donnees: face.donnees,
      repereY: face.repereY,
      echelleY: face.echelleY,
      uv: i === 0 ? [1, 0, 1, 0] : transformationUV(phare, face),
    })),
  }
}

export function chargerModele(produit) {
  const cle = produit.image
  if (!promesses.has(cle)) {
    const promesse = construire(produit).then((modele) => {
      modeles.set(cle, modele)
      return modele
    })
    promesses.set(cle, promesse)
  }
  return promesses.get(cle)
}

export function modeleEnCache(produit) {
  return modeles.get(produit.image) ?? null
}
