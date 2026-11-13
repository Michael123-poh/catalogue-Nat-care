import { Link } from 'react-router-dom'
import image from '../assets/Page_d_acceuil_Nat_Care_Website@2x-100.jpg.jpeg'
import './Bienvenue.css'

// Page d'accueil : l'affiche Nat'Care en entier, avec un bouton pour entrer dans le catalogue.
// Le logo et le menu sont ceux de l'en-tête commun, au même endroit que sur les autres pages.
export default function Bienvenue() {
  return (
    <main className="bienvenue">
      <div className="bienvenue__affiche">
        <img
          className="bienvenue__image"
          src={image}
          alt="Nat'Care : le meilleur de notre nature pour votre glow"
        />
        <Link className="bienvenue__visiter" to="/catalogue" viewTransition>
          Visiter
        </Link>
      </div>
    </main>
  )
}
