import masquePurify4 from '../assets/4Nat_Care_Masque_Purify-removebg-preview.png'
import masquePurify5 from '../assets/5Nat_Care_Masque_Purify-removebg-preview.png'
import masquePurify6 from '../assets/6Nat_Care_Masque_Purify-removebg-preview.png'
import masqueGlow7 from '../assets/7Nat_Care_Masque_Glow-removebg-preview.png'
import masqueGlow8 from '../assets/8Nat_Care_Masque_Glow-removebg-preview.png'
import masqueGlow9 from '../assets/9Nat_Care_Masque_Glow-removebg-preview.png'
import serumGlow2 from '../assets/2Nat_Care_Sérum_Glow-removebg-preview.png'
import serumGlow3 from '../assets/3Nat_Care_Sérum_Glow-removebg-preview.png'
import gommageSugar19 from '../assets/19Nat_Care_Gommage_Corporel_Sugar_Soufflé_Eclat-removebg-preview.png'
import gommageSugar20 from '../assets/20Nat_Care_Gommage_Corporel_Sugar_Soufflé_Eclat-removebg-preview.png'
import gommageSugar21 from '../assets/21Nat_Care_Gommage_Corporel_Sugar_Soufflé_Eclat-removebg-preview.png'
import chantilly22 from '../assets/22Nat_Care_Chantilly_Nourissante-removebg-preview.png'
import chantilly23 from '../assets/23Nat_Care_Chantilly_Nourissante-removebg-preview.png'
import chantilly24 from '../assets/24Nat_Care_Chantilly_Nourissante-removebg-preview.png'
import huileEclat13 from '../assets/13Nat_Care_Huile_Eclat-removebg-preview.png'
import huileEclat14 from '../assets/14Nat_Care_Huile_Eclat-removebg-preview.png'
import huileEclat15 from '../assets/15Nat_Care_Huile_Eclat-removebg-preview.png'
import huileDouceur16 from '../assets/16Nat_Care_Huile_Douceur-removebg-preview.png'
import huileDouceur17 from '../assets/17Nat_Care_Huile_Douceur-removebg-preview.png'
import huileDouceur18 from '../assets/18Nat_Care_Huile_Douceur-removebg-preview.png'
import huileRacines10 from '../assets/10Nat_Care_Huile_Racines-removebg-preview.png'
import huileRacines11 from '../assets/11Nat_Care_Huile_Racines-removebg-preview.png'
import huileRacines12 from '../assets/12Nat_Care_Huile_Racines-removebg-preview.png'

// ── Catégories (cartes de la home) ──────────────────────────────────────────────────────────────
// cote : côté où se trouve le produit phare sur la home (la carte déborde de l'autre côté de l'écran)
// hauteur / bas : taille du produit phare sur la home et son décalage par rapport au bas de la carte (px)
// produits : produits de la catégorie. Le 1er est celui de la carte (produit phare) et s'ouvre en
//   premier ; un balayage gauche/droite sur la page catégorie passe au suivant / au précédent.
//
// ── Produits ────────────────────────────────────────────────────────────────────────────────────
// image : produit phare, affiché sur la home puis au centre de la page détail
// images : les vues du produit (miniatures), la vue de face en dernier
// dessus : (optionnel) photo vue du dessus (capuchon). Elle reste en miniature mais ne fait pas partie de
//   la rotation 3D : le produit tourne seulement sur ses autres faces
// facePrincipale : (optionnel) photo de côté qui sert de base au modèle 3D (contour et face de départ).
//   À utiliser quand la photo phare est prise en plongée : son contour déformerait le volume
// hauteurDetail : hauteur de l'image principale sur la page détail (px)
// description : (optionnel) deux paragraphes affichés en colonnes sous le produit
// prix : (optionnel) prix en FCFA. Sans valeur, le texte et le prix provisoires ci-dessous s'affichent

export const DESCRIPTION_PROVISOIRE = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis',
]
const PRIX_PROVISOIRE = 3500

export const prixDe = (produit) => produit.prix ?? PRIX_PROVISOIRE

const masquePurify = {
  id: 'masque-purify',
  nom: 'Masque Purify',
  image: masquePurify5,
  images: [masquePurify4, masquePurify6, masquePurify5],
  hauteurDetail: 275,
}

const masqueGlow = {
  id: 'masque-glow',
  nom: 'Masque Glow',
  image: masqueGlow7,
  images: [masqueGlow8, masqueGlow9, masqueGlow7],
  hauteurDetail: 275,
}

const serumGlow = {
  id: 'serum-glow',
  nom: 'Sérum Glow',
  image: serumGlow2,
  images: [serumGlow3, serumGlow2],
  hauteurDetail: 320,
}

const gommageSugar = {
  id: 'gommage-sugar',
  nom: 'Gommage Sugar Soufflé Éclat',
  image: gommageSugar21,
  images: [gommageSugar19, gommageSugar20, gommageSugar21],
  dessus: gommageSugar20,
  facePrincipale: gommageSugar19,
  hauteurDetail: 275,
}

const chantilly = {
  id: 'chantilly-nourrissante',
  nom: 'Chantilly Nourrissante',
  image: chantilly24,
  images: [chantilly22, chantilly23, chantilly24],
  dessus: chantilly23,
  facePrincipale: chantilly22,
  hauteurDetail: 275,
}

const huileEclat = {
  id: 'huile-eclat',
  nom: 'Huile Éclat',
  image: huileEclat13,
  images: [huileEclat14, huileEclat15, huileEclat13],
  hauteurDetail: 320,
}

const huileDouceur = {
  id: 'huile-douceur',
  nom: 'Huile Douceur',
  image: huileDouceur16,
  images: [huileDouceur17, huileDouceur18, huileDouceur16],
  hauteurDetail: 320,
}

const huileRacines = {
  id: 'huile-racines',
  nom: 'Huile Racines',
  image: huileRacines10,
  images: [huileRacines11, huileRacines12, huileRacines10],
  hauteurDetail: 320,
}

export const categories = [
  {
    id: 'visage',
    titre: 'VISAGE',
    cote: 'gauche',
    hauteur: 137,
    bas: 7,
    produits: [masquePurify, masqueGlow],
  },
  {
    id: 'corps',
    titre: 'CORPS',
    cote: 'droite',
    hauteur: 146,
    bas: 16,
    produits: [gommageSugar, chantilly, huileEclat],
  },
  {
    id: 'cheveux',
    titre: 'CHEVEUX',
    cote: 'gauche',
    hauteur: 176,
    bas: 5,
    produits: [huileDouceur, huileRacines],
  },
  {
    // Nom et produits de cette 4e catégorie à confirmer
    id: 'cheveux-2',
    titre: 'CHEVEUX',
    cote: 'droite',
    hauteur: 172,
    bas: 9,
    produits: [serumGlow],
  },
]
